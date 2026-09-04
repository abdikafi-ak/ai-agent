"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    sendMessage({
      text: input,
    });

    setInput("");
  };

  const isGenerating =
    status === "submitted" || status === "streaming";

  const suggestions = [
    {
      title: "Get ideas",
      description: "What can you help me with?",
      icon: "💡",
      text: "What can you help me with?",
    },
    {
      title: "Search the web",
      description: "Search for the latest information",
      icon: "🔎",
      text: "Search the latest news about Somalia",
    },
    {
      title: "Learn something",
      description: "Explain a programming topic",
      icon: "📚",
      text: "Explain JavaScript to me",
    },
    {
      title: "Build something",
      description: "Get help with your project",
      icon: "💻",
      text: "Help me build a web application",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">

      {/* Header */}
      <header className="sticky left-0 top-0 z-40 border-b border-gray-200 bg-white p-5">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-semibold">
            Chat with AI
          </h1>
        </div>
      </header>

      {/* Messages */}
      <main className="mx-auto w-full max-w-2xl px-5 pt-6 pb-32">

        {messages.length === 0 ? (

          /* Welcome Screen */
          <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">

            {/* Logo */}
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-3xl text-white shadow-sm">
              ✦
            </div>

            {/* Title */}
            <h2 className="text-3xl font-semibold tracking-tight">
              How can I help you?
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-md text-gray-500">
              Ask me anything, search the web, learn something
              new, or get help with your projects.
            </p>

            {/* Suggestions */}
            <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">

              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.title}
                  type="button"
                  onClick={() => setInput(suggestion.text)}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {suggestion.icon}
                    </span>

                    <span className="font-medium">
                      {suggestion.title}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {suggestion.description}
                  </p>
                </button>
              ))}

            </div>
          </div>

        ) : (

          /* Chat Messages */
          <div className="flex w-full flex-col gap-4">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full min-w-0 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[85%] min-w-0 wrap-break-words rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-gray-600 text-white"
                      : "border border-gray-200 bg-gray-200 text-black"
                  }`}
                >

                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <p
                        key={index}
                        className="whitespace-pre-wrap wrap-break-words"
                      >
                        {part.text}
                      </p>
                    ) : null
                  )}

                </div>
              </div>
            ))}

            {/* Generating */}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3">

                  <span className="text-sm text-gray-500">
                    generating
                  </span>

                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500" />
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Input */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white p-5">

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-2xl gap-2"
        >

          <input
            type="text"
            placeholder={
              isGenerating
                ? "AI is generating..."
                : "Ask something..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGenerating}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="shrink-0 rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Send"}
          </button>

        </form>

      </div>

    </div>
  );
}