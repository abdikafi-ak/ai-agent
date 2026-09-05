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
export const getCurrentTime = tool({
    description:
        "Get the current date and time. Use this whenever the user asks for the current time, today's date, or what time it is.",
    inputSchema: z.object({
        timezone: z
            .string()
            .optional()
            .describe(
                "IANA timezone such as Africa/Mogadishu, America/New_York, or Europe/London"
            ),
    }),

    execute: async ({ timezone = "Africa/Mogadishu" }) => {
        const now = new Date();

        return {
            date: new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                dateStyle: "full",
            }).format(now),

            time: new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                timeStyle: "long",
            }).format(now),

            timezone,
        };
    },
});