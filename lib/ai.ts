import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openRouter = createOpenRouter({
    apiKey: process.env.OPEN_ROUTER_API_KEY,
})


export const MODAL = 'minimax/minimax-m3:free'