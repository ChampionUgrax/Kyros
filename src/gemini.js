import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const MODEL =
  process.env.GEMINI_MODEL || "gemini-3.8-flash";
