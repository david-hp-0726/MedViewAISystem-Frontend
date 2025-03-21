import React, { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ControlProps {
  handleSendMessage: (message: string) => void;
  onReopenModal: () => void; // 添加一个新的 prop 来处理重新打开弹窗
}

function Control({ handleSendMessage, onReopenModal }: ControlProps) {
  const [message, setMessage] = useState("");
  const [recordActive, setRecordActive] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
  const handleKeyDown = (event:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="h-20 px-6 border-t flex items-center bg-gray-100 shadow-md">
      {/* Chat Input Field */}
      <TextareaAutosize
        minRows={1}
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C69AB] resize-none"
        placeholder="Type a message..."
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="ml-3 px-5 py-2 bg-[#3C69AB] text-white font-medium rounded-xl hover:bg-[#2F539B] transition-all"
      >
        Send
      </button>

      {/* Record / Stop Button */}
      {!recordActive ? (
        <button
          onClick={handleOnRecord}
          className="ml-3 px-5 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all"
        >
          🎤 Record
        </button>
      ) : (
        <button
          onClick={handleStopRecord}
          className="ml-3 px-5 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all"
        >
          ⏹ Stop
        </button>
      )}

      {/* Reopen Modal Button */}
      <button
        onClick={onReopenModal}
        className="ml-3 px-5 py-2 bg-yellow-600 text-white font-medium rounded-xl hover:bg-yellow-700 transition-all"
      >
        Change Device
      </button>
    </div>
  );
}

export default Control;