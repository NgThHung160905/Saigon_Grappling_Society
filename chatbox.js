/**
 * Chatbox Component: Giao diện và tương tác cho AI Chatbox Widget
 * Sử dụng hoàn toàn cấu hình từ file .env (không hiển thị cài đặt API key cho người dùng)
 */
import { sendChatMessage, PROVIDERS } from "./ai-service.js";

// Tự động nhận URL Google Sheet từ biến môi trường .env (nếu có)
if (typeof window !== "undefined" && window.CONFIG && !window.CONFIG.endpoint) {
  if (import.meta.env?.VITE_GOOGLE_SHEET_ENDPOINT) {
    window.CONFIG.endpoint = import.meta.env.VITE_GOOGLE_SHEET_ENDPOINT;
  }
}

// Trạng thái hội thoại
let state = {
  isOpen: false,
  provider: import.meta.env?.VITE_DEFAULT_AI_PROVIDER || "groq",
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

  // Links: [text](url) and raw URLs
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--chat-primary);text-decoration:underline;font-weight:600">$1</a>');
  html = html.replace(/(^|[\s(])(https?:\/\/[^\s)<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--chat-primary);text-decoration:underline;font-weight:600">$2</a>');

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

  // Bộ lọc phát hiện ngôn từ tục tĩu / xúc phạm (Song ngữ Việt - Anh)
  const PROFANITY_PATTERN = /\b(đm|dm|dkm|đkm|vcl|vcc|vl|cl|cc|lồn|lon|buồi|buoi|cặc|cac|địt|dit|đụ|du má|đụ má|mẹ mày|me may|bitch|fuck|fucking|shit|asshole|bastard|dick|cunt|pussy|stfu|fck|đéo|deo|mẹ kiếp|cút|đồ chó|đồ khốn)\b|đ[iị]t|d[iị]t|l[ồo]n|c[ặa]c|bu[ồo]i|ch[óo] má|đ[ụu] m[áa]|đ[ụu] m[ẹe]|v[ãa]i c[ứu]|v[ãa]i l[ồo]n/i;
  const ENGLISH_PROFANITY_PATTERN = /\b(bitch|fuck|fucking|shit|asshole|bastard|dick|cunt|pussy|stfu|fck|damn|hell)\b/i;

  const PROFANITY_RESPONSES = {
    vi: {
      strike1: "Tôi biết bạn đang rất khó chịu trong người, có thể là do áp lực công việc, học tập hoặc cuộc sống. Vì vậy hãy đến với SGS để được đấm nhau với các coach với mục đích giải tỏa bạn nhé :)))",
      strike2: "Nếu bạn nhắn bậy nữa, tôi sẽ cấm chat bạn á :v",
      ban: "Bạn đã bị cấm chat do tiếp tục sử dụng ngôn từ không phù hợp.",
      placeholderBan: "Bạn đã bị cấm chat do tiếp tục sử dụng ngôn từ không phù hợp."
    },
    en: {
      strike1: "I know you're feeling frustrated right now—perhaps due to work, studies, or daily life stress. Why not drop by SGS and spar with our coaches to blow off some steam? :)))",
      strike2: "If you keep swearing, I'm going to ban you from this chat :v",
      ban: "You have been banned from chatting due to continued inappropriate language.",
      placeholderBan: "You have been banned from chatting due to continued inappropriate language."
    }
  };

  function detectSwearLang(text) {
    const isEnProfane = ENGLISH_PROFANITY_PATTERN.test(text);
    const hasVnAccents = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
    const isEnSite = (localStorage.getItem("sgs_lang") === "en" || document.documentElement.lang === "en");
    if (isEnProfane && !hasVnAccents) return "en";
    if (isEnSite && !hasVnAccents) return "en";
    return "vi";
  }

  let strikeCount = parseInt(sessionStorage.getItem("sgs_chat_strikes") || "0", 10);
  let isBanned = sessionStorage.getItem("sgs_chat_banned") === "true";

  function applyBan(lang) {
    isBanned = true;
    sessionStorage.setItem("sgs_chat_banned", "true");
    const l = lang || (localStorage.getItem("sgs_lang") === "en" ? "en" : "vi");
    const t = PROFANITY_RESPONSES[l] || PROFANITY_RESPONSES.vi;
    if (textarea) {
      textarea.disabled = true;
      textarea.value = "";
      textarea.placeholder = t.placeholderBan;
      textarea.style.opacity = "0.6";
      textarea.style.cursor = "not-allowed";
    }
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.style.opacity = "0.4";
      sendBtn.style.cursor = "not-allowed";
    }
    if (suggestions) suggestions.style.display = "none";
  }

  if (isBanned) {
    applyBan();
  }

  const CHAT_I18N = {
    vi: {
      launcher: "Mở trò chuyện AI",
      title: "Trợ lý AI",
      online: "● Trực tuyến",
      close: "Đóng",
      welcome: "Oss! Chào bạn! Tôi là trợ lý AI của <strong>Saigon Grappling Society</strong>. Tôi có thể giải đáp cho bạn về lịch tập, học phí, các bộ môn BJJ / Striking và đăng ký tập thử.",
      quickPrompt: "Bạn có thể bấm hỏi nhanh:",
      chips: [
        "🗓️ Lịch tập các lớp trong tuần của SGS thế nào?",
        "💰 Bảng giá học phí và các gói tập tại SGS",
        "🥋 Tôi chưa từng tập võ, đăng ký tập thử thế nào?"
      ],
      placeholder: "Nhập câu hỏi của bạn...",
      send: "Gửi tin nhắn"
    },
    en: {
      launcher: "Open AI Chat",
      title: "AI Assistant",
      online: "● Online",
      close: "Close",
      welcome: "Oss! Hello! I am the AI assistant of <strong>Saigon Grappling Society</strong>. I can assist you with our training schedule, membership pricing, BJJ / Striking programs, and trial registration.",
      quickPrompt: "Quick questions:",
      chips: [
        "🗓️ What is SGS's weekly training schedule?",
        "💰 Membership plans & pricing at SGS",
        "🥋 I'm a beginner, how do I register for a trial class?"
      ],
      placeholder: "Ask a question...",
      send: "Send message"
    }
  };

  function updateChatLanguage(lang) {
    const t = CHAT_I18N[lang] || CHAT_I18N.vi;
    if (launcher) launcher.setAttribute("aria-label", t.launcher);
    const titleEl = document.getElementById("chat-window-title");
    if (titleEl) titleEl.textContent = t.title;
    const badgeEl = document.getElementById("chat-provider-badge");
    if (badgeEl) badgeEl.textContent = t.online;
    if (closeBtn) closeBtn.title = t.close;
    if (textarea) textarea.placeholder = t.placeholder;
    if (sendBtn) sendBtn.setAttribute("aria-label", t.send);

    // If user hasn't started a conversation yet, update initial greeting
    if (state.messages.length === 0 && msgList) {
      const firstMsg = msgList.querySelector(".chat-msg.msg-assistant");
      if (firstMsg) {
        const bubble = firstMsg.querySelector(".chat-bubble");
        if (bubble) {
          bubble.innerHTML = `
            <p>${t.welcome}</p>
            <p>${t.quickPrompt}</p>
            <div class="chat-suggestions" id="chat-suggestions">
              ${t.chips.map(c => `<button type="button" class="chat-chip">${c}</button>`).join("")}
            </div>
          `;
          const newSug = bubble.querySelector("#chat-suggestions");
          if (newSug) {
            newSug.addEventListener("click", e => {
              const chip = e.target.closest(".chat-chip");
              if (chip) {
                const text = chip.textContent.trim().replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, "");
                handleSubmit(text);
              }
            });
          }
        }
      }
    }
  }

  // Set initial language from storage or html
  const initialLang = localStorage.getItem("sgs_lang") || document.documentElement.lang || "vi";
  updateChatLanguage(initialLang);

  // Listen to language switch event from main site
  window.addEventListener("sgs_language_change", e => {
    if (e.detail && e.detail.lang) {
      updateChatLanguage(e.detail.lang);
    }
  });

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
    if (isBanned) return;
    const text = (promptText || textarea.value).trim();
    if (!text || state.isGenerating) return;

    // Reset textarea
    textarea.value = "";
    textarea.style.height = "42px";

    // 1. Hiển thị tin nhắn người dùng
    appendMessage("user", text);
    state.messages.push({ role: "user", content: text });

    // 2. Kiểm tra ngôn từ tục tĩu / xúc phạm (Song ngữ Việt - Anh)
    const isProfane = PROFANITY_PATTERN.test(text);
    if (isProfane) {
      const lang = detectSwearLang(text);
      const resp = PROFANITY_RESPONSES[lang] || PROFANITY_RESPONSES.vi;

      if (strikeCount === 0) {
        // Vi phạm lần 1: Gửi thông điệp giải tỏa cùng các coach
        strikeCount = 1;
        sessionStorage.setItem("sgs_chat_strikes", "1");
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          appendMessage("assistant", resp.strike1);
          state.messages.push({ role: "assistant", content: resp.strike1 });
        }, 500);
        return;
      } else if (strikeCount === 1) {
        // Vi phạm lần 2: Đưa ra lời cảnh báo cấm chat
        strikeCount = 2;
        sessionStorage.setItem("sgs_chat_strikes", "2");
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          appendMessage("assistant", resp.strike2);
          state.messages.push({ role: "assistant", content: resp.strike2 });
        }, 500);
        return;
      } else {
        // Vi phạm lần 3 trở đi: Cấm chat ngay lập tức!
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          appendMessage("assistant", resp.ban);
          state.messages.push({ role: "assistant", content: resp.ban });
          applyBan(lang);
        }, 400);
        return;
      }
    }

    // 3. Khởi tạo streaming gọi AI
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
          let displayText = fullText;
          if (displayText.includes("[BAN_CHAT]")) {
            displayText = displayText.replace("[BAN_CHAT]", "").trim();
            applyBan();
          }
          if (!assistantBubble) {
            assistantBubble = appendMessage("assistant", displayText);
          } else {
            assistantBubble.innerHTML = formatMarkdown(displayText);
          }
          scrollToBottom();
        }
      });

      if (assistantBubble) {
        const fullAnswer = assistantBubble.innerText;
        if (fullAnswer.includes("Tôi biết bạn đang rất khó chịu trong người")) {
          strikeCount = Math.max(strikeCount, 1);
          sessionStorage.setItem("sgs_chat_strikes", String(strikeCount));
        }
        state.messages.push({ role: "assistant", content: fullAnswer });
      }
    } catch (err) {
      removeTypingIndicator();
      if (err.name === "AbortError") {
        appendMessage("assistant", "*(Đã dừng câu trả lời)*");
      } else {
        const errorText = err && err.message ? err.message : "Hệ thống AI hiện đang xử lý nhiều lượt yêu cầu. Vui lòng thử lại sau ít giây.";
        appendMessage("assistant", `⚠️ ${errorText}`);
        console.error("AI Service Error:", err);
      }
    } finally {
      state.isGenerating = false;
      if (!isBanned) {
        sendBtn.disabled = false;
        textarea.focus();
      }
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
