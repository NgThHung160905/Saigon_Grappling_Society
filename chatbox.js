/**
 * Chatbox Component: Giao diện và tương tác cho AI Chatbox Widget
 * Sử dụng hoàn toàn cấu hình từ file .env (không hiển thị cài đặt API key cho người dùng)
 */
import { sendChatMessage, PROVIDERS } from "./ai-service.js";

// Trạng thái hội thoại
let state = {
  isOpen: false,
  provider: import.meta.env?.VITE_DEFAULT_AI_PROVIDER || "gemini",
  isGenerating: false,
  abortController: null,
  messages: []
};

// Markdown formatter đơn giản, an toàn
function formatMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks: ```code```
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Bullet points
  const lines = html.split("\n");
  let inList = false;
  let formatted = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        formatted.push("<ul>");
        inList = true;
      }
      formatted.push(`<li>${trimmed.slice(2)}</li>`);
    } else {
      if (inList) {
        formatted.push("</ul>");
        inList = false;
      }
      if (trimmed) {
        formatted.push(`<p>${line}</p>`);
      }
    }
  }
  if (inList) formatted.push("</ul>");

  return formatted.join("");
}

function getTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function initChatbox() {
  // Tạo HTML Widget và nhúng vào body
  const widgetContainer = document.createElement("div");
  widgetContainer.id = "ai-chatbox-root";
  widgetContainer.innerHTML = `
    <!-- Launcher Button -->
    <button class="chat-launcher" id="chat-launcher" aria-label="Mở trò chuyện AI">
      <span class="chat-pulse" aria-hidden="true"></span>
      <svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
        <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
        <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
      </svg>
      <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <!-- Chatbox Window -->
    <div class="chat-window" id="chat-window" hidden role="dialog" aria-labelledby="chat-window-title">
      <!-- Header -->
      <header class="chat-header">
        <div class="chat-header-brand">
          <div class="chat-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
            </svg>
            <span class="chat-status-dot"></span>
          </div>
          <div class="chat-header-info">
            <h3 class="chat-title" id="chat-window-title">Trợ lý AI</h3>
            <span class="chat-model-badge" id="chat-provider-badge">● Trực tuyến</span>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="chat-btn-icon" id="chat-btn-close" title="Đóng">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      <!-- Messages Body -->
      <div class="chat-messages" id="chat-messages">
        <!-- Welcome Message -->
        <div class="chat-msg msg-assistant">
          <div class="chat-bubble">
            <p>Oss! Chào bạn! Tôi là trợ lý AI của <strong>Saigon Grappling Society</strong>. Tôi có thể giải đáp cho bạn về lịch tập, học phí, các bộ môn BJJ / Striking và đăng ký tập thử.</p>
            <p>Bạn có thể bấm hỏi nhanh:</p>
            <div class="chat-suggestions" id="chat-suggestions">
              <button type="button" class="chat-chip">🗓️ Lịch tập các lớp trong tuần của SGS thế nào?</button>
              <button type="button" class="chat-chip">💰 Bảng giá học phí và các gói tập tại SGS</button>
              <button type="button" class="chat-chip">🥋 Tôi chưa từng tập võ, đăng ký tập thử thế nào?</button>
            </div>
          </div>
          <span class="chat-msg-time">${getTimeString()}</span>
        </div>
      </div>

      <!-- Input Bar -->
      <form class="chat-input-bar" id="chat-form">
        <textarea 
          class="chat-textarea" 
          id="chat-textarea" 
          placeholder="Nhập câu hỏi của bạn..." 
          rows="1"
          required></textarea>
        <button class="chat-send-btn" type="submit" id="chat-send-btn" aria-label="Gửi tin nhắn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(widgetContainer);

  // Tham chiếu các phần tử
  const launcher = document.getElementById("chat-launcher");
  const win = document.getElementById("chat-window");
  const closeBtn = document.getElementById("chat-btn-close");
  const msgList = document.getElementById("chat-messages");
  const form = document.getElementById("chat-form");
  const textarea = document.getElementById("chat-textarea");
  const sendBtn = document.getElementById("chat-send-btn");
  const suggestions = document.getElementById("chat-suggestions");

  // Mở / đóng Chatbox
  function toggleChat(open) {
    state.isOpen = typeof open === "boolean" ? open : !state.isOpen;
    if (state.isOpen) {
      win.removeAttribute("hidden");
      launcher.classList.add("is-active");
      setTimeout(() => textarea.focus(), 200);
      scrollToBottom();
    } else {
      win.setAttribute("hidden", "");
      launcher.classList.remove("is-active");
    }
  }

  launcher.addEventListener("click", () => toggleChat());
  closeBtn.addEventListener("click", () => toggleChat(false));

  // Tự co giãn textarea khi gõ
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 110) + "px";
  });

  textarea.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  function scrollToBottom() {
    msgList.scrollTop = msgList.scrollHeight;
  }

  // Thêm tin nhắn vào UI
  function appendMessage(role, content) {
    const msgEl = document.createElement("div");
    msgEl.className = `chat-msg msg-${role}`;
    
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.innerHTML = role === "assistant" ? formatMarkdown(content) : `<p>${content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;

    const time = document.createElement("span");
    time.className = "chat-msg-time";
    time.textContent = getTimeString();

    msgEl.appendChild(bubble);
    msgEl.appendChild(time);
    msgList.appendChild(msgEl);
    scrollToBottom();
    return bubble;
  }

  // Thêm Typing Indicator
  function showTypingIndicator() {
    const typingEl = document.createElement("div");
    typingEl.className = "chat-msg msg-assistant";
    typingEl.id = "chat-typing-indicator";
    typingEl.innerHTML = `
      <div class="chat-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    msgList.appendChild(typingEl);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById("chat-typing-indicator");
    if (el) el.remove();
  }

  // Xử lý gửi tin nhắn
  async function handleSubmit(promptText) {
    const text = (promptText || textarea.value).trim();
    if (!text || state.isGenerating) return;

    // Reset textarea
    textarea.value = "";
    textarea.style.height = "42px";

    // 1. Hiển thị tin nhắn người dùng
    appendMessage("user", text);
    state.messages.push({ role: "user", content: text });

    // 2. Khởi tạo streaming gọi AI
    state.isGenerating = true;
    sendBtn.disabled = true;
    showTypingIndicator();
    state.abortController = new AbortController();

    let assistantBubble = null;

    try {
      await sendChatMessage({
        provider: state.provider,
        messages: state.messages,
        signal: state.abortController.signal,
        onChunk: (fullText) => {
          removeTypingIndicator();
          if (!assistantBubble) {
            assistantBubble = appendMessage("assistant", fullText);
          } else {
            assistantBubble.innerHTML = formatMarkdown(fullText);
          }
          scrollToBottom();
        }
      });

      if (assistantBubble) {
        state.messages.push({ role: "assistant", content: assistantBubble.innerText });
      }
    } catch (err) {
      removeTypingIndicator();
      if (err.name === "AbortError") {
        appendMessage("assistant", "*(Đã dừng câu trả lời)*");
      } else {
        appendMessage("assistant", "⚠️ Hệ thống AI hiện đang xử lý nhiều lượt yêu cầu hoặc tạm thời gián đoạn. Vui lòng thử lại sau ít giây.");
        console.error("AI Service Error:", err);
      }
    } finally {
      state.isGenerating = false;
      sendBtn.disabled = false;
      textarea.focus();
    }
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    handleSubmit();
  });

  // Gợi ý câu hỏi nhanh
  if (suggestions) {
    suggestions.addEventListener("click", e => {
      const chip = e.target.closest(".chat-chip");
      if (chip) {
        const text = chip.textContent.trim().replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, "");
        handleSubmit(text);
      }
    });
  }

}

// Khởi chạy khi DOM sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChatbox);
} else {
  initChatbox();
}
