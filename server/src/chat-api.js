import express from "express";
import cors from "cors";
import constants from "./constants";
import { Configuration, OpenAIApi } from "openai";

let isInit = false;

const openaiConfiguration = new Configuration({
  apiKey: constants.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfiguration);

async function getLLMResponse(prompt) {
  var response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
    max_tokens: 30,
  });
  return response.data.choices[0]["text"];
}

async function getChatResponse({ messages, temperature }) {
  var response = await openai.createChatCompletion({
    model: "gpt-4",
    messages,
    temperature,
  });

  return response.data.choices[0].message.content;
}

/**
 * @type {import("express").RequestHandler}
 */
const chatApiHandler = async (req, res) => {
  const { messages, temperature } = req.body;

  if (!messages) {
    res.status(400).send("Missing messages");
    return;
  }

  if (temperature == null) {
    res.status(400).send("Missing temperature");
    return;
  }

  try {
    const chatResponse = await getChatResponse({ messages, temperature });
    res.send({
      chatResponse,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to get chat response");
    return;
  }
};

export const initApi = () => {
  if (isInit) {
    throw new Error(`Chat API has already been initialized`);
  }

  isInit = true;

  const port = constants.CHAT_API_PORT;

  const app = express();

  app.use(express.json());
  app.use(cors({origin: "*"}));

  app.post("/chat", chatApiHandler);

  app.listen(port);

  console.log(`Chat API is running on port ${port}`);
};
