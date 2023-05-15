import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY");
}

if (!process.env.CHAT_API_PORT) {
  throw new Error("Missing CHAT_API_PORT");
}

/**
 * @type {{ OPENAI_API_KEY: string; CHAT_API_PORT: string }}
 */
const constants = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  CHAT_API_PORT: process.env.CHAT_API_PORT,
};

export default constants;
