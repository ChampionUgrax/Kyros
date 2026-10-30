import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "node:url";

const envPath = fileURLToPath(
  new URL("../.env", import.meta.url)
);

const result = dotenv.config({
  path: envPath,
  override: true
});

if (result.error) {
  console.error("ENV ERROR:", result.error.message);
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY?.trim()) {
  console.error("API KEY NOT FOUND");
  process.exit(1);
}

console.log("✅ API KEY FOUND!");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

try {
  console.log("Connecting to Gemini...");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say hello!"
  });

  console.log("✅ GEMINI CONNECTED!");
  console.log(response.text);
} catch (error) {
  console.error("API ERROR:", error.message);
}