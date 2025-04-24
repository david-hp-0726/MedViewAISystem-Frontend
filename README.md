# MedView AI Chatbot — Frontend

This is the React + TypeScript frontend for the **MedView Chatbot**, a web-based assistant that helps users ask medical device questions and get responses via a custom AI backend or a cache of frequently asked questions.

---

## 🌐 Live App

Try it here:  
🔗 [https://med-view-ai-system-frontend.vercel.app](https://med-view-ai-system-frontend.vercel.app)

---

## 🧠 Key Features

- 🔎 **Device-Aware Chat**: User selects their device (e.g., AirSense 11) for personalized answers.
- 🧵 **Text + Voice Input**: Uses Web Speech API for voice-to-text and text-to-speech support.
- ♻️ **Cache Mode**: Toggles between real-time AI and eco-friendly pre-cached responses.
- 📋 **Suggested Questions**: Top 3 FAQs are shown after device selection.
- 🅰️ **Accessibility**: Large font mode, TTS buttons, mobile-friendly design.

---

## 🏁 Getting Started (Local Development)

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Setup Steps

```bash
git clone https://github.com/your-username/MedViewAISystem-Frontend.git
cd MedViewAISystem-Frontend
npm install
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173)

---

## 🔧 Core Files & Components

| File/Component         | Purpose |
|------------------------|---------|
| `App.tsx`              | Main entry point. Manages state (device, messages, font, cache mode, modal). Handles message flow and fetch logic. |
| `Chat.tsx`             | Renders chat messages, including Markdown parsing and speech synthesis playback. |
| `Control.tsx`          | Handles user input box, send button, voice recording, and cache toggle UI. |
| `DeviceSelectionModal.tsx` | Modal that prompts the user to select a device, with search filtering. |

---

## 🛠️ Developer Notes

- **Message Flow**: Messages are stored in `messages[]`, and updates are streamed via `fetchAIResponse()` (OpenRouter) or directly from the backend `/ask` endpoint.
- **Cache Mode**: When toggled, attempts to fetch a semantically-matched FAQ from the backend. If no match is found, it falls back to AI.
- **Environment Variables**:
  - `VITE_RENDER_URL`: Backend base URL (e.g., `https://medviewaisystem-backend.onrender.com`)
  - `VITE_OPENROUTER_API_KEY`: OpenRouter API key (used for AI fallback)

---

## 📁 Folder Structure

```
/src
├── components
│   ├── Chat.tsx
│   ├── Control.tsx
│   └── DeviceSelectionModal.tsx
├── App.tsx
├── index.css
└── utils/
    └── api.ts  ← handles OpenRouter streaming fetch
```

---

## 🧪 Testing & Deployment

- Hosted via **Vercel** — new commits to `main` trigger redeployments.
- Test locally with backend running at `localhost:8000`.
- Run accessibility checks manually for font toggle and TTS buttons.

---

## ✍️ Notes for Future Developers

- Only a small set of devices is currently supported (for prototyping).
- You can add new devices by updating the backend’s MongoDB collection.
- If you need to expand features (e.g., logging, multilingual support), you may want to modularize chat and voice logic further.

---

## 🔗 Related Repositories

- **Backend**: [MedViewAISystem-Backend](https://github.com/your-username/MedViewAISystem-Backend)
- **RAG Tree System** (optional): [https://github.com/AWu497/CS370/tree/base](https://github.com/AWu497/CS370/tree/base)

---
