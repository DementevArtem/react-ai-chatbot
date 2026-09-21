<div align="center">
  <img src="./public/robot.png" alt="AI Chatbot logo" width="96" />

  # AI Chatbot

  **A fast, responsive AI conversation experience powered by Google Gemini.**

  Ask questions, follow answers as they stream in, and keep every conversation
  neatly organized — all from a clean React interface.

  [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
  [![Gemini](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
</div>

---

## ✨ What makes it useful

- **Live streaming responses** — read the answer while Gemini is generating it.
- **Multiple conversations** — create, switch between, and delete chat threads.
- **Smart chat titles** — Gemini automatically names new conversations.
- **Persistent history** — chats and model context survive page reloads.
- **Markdown support** — assistant responses render headings, lists, code, and links.
- **Five color themes** — choose blue, teal, green, orange, or dark mode.
- **Responsive layout** — comfortable on both desktop and mobile screens.
- **Friendly error states** — API problems are turned into readable messages.

## 📸 Screenshots

<!--
Add your screenshots to docs/screenshots/ and replace the placeholders below:

| Chat | Themes & history |
| --- | --- |
| ![Main chat](./docs/screenshots/chat.png) | ![Themes and history](./docs/screenshots/sidebar.png) |
-->

| Main chat | Themes & chat history |
| :---: | :---: |
| 📷 `docs/screenshots/chat.png` | 📷 `docs/screenshots/sidebar.png` |
| _Add a screenshot of a conversation_ | _Add a screenshot of the sidebar_ |

## 🧰 Tech stack

- [React 19](https://react.dev/) for the user interface
- [Vite 8](https://vite.dev/) for development and production builds
- [Google Gen AI SDK](https://googleapis.github.io/js-genai/) for Gemini responses
- [React Markdown](https://github.com/remarkjs/react-markdown) for rich message rendering
- CSS Modules for component-scoped styles
- Local Storage for chat history and theme preferences
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) for static analysis

## 🚀 Getting started

### Prerequisites

- Node.js 20.19+ or 22.12+
- A [Google AI Studio API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
git clone https://github.com/DementevArtem/react-ai-chatbot.git
cd react-ai-chatbot
npm install
```

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in your terminal.

> [!IMPORTANT]
> Variables prefixed with `VITE_` are included in the browser bundle. Restrict
> your Gemini key in Google Cloud and never commit the `.env` file. For a public
> production deployment, route AI requests through a protected backend instead.

## 📜 Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the project with Oxlint |

## 🗂️ Project structure

```text
src/
├── assistants/       # Gemini integration and streaming
├── components/
│   ├── Chat/         # Messages and Markdown rendering
│   ├── Controls/     # Message composer
│   └── Sidebar/      # History, navigation, and themes
├── utils/            # Chat storage, errors, and theme helpers
├── App.jsx            # Application state and orchestration
└── main.jsx           # React entry point
```

## 🔒 Data and privacy

Conversation history is stored locally in the browser using Local Storage.
Messages are sent to the Google Gemini API only when you submit them. Clearing
site data removes the locally saved chats and theme preference.

---

<div align="center">
  Built with React, curiosity, and a little help from Gemini 🤖
</div>
