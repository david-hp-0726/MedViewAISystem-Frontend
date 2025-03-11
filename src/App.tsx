import { useState } from "react";
import "./index.css"; // Ensure Tailwind styles are loaded
// import robot from "./public/robot.png";
import Chat from "./components/Chat";
import Control from "./components/Control";

type Message = {
  role: "ai" | "user";
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>(fakeMessages);
  const handleSendMessage = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "ai", content: "Server unavailable" },
      ]);
    }, 1000); // 1000ms = 1 second
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8F9FA] justify-between">
      {/* Header with SVG Background */}
      <header className="h-28 flex items-center px-8 shadow-md text-white bg-gradient-to-r from-[#3C69AB] to-[#2F539B] justify-between">
        {/* Logo / Title */}
        <h1 className="text-4xl font-medium tracking-wide drop-shadow-lg">
          MedView Chatbot
        </h1>

        {/* Return Link */}
        <a
          className="text-lg font-light bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300"
          href="https://www.medviewsystems.com/"
        >
          Return
        </a>
      </header>

      {/* Chat Container */}
      <div className="flex-grow px-16 mb-4 overflow-auto max-sm:px-8">
        <Chat messages={messages} />
      </div>

      {/* Control Input */}
      <Control handleSendMessage={handleSendMessage} />
    </div>
  );
}

const fakeMessages: Message[] = [
  {
    role: "ai",
    content: "Hi there, I am your MedView AI Assistant. How can I help you?",
  },
  {
    role: "user",
    content:
      "Could you help find the instructions for AirSense 11 ResMed CPAP. I can't figure out how to use it.",
  },
];

export default App;
