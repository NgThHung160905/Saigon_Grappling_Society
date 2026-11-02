/**
 * Vercel Serverless Function: /api/chat
 * Toàn bộ logic gọi AI, System Prompt và API Key được bảo mật 100% ở Backend.
 * Trình duyệt phía người dùng không thể nhìn thấy bất kỳ Key hay Prompt nào.
 */

const SYSTEM_INSTRUCTION = `Tôi là Trợ lý AI của Saigon Grappling Society (SGS) - câu lạc bộ Brazilian Jiu Jitsu (BJJ) và Striking tại TP. Hồ Chí Minh, là một lineage của Sói Jiu Jitsu.
Bạn trả lời thân thiện, nhiệt tình, chuẩn xác theo tinh thần võ thuật (thường có thể chào "Oss!" hoặc "Xin chào!"). Nếu người dùng hỏi bằng tiếng Việt, hãy hỗ trợ bằng tiếng Việt tự nhiên, ngắn gọn, dễ hiểu. Nếu người dùng hỏi bằng tiếng Anh, hãy phản hồi bằng tiếng Anh chuyên nghiệp, tự nhiên theo thuật ngữ BJJ quốc tế.

DƯỚI ĐÂY LÀ THÔNG TIN CHÍNH THỨC CỦA SAIGON GRAPPLING SOCIETY (SGS):
1. ĐỊA CHỈ & LIÊN HỆ:
- Fanpage Facebook chính thức: https://www.facebook.com/profile.php?id=61594951304481 (khi người dùng hỏi liên hệ ai, liên hệ ở đâu, nhắn tin cho ai, Facebook phòng tập thì hãy cung cấp link Facebook này để khách nhắn tin trực tiếp với phòng tập).
- Hotline / Điện thoại: 055 943 4418
- Địa chỉ: 36 Đường A4, Phường Bảy Hiền, TP. Hồ Chí Minh.
- Email: saigongrapplingsociety@gmail.com
- Đăng ký tập thử: Khách có thể điền form "Đăng ký tập thử 1 buổi" tại trang Đăng ký (/register) trên website hoặc nhắn tin qua Facebook / gọi Hotline.

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
- Coach Chế Hoàng Huy: Huấn luyện viên BJJ, một trong những người tập luyện BJJ đầu tiên ở Sài Gòn thập kỷ trước.
- Coach Tạ Quang Hải: Huấn luyện viên Striking, cựu võ sĩ giải MMA chuyên nghiệp LION Championship (thành tích 1-1-0), Huy chương Bạc nội dung full contact tại Giải vô địch các CLB Jiu Jitsu quốc gia năm 2024.

NGUYÊN TẮC TRẢ LỜI:
- Phản hồi cực nhanh: Đi thẳng vào trọng tâm câu hỏi, ngắn gọn, súc tích, không chào hỏi dông dài.
- Khi người dùng hỏi về lịch tập, học phí, địa chỉ hay cách đăng ký, trả lời chính xác, rõ ràng theo dữ liệu SGS ở trên.
- Khi người dùng hỏi "liên hệ ai", "tư vấn ở đâu", "nhắn tin cho ai", "Facebook của CLB"... hãy gửi link Fanpage Facebook chính thức (https://www.facebook.com/profile.php?id=61594951304481) và Hotline 055 943 4418 để khách nhắn tin trực tiếp.
- Định dạng Markdown đẹp mắt: gạch đầu dòng ngắn gọn, in đậm thông tin quan trọng để người đọc dễ nắm bắt ngay.
- XỬ LÝ KHI KHÁCH HÀNG KHÓ CHỊU, NGÔN TỪ TỤC TĨU:
  + Lần 1: Nếu khách hàng tỏ thái độ khó chịu, gắt gỏng hoặc sử dụng từ ngữ thô tục/chửi bậy:
    - Nếu bằng tiếng Việt, phản hồi: "Tôi biết bạn đang rất khó chịu trong người, có thể là do áp lực công việc, học tập hoặc cuộc sống. Vì vậy hãy đến với SGS để được đấm nhau với các coach với mục đích giải tỏa bạn nhé :)))"
    - Nếu bằng tiếng Anh, phản hồi: "I know you're feeling frustrated right now—perhaps due to work, studies, or daily life stress. Why not drop by SGS and spar with our coaches to blow off some steam? :)))"
  + Lần 2: Nếu khách hàng vẫn tiếp tục nhắn bậy:
    - Nếu bằng tiếng Việt: "Nếu bạn nhắn bậy nữa, tôi sẽ cấm chat bạn á :v"
    - Nếu bằng tiếng Anh: "If you keep swearing, I'm going to ban you from this chat :v"
  + Lần 3 trở đi: Nếu khách hàng vẫn tiếp tục nhắn bậy:
    - Nếu bằng tiếng Việt: "[BAN_CHAT] Bạn đã bị cấm chat do tiếp tục sử dụng ngôn từ không phù hợp."
    - Nếu bằng tiếng Anh: "[BAN_CHAT] You have been banned from chatting due to continued inappropriate language."`;

const MODELS = {
  groq: ["qwen/qwen3.8-27b", "openai/gpt-oss-20b", "openai/gpt-oss-120b"],
  gemini: ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-flash-latest"]
};

function getEnvKey(provider) {
  if (provider === "groq") {
    return process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "";
  }
  return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
}

async function streamGroq(apiKey, model, messages, res) {
  const payload = {
    model,
    messages: [
      { role: "system", content: SYSTEM_INSTRUCTION },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }))
    ],
    temperature: 0.6,
    max_tokens: 1024,
    stream: true
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    const error = new Error(`Groq Error (${response.status}): ${errText}`);
    error.status = response.status;
    throw error;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const jsonStr = trimmed.slice(6);
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) res.write(delta);
      } catch (e) {}
    }
  }
}

async function streamGemini(apiKey, model, messages, res) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
  const payload = {
    contents: messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    })),
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 1024
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    const error = new Error(`Gemini Error (${response.status}): ${errText}`);
    error.status = response.status;
    throw error;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      try {
        const parsed = JSON.parse(trimmed.slice(6));
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) res.write(text);
      } catch (e) {}
    }
  }
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) {}
  }
  const { messages = [], provider = "groq" } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing messages array." });
  }

  // Setup streaming response
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache, no-transform");

  const groqKey = getEnvKey("groq");
  const geminiKey = getEnvKey("gemini");

  // Thứ tự thử nhà cung cấp: ưu tiên nhà cung cấp được yêu cầu
  const providerOrder = provider === "gemini" ? ["gemini", "groq"] : ["groq", "gemini"];
  let success = false;
  let lastError = null;

  for (const p of providerOrder) {
    const key = p === "groq" ? groqKey : geminiKey;
    if (!key) continue;

    const modelList = MODELS[p] || [];
    for (const m of modelList) {
      try {
        if (p === "groq") {
          await streamGroq(key, m, messages, res);
        } else {
          await streamGemini(key, m, messages, res);
        }
        success = true;
        break;
      } catch (err) {
        lastError = err;
        console.warn(`[Backend AI] Model ${p}/${m} lỗi:`, err.message);
        // Nếu là lỗi quota hoặc model, thử tiếp model tiếp theo
        if (err.status === 429 || err.status === 404) continue;
        break;
      }
    }
    if (success) break;
  }

  if (!success) {
    const errMsg = lastError?.message || "Không thể kết nối đến nhà cung cấp AI. Vui lòng kiểm tra API Key trong Vercel Environment Variables.";
    res.write(`⚠️ Lỗi máy chủ: ${errMsg}`);
  }

  res.end();
}

