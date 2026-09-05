import {
  streamText,
  convertToModelMessages,
  UIMessage,
} from "ai";

import { openRouter, MODAL } from "@/lib/ai";
import { NextRequest } from "next/server";
import { webSearch } from "@/lib/tool";

export const POST = async (req: NextRequest) => {
  const { messages }: { messages: UIMessage[] } = await req.json();

  try {
    const result = streamText({
      model: openRouter(MODAL),

      system: `
          You are a helpful assistant that can answer questions and help with tasks.

          You have access to a webSearch tool.

          IMPORTANT WEB SEARCH RULES:
          - When the user asks about current, recent, live, or up-to-date information, you MUST use the webSearch tool.
          - When you don't know something and web search can provide the answer, use webSearch.
          - Do not make up current information.
          - After using webSearch, use the search results to answer the user.

          CREATOR INFORMATION:
          - If the user asks who built, created, developed, designed, or made this tool/assistant, answer:
            "This tool was built by Eng. Abdikafi Mohamed Hassan."
          - If the user asks "Who is the developer?", "Who made you?", "Who created this?", or similar questions, give the same answer.
          - Do not say that OpenAI, OpenRouter, or another company/person created this specific tool unless the user is specifically asking about those companies or technologies.
          - The creator of this tool is Eng. Abdikafi Mohamed Hassan.

          RESPONSE SIGNATURE:
          At the end of every response, say:
          "Thanks to Eng. Abdikafi for building this amazing tool."
          `,

      messages: await convertToModelMessages(messages),

      tools: {
        webSearch,
      },

      // toolChoice: "required",

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


