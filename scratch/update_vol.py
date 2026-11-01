# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

old = 'bgAudio.volume = 0.55;'
new = 'bgAudio.volume = 0.45; // Âm lượng dịu nhẹ chuẩn lofi / background'

if old in c:
    c = c.replace(old, new)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated volume in index.html")
else:
    print("String not found")

