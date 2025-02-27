import React from "react";

// Define Type for Messages
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
    <div className="h-full bg-white flex-1 overflow-y-auto p-4 space-y-4 rounded-md">
      {messages.map(({ role, content }, index) => (
        <div
          key={index}
          className={`flex ${
            role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`p-3 rounded-lg max-w-lg flex items-center space-x-2 ${
              role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            <span>{content}</span>
            {/* Read Aloud Button */}
            <button
              onClick={() => readAloud(content)}
              className="ml-2 px-2 py-1 bg-gray-500 text-white rounded-md text-sm"
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
