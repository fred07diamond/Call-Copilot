import { useCallback, useEffect, useRef, useState } from "react";
import { DeepgramClient } from "@deepgram/sdk";
import { agentNativePath, appApiPath } from "@agent-native/core/client";

const TRANSCRIBE_URL = agentNativePath("/_agent-native/transcribe-voice");
const GOOGLE_REALTIME_SESSION_URL = agentNativePath(
  "/_agent-native/transcribe-stream/session",
);
const GOOGLE_REALTIME_WS_PROTOCOL = "agent-native-google-realtime";
const DEEPGRAM_TOKEN_URL = appApiPath("/api/call-copilot/deepgram-token");
const SPEECH_RMS_THRESHOLD = 0.025;
const SOURCE_ACTIVITY_LOG_MS = 5_000;
const SYSTEM_AUDIO_ENDED_NOTICE =
  "System audio capture ended. Click Mic + System Audio to recapture.";
const PREFS_URL = agentNativePath(
  "/_agent-native/application-state/voice-transcription-prefs",
);

function logTranscription(message: string, detail?: unknown): void {
  if (detail === undefined) {
    console.info(`[call-transcription] ${message}`);
    return;
  }
  console.info(`[call-transcription] ${message}`, detail);
}

function measureAnalyserRms(analyser: AnalyserNode, buffer: Uint8Array): number {
  analyser.getByteTimeDomainData(buffer as Uint8Array<ArrayBuffer>);
  let sumSquares = 0;
  for (let index = 0; index < buffer.length; index += 1) {
    const normalized = (buffer[index] - 128) / 128;
    sumSquares += normalized * normalized;
  }
  return Math.sqrt(sumSquares / buffer.length);
}

function measureChannelRms(channel: Float32Array): number {
  if (channel.length === 0) return 0;
  let sumSquares = 0;
  for (let index = 0; index < channel.length; index += 1) {
    const sample = channel[index];
    sumSquares += sample * sample;
  }
  return Math.sqrt(sumSquares / channel.length);
}

async function readDeepgramToken(): Promise<string> {
  const res = await fetch(DEEPGRAM_TOKEN_URL);
  if (!res.ok) {
    throw new Error(
      "Deepgram is not configured on the server. Add DEEPGRAM_API_KEY to apps/call-copilot/.env.local and restart the app.",
    );
  }
  const body = (await res.json()) as { key?: string };
  if (!body.key?.trim()) {
    throw new Error("Deepgram token response was missing a key.");
  }
  return body.key.trim();
}

type DeepgramListenSocket = Awaited<
  ReturnType<DeepgramClient["listen"]["v1"]["connect"]>
>;

type VoiceProvider =
  | "auto"
  | "openai"
  | "browser"
  | "google-realtime"
  | "deepgram"
  | "builder-gemini"
  | "builder"
  | "gemini"
  | "groq";

export type TranscriptionCaptureMode = "mic-only" | "mic-and-system";

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ||
    null
  );
}

// ── Deepgram types ──────────────────────────────────────────────────────────

interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
  punctuated_word?: string;
}

interface DeepgramAlternative {
  transcript: string;
  confidence: number;
  words: DeepgramWord[];
}

interface DeepgramResultMessage {
  type: "Results";
  is_final: boolean;
  speech_final: boolean;
  channel_index?: number[];
  channel: {
    alternatives: DeepgramAlternative[];
  };
  utterances?: DeepgramUtterance[];
}

type DeepgramMessage = DeepgramResultMessage | { type: string };

interface DeepgramUtterance {
  speaker?: number;
  transcript?: string;
  confidence?: number;
}

interface DeepgramSpeakerSegment {
  speakerId: number;
  speaker: string;
  text: string;
  labelConfidence?: number | null;
}

function deterministicChannelLabel(channelIndex: number): string {
  if (channelIndex === 0) return "You";
  if (channelIndex === 1) return "Guest";
  return `Speaker ${channelIndex + 1}`;
}

function micOnlyDiarizedLabel(speakerIndex: number): {
  speaker: string;
  labelConfidence: number | null;
} {
  if (speakerIndex === 0) {
    return { speaker: "You", labelConfidence: null };
  }
  return { speaker: "Guest", labelConfidence: 0.55 };
}

function parseDeepgramUtteranceSegments(
  utterances: DeepgramUtterance[],
): DeepgramSpeakerSegment[] {
  const turns: DeepgramSpeakerSegment[] = [];
  for (const utterance of utterances) {
    const text = utterance.transcript?.trim();
    if (!text) continue;
    const speakerIndex = hasDeepgramSpeakerId(utterance.speaker)
      ? utterance.speaker
      : 0;
    const { speaker, labelConfidence } = micOnlyDiarizedLabel(speakerIndex);
    turns.push({
      speakerId: speakerIndex,
      speaker,
      text,
      labelConfidence,
    });
  }
  return turns;
}

function hasDeepgramSpeakerId(
  value: number | undefined | null,
): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function groupDeepgramWordsBySpeaker(
  words: DeepgramWord[],
): DeepgramSpeakerSegment[] {
  const turns: DeepgramSpeakerSegment[] = [];
  for (const word of words) {
    const speakerIndex = hasDeepgramSpeakerId(word.speaker) ? word.speaker : 0;
    const { speaker, labelConfidence } = micOnlyDiarizedLabel(speakerIndex);
    const w = word.punctuated_word ?? word.word;
    const last = turns[turns.length - 1];
    if (last?.speakerId === speakerIndex) {
      last.text = `${last.text} ${w}`;
    } else {
      turns.push({ speakerId: speakerIndex, speaker, text: w, labelConfidence });
    }
  }
  return turns;
}

