import React, { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ControlProps {
  handleSendMessage: (message: string) => void;
  onReopenModal: () => void;
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
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-4 pt-2 z-50">
      {/* First row: message input only */}
      <div className="flex items-center gap-3">
        <TextareaAutosize
          minRows={1}
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="flex-1 resize-none p-3 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-transparent bg-transparent placeholder:text-gray-500"
        />
      </div>

      {/* Second row: record and device buttons (left), send button (right) */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-3">
          {!recordActive ? (
            <button
              onClick={handleOnRecord}
              className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition border-black border-1 border"
            >
              🎤 Start Recording
            </button>
          ) : (
            <button
              onClick={handleStopRecord}
              className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition border-black border-1 border"
            >
              ⏹ Stop Recording
            </button>
          )}

          <button
            onClick={onReopenModal}
            className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition border-black border-1 border"
          >
            ⚙️ Change Device
          </button>
        </div>

        <button
          onClick={handleSend}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition"
        >
          📤 Send
        </button>
      </div>
    </div>
  );
}

export default Control;
