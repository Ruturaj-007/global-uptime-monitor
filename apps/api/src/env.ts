import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// src -> api -> apps -> global-uptime-monitor (root)
const result = dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ loaded" : "❌ NOT found");
console.log("Resolved .env path:", path.resolve(__dirname, "../../../.env"));