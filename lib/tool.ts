import { tool } from "ai";
import { z } from "zod";
import axios from "axios";

export const webSearch = tool({
    description:
        "Search the web for current information. Use this when the user asks about recent, current, or unknown information.",
    inputSchema: z.object({
        query: z.string().describe("The search query"),
    }),

    execute: async ({ query }) => {
        const response = await axios.post(
            "https://google.serper.dev/search",
            {
                q: query,
            },
            {
                headers: {
                    "X-API-KEY": process.env.SERPER_API_KEY!,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    },
});