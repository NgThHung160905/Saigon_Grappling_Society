# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

old_block = '''      const btn = $("#submit");
      const t = I18N[currentLang];
      btn.disabled = true;
      btn.textContent = t.rules.submitSending;

      try {
        if (CONFIG.endpoint) {'''

new_block = '''      const btn = $("#submit");
      const t = I18N[currentLang];
      btn.disabled = true;
      btn.textContent = t.rules.submitSending;

      // Chặn hoàn toàn các thông tin test / pentest không gửi lên Google Sheet
      const testCheck = (data.name + " " + data.email + " " + data.slot + " " + data.phone).toLowerCase();
      const isTest = testCheck.includes("pentest") || testCheck.includes("example.invalid") || /^0+$/.test(data.phone) || (testCheck.includes("test") && testCheck.includes("sgs"));

      try {
        if (CONFIG.endpoint && !isTest) {'''

if old_block.replace('\n', '\r\n') in c:
    c = c.replace(old_block.replace('\n', '\r\n'), new_block.replace('\n', '\r\n'))
    print("Updated index.html (CRLF)")
elif old_block in c:
    c = c.replace(old_block, new_block)
    print("Updated index.html (LF)")
else:
    print("Block not found in index.html")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

