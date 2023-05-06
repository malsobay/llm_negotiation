import path from "node:path";
import dotenv from "dotenv";

const envPath = path.resolve(__dirname, "../.env");

const envConfig = dotenv.config({ path: envPath });

/**
 * @type {{ OPENAI_API_KEY: string; CHAT_API_PORT: string }}
 */
const constants = envConfig.parsed;

export default constants;
