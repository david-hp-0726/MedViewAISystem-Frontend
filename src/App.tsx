// App.tsx
import { useState, useEffect } from "react";
import "./index.css";
import Chat from "./components/Chat";
import Control from "./components/Control";
import { fetchAIResponse } from "./utils/api";
import DeviceSelectionModal from "./components/DeviceSelectionModal";

type Message = {
  role: "ai" | "user";
  content: string;
};

// Full device list (example)
const deviceList = [
  "AirSense 11",
  "AirSense 10",
  "AirCurve 10",
  "DreamStation 2",
  "ResMed Lumis",
  "Philips Respironics",
  "DeVilbiss IntelliPAP",
  "Fisher & Paykel SleepStyle",
  "Lowenstein Prisma",
  "Other Medical Device",
];

function App() {
  const [messages, setMessages] = useState<Message[]>(fakeMessages);
  const [showModal, setShowModal] = useState(true);
  const [deviceType, setDeviceType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevices, setFilteredDevices] = useState<string[]>([]);
  const [showBubble, setShowBubble] = useState(true);

  // Device search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDevices(deviceList);
    } else {
      const results = deviceList.filter((device) =>
        device.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDevices(results);
    }
  }, [searchTerm]);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    let aiResponse = "";
    setMessages((prev) => [...prev, { role: "ai", content: "" }]); // Add empty AI message

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";

    await fetchAIResponse(message, apiKey, deviceType, (chunk) => {
      aiResponse += chunk;
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 ? { ...msg, content: aiResponse } : msg
        )
      );
    });
  };
  const getFrequentQuestions = (device: string): string[] => [
    `What are the recommended settings for ${device}?`,
    `How to perform daily maintenance on ${device}?`,
    `How to troubleshoot connectivity issues with ${device}?`,
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8F9FA] justify-between">
      {/* Header */}
      <header className="h-28 flex items-center px-8 shadow-md text-white bg-gradient-to-r from-[#3C69AB] to-[#2F539B] justify-between">
        <div className="flex items-center">
          <h1 className="text-4xl font-medium tracking-wide drop-shadow-lg">
            MedView Chatbot
          </h1>
          {deviceType && (
            <span className="ml-4 text-lg bg-white/20 px-3 py-1 rounded-full">
              Current Device: {deviceType}
            </span>
          )}
        </div>
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
        {deviceType && showBubble && (
          <div className="fixed left-8 bottom-28 z-50 flex flex-col gap-2 animate-fade-in">
            {getFrequentQuestions(deviceType).map((question, index) => (
              <button
                key={index}
                onClick={() => {handleSendMessage(question); setShowBubble(false);}}
                className="bg-white/90 backdrop-blur-sm text-sm px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all 
                   border border-gray-200 hover:border-blue-200 hover:text-blue-600"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Control Input */}
      <Control
        handleSendMessage={handleSendMessage}
        onReopenModal={() => setShowModal(true)}
      />

      {/* Device Selection Modal */}
      {showModal && (
        <DeviceSelectionModal
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredDevices={filteredDevices}
          onSelectDevice={(device) => setDeviceType(device)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

const fakeMessages: Message[] = [
  {
    role: "ai",
    content: "Hi, I am your MedView Assistant. How can I help you.",
  },
];

export default App;
