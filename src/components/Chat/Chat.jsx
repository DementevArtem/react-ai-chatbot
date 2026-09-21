import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import styles from "./Chat.module.css";

export function Chat({ messages, isStreaming = false }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: isStreaming ? "auto" : "smooth",
    });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className={styles.Chat}>
        <p className={styles.Empty}>Send a message to start the chat.</p>
      </div>
    );
  }

  return (
    <div className={styles.Chat}>
      {messages.map(({ role, content }, index) => {
        const isLast = index === messages.length - 1;
        const isStreamingMessage =
          isStreaming && isLast && role === "assistant";
        const showThinking = isStreamingMessage && content.length === 0;

        return (
          <div
            className={styles.Message}
            key={index}
            data-role={role}
            data-streaming={isStreamingMessage || undefined}
          >
            {showThinking ? (
              <ThinkingIndicator />
            ) : role === "error" ? (
              <span className={styles.BubbleText}>{content}</span>
            ) : role === "assistant" ? (
              <div className={styles.AssistantBody}>
                <div className={styles.Markdown}>
                  <Markdown>{content}</Markdown>
                </div>
                {isStreamingMessage && <span className={styles.Cursor} />}
              </div>
            ) : (
              <span className={styles.BubbleText}>{content}</span>
            )}
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className={styles.Thinking}>
      <span className={styles.Spinner} aria-hidden="true" />
      <span>Thinking</span>
      <span className={styles.Dots} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}
