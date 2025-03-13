// App.tsx
import { useState, useEffect } from "react";
import "./index.css";
import Chat from "./components/Chat";
import Control from "./components/Control";

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
  "Other Medical Device"
];

function App() {
  const [messages, setMessages] = useState<Message[]>(fakeMessages);
  const [showModal, setShowModal] = useState(true);
  const [deviceType, setDeviceType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevices, setFilteredDevices] = useState<string[]>([]);

  // Device search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDevices(deviceList);
    } else {
      const results = deviceList.filter(device =>
        device.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDevices(results);
    }
  }, [searchTerm]);

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: deviceType 
          ? `Server response for ${deviceType}: [Mock response] Please try holding the power button for 3 seconds to restart the device.` 
          : "Please select your device first." }
      ]);
    }, 1000);
  };

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
      </div>

      {/* Control Input */}
      <Control 
        handleSendMessage={handleSendMessage}
        onReopenModal={() => setShowModal(true)}
      />

      {/* Device Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Select Medical Device</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Enter device name..."
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />

            <div className="mt-4 overflow-y-auto flex-1">
              {filteredDevices.map((device, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDeviceType(device);
                    setShowModal(false);
                  }}
                  className="w-full p-3 text-left hover:bg-blue-50 rounded-lg transition-colors flex items-center"
                >
                  <span className="flex-1">{device}</span>
                  <span className="text-blue-500 text-sm">Select</span>
                </button>
              ))}
              {filteredDevices.length === 0 && (
                <div className="text-gray-500 p-3 text-center">
                  No matching devices found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const fakeMessages: Message[] = [
  {
    role: "ai",
    content: "Hello, I am your MedView Assistant. Please select your device first.",
  },
];

export default App;