/**
 * AI Service: Quản lý kết nối các API AI thực tế
 * Hỗ trợ Google Gemini API (Free Tier), Groq (Free Tier), và OpenRouter
 */

const SYSTEM_INSTRUCTION = `Bạn là Trợ lý AI chính thức của Saigon Grappling Society (SGS) - câu lạc bộ Brazilian Jiu Jitsu (BJJ) và Striking hàng đầu tại TP. Hồ Chí Minh, đối tác chính thức (Official Affiliate) cùng 10th Planet Jiu Jitsu.
Bạn trả lời thân thiện, nhiệt tình, chuẩn xác theo tinh thần võ thuật (thường có thể chào "Oss!" hoặc "Xin chào!") và hỗ trợ khách hàng bằng tiếng Việt tự nhiên, ngắn gọn, dễ hiểu.

DƯỚI ĐÂY LÀ THÔNG TIN CHÍNH THỨC CỦA SAIGON GRAPPLING SOCIETY (SGS):
1. ĐỊA CHỈ & LIÊN HỆ:
- Địa chỉ: 36 Đường A4, Phường Bảy Hiền, TP. Hồ Chí Minh.
- Hotline / Điện thoại: 055 943 4418 hoặc 0931 439 946
- Email: saigongrapplingsociety@gmail.com
- Đăng ký tập thử: Khách có thể điền form "Đăng ký tập thử 1 buổi" ngay phía dưới trang web.

2. CÁC BỘ MÔN ĐÀO TẠO:
- BJJ Gi: Brazilian Jiu Jitsu mặc võ phục Gi truyền thống, tập trung vào đòn bẩy, khống chế, siết cổ áo và tay áo.
- BJJ NoGi: BJJ không mặc võ phục (mặc rashguard/quần short thể thao), tốc độ nhanh, tập trung kiểm soát cổ tay, gáy, chân và khóa siết hiện đại.
- Striking: Kỹ thuật đòn đánh đứng (Boxing, Kickboxing, Muay Thai) rèn luyện thể lực và phản xạ.
- Open Mat: Buổi giao lưu tự do, sparring cọ xát kinh nghiệm giữa các thành viên.

3. LỊCH TẬP CHI TIẾT (Từ Thứ Hai đến Thứ Bảy, Chủ Nhật nghỉ - OFF):
- Ca Sáng (10:00 - 12:00):
  + Thứ 2, Thứ 4, Thứ 6, Thứ 7: BJJ NoGi
  + Thứ 3, Thứ 5: BJJ Gi
- Ca Trưa (12:00 - 14:00):
  + Thứ 2, Thứ 3, Thứ 5, Thứ 6: Gi / NoGi (Full Sparring - đấu tập)
  + Thứ 4: NoGi (Full Sparring)
  + Thứ 7: Nghỉ
- Ca Chiều (15:00 - 17:00):
  + Thứ Bảy: OPEN MAT (Giao lưu tự do Gi & NoGi)
  + Thứ 2 đến Thứ 6: Nghỉ
- Ca Tối 1 (18:00 - 19:15) - Lớp Fundamental (Căn bản cho người mới & mọi trình độ):
  + Thứ 2, Thứ 3, Thứ 5, Thứ 6: BJJ NoGi
  + Thứ 4, Thứ 7: BJJ Gi
- Ca Tối 2 (19:30 - 21:00) - Lớp Competition & Striking:
  + Thứ 2, Thứ 6: BJJ NoGi (Competition)
  + Thứ 3, Thứ 5, Thứ 7: STRIKING (Đánh đứng)
  + Thứ 4: BJJ Gi (Competition)

4. BẢNG GIÁ HỌC PHÍ & GÓI TẬP (Hiệu lực từ tháng 11/2026):
- Đăng ký theo tháng:
  + Gói theo khung giờ: 1.200.000đ/tháng (Người lớn 22+), 900.000đ/tháng (Học sinh/sinh viên có thẻ).
  + Gói All-Access (tập không giới hạn tất cả các ca và lớp): 1.800.000đ/tháng (Người lớn 22+), 1.500.000đ/tháng (HSSV có thẻ).
- Vé lẻ (Drop-in):
  + 1 lớp tập tùy chọn: 150.000đ/buổi.
  + 1-Day Pass (tập bao nhiêu lớp trong ngày cũng được): 350.000đ.
- Gói dài hạn ưu đãi:
  + Gói 3 tháng: 3.240.000đ (đã giảm 10% + tặng 1 áo thun SGS trị giá 159K).
  + Gói 6 tháng: 6.480.000đ (đã giảm 10% + tặng 1 áo rashguard SGS trị giá 375K).

5. HUẤN LUYỆN VIÊN (COACHES):
- Đội ngũ Head Coach và Coach BJJ đai đen, nâu, tím giàu kinh nghiệm thi đấu và giảng dạy.
- Coach Tạ Quang Hải: Huấn luyện viên Striking, cựu võ sĩ giải MMA chuyên nghiệp LION Championship (thành tích 1-1-0), Huy chương Bạc nội dung full contact tại Giải vô địch các CLB Jiu Jitsu quốc gia năm 2024.

NGUYÊN TẮC TRẢ LỜI:
- Khi người dùng hỏi về lịch tập, học phí, địa chỉ hay cách đăng ký, bạn hãy trả lời chính xác, rõ ràng dựa trên dữ liệu SGS ở trên.
- Nếu người dùng hỏi những câu hỏi ngoài lề (khoa học, đời sống, v.v.), bạn vẫn giải đáp thông minh, lịch sự.
- Định dạng Markdown đẹp mắt: dùng gạch đầu dòng, in đậm các ý chính để người đọc dễ theo dõi trên điện thoại.`;

