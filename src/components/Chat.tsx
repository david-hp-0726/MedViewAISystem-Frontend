import ReactMarkdown from "react-markdown";

type Message = {
  role: "ai" | "user";
  content: string;
};

interface ChatProps {
  messages: Message[];
}

function Chat({ messages }: ChatProps) {
  // Function to read a message aloud
  const readAloud = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // Set language (adjust if needed)
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported in this browser.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map(({ role, content }, index) => (
        <div
          key={index}
          className={`flex ${
            role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            style={{
              wordBreak: "break-word", // Ensures text wraps
              overflowWrap: "break-word",
              maxWidth: "75%", // Prevents markdown from expanding too wide
              padding: "12px",
              borderRadius: "12px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              backgroundColor: role === "user" ? "#3C69AB" : "#E0E0E0",
              color: role === "user" ? "#ffffff" : "#333",
            }}
          >
            {/* Render Markdown Content */}
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
                    style={{ color: "#007bff", textDecoration: "underline" }}
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
                      backgroundColor: "#f4f4f4",
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
                      overflowX: "auto", // Enables horizontal scrolling for long code blocks
                      maxWidth: "100%",
                    }}
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>

            {/* Read Aloud Button */}
            <button
              onClick={() => readAloud(content)}
              className={`ml-2 px-3 py-1 text-gray-700 rounded-md text-sm hover:bg-gray-400 transition ${
                role === "user" ? "bg-gray-300" : "bg-gray-500"
              }`}
            >
              🔊
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Chat;
