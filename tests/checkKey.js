import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
  override: true,
  quiet: true
});

const key = process.env.GEMINI_API_KEY || "";

console.log("Key detected:", key.length > 0);
console.log("Key length:", key.length);

const invalid = [...key].filter(
  char => char.charCodeAt(0) < 33 ||
          char.charCodeAt(0) > 126
);

console.log("Invalid characters:", invalid.length);
console.log("Starts with AIza:", key.startsWith("AIza"));

if (invalid.length === 0 && key.length > 0) {
  console.log("Key format is safe for HTTP headers.");
} else {
  console.log("Please re-copy your key from Google AI Studio.");
}