function floatToLinear16(buffer: Float32Array): Int16Array {
  const pcm = new Int16Array(buffer.length);
  for (let index = 0; index < buffer.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, buffer[index]));
    pcm[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return pcm;
}

function downsampleToLinear16(
  buffer: Float32Array,
  fromRate: number,
  toRate: number,
): Int16Array {
  if (fromRate === toRate) {
    return floatToLinear16(buffer);
  }

  const ratio = fromRate / toRate;
  const outputLength = Math.max(1, Math.round(buffer.length / ratio));
  const output = new Float32Array(outputLength);
  for (let index = 0; index < outputLength; index += 1) {
    output[index] = buffer[Math.min(buffer.length - 1, Math.floor(index * ratio))];
  }
  return floatToLinear16(output);
}

function downsampleStereoToLinear16(
  left: Float32Array,
  right: Float32Array,
  fromRate: number,
  toRate: number,
): Int16Array {
  const leftPcm = downsampleToLinear16(left, fromRate, toRate);
  const rightPcm = downsampleToLinear16(right, fromRate, toRate);
  const length = Math.min(leftPcm.length, rightPcm.length);
  const interleaved = new Int16Array(length * 2);
  for (let index = 0; index < length; index += 1) {
    interleaved[index * 2] = leftPcm[index];
    interleaved[index * 2 + 1] = rightPcm[index];
  }
  return interleaved;
}

function transcriptFromAlternative(alternative: DeepgramAlternative): string {
  const direct = alternative.transcript.trim();
  if (direct) return direct;
  const words = alternative.words ?? [];
  if (words.length === 0) return "";
  return words
    .map((word) => word.punctuated_word ?? word.word)
    .join(" ")
    .trim();
}

interface VoicePrefs {
  provider?: VoiceProvider;
  instructions?: string;
}

interface UseCallTranscriptionOptions {
  enabled: boolean;
  audioEnabled?: boolean;
  captureMode?: TranscriptionCaptureMode;
  onFinalText?: (text: string) => void;
  /** speaker is set when the provider supports diarization (e.g. Deepgram). */
  onFinalChunk?: (
    text: string,
    speaker?: string,
    options?: { labelConfidence?: number | null },
  ) => void;
  onLiveUpdate?: (
    finalText: string,
    interimText: string,
    interimSpeaker?: string,
  ) => void;
  onError?: (message: string) => void;
}

interface CallTranscriptionState {
  supported: boolean;
  listening: boolean;
  amplitude: number;
  error: string | null;
  connectionNotice: string | null;
  breakRecognitionForSpeakerTurn: () => void;
  start: () => Promise<void>;
  stop: () => void;
}

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

function getSpeechRecognitionCtor(): (new () => BrowserSpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function pickMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  for (const mime of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }
  return "audio/webm";
}

async function readVoicePrefs(): Promise<VoicePrefs> {
  try {
    const res = await fetch(PREFS_URL);
    if (!res.ok) return {};
    return (await res.json()) as VoicePrefs;
  } catch {
    return {};
  }
}

