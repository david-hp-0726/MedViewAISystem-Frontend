import { useState, useEffect } from "react";
import "./index.css";
import Chat from "./components/Chat";
import Control from "./components/Control";
import { fetchAIResponse } from "./utils/api";
import DeviceSelectionModal from "./components/DeviceSelectionModal";

type Message = {
  role: "ai" | "user";
  cached: boolean;
  content: string;
};

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
  const [showBubble] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [largeFont, setLargeFont] = useState(false);
  const [useCache, setUseCache] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchSuggestedQuestions = async () => {
      if (!deviceType || deviceType == "Other Medical Device") {
        setSuggestedQuestions([]);
        return;
      }

      try {
        const isDev = window.location.hostname === "localhost";
        const backendUrl = isDev
          ? "http://localhost:8000/faqs"
          : import.meta.env.VITE_RENDER_URL + "/faqs";

        const res = await fetch(
          `${backendUrl}?device=${encodeURIComponent(deviceType)}`
        );
        const data = await res.json();
        setSuggestedQuestions(data.questions.slice(0, 3)); // Limit to 3 questions
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
        setSuggestedQuestions(getFrequentQuestions(deviceType));
      }
    };

    fetchSuggestedQuestions();
  }, [deviceType]);

  const handleSendMessage = async (message: string) => {
    if (messageLoading) return;
    const isDev = window.location.hostname === "localhost";
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
    const backendUrl = isDev
      ? "http://localhost:8000/ask"
      : import.meta.env.VITE_RENDER_URL + "/ask";
    // const backendUrl = import.meta.env.VITE_RENDER_URL + "/ask";
    setMessageLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", cached: false, content: message },
      { role: "ai", cached: false, content: "" },
    ]);

    let aiResponse = "";

    // Try the FastAPI FAQ cache
    if (useCache) {
      try {
        const cachedRes = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device: deviceType,
            question: message,
          }),
        });

        const cachedData = await cachedRes.json();

        // If similarity is high enough, return cached answer
        if (cachedRes.ok && cachedData.similarity >= 0.7) {
          aiResponse = cachedData.answer;

          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1
                ? { ...msg, content: aiResponse, cached: true }
                : msg
            )
          );

          setMessageLoading(false);
          return; // ✅ stop here, don’t call the AI
        }
      } catch (err) {
        console.warn(
          "Failed to fetch from FAQ cache. Falling back to AI...",
          err
        );
      }
    }

    try {
      // Directly Call OpenRouter AI
      await fetchAIResponse(message, apiKey, deviceType, (chunk) => {
        aiResponse += chunk;
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, content: aiResponse } : msg
          )
        );
      });
    } catch (err) {
      console.error("OpenRouter API failed:", err);
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? { ...msg, content: "Sorry, something went wrong with the AI." }
            : msg
        )
      );
    } finally {
      setMessageLoading(false);
    }
  };

  const getFrequentQuestions = (device: string): string[] => [
    `What are the recommended settings for ${device}?`,
    `How to perform daily maintenance on ${device}?`,
    `How to troubleshoot connectivity issues with ${device}?`,
  ];

  const toggleUseCache = () => {
    setUseCache((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f5f5f5] justify-between">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3C69AB] to-[#2F539B] text-white shadow-md px-4 py-4 sm:px-8 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          {/* Title and Device Info */}
          <div className="flex flex-row justify-between sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-wide drop-shadow-lg">
              MedView Chatbot
            </h1>

            {deviceType && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-1 sm:mt-0 text-sm sm:text-base bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full inline-block w-fit"
              >
                <span className="hidden lg:inline">Current Device: </span>
                {deviceType}
              </button>
            )}
          </div>

          {/* Font Toggle Button */}
          <div className="flex justify-end sm:justify-start">
            <button
              onClick={() => setLargeFont((prev) => !prev)}
              className={`text-sm sm:text-base bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 w-fit ${
                !largeFont ? "font-bold" : "font-normal"
              }`}
            >
              {largeFont ? "Normal Font" : "Large Font"}
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-grow px-4 sm:px-16 mb-4 overflow-auto">
        <Chat messages={messages} largeFont={largeFont} />

        {deviceType && showBubble && (
          <div className="fixed bottom-40 right-4 sm:right-20 z-50 flex flex-col gap-2 animate-fade-in max-w-[90vw]">
            <button
              onClick={() => setShowRecommendations((prev) => !prev)}
              className="text-sm text-gray-500 hover:text-gray-700 underline self-end"
            >
              {showRecommendations
                ? "Hide suggestions ▲"
                : "Show suggestions ▼"}
            </button>

            {showRecommendations && (
              <div className="flex flex-col gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    disabled={messageLoading}
                    onClick={() => {
                      handleSendMessage(question);
                    }}
                    className="bg-white/90 backdrop-blur-sm text-sm px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all \
                      border border-gray-200 hover:border-blue-200 hover:text-blue-600"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Input */}
      <Control
        handleSendMessage={handleSendMessage}
        toggleUseCache={toggleUseCache}
        onReopenModal={() => setShowModal(true)}
        useCache={useCache}
        messageLoading={messageLoading}
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
    cached: false,
    content: "Hello, I am your MedView Assistant. How can I help you?",
  },
];

export default App;
