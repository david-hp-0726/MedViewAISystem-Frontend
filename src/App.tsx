import { useEffect, useRef, useState } from "react";
import "./index.css"; // Ensure Tailwind styles are loaded
import robot from "./public/robot.png";
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
    <div className="flex flex-col h-screen w-full bg-[#E1E0E0] justify-between">
      <header className="h-1/6 text-white flex gap-4 items-center py-2 justify-center">
        <img src={robot} className="h-20" />
        <h2 className="text-xl font-semibold text-black">Medview Chatbot</h2>
      </header>
      <div className="flex-grow px-16 mb-4 overflow-auto max-sm:px-8 ">
        <Chat messages={messages} />
      </div>
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
