"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
export default function Home() {
  const { messages, sendMessage, status, stop } = useChat();

  const [input, setInput] = useState("");

  const isGenerating = status === "submitted" || status === "streaming";
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --------------------------------
  // Scroll state
  // --------------------------------
  const shouldAutoScrollRef = useRef(true);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };
  // --------------------------------
  // Detect browser scrolling
  // --------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const distanceFromBottom =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;

      const nearBottom = distanceFromBottom < 150;

      shouldAutoScrollRef.current = nearBottom;

      isUserScrollingRef.current = true;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // --------------------------------
  // Auto scroll while AI responds
  // --------------------------------
  useEffect(() => {
    if (!isGenerating) return;

    if (!shouldAutoScrollRef.current) return;

    if (isUserScrollingRef.current) return;

    requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "auto",
      });
    });
  }, [messages, isGenerating]);

  // --------------------------------
  // Send message
  // --------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || isGenerating) return;

    shouldAutoScrollRef.current = true;
    isUserScrollingRef.current = false;

    setInput("");

    await sendMessage({
      text,
    });

    requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  // --------------------------------
  // Suggestion
  // --------------------------------
  const handleSuggestion = async (text: string) => {
    if (isGenerating) return;

    shouldAutoScrollRef.current = true;
    isUserScrollingRef.current = false;

    setInput("");

    await sendMessage({
      text,
    });

    requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ========================================
          HEADER
      ======================================== */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* Logo / Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
              AI
            </div>

            <div>
              <h1 className="text-sm font-semibold">AbdiKafi-Agent</h1>

              <p className="text-xs text-gray-500">
                Your intelligent assistant
              </p>
            </div>
          </div>

          {/* Online */}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />

            <span className="text-xs text-gray-500">Online</span>
          </div>
        </div>
      </header>

      {/* ========================================
          MAIN
      ======================================== */}
      <main className="mx-auto w-full max-w-4xl px-4 pb-40 pt-8 sm:px-6 sm:pt-12">
        {/* ========================================
            EMPTY STATE
        ======================================== */}
        {messages.length === 0 && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center">
            {/* Icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
              ✨
            </div>

            {/* Title */}
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              How can I help you?
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-xl text-center text-sm leading-6 text-gray-500 sm:text-base">
              Ask me anything. I can help you write, explain, research, code,
              and more.
            </p>

            {/* ====================================
                SUGGESTIONS
            ==================================== */}
            <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
              {/* Suggestion 1 */}
              <button
                type="button"
                onClick={() =>
                  handleSuggestion("Explain HTML to me in simple terms")
                }
                className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:bg-gray-50"
              >
                <p className="text-sm font-medium">Learn something</p>

                <p className="mt-1 text-xs text-gray-500">
                  Explain HTML in simple terms
                </p>
              </button>

              {/* Suggestion 2 */}
              <button
                type="button"
                onClick={() =>
                  handleSuggestion("Give me a beginner JavaScript project")
                }
                className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:bg-gray-50"
              >
                <p className="text-sm font-medium">Build a project</p>

                <p className="mt-1 text-xs text-gray-500">
                  Give me a beginner JavaScript project
                </p>
              </button>

              {/* Suggestion 3 */}
              <button
                type="button"
                onClick={() => handleSuggestion("Explain what an API is")}
                className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:bg-gray-50"
              >
                <p className="text-sm font-medium">Understand APIs</p>

                <p className="mt-1 text-xs text-gray-500">
                  Explain APIs for beginners
                </p>
              </button>

              {/* Suggestion 4 */}
              <button
                type="button"
                onClick={() =>
                  handleSuggestion("Help me create a Node.js backend")
                }
                className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:bg-gray-50"
              >
                <p className="text-sm font-medium">Get coding help</p>

                <p className="mt-1 text-xs text-gray-500">
                  Help me create a Node.js backend
                </p>
              </button>
            </div>
          </div>
        )}

        {/* ========================================
            CHAT MESSAGES
        ======================================== */}
        {messages.length > 0 && (
          <div className="flex w-full flex-col gap-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full min-w-0 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* ==================================
                    USER MESSAGE
                ================================== */}
                {message.role === "user" ? (
                  <div className="max-w-[85%] min-w-0 rounded-2xl bg-gray-900 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                    {message.parts.map((part, index) =>
                      part.type === "text" ? (
                        <p
                          key={index}
                          className="whitespace-pre-wrap wrap-break-words"
                        >
                          {part.text}
                        </p>
                      ) : null,
                    )}
                  </div>
                ) : (
                  /* ==================================
                     AI MESSAGE
                  ================================== */
                  <div className="w-full min-w-0 max-w-[95%]">
                    {message.parts.map((part, index) =>
                      part.type === "text" ? (
                        <ReactMarkdown
                          key={index}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            /* -----------------------
                               Paragraph
                            ----------------------- */
                            p: ({ children }) => (
                              <p className="mb-4 text-[15px] leading-7 text-gray-800 last:mb-0">
                                {children}
                              </p>
                            ),

                            /* -----------------------
                               Headings
                            ----------------------- */
                            h1: ({ children }) => (
                              <h1 className="mb-4 mt-6 text-2xl font-bold tracking-tight text-gray-900 first:mt-0">
                                {children}
                              </h1>
                            ),

                            h2: ({ children }) => (
                              <h2 className="mb-3 mt-6 text-xl font-bold tracking-tight text-gray-900 first:mt-0">
                                {children}
                              </h2>
                            ),

                            h3: ({ children }) => (
                              <h3 className="mb-2 mt-5 text-lg font-semibold text-gray-900 first:mt-0">
                                {children}
                              </h3>
                            ),

                            /* -----------------------
                               Bold
                            ----------------------- */
                            strong: ({ children }) => (
                              <strong className="font-semibold text-gray-900">
                                {children}
                              </strong>
                            ),

                            /* -----------------------
                               Italic
                            ----------------------- */
                            em: ({ children }) => (
                              <em className="italic">{children}</em>
                            ),

                            /* -----------------------
                               Unordered List
                            ----------------------- */
                            ul: ({ children }) => (
                              <ul className="mb-4 ml-6 list-disc space-y-1.5 text-[15px] leading-7 text-gray-800">
                                {children}
                              </ul>
                            ),

                            /* -----------------------
                               Ordered List
                            ----------------------- */
                            ol: ({ children }) => (
                              <ol className="mb-4 ml-6 list-decimal space-y-1.5 text-[15px] leading-7 text-gray-800">
                                {children}
                              </ol>
                            ),

                            /* -----------------------
                               List Item
                            ----------------------- */
                            li: ({ children }) => (
                              <li className="pl-1">{children}</li>
                            ),

                            /* -----------------------
                               Inline Code
                            ----------------------- */
                            code: ({ children, className, ...props }) => {
                              const match = /language-(\w+)/.exec(
                                className || "",
                              );

                              return match ? (
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{
                                    margin: 0,
                                    padding: 0,
                                    background: "transparent",
                                  }}
                                  codeTagProps={{
                                    style: {
                                      background: "transparent",
                                    },
                                  }}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code
                                  className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-[13px] text-gray-800"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },

                            /* -----------------------
                               Code Block
                            ----------------------- */
                            pre: ({ children }) => (
                              <pre className="mb-5 mt-4 max-w-full overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 p-4 text-sm leading-6 text-gray-100">
                                {children}
                              </pre>
                            ),

                            /* -----------------------
                               Blockquote
                            ----------------------- */
                            blockquote: ({ children }) => (
                              <blockquote className="mb-4 border-l-4 border-gray-300 pl-4 italic text-gray-600">
                                {children}
                              </blockquote>
                            ),

                            /* -----------------------
                               Horizontal Line
                            ----------------------- */
                            hr: () => <hr className="my-6 border-gray-200" />,

                            /* -----------------------
                               Links
                            ----------------------- */
                            a: ({ children, href }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
                              >
                                {children}
                              </a>
                            ),

                            /* -----------------------
                               Tables
                            ----------------------- */
                            table: ({ children }) => (
                              <div className="mb-5 mt-4 w-full overflow-x-auto">
                                <table className="w-full min-w-[500px] border-collapse text-sm">
                                  {children}
                                </table>
                              </div>
                            ),

                            thead: ({ children }) => (
                              <thead className="bg-gray-100">{children}</thead>
                            ),

                            tbody: ({ children }) => <tbody>{children}</tbody>,

                            tr: ({ children }) => (
                              <tr className="border-b border-gray-200">
                                {children}
                              </tr>
                            ),

                            th: ({ children }) => (
                              <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900">
                                {children}
                              </th>
                            ),

                            td: ({ children }) => (
                              <td className="border border-gray-200 px-3 py-2 text-gray-700">
                                {children}
                              </td>
                            ),
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      ) : null,
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* ======================================
                GENERATING
            ====================================== */}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>Generating</span>

                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================
          FIXED INPUT
      ======================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-4xl px-4 py-3 sm:px-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end rounded-2xl border border-gray-300 bg-white shadow-sm transition focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-100">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    if (input.trim() && !isGenerating) {
                      e.currentTarget.form?.requestSubmit();
                    }
                  }
                }}
                disabled={isGenerating}
                placeholder={
                  isGenerating ? "AI is generating..." : "Message AI..."
                }
               
                className="min-h-[48px] max-h-[200px] flex-1 resize-none overflow-y-auto bg-transparent px-4 py-3 text-sm leading-6 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {/* Stop / Send */}
              {isGenerating ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  className="m-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white transition hover:bg-red-600 active:scale-95"
                  aria-label="Stop generating"
                >
                  <span className="h-3.5 w-3.5 rounded-sm bg-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="m-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white transition hover:bg-gray-800 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                  aria-label="Send message"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </button>
              )}
            </div>

            <p className="mt-1 text-center text-[11px] text-gray-400">
              Press Enter to send • Shift + Enter for a new line
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
