# -*- coding: utf-8 -*-
with open("chatbox.js", "r", encoding="utf-8") as f:
    code = f.read()

old_block = '''  // Bộ lọc phát hiện ngôn từ tục tĩu / xúc phạm
  const PROFANITY_PATTERN = /\\b(đm|dm|dkm|đkm|vcl|vcc|vl|cl|cc|lồn|lon|buồi|buoi|cặc|cac|địt|dit|đụ|du má|đụ má|mẹ mày|me may|bitch|fuck|fucking|shit|asshole|bastard|dick|đéo|deo|mẹ kiếp|cút|đồ chó|đồ khốn)\\b|đ[iị]t|d[iị]t|l[ồo]n|c[ặa]c|bu[ồo]i|ch[óo] má|đ[ụu] m[áa]|đ[ụu] m[ẹe]|v[ãa]i c[ứu]|v[ãa]i l[ồo]n/i;

  let strikeCount = parseInt(sessionStorage.getItem("sgs_chat_strikes") || "0", 10);
  let isBanned = sessionStorage.getItem("sgs_chat_banned") === "true";

  function applyBan() {
    isBanned = true;
    sessionStorage.setItem("sgs_chat_banned", "true");
    if (textarea) {
      textarea.disabled = true;
      textarea.value = "";
      textarea.placeholder = "Bạn đã bị cấm chat do tiếp tục sử dụng ngôn từ không phù hợp.";
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
  }'''

new_block = '''  // Bộ lọc phát hiện ngôn từ tục tĩu / xúc phạm (Song ngữ Việt - Anh)
  const PROFANITY_PATTERN = /\\b(đm|dm|dkm|đkm|vcl|vcc|vl|cl|cc|lồn|lon|buồi|buoi|cặc|cac|địt|dit|đụ|du má|đụ má|mẹ mày|me may|bitch|fuck|fucking|shit|asshole|bastard|dick|cunt|pussy|stfu|fck|đéo|deo|mẹ kiếp|cút|đồ chó|đồ khốn)\\b|đ[iị]t|d[iị]t|l[ồo]n|c[ặa]c|bu[ồo]i|ch[óo] má|đ[ụu] m[áa]|đ[ụu] m[ẹe]|v[ãa]i c[ứu]|v[ãa]i l[ồo]n/i;
  const ENGLISH_PROFANITY_PATTERN = /\\b(bitch|fuck|fucking|shit|asshole|bastard|dick|cunt|pussy|stfu|fck|damn|hell)\\b/i;

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
  }'''

if old_block.replace('\n', '\r\n') in code:
    code = code.replace(old_block.replace('\n', '\r\n'), new_block.replace('\n', '\r\n'))
    print("Replaced definitions (CRLF)")
elif old_block in code:
    code = code.replace(old_block, new_block)
    print("Replaced definitions (LF)")
else:
    print("Definitions block not found in chatbox.js")

old_handler = '''    // 2. Kiểm tra ngôn từ tục tĩu / xúc phạm
    const isProfane = PROFANITY_PATTERN.test(text);
    if (isProfane) {
      if (strikeCount === 0) {
        // Vi phạm lần 1: Gửi thông điệp giải tỏa cùng các coach
        strikeCount = 1;
        sessionStorage.setItem("sgs_chat_strikes", "1");
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          const warningMsg = "Tôi biết bạn đang rất khó chịu trong người, có thể là do áp lực công việc, học tập hoặc cuộc sống. Vì vậy hãy đến với SGS để được đấm nhau với các coach với mục đích giải tỏa bạn nhé :)))";
          appendMessage("assistant", warningMsg);
          state.messages.push({ role: "assistant", content: warningMsg });
        }, 500);
        return;
      } else if (strikeCount === 1) {
        // Vi phạm lần 2: Đưa ra lời cảnh báo cấm chat
        strikeCount = 2;
        sessionStorage.setItem("sgs_chat_strikes", "2");
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          const warningMsg2 = "Nếu bạn nhắn bậy nữa, tôi sẽ cấm chat bạn á :v";
          appendMessage("assistant", warningMsg2);
          state.messages.push({ role: "assistant", content: warningMsg2 });
        }, 500);
        return;
      } else {
        // Vi phạm lần 3 trở đi: Cấm chat ngay lập tức!
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          const banMsg = "Bạn đã bị cấm chat do tiếp tục sử dụng ngôn từ không phù hợp.";
          appendMessage("assistant", banMsg);
          state.messages.push({ role: "assistant", content: banMsg });
          applyBan();
        }, 400);
        return;
      }
    }'''

new_handler = '''    // 2. Kiểm tra ngôn từ tục tĩu / xúc phạm (Song ngữ Việt - Anh)
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
    }'''

if old_handler.replace('\n', '\r\n') in code:
    code = code.replace(old_handler.replace('\n', '\r\n'), new_handler.replace('\n', '\r\n'))
    print("Replaced handler (CRLF)")
elif old_handler in code:
    code = code.replace(old_handler, new_handler)
    print("Replaced handler (LF)")
else:
    print("Handler block not found in chatbox.js")

with open("chatbox.js", "w", encoding="utf-8") as f:
    f.write(code)
print("Updated chatbox.js successfully.")

