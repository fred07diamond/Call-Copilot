import { defineAction } from "@agent-native/core";
import { z } from "zod";
import {
  markCallAnalysisError,
  publishCallAnalysisResult,
} from "../server/lib/analyses.js";

const transcriptSummarySchema = z.object({
  keyMoments: z.array(z.string()),
  questionsAsked: z.array(z.string()),
  objectionsRaised: z.array(z.string()),
  valuePropsMentioned: z.array(z.string()),
  talkRatio: z.object({
    repPercent: z.number(),
    prospectPercent: z.number(),
    assessment: z.string(),
  }),
});

const analysisResultSchema = z.object({
  analysisTier: z.enum(["quick", "deep"]).optional(),
  incompleteNote: z.string().nullable().optional(),
  transcriptSummary: transcriptSummarySchema.optional(),
  overallScore: z.object({
    score: z.number().min(1).max(10),
    summary: z.string().min(1),
  }),
  keyStrengths: z.object({
    summary: z.string().optional().default(""),
    items: z
      .array(
        z.object({
          title: z.string(),
          detail: z.string(),
          quote: z.string().optional(),
        }),
      )
      .default([]),
  }),
  areasToImprove: z.object({
    summary: z.string().optional().default(""),
    items: z
      .array(
        z.object({
          title: z.string(),
          detail: z.string(),
          quote: z.string().optional(),
        }),
      )
      .default([]),
  }),
  missedOpportunities: z.object({
    summary: z.string().optional().default(""),
    items: z
      .array(
        z.object({
          opportunity: z.string(),
          playbookReference: z.string(),
        }),
      )
      .default([]),
  }),
  topActionItems: z.object({
    items: z
      .array(
        z.object({
          priority: z.number().int().min(1),
          action: z.string(),
          playbookSection: z.string(),
        }),
      )
      .min(1)
      .max(10),
  }),
});

export default defineAction({
  description:
    "Publish a simplified Call Analysis result for a pending analysis request, or mark the request as failed.",
  schema: z.object({
    id: z.string().min(1),
    status: z.enum(["complete", "error"]).default("complete"),
    error: z.string().optional(),
    result: analysisResultSchema.optional(),
  }),
  http: false,
  run: async ({ id, status, error, result }) => {
    if (status === "error") {
      const analysis = await markCallAnalysisError({
        id,
        errorMessage: error ?? "Call analysis failed.",
      });
      return JSON.stringify({ analysis }, null, 2);
    }

    if (!result) {
      throw new Error("A structured analysis result is required.");
    }

    const analysis = await publishCallAnalysisResult({ id, result });
    return JSON.stringify({ analysis }, null, 2);
  },
});
