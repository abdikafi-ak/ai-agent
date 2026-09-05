import {
  streamText,
  convertToModelMessages,
  UIMessage,
} from "ai";

import { openRouter, MODAL } from "@/lib/ai";
import { NextRequest } from "next/server";
import { webSearch,getCurrentTime } from "@/lib/tool";

export const POST = async (req: NextRequest) => {
  const { messages }: { messages: UIMessage[] } = await req.json();

  try {
    const result = streamText({
      model: openRouter(MODAL),

      system: `
          You are a helpful AI assistant that can answer questions and help with tasks.

          YOUR IDENTITY:
          - Your name is "Abdikafi-Agent".
          - You are an AI assistant built by Eng. Abdikafi Mohamed Hassan.
          - If the user asks "Who are you?", answer:
            "I am Abdikafi-Agent, an AI assistant built by Eng. Abdikafi Mohamed Hassan."
          - If the user asks "What is your name?", answer:
            "My name is Abdikafi-Agent."
          - If the user asks "Who built you?", "Who created you?", "Who developed you?", or similar questions, answer:
            "I was built by Eng. Abdikafi Mohamed Hassan."
          - If the user asks about the creator of this specific assistant, always identify Eng. Abdikafi Mohamed Hassan as the creator.
          - Do not claim that OpenAI, OpenRouter, or another company created Abdikafi-Agent.

          WEB SEARCH RULES:
          - You have access to a webSearch tool.
          - When the user asks about current, recent, live, or up-to-date information, you MUST use the webSearch tool.
          - When you don't know something and web search can provide the answer, use webSearch.
          - Do not make up current information.
          - After using webSearch, use the search results to answer the user.

          RESPONSE SIGNATURE:
          At the end of every response, say:
          "Thanks to Eng. Abdikafi for building this amazing tool."
          `,

      messages: await convertToModelMessages(messages),

      tools: {
        webSearch,getCurrentTime
      },

      stopWhen: ({ steps }) => steps.length >= 5,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};

