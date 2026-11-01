# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

old_coach = '''        {
          name: "Chế Hoàng Huy",
          title: "Coach",
          disc: "BJJ",
          belt: "white",
          img: "images/COACHES/Chế Hoàng Huy.jpg",
          link: "https://www.facebook.com/photo?fbid=122113327659498376&set=a.122108037897498376"
        },'''

new_coach = '''        {
          name: "Chế Hoàng Huy",
          title: "Coach",
          disc: "BJJ",
          img: "images/COACHES/Chế Hoàng Huy.jpg",
          link: "https://www.facebook.com/photo?fbid=122113327659498376&set=a.122108037897498376"
        },'''

if old_coach.replace('\n', '\r\n') in c:
    c = c.replace(old_coach.replace('\n', '\r\n'), new_coach.replace('\n', '\r\n'))
    print("Updated index.html (CRLF)")
elif old_coach in c:
    c = c.replace(old_coach, new_coach)
    print("Updated index.html (LF)")
else:
    print("Target coach not found in index.html")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

with open('ai-service.js', 'r', encoding='utf-8') as f:
    ai = f.read()

old_ai = 'Coach Chế Hoàng Huy: Huấn luyện viên BJJ (Đai trắng)'
new_ai = 'Coach Chế Hoàng Huy: Huấn luyện viên BJJ'

if old_ai in ai:
    ai = ai.replace(old_ai, new_ai)
    print("Updated ai-service.js")
    with open('ai-service.js', 'w', encoding='utf-8') as f:
        f.write(ai)

