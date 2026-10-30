import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// STEP 1: Load .env from the main kyros_AI folder
const envPath = fileURLToPath(
  new URL("../.env", import.meta.url)
);

const result = dotenv.config({
  path: envPath,
  override: true,
  quiet: true
});

if (result.error) {
  console.error("ERROR: Cannot load .env:", result.error.message);
  process.exit(1);
}

// STEP 2: Read and validate API key
const key = process.env.GEMINI_API_KEY?.trim();

console.log("1. Checking API key...");

if (!key) {
  console.error("ERROR: GEMINI_API_KEY is missing!");
  process.exit(1);
}

console.log("API key detected:", true);
console.log("Key length:", key.length);

// Detect invalid HTTP header characters
const invalidChars = [...key].filter(
  char => !/^[\x21-\x7E]$/.test(char)
);

console.log("Invalid characters:", invalidChars.length);

if (invalidChars.length > 0 || key.length < 10) {
  console.error("ERROR: Invalid API key format!");
  console.error("Replace the key in your .env file.");
  process.exit(1);
}

console.log("2. API key format looks valid");

// STEP 3: Connect to Gemini API
console.log("3. Contacting Gemini API...");

try {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models",
    {
      method: "GET",
      headers: {
        "x-goog-api-key": key
      },
      signal: AbortSignal.timeout(15000)
    }
  );

  console.log("4. API status:", response.status);

  const data = await response.json();

  if (!response.ok) {
    console.error("API ERROR:", data.error?.message || data);
    process.exitCode = 1;
  } else {
    console.log("SUCCESS: Gemini API connected!");

    const models = data.models || [];

    console.log(
      "Available models:",
      models.slice(0, 10).map(model => model.name)
    );
  }

} catch (error) {
  console.error("CONNECTION ERROR:", error.message);
  console.error(
    "Underlying cause:",
    error.cause?.message || "Unknown"
  );
  console.error(
    "Error code:",
    error.cause?.code || "Unknown"
  );
  process.exitCode = 1;
}