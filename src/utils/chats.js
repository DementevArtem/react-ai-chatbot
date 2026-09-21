const STORAGE_KEY = "ai-chatbot-chats";

export function createChat() {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    geminiHistory: [],
    updatedAt: Date.now(),
  };
}

export function loadChatState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultState();
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.chats) || parsed.chats.length === 0) {
      return createDefaultState();
    }

    const activeId = parsed.chats.some((chat) => chat.id === parsed.activeId)
      ? parsed.activeId
      : parsed.chats[0].id;

    return { chats: parsed.chats, activeId };
  } catch {
    return createDefaultState();
  }
}

export function saveChatState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function titleFromMessage(content) {
  const title = content.trim().replace(/\s+/g, " ");
  return title.length > 40 ? `${title.slice(0, 40)}…` : title;
}

function createDefaultState() {
  const chat = createChat();
  return { chats: [chat], activeId: chat.id };
}
