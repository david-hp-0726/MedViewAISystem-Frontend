import React, { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ControlProps {
  handleSendMessage: (message: string) => void;
  toggleUseCache: () => void;
  onReopenModal: () => void;
  useCache: boolean;
  messageLoading: boolean;
}

function Control({
  handleSendMessage,
  toggleUseCache,
  onReopenModal,
  useCache,
  messageLoading,
}: ControlProps) {
  const [message, setMessage] = useState("");
  const [recordActive, setRecordActive] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [showCacheTooltip, setShowCacheTooltip] = useState(false);

  const handleSend = () => {
    if (message.trim() === "") return;
    setMessage("");
    handleSendMessage(message);
  };

  function handleOnRecord() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setMessage((prev) => prev + " " + transcript);
    };

    recognitionRef.current.onstart = () => {
      setRecordActive(true);
    };

    recognitionRef.current.start();
  }

  function handleStopRecord() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecordActive(false);
    }
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[90%] max-w-4xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-3 z-50">
      {/* Message input */}
      <div className="flex items-center gap-3">
        <TextareaAutosize
          minRows={1}
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="flex-1 resize-none p-2 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-transparent bg-transparent placeholder:text-gray-500 text-sm sm:text-base"
        />
        <button
          onClick={handleSend}
          disabled={messageLoading}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition text-sm sm:text-base"
        >
          Send
        </button>
      </div>

      {/* Buttons row */}
      <div className="flex justify-start items-center mt-3 gap-2 flex-wrap">
        <button
          onClick={recordActive ? handleStopRecord : handleOnRecord}
          className="flex-1 sm:flex-none px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition border border-black text-sm sm:text-base"
        >
          {recordActive ? "⏹ Stop Recording" : "Start Recording"}
        </button>
        <button
          onClick={onReopenModal}
          className="flex-1 sm:flex-none px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition border border-black text-sm sm:text-base"
        >
          Change Device
        </button>
        <button
          onClick={toggleUseCache}
<<<<<<< HEAD
          className={`flex-1 sm:flex-none px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition border border-black text-sm sm:text-base ${
=======
          onMouseEnter={() => setShowCacheTooltip(true)}
          onMouseLeave={() => setShowCacheTooltip(false)}
          className={`h-full flex-1 sm:flex-none px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition border border-black text-sm sm:text-base relative ${
>>>>>>> 66712fed13eaf7a0743abe374e111434f10353a1
            useCache && "border-blue-500 text-blue-500 break-words"
          }`}
        >
          Cache Mode
          {showCacheTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg w-64 shadow-xl z-50">
              <div className="whitespace-normal">
                <span className="font-semibold text-green-400">
                  Eco-Friendly Mode:{" "}
                </span>
                Uses pre-saved answers to reduce AI computations and energy
                consumption. This lowers carbon footprint while maintaining
                faster responses. Answers may be less specific than AI-generated
                ones.
              </div>
              {/* 小三角指针 */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default Control;
