import React, { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ControlProps {
  handleSendMessage: (message: string) => void;
}

function Control({ handleSendMessage }: ControlProps) {
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

  return (
    <div className="h-1/6 py-4 px-16 border-t flex items-center">
      <TextareaAutosize
        minRows={1}
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Send
      </button>
      {!recordActive ? (
        <button
          onClick={handleOnRecord}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Record
        </button>
      ) : (
        <button
          onClick={handleStopRecord}
          className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Stop
        </button>
      )}
    </div>
  );
}

export default Control;
