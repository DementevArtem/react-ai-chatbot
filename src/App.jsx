import { useState, useRef, useEffect } from 'react';
import { Assistant, generateChatTitle } from './assistants/googleai';
import { Chat } from './components/Chat/Chat';
import { Controls } from './components/Controls/Controls';
import { Sidebar } from './components/Sidebar/Sidebar';
import {
  createChat,
  loadChatState,
  saveChatState,
  titleFromMessage,
} from './utils/chats';
import { getErrorMessage } from './utils/errors';
import { loadTheme, saveTheme } from './utils/theme';
import styles from './App.module.css'

function App() {
  const [chatState, setChatState] = useState(loadChatState);
  const [theme, setTheme] = useState(() => {
    const next = loadTheme();
    document.documentElement.dataset.theme = next;
    return next;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [streamingContent, setStreamingContent] = useState(null);
  const assistantRef = useRef(null);

  const { chats, activeId } = chatState;
  const activeChat = chats.find((chat) => chat.id === activeId) ?? chats[0];
  const orderedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);

  if (!assistantRef.current) {
    assistantRef.current = new Assistant(activeChat?.geminiHistory ?? []);
  }

  useEffect(() => {
    saveChatState(chatState);
  }, [chatState]);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function updateChats(updater) {
    setChatState((prev) => {
      const next = updater(prev);
      return next;
    });
  }

  function handleNewChat() {
    if (isLoading) return;

    const current = chats.find((chat) => chat.id === activeId);
    if (current && current.messages.length === 0) {
      setIsSidebarOpen(false);
      return;
    }

    const chat = createChat();
    updateChats((prev) => ({
      chats: [chat, ...prev.chats],
      activeId: chat.id,
    }));
    assistantRef.current = new Assistant();
    setIsSidebarOpen(false);
  }

  function handleSelectChat(id) {
    if (isLoading || id === activeId) return;

    const chat = chats.find((item) => item.id === id);
    if (!chat) return;

    updateChats((prev) => ({ ...prev, activeId: id }));
    assistantRef.current = new Assistant(chat.geminiHistory);
    setIsSidebarOpen(false);
  }

  function handleDeleteChat(id) {
    if (isLoading) return;

    const remaining = chats.filter((chat) => chat.id !== id);
    const chatsAfterDelete = remaining.length > 0 ? remaining : [createChat()];
    const nextActiveId =
      id === activeId
        ? [...chatsAfterDelete].sort((a, b) => b.updatedAt - a.updatedAt)[0].id
        : activeId;
    const nextActiveChat = chatsAfterDelete.find(
      (chat) => chat.id === nextActiveId
    );

    assistantRef.current = new Assistant(nextActiveChat?.geminiHistory ?? []);
    updateChats(() => ({
      chats: chatsAfterDelete,
      activeId: nextActiveId,
    }));
  }

  function addMessage(message) {
    updateChats((prev) => ({
      ...prev,
      chats: prev.chats.map((chat) => {
        if (chat.id !== prev.activeId) return chat;

        return {
          ...chat,
          messages: [...chat.messages, message],
          updatedAt: Date.now(),
        };
      }),
    }));
  }

  async function handleSend(content) {
    const chatId = activeId;
    const shouldGenerateTitle =
      (chats.find((chat) => chat.id === chatId)?.messages.length ?? 0) === 0;

    addMessage({ content, role: "user" });
    setStreamingContent("");
    setIsLoading(true);

    try {
      const result = await assistantRef.current.chat(content, setStreamingContent);
      updateChats((prev) => ({
        ...prev,
        chats: prev.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { content: result, role: "assistant" },
                ],
                geminiHistory: assistantRef.current.getHistory(),
                updatedAt: Date.now(),
              }
            : chat
        ),
      }));

      if (shouldGenerateTitle && result) {
        void nameChat(chatId, content, result);
      }
    } catch (error) {
      addMessage({
        content: getErrorMessage(error),
        role: "error",
      });
    } finally {
      setStreamingContent(null);
      setIsLoading(false);
    }
  }

  async function nameChat(chatId, userContent, assistantContent) {
    try {
      const title = await generateChatTitle(userContent, assistantContent);
      if (!title) return;

      updateChats((prev) => ({
        ...prev,
        chats: prev.chats.map((chat) =>
          chat.id === chatId && chat.title === "New chat"
            ? { ...chat, title }
            : chat
        ),
      }));
    } catch {
      updateChats((prev) => ({
        ...prev,
        chats: prev.chats.map((chat) =>
          chat.id === chatId && chat.title === "New chat"
            ? { ...chat, title: titleFromMessage(userContent) }
            : chat
        ),
      }));
    }
  }

  return (
    <div className={styles.Layout}>
      <div
        className={styles.SidebarOverlay}
        data-open={isSidebarOpen}
        onClick={() => setIsSidebarOpen(false)}
      />
      <div className={styles.SidebarContainer} data-open={isSidebarOpen}>
        <Sidebar
          chats={orderedChats}
          activeId={activeChat.id}
          isDisabled={isLoading}
          theme={theme}
          onSelect={handleSelectChat}
          onNewChat={handleNewChat}
          onDelete={handleDeleteChat}
          onThemeChange={setTheme}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      <div className={styles.App}>
        <header className={styles.Header}>
          <button
            className={styles.MenuButton}
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
            aria-expanded={isSidebarOpen}
          >
            <MenuIcon />
          </button>
          <p className={styles.HeaderTitle}>{activeChat.title}</p>
        </header>
        <div className={styles.ChatContainer}>
          <Chat
            messages={
              streamingContent === null
                ? activeChat.messages
                : [
                    ...activeChat.messages,
                    { role: "assistant", content: streamingContent },
                  ]
            }
            isStreaming={streamingContent !== null}
          />
        </div>
        <Controls isDisabled={isLoading} onSend={handleSend} />
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
    </svg>
  );
}

export default App;
