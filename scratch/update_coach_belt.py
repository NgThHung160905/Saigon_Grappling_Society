# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

old_str = '''name: "Chế Hoàng Huy",
          title: "Coach",
          disc: "BJJ",
          belt: "blue",'''

new_str = '''name: "Chế Hoàng Huy",
          title: "Coach",
          disc: "BJJ",
          belt: "white",'''

# Try with CRLF or LF
if old_str.replace('\n', '\r\n') in c:
    c = c.replace(old_str.replace('\n', '\r\n'), new_str.replace('\n', '\r\n'))
    print('Updated index.html with CRLF')
elif old_str in c:
    c = c.replace(old_str, new_str)
    print('Updated index.html with LF')
else:
    print('Target string not found in index.html')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

with open('ai-service.js', 'r', encoding='utf-8') as f:
    ai = f.read()

old_ai = 'Coach Chế Hoàng Huy: Huấn luyện viên BJJ (Đai xanh)'
new_ai = 'Coach Chế Hoàng Huy: Huấn luyện viên BJJ (Đai trắng)'

if old_ai in ai:
    ai = ai.replace(old_ai, new_ai)
    print('Updated ai-service.js')
    with open('ai-service.js', 'w', encoding='utf-8') as f:
        f.write(ai)

