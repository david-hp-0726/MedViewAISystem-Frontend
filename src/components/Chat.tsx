import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "ai" | "user";
  content: string;
  cached: boolean;
};

interface ChatProps {
  messages: Message[];
  largeFont?: boolean;
}

function Chat({ messages, largeFont }: ChatProps) {
  const [currentlySpeakingIndex, setCurrentlySpeakingIndex] = useState<
    number | null
  >(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const readAloud = (text: string, index: number) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    // If the same message is already playing, stop it
    if (currentlySpeakingIndex === index) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingIndex(null);
      return;
    }

    // Stop any currently playing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onend = () => {
      setCurrentlySpeakingIndex(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setCurrentlySpeakingIndex(index);
  };

  return (
    <div className="overflow-y-auto p-6 pb-44 space-y-4">
      {messages.map(({ role, content, cached }, index) => (
        <div
          key={index}
          className={`flex ${
            role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              maxWidth: "75%",
              padding: `${cached ? "20px" : "12px"} 12px 12px 12px`,
              borderRadius: "12px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              backgroundColor: role === "user" ? "#57AE5B" : "#ffffff",
              color: role === "user" ? "#ffffff" : "#333",
              fontSize: largeFont ? "1.25rem" : "1rem",
              position: "relative",
            }}
          >
            {cached && (
              <span className="absolute top-1 left-2 text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full">
                Cached
              </span>
            )}

            {content === "" ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ ...props }) => (
                    <p style={{ marginBottom: "8px" }} {...props} />
                  ),
                  strong: ({ ...props }) => (
                    <strong style={{ fontWeight: "bold" }} {...props} />
                  ),
                  a: ({ href, ...props }) => (
                    <a
                      href={href}
                      style={{
                        color: "#007bff",
                        textDecoration: "underline",
                      }}
                      {...props}
                    />
                  ),
                  ul: ({ ...props }) => (
                    <ul
                      style={{ paddingLeft: "20px", marginBottom: "8px" }}
                      {...props}
                    />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      style={{ paddingLeft: "20px", marginBottom: "8px" }}
                      {...props}
                    />
                  ),
                  code: ({ ...props }) => (
                    <code
                      style={{
                        backgroundColor: "#a1a1a1",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        fontFamily: "monospace",
                        fontSize: "0.9em",
                      }}
                      {...props}
                    />
                  ),
                  pre: ({ ...props }) => (
                    <pre
                      style={{
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "8px",
                        overflowX: "auto",
                        maxWidth: "100%",
                      }}
                      {...props}
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            )}

            {/* Toggle Play / Stop Button */}
            <button
              onClick={() => readAloud(content, index)}
              className={`ml-2 px-3 py-1 text-gray-700 rounded-md text-sm hover:bg-gray-400 transition ${
                role === "user" ? "bg-gray-300" : "bg-gray-500"
              }`}
            >
              {currentlySpeakingIndex === index ? "⏹️" : "🔊"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Chat;