export function useCallTranscription(
  options: UseCallTranscriptionOptions,
): CallTranscriptionState {
  const {
    enabled,
    audioEnabled = enabled,
    captureMode = "mic-only",
    onFinalText,
    onFinalChunk,
    onLiveUpdate,
    onError,
  } = options;
  const onFinalTextRef = useRef(onFinalText);
  const onFinalChunkRef = useRef(onFinalChunk);
  const onLiveUpdateRef = useRef(onLiveUpdate);
  const onErrorRef = useRef(onError);
  const enabledRef = useRef(enabled);
  const audioEnabledRef = useRef(audioEnabled);
  const listeningRef = useRef(false);
  const finalTextRef = useRef("");
  const interimTextRef = useRef("");

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [connectionNotice, setConnectionNotice] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const captureMicStreamRef = useRef<MediaStream | null>(null);
  const captureDisplayStreamRef = useRef<MediaStream | null>(null);
  const captureMixContextRef = useRef<AudioContext | null>(null);
  const captureVideoRef = useRef<HTMLVideoElement | null>(null);
  const captureModeRef = useRef<TranscriptionCaptureMode>(captureMode);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const speechRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const pcmProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const pcmSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const pcmSystemSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const pcmMergerRef = useRef<ChannelMergerNode | null>(null);
  const realtimeSocketRef = useRef<WebSocket | null>(null);
  const deepgramListenSocketRef = useRef<DeepgramListenSocket | null>(null);
  const deepgramListenAbortRef = useRef<AbortController | null>(null);
  const deepgramReadyRef = useRef(false);
  const pcmStreamingRef = useRef(false);
  const deepgramConnectPromiseRef = useRef<Promise<void> | null>(null);
  const realtimeStopTimeoutRef = useRef<number | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);
  const connectionNoticeSetterRef = useRef(setConnectionNotice);
  const speechDetectedRef = useRef(false);
  const speechGateFrameRef = useRef<number | null>(null);
  const speechGateContextRef = useRef<AudioContext | null>(null);
  const speechGateAnalyserRef = useRef<AnalyserNode | null>(null);
  const speechGateBufferRef = useRef<Uint8Array | null>(null);
  const sourceMonitorIntervalRef = useRef<number | null>(null);
  const sourceMonitorContextRef = useRef<AudioContext | null>(null);
  const sourceMonitorMicRef = useRef<AnalyserNode | null>(null);
  const sourceMonitorSystemRef = useRef<AnalyserNode | null>(null);
  const sourceMonitorBufferRef = useRef<Uint8Array | null>(null);
  const startRef = useRef<() => Promise<void>>(async () => {});
  const stopRef = useRef<() => void>(() => {});
  const startAudioCaptureRef = useRef<() => Promise<void>>(async () => {});
  const startBrowserRecognitionRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    onFinalTextRef.current = onFinalText;
    onFinalChunkRef.current = onFinalChunk;
    onLiveUpdateRef.current = onLiveUpdate;
    onErrorRef.current = onError;
  }, [onFinalText, onFinalChunk, onLiveUpdate, onError]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  useEffect(() => {
    captureModeRef.current = captureMode;
  }, [captureMode]);

  useEffect(() => {
    connectionNoticeSetterRef.current = setConnectionNotice;
  }, []);

  useEffect(() => {
    const hasMic =
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia;
    const hasSpeech = !!getSpeechRecognitionCtor();
    const hasRecorder = typeof MediaRecorder !== "undefined";
    setSupported(hasMic && (hasSpeech || hasRecorder));
  }, []);

  const emitLive = useCallback(() => {
    onLiveUpdateRef.current?.(finalTextRef.current, interimTextRef.current);
  }, []);

  const failWith = useCallback((message: string) => {
    setError(message);
    onErrorRef.current?.(message);
  }, []);

  const stopSpeechGate = useCallback(() => {
    if (speechGateFrameRef.current !== null) {
      cancelAnimationFrame(speechGateFrameRef.current);
      speechGateFrameRef.current = null;
    }
    speechGateAnalyserRef.current = null;
    speechGateBufferRef.current = null;
    speechDetectedRef.current = false;
    if (speechGateContextRef.current) {
      void speechGateContextRef.current.close().catch(() => {});
      speechGateContextRef.current = null;
    }
  }, []);

  const startSpeechGate = useCallback(
    (stream: MediaStream) => {
      stopSpeechGate();
      const AudioCtor = getAudioContextCtor();
      if (!AudioCtor) return;

      const context = new AudioCtor();
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      const buffer = new Uint8Array(analyser.frequencyBinCount);
      context.createMediaStreamSource(stream).connect(analyser);
      speechGateContextRef.current = context;
      speechGateAnalyserRef.current = analyser;
      speechGateBufferRef.current = buffer;
      speechDetectedRef.current = false;

      const tick = () => {
        if (!speechGateAnalyserRef.current || !speechGateBufferRef.current) return;
        if (
          measureAnalyserRms(
            speechGateAnalyserRef.current,
            speechGateBufferRef.current,
          ) >= SPEECH_RMS_THRESHOLD
        ) {
          speechDetectedRef.current = true;
        }
        speechGateFrameRef.current = requestAnimationFrame(tick);
      };
      speechGateFrameRef.current = requestAnimationFrame(tick);
    },
    [stopSpeechGate],
  );

  const consumeSpeechChunk = useCallback(() => {
    const shouldSend = speechDetectedRef.current;
    speechDetectedRef.current = false;
    return shouldSend;
  }, []);

  const stopSourceActivityMonitor = useCallback(() => {
    if (sourceMonitorIntervalRef.current !== null) {
      window.clearInterval(sourceMonitorIntervalRef.current);
      sourceMonitorIntervalRef.current = null;
    }
    sourceMonitorMicRef.current = null;
    sourceMonitorSystemRef.current = null;
    sourceMonitorBufferRef.current = null;
    if (sourceMonitorContextRef.current) {
      void sourceMonitorContextRef.current.close().catch(() => {});
      sourceMonitorContextRef.current = null;
    }
  }, []);

  const startSourceActivityMonitor = useCallback(() => {
    stopSourceActivityMonitor();
    if (!captureMicStreamRef.current && !captureDisplayStreamRef.current) {
      return;
    }

    const AudioCtor = getAudioContextCtor();
    if (!AudioCtor) return;

    const context = new AudioCtor();
    sourceMonitorContextRef.current = context;

    if (captureMicStreamRef.current) {
      const micAnalyser = context.createAnalyser();
      micAnalyser.fftSize = 2048;
      context
        .createMediaStreamSource(captureMicStreamRef.current)
        .connect(micAnalyser);
      sourceMonitorMicRef.current = micAnalyser;
    }

    const displayAudioTracks = captureDisplayStreamRef.current?.getAudioTracks() ?? [];
    if (displayAudioTracks.length > 0) {
      const systemAnalyser = context.createAnalyser();
      systemAnalyser.fftSize = 2048;
      context
        .createMediaStreamSource(new MediaStream(displayAudioTracks))
        .connect(systemAnalyser);
      sourceMonitorSystemRef.current = systemAnalyser;
    }

    const buffer = new Uint8Array(
      sourceMonitorMicRef.current?.fftSize ??
        sourceMonitorSystemRef.current?.fftSize ??
        2048,
    );
    sourceMonitorBufferRef.current = buffer;
    sourceMonitorIntervalRef.current = window.setInterval(() => {
      const micTrack = captureMicStreamRef.current?.getAudioTracks()[0];
      const systemTrack = captureDisplayStreamRef.current?.getAudioTracks()[0];
      const micRms = sourceMonitorMicRef.current
        ? measureAnalyserRms(sourceMonitorMicRef.current, buffer)
        : null;
      const systemRms = sourceMonitorSystemRef.current
        ? measureAnalyserRms(sourceMonitorSystemRef.current, buffer)
        : null;

      logTranscription("Audio source activity", {
        mic: {
          live: micTrack?.readyState === "live",
          muted: micTrack?.muted ?? null,
          providingAudio:
            micRms !== null && micRms >= SPEECH_RMS_THRESHOLD,
          rms: micRms,
        },
        system: {
          live: systemTrack?.readyState === "live",
          muted: systemTrack?.muted ?? null,
          providingAudio:
            systemRms !== null && systemRms >= SPEECH_RMS_THRESHOLD,
          rms: systemRms,
        },
      });
    }, SOURCE_ACTIVITY_LOG_MS);
  }, [stopSourceActivityMonitor]);

  const beginDeepgramAudioPipeline = useCallback(
    (stream: MediaStream) => {
      startSpeechGate(stream);
      startSourceActivityMonitor();
    },
    [startSourceActivityMonitor, startSpeechGate],
  );

  const stopCaptureSources = useCallback(() => {
    captureVideoRef.current?.remove();
    captureVideoRef.current = null;

    for (const stream of [captureMicStreamRef, captureDisplayStreamRef]) {
      if (!stream.current) continue;
      for (const track of stream.current.getTracks()) {
        track.stop();
      }
      stream.current = null;
    }

    if (captureMixContextRef.current) {
      void captureMixContextRef.current.close().catch(() => {});
      captureMixContextRef.current = null;
    }
  }, []);

  const acquireCaptureStream = useCallback(async (): Promise<MediaStream> => {
    stopCaptureSources();

    const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    captureMicStreamRef.current = micStream;
    for (const track of micStream.getAudioTracks()) {
      track.addEventListener("ended", () => {
        logTranscription("Microphone audio track ended");
      });
      track.addEventListener("mute", () => {
        logTranscription("Microphone audio track muted");
      });
      track.addEventListener("unmute", () => {
        logTranscription("Microphone audio track unmuted");
      });
    }

    if (captureModeRef.current === "mic-only") {
      return micStream;
    }

    if (!navigator.mediaDevices.getDisplayMedia) {
      throw new Error("This browser does not support system audio capture.");
    }

    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
    captureDisplayStreamRef.current = displayStream;

    const video = document.createElement("video");
    video.srcObject = displayStream;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("aria-hidden", "true");
    video.style.position = "fixed";
    video.style.width = "1px";
    video.style.height = "1px";
    video.style.opacity = "0";
    video.style.pointerEvents = "none";
    video.style.zIndex = "-1";
    document.body.appendChild(video);
    captureVideoRef.current = video;
    void video.play().catch(() => {});

    const displayAudioTracks = displayStream.getAudioTracks();
    if (displayAudioTracks.length === 0) {
      throw new Error(
        "No system audio was shared. Choose a call tab and enable tab audio.",
      );
    }

    for (const track of displayAudioTracks) {
      track.addEventListener("ended", () => {
        logTranscription("System audio track ended");
        connectionNoticeSetterRef.current(SYSTEM_AUDIO_ENDED_NOTICE);
      });
      track.addEventListener("mute", () => {
        logTranscription("System audio track muted");
        connectionNoticeSetterRef.current(SYSTEM_AUDIO_ENDED_NOTICE);
      });
      track.addEventListener("unmute", () => {
        logTranscription("System audio track unmuted");
      });
    }

    const AudioCtor = getAudioContextCtor();
    if (!AudioCtor) {
      throw new Error("Web Audio is not available for system audio capture.");
    }

    const context = new AudioCtor();
    captureMixContextRef.current = context;
    const destination = context.createMediaStreamDestination();
    context.createMediaStreamSource(micStream).connect(destination);
    context
      .createMediaStreamSource(new MediaStream(displayAudioTracks))
      .connect(destination);

    if (context.state === "suspended") {
      await context.resume().catch(() => {});
    }

    logTranscription("Merged microphone and system audio for transcription");
    return destination.stream;
  }, [stopCaptureSources]);

  const stopMeter = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    analyserRef.current = null;
    if (audioContextRef.current) {
      void audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAmplitude(0);
  }, []);

  const stopMedia = useCallback(() => {
    if (restartTimeoutRef.current !== null) {
      window.clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (realtimeStopTimeoutRef.current !== null) {
      window.clearTimeout(realtimeStopTimeoutRef.current);
      realtimeStopTimeoutRef.current = null;
    }
    if (speechRef.current) {
      try {
        speechRef.current.onresult = null;
        speechRef.current.onerror = null;
        speechRef.current.onend = null;
        speechRef.current.stop();
      } catch {
        /* ignore */
      }
      speechRef.current = null;
    }
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch {
        /* ignore */
      }
      mediaRecorderRef.current = null;
    }
    if (pcmProcessorRef.current) {
      try {
        pcmProcessorRef.current.onaudioprocess = null;
        pcmProcessorRef.current.disconnect();
      } catch {
        /* ignore */
      }
      pcmProcessorRef.current = null;
    }
    if (pcmSourceRef.current) {
      try {
        pcmSourceRef.current.disconnect();
      } catch {
        /* ignore */
      }
      pcmSourceRef.current = null;
    }
    if (pcmSystemSourceRef.current) {
      try {
        pcmSystemSourceRef.current.disconnect();
      } catch {
        /* ignore */
      }
      pcmSystemSourceRef.current = null;
    }
    if (pcmMergerRef.current) {
      try {
        pcmMergerRef.current.disconnect();
      } catch {
        /* ignore */
      }
      pcmMergerRef.current = null;
    }
    if (realtimeSocketRef.current) {
      try {
        realtimeSocketRef.current.close();
      } catch {
        /* ignore */
      }
      realtimeSocketRef.current = null;
    }
    deepgramReadyRef.current = false;
    pcmStreamingRef.current = false;
    if (mediaStreamRef.current) {
      for (const track of mediaStreamRef.current.getTracks()) {
        track.stop();
      }
      mediaStreamRef.current = null;
    }
    stopCaptureSources();
    stopSpeechGate();
    stopSourceActivityMonitor();
    stopMeter();
  }, [stopCaptureSources, stopMeter, stopSourceActivityMonitor, stopSpeechGate]);

  const stopDeepgramTransport = useCallback(() => {
    if (realtimeStopTimeoutRef.current !== null) {
      window.clearTimeout(realtimeStopTimeoutRef.current);
      realtimeStopTimeoutRef.current = null;
    }
    if (deepgramListenAbortRef.current) {
      deepgramListenAbortRef.current.abort();
      deepgramListenAbortRef.current = null;
    }
    if (deepgramListenSocketRef.current) {
      try {
        deepgramListenSocketRef.current.close();
      } catch {
        /* ignore */
      }
      deepgramListenSocketRef.current = null;
    }
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch {
        /* ignore */
      }
      mediaRecorderRef.current = null;
    }
    if (pcmProcessorRef.current) {
      try {
        pcmProcessorRef.current.onaudioprocess = null;
        pcmProcessorRef.current.disconnect();
      } catch {
        /* ignore */
      }
      pcmProcessorRef.current = null;
    }
    if (pcmSourceRef.current) {
      try {
        pcmSourceRef.current.disconnect();
      } catch {
        /* ignore */
      }
      pcmSourceRef.current = null;
    }
    if (pcmSystemSourceRef.current) {
      try {
        pcmSystemSourceRef.current.disconnect();
      } catch {
        /* ignore */
      }
      pcmSystemSourceRef.current = null;
    }
    if (pcmMergerRef.current) {
      try {
        pcmMergerRef.current.disconnect();
      } catch {
        /* ignore */
      }
      pcmMergerRef.current = null;
    }
    if (realtimeSocketRef.current) {
      try {
        realtimeSocketRef.current.close();
      } catch {
        /* ignore */
      }
      realtimeSocketRef.current = null;
    }
    deepgramReadyRef.current = false;
    pcmStreamingRef.current = false;
  }, []);

  const startMeter = useCallback((stream: MediaStream) => {
    if (analyserRef.current) return;

    try {
      const AudioCtor =
        typeof window !== "undefined"
          ? window.AudioContext ||
            (window as Window & { webkitAudioContext?: typeof AudioContext })
              .webkitAudioContext ||
            null
          : null;
      if (!AudioCtor) return;

      const context = new AudioCtor();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      audioContextRef.current = context;
      analyserRef.current = analyser;

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(buffer);
        let sumSquares = 0;
        for (let index = 0; index < buffer.length; index += 1) {
          const normalized = (buffer[index] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / buffer.length);
        setAmplitude(Math.min(1, rms * 2.5));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      /* analyser is best-effort */
    }
  }, []);

  const startDeepgramRealtime = useCallback(async () => {
    const existingSocket = deepgramListenSocketRef.current;
    if (
      existingSocket &&
      (existingSocket.readyState === WebSocket.OPEN ||
        existingSocket.readyState === WebSocket.CONNECTING)
    ) {
      logTranscription("Reusing existing Deepgram listen socket");
      return;
    }
    if (deepgramConnectPromiseRef.current) {
      await deepgramConnectPromiseRef.current;
      return;
    }

    const connectDeepgram = async () => {
      const key = await readDeepgramToken();
      const stream =
        mediaStreamRef.current ?? (await acquireCaptureStream());
      if (cancelledRef.current) {
        for (const track of stream.getTracks()) track.stop();
        return;
      }

      mediaStreamRef.current = stream;
      startMeter(stream);
      beginDeepgramAudioPipeline(stream);
      stopDeepgramTransport();

      const targetSampleRate = 16_000;
      const AudioCtor = getAudioContextCtor();
      if (!AudioCtor) {
        throw new Error("Web Audio is not available for live transcription.");
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtor();
      }
      const context = audioContextRef.current;
      if (context.state === "suspended") {
        await context.resume().catch(() => {});
      }

      deepgramReadyRef.current = false;
      pcmStreamingRef.current = false;
      const useMultichannel = captureModeRef.current === "mic-and-system";

      const handleDeepgramResult = (result: DeepgramResultMessage) => {
        const alternative = result.channel?.alternatives?.[0];
        if (!alternative) return;

        const transcript = transcriptFromAlternative(alternative);
        if (!transcript) return;

        const channelIndex = result.channel_index?.[0];
        const channelSpeaker =
          channelIndex === undefined
            ? null
            : deterministicChannelLabel(channelIndex);

        if (!result.is_final) {
          if (useMultichannel) {
            interimTextRef.current = transcript;
            onLiveUpdateRef.current?.(
              finalTextRef.current,
              transcript,
              channelSpeaker ?? "You",
            );
            return;
          }

          const words = alternative.words ?? [];
          if (words.length > 0) {
            const turns = groupDeepgramWordsBySpeaker(words);
            const currentTurn = turns[turns.length - 1];
            interimTextRef.current = currentTurn.text;
            onLiveUpdateRef.current?.(
              finalTextRef.current,
              currentTurn.text,
              currentTurn.speaker,
            );
            return;
          }

          interimTextRef.current = transcript;
          onLiveUpdateRef.current?.(finalTextRef.current, transcript, "You");
          return;
        }

        interimTextRef.current = "";

        if (useMultichannel) {
          const finalText = transcript.trim();
          if (!finalText) {
            logTranscription("Skipping empty Deepgram transcript");
            return;
          }
          const speaker = channelSpeaker ?? "You";
          finalTextRef.current = [finalTextRef.current, finalText]
            .filter(Boolean)
            .join(" ")
            .trim();
          onFinalChunkRef.current?.(finalText, speaker, { labelConfidence: null });
          onLiveUpdateRef.current?.(finalTextRef.current, "");
          return;
        }

        const utteranceTurns = parseDeepgramUtteranceSegments(
          result.utterances ?? [],
        );
        if (utteranceTurns.length > 0) {
          for (const turn of utteranceTurns) {
            const text = turn.text.trim();
            if (!text) continue;
            finalTextRef.current = [finalTextRef.current, text]
              .filter(Boolean)
              .join(" ")
              .trim();
            onFinalChunkRef.current?.(text, turn.speaker, {
              labelConfidence: turn.labelConfidence ?? null,
            });
          }
          onLiveUpdateRef.current?.(finalTextRef.current, "");
          return;
        }

        const words = alternative.words ?? [];
        if (words.length === 0) {
          const finalText = transcript.trim();
          if (!finalText) {
            logTranscription("Skipping empty Deepgram transcript");
            return;
          }
          finalTextRef.current = [finalTextRef.current, finalText]
            .filter(Boolean)
            .join(" ")
            .trim();
          onFinalChunkRef.current?.(finalText, "You", { labelConfidence: null });
          onLiveUpdateRef.current?.(finalTextRef.current, "");
          return;
        }

        const turns = groupDeepgramWordsBySpeaker(words);
        for (const turn of turns) {
          const text = turn.text.trim();
          if (!text) continue;
          finalTextRef.current = [finalTextRef.current, text]
            .filter(Boolean)
            .join(" ")
            .trim();
          onFinalChunkRef.current?.(text, turn.speaker, {
            labelConfidence: turn.labelConfidence ?? null,
          });
        }
        onLiveUpdateRef.current?.(finalTextRef.current, "");
      };

      const startPcmCapture = () => {
        if (pcmStreamingRef.current || cancelledRef.current || pcmProcessorRef.current) {
          return;
        }

        const sampleRate = Math.round(context.sampleRate);
        const processor = useMultichannel
          ? context.createScriptProcessor(4096, 2, 1)
          : context.createScriptProcessor(4096, 1, 1);
        pcmProcessorRef.current = processor;

        if (useMultichannel) {
          const micStream = captureMicStreamRef.current;
          const systemTracks =
            captureDisplayStreamRef.current?.getAudioTracks() ?? [];
          if (!micStream || systemTracks.length === 0) {
            throw new Error(
              "Mic + System Audio mode requires both microphone and system audio tracks.",
            );
          }

          const merger = context.createChannelMerger(2);
          const micSource = context.createMediaStreamSource(micStream);
          const systemSource = context.createMediaStreamSource(
            new MediaStream(systemTracks),
          );
          micSource.connect(merger, 0, 0);
          systemSource.connect(merger, 0, 1);
          pcmSourceRef.current = micSource;
          pcmSystemSourceRef.current = systemSource;
          pcmMergerRef.current = merger;
          merger.connect(processor);

          processor.onaudioprocess = (event) => {
            if (!deepgramReadyRef.current || cancelledRef.current) return;
            const activeSocket = deepgramListenSocketRef.current;
            if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) return;

            const micInput = event.inputBuffer.getChannelData(0);
            const systemInput = event.inputBuffer.getChannelData(1);
            if (
              measureChannelRms(micInput) < SPEECH_RMS_THRESHOLD &&
              measureChannelRms(systemInput) < SPEECH_RMS_THRESHOLD
            ) {
              return;
            }
            const pcm = downsampleStereoToLinear16(
              micInput,
              systemInput,
              sampleRate,
              targetSampleRate,
            );
            try {
              activeSocket.sendMedia(pcm);
            } catch (err) {
              logTranscription("Failed to send PCM to Deepgram", err);
            }
          };
        } else {
          const source = context.createMediaStreamSource(stream);
          pcmSourceRef.current = source;

          processor.onaudioprocess = (event) => {
            if (!deepgramReadyRef.current || cancelledRef.current) return;
            const activeSocket = deepgramListenSocketRef.current;
            if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) return;

            const input = event.inputBuffer.getChannelData(0);
            if (measureChannelRms(input) < SPEECH_RMS_THRESHOLD) {
              return;
            }
            const pcm = downsampleToLinear16(input, sampleRate, targetSampleRate);
            try {
              activeSocket.sendMedia(pcm);
            } catch (err) {
              logTranscription("Failed to send PCM to Deepgram", err);
            }
          };

          source.connect(processor);
        }

        processor.connect(context.destination);
        pcmStreamingRef.current = true;
        logTranscription("PCM capture started", {
          sampleRate: targetSampleRate,
          channels: useMultichannel ? 2 : 1,
        });
      };

      const abortController = new AbortController();
      deepgramListenAbortRef.current = abortController;

      const client = new DeepgramClient({ apiKey: key });
      const socket = await client.listen.v1.connect(
        useMultichannel
          ? {
              model: "nova-2",
              multichannel: "true",
              channels: "2",
              punctuate: "true",
              smart_format: "true",
              interim_results: "true",
              endpointing: 300,
              utterance_end_ms: 1500,
              keywords: "Builder:2,Figma:2,React:2",
              encoding: "linear16",
              sample_rate: String(targetSampleRate),
              Authorization: `Token ${key}`,
              protocols: ["token", key],
              abortSignal: abortController.signal,
            }
          : {
              model: "nova-2",
              diarize: "true",
              punctuate: "true",
              smart_format: "true",
              interim_results: "true",
              endpointing: 300,
              utterance_end_ms: 1500,
              keywords: "Builder:2,Figma:2,React:2",
              encoding: "linear16",
              sample_rate: String(targetSampleRate),
              Authorization: `Token ${key}`,
              protocols: ["token", key],
              abortSignal: abortController.signal,
              queryParams: {
                diarize_version: "latest",
                utterances: "true",
              },
            },
      );

      socket.on("open", () => {
        deepgramReadyRef.current = true;
        setConnectionNotice(null);
        startPcmCapture();
        logTranscription("Deepgram listen socket open");
      });

      socket.on("message", (message) => {
        if (message.type !== "Results") return;
        handleDeepgramResult(message as DeepgramResultMessage);
      });

      socket.on("close", (event) => {
        if (!listeningRef.current || cancelledRef.current) return;
        logTranscription("Deepgram connection closed", {
          code: event.code,
          reason: event.reason,
        });
        if (event.code !== 1000) {
          setConnectionNotice("Transcription connection lost, reconnecting...");
        }
      });

      socket.on("error", (error) => {
        if (!listeningRef.current || cancelledRef.current) return;
        logTranscription("Deepgram connection error", { message: error.message });
      });

      socket.connect();
      await socket.waitForOpen();
      deepgramListenSocketRef.current = socket;
    };

    deepgramConnectPromiseRef.current = connectDeepgram();
    try {
      await deepgramConnectPromiseRef.current;
    } finally {
      deepgramConnectPromiseRef.current = null;
    }
  }, [acquireCaptureStream, beginDeepgramAudioPipeline, startMeter, stopDeepgramTransport]);

  const startAudioCapture = useCallback(async () => {
    if (mediaStreamRef.current || captureModeRef.current === "mic-and-system") {
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (cancelledRef.current) {
      for (const track of stream.getTracks()) track.stop();
      return;
    }
    mediaStreamRef.current = stream;
    startMeter(stream);
  }, [startMeter]);

  const startBrowserRecognition = useCallback(async () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      throw new Error(
        "This browser does not support live speech recognition. Configure a transcription provider in settings.",
      );
    }

    const stream =
      mediaStreamRef.current ?? (await acquireCaptureStream());
    if (cancelledRef.current) {
      for (const track of stream.getTracks()) track.stop();
      return;
    }

    mediaStreamRef.current = stream;
    startMeter(stream);

    if (speechRef.current) {
      const existing = speechRef.current;
      try {
        existing.onresult = null;
        existing.onerror = null;
        existing.onend = null;
        existing.stop();
      } catch {
        /* ignore */
      }
      speechRef.current = null;
    }

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang =
      (typeof navigator !== "undefined" && navigator.language) || "en-US";
    speechRef.current = recognition;

    recognition.onresult = (event) => {
      let interim = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          const finalChunk = text.trim();
          if (finalChunk) {
            finalTextRef.current = [finalTextRef.current, finalChunk]
              .filter(Boolean)
              .join(" ")
              .trim();
            onFinalChunkRef.current?.(finalChunk);
          }
        } else {
          interim += text;
        }
      }
      interimTextRef.current = interim;
      emitLive();
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      failWith(
        event.error === "not-allowed"
          ? "Microphone access was denied."
          : `Speech recognition error: ${event.error}`,
      );
    };

    recognition.onend = () => {
      if (!listeningRef.current || cancelledRef.current) return;
      if (speechRef.current !== recognition) return;
      restartTimeoutRef.current = window.setTimeout(() => {
        restartTimeoutRef.current = null;
        if (!listeningRef.current || cancelledRef.current) return;
        void startBrowserRecognitionRef.current();
      }, 250);
    };

    recognition.start();
  }, [acquireCaptureStream, emitLive, failWith, startMeter]);

  const breakRecognitionForSpeakerTurn = useCallback(() => {
    const pending = interimTextRef.current.trim();
    if (pending) {
      onFinalChunkRef.current?.(pending);
      interimTextRef.current = "";
      emitLive();
    }

    if (!listeningRef.current || cancelledRef.current) {
      return;
    }

    if (realtimeSocketRef.current || deepgramListenSocketRef.current) {
      return;
    }

    if (!speechRef.current) {
      return;
    }

    if (restartTimeoutRef.current !== null) {
      window.clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    const recognition = speechRef.current;
    try {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    } catch {
      /* ignore */
    }
    speechRef.current = null;
    restartTimeoutRef.current = window.setTimeout(() => {
      restartTimeoutRef.current = null;
      if (!listeningRef.current || cancelledRef.current) return;
      void startBrowserRecognitionRef.current();
    }, 150);
  }, [emitLive]);

  const startGoogleRealtime = useCallback(async () => {
    const stream =
      mediaStreamRef.current ?? (await acquireCaptureStream());
    if (cancelledRef.current) {
      for (const track of stream.getTracks()) track.stop();
      return;
    }

    const sessionRes = await fetch(GOOGLE_REALTIME_SESSION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language:
          (typeof navigator !== "undefined" && navigator.language) || "en-US",
      }),
    });
    const sessionBody = (await sessionRes.json().catch(() => ({
      error: `HTTP ${sessionRes.status}`,
    }))) as {
      websocketUrl?: string;
      sessionToken?: string;
      websocketProtocol?: string;
      error?: string;
    };

    if (
      !sessionRes.ok ||
      !sessionBody.websocketUrl ||
      !sessionBody.sessionToken
    ) {
      for (const track of stream.getTracks()) track.stop();
      throw new Error(
        sessionBody.error ||
          `Could not start streaming transcription (${sessionRes.status})`,
      );
    }

    mediaStreamRef.current = stream;
    startMeter(stream);

    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;

    const socket = new WebSocket(sessionBody.websocketUrl, [
      sessionBody.websocketProtocol || GOOGLE_REALTIME_WS_PROTOCOL,
      sessionBody.sessionToken,
    ]);
    socket.binaryType = "arraybuffer";
    realtimeSocketRef.current = socket;

    socket.onmessage = (event) => {
      const raw =
        typeof event.data === "string"
          ? event.data
          : event.data instanceof Blob
            ? null
            : new TextDecoder().decode(event.data);
      if (!raw) return;

      let message: {
        type?: string;
        text?: string;
        isFinal?: boolean;
        error?: string;
      };
      try {
        message = JSON.parse(raw);
      } catch {
        return;
      }

      if (message.error) {
        failWith(message.error);
        return;
      }

      const text = (message.text ?? "").trim();
      if (!text) return;

      if (message.isFinal) {
        finalTextRef.current = [finalTextRef.current, text]
          .filter(Boolean)
          .join(" ")
          .trim();
        interimTextRef.current = "";
        onFinalChunkRef.current?.(text);
      } else {
        interimTextRef.current = text;
      }
      emitLive();
    };

    socket.onerror = () => {
      failWith("Streaming transcription connection failed.");
    };

    recorder.ondataavailable = async (event) => {
      if (!event.data || event.data.size === 0) return;
      const activeSocket = realtimeSocketRef.current;
      if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) return;
      try {
        activeSocket.send(await event.data.arrayBuffer());
      } catch {
        failWith("Streaming audio upload failed.");
      }
    };

    recorder.onstop = () => {
      const activeSocket = realtimeSocketRef.current;
      if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) return;
      try {
        activeSocket.send(JSON.stringify({ type: "stop" }));
      } catch {
        /* ignore */
      }
    };

    socket.onopen = () => {
      try {
        recorder.start(250);
      } catch {
        failWith("Could not start microphone capture.");
      }
    };
  }, [acquireCaptureStream, emitLive, failWith, startMeter]);

  const startChunkedTranscription = useCallback(
    async (provider: VoiceProvider, instructions?: string) => {
      const stream =
        mediaStreamRef.current ?? (await acquireCaptureStream());
      if (cancelledRef.current) {
        for (const track of stream.getTracks()) track.stop();
        return;
      }

      mediaStreamRef.current = stream;
      startMeter(stream);

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const localChunks = chunks.splice(0, chunks.length);
        if (!listeningRef.current || cancelledRef.current || localChunks.length === 0) {
          return;
        }

        try {
          const audioBlob = new Blob(localChunks, { type: mimeType });
          const form = new FormData();
          form.append("audio", audioBlob, `call.${mimeType.split("/")[1] ?? "webm"}`);
          form.append("provider", provider);
          if (instructions?.trim()) {
            form.append("instructions", instructions.trim());
          }

          const res = await fetch(TRANSCRIBE_URL, {
            method: "POST",
            body: form,
          });
          if (!res.ok) {
            const body = await res.json().catch(() => ({
              error: `HTTP ${res.status}`,
            }));
            throw new Error(body.error || `Transcription failed (${res.status})`);
          }
          const data = (await res.json()) as { text?: string };
          const text = (data.text ?? "").trim();
          if (text) {
            finalTextRef.current = [finalTextRef.current, text]
              .filter(Boolean)
              .join(" ")
              .trim();
            interimTextRef.current = "";
            emitLive();
            onFinalChunkRef.current?.(text);
            onFinalTextRef.current?.(text);
          }
        } catch (err) {
          failWith(
            err instanceof Error ? err.message : "Transcription request failed.",
          );
        } finally {
          if (listeningRef.current && !cancelledRef.current) {
            try {
              recorder.start(5000);
            } catch {
              failWith("Could not restart microphone capture.");
            }
          }
        }
      };

      recorder.start(5000);
    },
    [acquireCaptureStream, emitLive, failWith, startMeter],
  );

  const start = useCallback(async () => {
    if (listeningRef.current) return;
    cancelledRef.current = false;
    setError(null);
    setConnectionNotice(null);
    listeningRef.current = true;
    setListening(true);

    try {
      const prefs = await readVoicePrefs();
      const provider = prefs.provider ?? "deepgram";
      if (provider === "deepgram") {
        await startDeepgramRealtime();
        return;
      }
      if (provider === "google-realtime") {
        await startGoogleRealtime();
        return;
      }
      if (provider === "auto") {
        try {
          await startDeepgramRealtime();
          return;
        } catch (deepgramError) {
          console.warn(
            "[call-transcription] Deepgram live transcription unavailable:",
            deepgramError,
          );
          stopDeepgramTransport();
        }
      }
      if (provider === "browser" || (provider === "auto" && getSpeechRecognitionCtor())) {
        await startBrowserRecognition();
        return;
      }
      await startChunkedTranscription(provider, prefs.instructions);
    } catch (err) {
      console.error("[call-transcription] start failed:", err);
      listeningRef.current = false;
      setListening(false);
      stopMedia();
      failWith(
        err instanceof Error ? err.message : "Could not start live transcription.",
      );
    }
  }, [
    failWith,
    startBrowserRecognition,
    startChunkedTranscription,
    startDeepgramRealtime,
    startGoogleRealtime,
    stopDeepgramTransport,
    stopMedia,
  ]);

  const stop = useCallback(() => {
    if (cancelledRef.current && !listeningRef.current) {
      return;
    }
    cancelledRef.current = true;
    listeningRef.current = false;
    setListening(false);
    setConnectionNotice(null);
    deepgramConnectPromiseRef.current = null;
    stopMedia();
    interimTextRef.current = "";
    emitLive();
  }, [emitLive, stopMedia]);

  startRef.current = start;
  stopRef.current = stop;
  startAudioCaptureRef.current = startAudioCapture;
  startBrowserRecognitionRef.current = startBrowserRecognition;

  useEffect(() => {
    if (audioEnabled) {
      void startAudioCaptureRef.current();
      return;
    }
    if (!enabled) {
      stopRef.current();
    }
  }, [audioEnabled, enabled]);

  useEffect(() => {
    if (!enabled) return;
    void startRef.current();
    return () => {
      if (!audioEnabledRef.current) {
        stopRef.current();
      }
    };
  }, [enabled]);

  return {
    supported,
    listening,
    amplitude,
    error,
    connectionNotice,
    breakRecognitionForSpeakerTurn,
    start,
    stop,
  };
}