export const PROVIDERS = {
  gemini: {
    name: "Google Gemini",
    defaultModel: "gemini-2.5-flash",
    fallbackModels: ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash"],
    description: "Gemini 2.5 Flash (Google AI Studio - Free Tier)",
    keyDocUrl: "https://aistudio.google.com/app/apikey",
    envKey: "VITE_GEMINI_API_KEY",
    storageKey: "ai_key_gemini"
  },
  groq: {
    name: "Groq Cloud",
    defaultModel: "llama-3.3-70b-versatile",
    fallbackModels: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    description: "Llama 3.3 70B (Tốc độ phản hồi cực nhanh, Free Tier)",
    keyDocUrl: "https://console.groq.com/keys",
    envKey: "VITE_GROQ_API_KEY",
    storageKey: "ai_key_groq"
  }
};

/**
 * Lấy API key cho provider trực tiếp từ file .env qua Vite import.meta.env
 */
export function getApiKey(provider = "gemini") {
  const p = PROVIDERS[provider];
  if (!p) return "";
  
  try {
    const envVal = import.meta.env ? import.meta.env[p.envKey] : "";
    if (envVal && typeof envVal === "string" && envVal.trim() && !envVal.includes("your_")) {
      return envVal.trim();
    }
  } catch (e) {
    // Không có import.meta.env
  }

  return "";
}

/**
 * Gửi tin nhắn đến Google Gemini API (có hỗ trợ Streaming SSE)
 */
async function callGeminiStream({ apiKey, model, messages, onChunk, signal }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  // Chuẩn hóa định dạng hội thoại cho Gemini
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    let errDetail = "";
    try {
      const errJson = await response.json();
      errDetail = errJson.error?.message || response.statusText;
    } catch (_) {
      errDetail = await response.text();
    }
    if (response.status === 404) {
      const err = new Error(`MODEL_NOT_FOUND:${model}`);
      err.status = 404;
      throw err;
    }
    if (response.status === 400 && errDetail.toLowerCase().includes("api_key")) {
      throw new Error("API Key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại Google Gemini API Key.");
    } else if (response.status === 429) {
      throw new Error("Đã vượt quá giới hạn lượt gọi (Rate Limit) của gói miễn phí. Vui lòng đợi ít giây rồi thử lại.");
    }
    throw new Error(`Lỗi Gemini API (${response.status}): ${errDetail}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // Giữ lại phần dư chưa kết thúc dòng

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        const jsonStr = trimmed.slice(6);
        if (jsonStr === "[DONE]") continue;
        try {
          const data = JSON.parse(jsonStr);
          const chunkText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (chunkText) {
            fullText += chunkText;
            if (typeof onChunk === "function") {
              onChunk(fullText, chunkText);
            }
          }
        } catch (e) {
          // Bỏ qua các chunk không parse được
        }
      }
    }
  }

  return fullText;
}

/**
 * Gửi tin nhắn đến Groq Cloud API (OpenAI-compatible)
 */
async function callGroqStream({ apiKey, model, messages, onChunk, signal }) {
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";

  const chatMessages = [
    { role: "system", content: SYSTEM_INSTRUCTION },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  const payload = {
    model: model || "llama-3.3-70b-versatile",
    messages: chatMessages,
    temperature: 0.7,
    max_tokens: 2048,
    stream: true
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    let errDetail = "";
    try {
      const errJson = await response.json();
      errDetail = errJson.error?.message || response.statusText;
    } catch (_) {
      errDetail = await response.text();
    }
    throw new Error(`Lỗi Groq API (${response.status}): ${errDetail}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        const jsonStr = trimmed.slice(6);
        if (jsonStr === "[DONE]") continue;
        try {
          const data = JSON.parse(jsonStr);
          const chunkText = data.choices?.[0]?.delta?.content || "";
          if (chunkText) {
            fullText += chunkText;
            if (typeof onChunk === "function") {
              onChunk(fullText, chunkText);
            }
          }
        } catch (e) {}
      }
    }
  }

  return fullText;
}

/**
 * Hàm điều phối chính gửi tin nhắn
 */
export async function sendChatMessage({ provider = "gemini", model, messages, onChunk, signal }) {
  const apiKey = getApiKey(provider);

  if (!apiKey) {
    const pInfo = PROVIDERS[provider] || PROVIDERS.gemini;
    throw new Error(`MISSING_API_KEY:${provider}:${pInfo.name}:${pInfo.keyDocUrl}`);
  }

  const pConfig = PROVIDERS[provider] || PROVIDERS.gemini;
  const modelsToTry = model ? [model] : (pConfig.fallbackModels || [pConfig.defaultModel]);

  let lastError = null;
  for (const m of modelsToTry) {
    try {
      if (provider === "groq") {
        return await callGroqStream({ apiKey, model: m, messages, onChunk, signal });
      } else {
        return await callGeminiStream({ apiKey, model: m, messages, onChunk, signal });
      }
    } catch (err) {
      if (err.message && err.message.startsWith("MODEL_NOT_FOUND")) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error("Không thể kết nối đến mô hình AI.");
}
