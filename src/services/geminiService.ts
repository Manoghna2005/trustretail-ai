/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { PredictionResult } from "../types";

// ✅ Vite frontend env variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

// Optional check in browser console
console.log("Frontend Gemini key exists =", !!apiKey);

// ✅ Gemini client
const ai = new GoogleGenAI({ apiKey });

export async function predictReliability(
  updateFrequency: number,
  accuracyRate: number,
  averageUpdateDelay: number,
  feedbackScore: number,
  complaintsCount: number
): Promise<PredictionResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze the following retail shop behavior data and predict a reliability score (0.0 to 1.0), provide a brief reasoning, and assign an incentive tier (Bronze, Silver, Gold, Platinum).

Data:
- Update Frequency: ${updateFrequency} times/week
- Accuracy Rate: ${(accuracyRate * 100).toFixed(1)}%
- Average Update Delay: ${averageUpdateDelay} hours
- Customer Feedback Score: ${feedbackScore}/5
- Complaints Count: ${complaintsCount}

Return the result strictly in JSON format like this:
{
  "score": 0.85,
  "reasoning": "Short explanation here",
  "tier": "Gold"
}`,

      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: "Reliability score from 0.0 to 1.0"
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation for the score"
            },
            tier: {
              type: Type.STRING,
              description: "Incentive tier: Bronze, Silver, Gold, or Platinum"
            }
          },
          required: ["score", "reasoning", "tier"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");

    return {
      score: result.score ?? 0.5,
      reasoning: result.reasoning ?? "AI generated score successfully.",
      tier: result.tier ?? "Silver"
    };
  } catch (error) {
    console.error("AI Prediction Error:", error);

    // ✅ Fallback logic if AI fails
    let score =
      (accuracyRate * 0.6) +
      ((feedbackScore / 5) * 0.3) +
      (Math.max(0, 1 - complaintsCount / 20) * 0.1);

    score = Math.min(1, Math.max(0, score));

    let tier: "Bronze" | "Silver" | "Gold" | "Platinum" = "Bronze";
    if (score > 0.9) tier = "Platinum";
    else if (score > 0.75) tier = "Gold";
    else if (score > 0.5) tier = "Silver";

    return {
      score,
      reasoning: "Calculated using heuristic fallback due to AI service interruption.",
      tier
    };
  }
}