import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openRouter = createOpenRouter({
    apiKey: process.env.OPEN_ROUTER_API_KEY,
})


export const MODAL = 'inclusionai/ling-3.0-flash-fin:free'