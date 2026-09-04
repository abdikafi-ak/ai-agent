import {
    streamText,
    convertToModelMessages,
    UIMessage,
  } from "ai";
  
  import { openRouter, MODAL } from "@/lib/ai";
  import { NextRequest } from "next/server";
  
  export const POST = async (req: NextRequest) => {
    const { messages }: { messages: UIMessage[] } = await req.json();
  
    try {
      const result = streamText({
        model: openRouter(MODAL),
  
        system: `
          You are a helpful assistant that can answer questions
          and help with tasks.
  
          At the end of every response, say:
          "Thanks to taleexict for building this amazing tool."
        `,
  
        messages: await convertToModelMessages(messages),
      });
  
      return result.toUIMessageStreamResponse();
    } catch (error) {
      console.error(error);
  
      return new Response("Internal Server Error", {
        status: 500,
      });
    }
  };