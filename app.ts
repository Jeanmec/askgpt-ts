import express, { Application, Request, Response } from "express";
import http from "http";
import cors from "cors";
require("dotenv").config();

const app: Application = express();
const server: http.Server = http.createServer(app);
const port: number | string = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/", async (req: Request, res: Response) => {
  const prompt = req.body.prompt as string;
  if (!prompt) {
    return res.status(400).send("No prompt provided");
  } else {
    const response = await askChatGpt(prompt);
    return res.status(200).send(response);
  }
});

server.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});

async function askChatGpt(prompt: string) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  return chatCompletion.choices[0].message.content;
}
