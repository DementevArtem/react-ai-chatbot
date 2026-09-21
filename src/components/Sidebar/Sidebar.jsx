import { THEMES } from "../../utils/theme";
import styles from "./Sidebar.module.css";

export function Sidebar({
  chats,
  activeId,
  isDisabled,
  theme,
  onSelect,
  onNewChat,
  onDelete,
  onThemeChange,
  onClose,
}) {
  return (
    <aside className={styles.Sidebar}>
      <div className={styles.BrandRow}>
        <div className={styles.Brand}>
          <img className={styles.Logo} src="/robot.png" alt="" />
          <h1 className={styles.Title}>AI Chatbot</h1>
        </div>
        <button
          className={styles.CloseButton}
          onClick={onClose}
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
      </div>
      <button
        className={styles.NewChat}
        onClick={onNewChat}
        disabled={isDisabled}
      >
        New chat
      </button>
      <h2 className={styles.Heading}>Chat history</h2>
      <ul className={styles.List}>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={styles.Item}
            data-active={chat.id === activeId}
          >
            <button
              className={styles.ChatButton}
              onClick={() => onSelect(chat.id)}
              disabled={isDisabled}
            >
              {chat.title}
            </button>
            <button
              className={styles.DeleteButton}
              onClick={() => onDelete(chat.id)}
              disabled={isDisabled}
              aria-label="Delete chat"
            >
              <DeleteIcon />
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.Themes}>
        <h2 className={styles.Heading}>Theme</h2>
        <div className={styles.ThemeRow}>
          {THEMES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.ThemeSwatch}
              style={{ background: item.swatch }}
              data-active={item.id === theme}
              aria-label={item.label}
              title={item.label}
              onClick={() => onThemeChange(item.id)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="22px"
      viewBox="0 -960 960 960"
      width="22px"
      fill="currentColor"
    >
      <path d="M256-200 200-256l224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="currentColor"
    >
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  );
}
