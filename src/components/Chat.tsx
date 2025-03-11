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
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map(({ role, content }, index) => (
        <div
          key={index}
          className={`flex ${
            role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`p-4 rounded-2xl max-w-xl flex items-center space-x-3 shadow-md ${
              role === "user"
                ? "bg-[#3C69AB] text-white rounded-br-none" // MedView blue, right-aligned
                : "bg-gray-300 text-gray-800 rounded-bl-none" // Light gray for bot messages
            }`}
          >
            <span className="text-base">{content}</span>

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
