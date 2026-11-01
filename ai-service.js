/**
 * AI Service (Frontend Client)
 * Mọi API Key và System Instruction đã được chuyển xuống Backend (/api/chat).
 * File này chỉ gửi tin nhắn lên Backend Serverless Function và nhận kết quả streaming.
 */

export const PROVIDERS = {
  groq: {
    name: "Groq Cloud",
    description: "Qwen 3.8 27B (Tốc độ siêu nhanh ~400ms)"
  },
  gemini: {
    name: "Google Gemini",
    description: "Gemini 2.5 Flash"
  }
};

/**
 * Gửi tin nhắn đến Backend /api/chat với streaming phản hồi
 */
export async function sendChatMessage({ provider = "groq", messages, onChunk, signal }) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Không có nội dung tin nhắn để gửi.");
  }

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      provider,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    }),
    signal
  });

  if (!response.ok) {
    let errorDetail = "";
    try {
      const errJson = await response.json();
      errorDetail = errJson.error || response.statusText;
    } catch (e) {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail || `Lỗi máy chủ (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (chunk) {
      fullText += chunk;
      if (typeof onChunk === "function") {
        onChunk(fullText, chunk);
      }
    }
  }

  return fullText;
}
