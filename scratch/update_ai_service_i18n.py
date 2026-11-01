# -*- coding: utf-8 -*-
with open('ai-service.js', 'r', encoding='utf-8') as f:
    ai = f.read()

old_ai = '''- XỬ LÝ KHI KHÁCH HÀNG KHÓ CHỊU, NGÔN TỪ TỤC TĨU:
  + Lần 1: Nếu khách hàng tỏ thái độ khó chịu, gắt gỏng hoặc sử dụng từ ngữ thô tục/chửi bậy, bạn BẮT BUỘC phản hồi chính xác nguyên văn câu sau:
    "Tôi biết bạn đang rất khó chịu trong người, có thể là do áp lực công việc, học tập hoặc cuộc sống. Vì vậy hãy đến với SGS để được đấm nhau với các coach với mục đích giải tỏa bạn nhé 🤙"
  + Lần 2: Nếu khách hàng vẫn tiếp tục nhắn bậy, hãy cảnh báo nguyên văn câu sau:
    "Nếu bạn nhắn bậy nữa 🤬, tôi sẽ cấm chat bạn á :v"
  + Lần 3 trở đi: Nếu khách hàng vẫn tiếp tục nhắn bậy, hãy thông báo:
    "[BAN_CHAT] Bạn đã bị cấm chat do tiếp tục sử dụng ngôn từ không phù hợp 💩."`;'''

new_ai = '''- XỬ LÝ KHI KHÁCH HÀNG KHÓ CHỊU, NGÔN TỪ TỤC TĨU:
  + Lần 1: Nếu khách hàng tỏ thái độ khó chịu, gắt gỏng hoặc sử dụng từ ngữ thô tục/chửi bậy:
    - Nếu bằng tiếng Việt, phản hồi: "Tôi biết bạn đang rất khó chịu trong người, có thể là do áp lực công việc, học tập hoặc cuộc sống. Vì vậy hãy đến với SGS để được đấm nhau với các coach với mục đích giải tỏa bạn nhé :)))"
    - Nếu bằng tiếng Anh, phản hồi: "I know you're feeling frustrated right now—perhaps due to work, studies, or daily life stress. Why not drop by SGS and spar with our coaches to blow off some steam? :)))"
  + Lần 2: Nếu khách hàng vẫn tiếp tục nhắn bậy:
    - Nếu bằng tiếng Việt: "Nếu bạn nhắn bậy nữa, tôi sẽ cấm chat bạn á :v"
    - Nếu bằng tiếng Anh: "If you keep swearing, I'm going to ban you from this chat :v"
  + Lần 3 trở đi: Nếu khách hàng vẫn tiếp tục nhắn bậy:
    - Nếu bằng tiếng Việt: "[BAN_CHAT] Bạn đã bị cấm chat do tiếp tục sử dụng ngôn từ không phù hợp."
    - Nếu bằng tiếng Anh: "[BAN_CHAT] You have been banned from chatting due to continued inappropriate language."`;'''

if old_ai.replace('\n', '\r\n') in ai:
    ai = ai.replace(old_ai.replace('\n', '\r\n'), new_ai.replace('\n', '\r\n'))
    print("Updated ai-service.js (CRLF)")
elif old_ai in ai:
    ai = ai.replace(old_ai, new_ai)
    print("Updated ai-service.js (LF)")
else:
    print("Pattern not found in ai-service.js")

with open('ai-service.js', 'w', encoding='utf-8') as f:
    f.write(ai)

