# MedView AI Chatbot — Frontend

The **MedView Chatbot** is a web-based assistant designed to help users get fast, device-specific answers to questions about their medical devices. This repository contains the React + TypeScript source code for the frontend.

## 🌐 Live Demo

Access the deployed web app here:  
🔗 [https://med-view-ai-system-frontend.vercel.app/](https://med-view-ai-system-frontend.vercel.app/)

## 📦 Features

- **Device-specific Answers**: Users select their medical device to receive personalized responses.
- **Text & Voice Interaction**: Supports both typing and voice input via Web Speech API.
- **Accessibility**: Large font toggle and text-to-speech for improved usability.
- **Cache Mode**: Eco-friendly feature that retrieves pre-saved answers for common questions.
- **Suggested Questions**: Displays 3 recommended FAQs when a device is selected.

## 🧭 Interface Overview

- **Header**: App title, current device, and font size toggle.
- **Chat Area**: Displays user questions and AI answers, including cached response tags.
- **Control Bar**: Input field, send button, voice recording, device selector, and cache mode toggle.

## 🛠️ Local Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Commands
```bash
git clone https://github.com/your-username/MedViewAISystem-Frontend.git
cd MedViewAISystem-Frontend
npm install
npm run dev
