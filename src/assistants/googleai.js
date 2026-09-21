import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3.6-flash";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export class Assistant {
  #history;

  constructor(history = []) {
    this.#history = [...history];
  }

  getHistory() {
    return [...this.#history];
  }

  async chat(content, onChunk) {
    this.#history.push({
      role: "user",
      parts: [{ text: content }],
    });

    try {
      const stream = await ai.models.generateContentStream({
        model: MODEL,
        contents: this.#history,
      });

      let text = "";

      for await (const chunk of stream) {
        const piece = chunk.text;
        if (!piece) continue;
        text += piece;
        onChunk?.(text);
      }

      this.#history.push({
        role: "model",
        parts: [{ text }],
      });

      return text;
    } catch (error) {
      this.#history.pop();
      throw error;
    }
  }
}

export async function generateChatTitle(userContent, assistantContent) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `You name chat threads the way ChatGPT does.

Write one short title (3-6 words) for this conversation.
Rules:
- Do not copy or paraphrase the user's question
- Hint at the topic like a label, e.g. "Junior developer roadmap" or "Кар'єра в IT"
- Use the same language as the user
- No quotes, no markdown, no trailing punctuation
- Return only the title

User message:
${userContent}

Assistant reply:
${assistantContent.slice(0, 600)}`,
  });

  return sanitizeTitle(response.text);
}

function sanitizeTitle(text) {
  const title = String(text ?? "")
    .replace(/[*_`#>"]/g, "")
    .replace(/^['"]+|['"]+$/g, "")
    .split("\n")[0]
    .trim()
    .replace(/[.!?…]+$/g, "")
    .replace(/\s+/g, " ");

  if (!title) return "";
  return title.length > 42 ? `${title.slice(0, 42).trim()}…` : title;
}
