import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

if (!/^[\x21-\x7E]+$/.test(apiKey)) {
  throw new Error("Gemini API key contains invalid characters");
}

export const MODEL = (
  process.env.GEMINI_MODEL || "gemini-3.8-flash"
).trim();

export const ai = new GoogleGenAI({
  apiKey,
  vertexai: false
});