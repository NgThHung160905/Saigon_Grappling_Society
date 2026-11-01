# -*- coding: utf-8 -*-
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Move <audio id="bg-audio"> to right after <body> or before the script
# Remove current audio tag if at bottom
import re
html = re.sub(r'\s*<!-- Background Audio.*?-->\s*<audio id="bg-audio".*?</audio>', '', html, flags=re.DOTALL)

# Insert <audio> right after <body>
audio_tag = '''
  <!-- Background Audio: Là Vì Em (Chỉ phát 1 lần, không lặp lại) -->
  <audio id="bg-audio" preload="auto">
    <source src="music/là vì em.mp3" type="audio/mpeg">
  </audio>
'''

if '<audio id="bg-audio"' not in html:
    html = html.replace('<body>', '<body>\n' + audio_tag, 1)
    print("Inserted <audio> at start of <body>")

# Replace the script block with robust audio activation
old_script = '''    /* ---- Background Audio: Tự động bật nhạc 1 lần khi người dùng tương tác ---- */
    const bgAudio = document.getElementById("bg-audio");
    let hasAudioStarted = false;

    function playBgMusic() {
      if (hasAudioStarted || !bgAudio) return;
      bgAudio.loop = false; // Chỉ phát 1 lần rồi tắt, không lặp lại
      bgAudio.volume = 0.45; // Âm lượng dịu nhẹ Lo-Fi
      const p = bgAudio.play();
      if (p !== undefined) {
        p.then(() => {
          hasAudioStarted = true;
          detachAutoPlayEvents();
        }).catch(() => {});
      }
    }

    function onFirstUserInteraction() {
      if (!hasAudioStarted && bgAudio) {
        playBgMusic();
      }
    }

    const autoEvents = ["click", "touchstart", "scroll", "keydown", "pointerdown"];
    function attachAutoPlayEvents() {
      autoEvents.forEach(evt => window.addEventListener(evt, onFirstUserInteraction, { once: true, passive: true }));
    }
    function detachAutoPlayEvents() {
      autoEvents.forEach(evt => window.removeEventListener(evt, onFirstUserInteraction));
    }

    // Kích hoạt ngay nếu được phép, hoặc đợi lần tương tác đầu tiên của người dùng
    playBgMusic();
    attachAutoPlayEvents();'''

new_script = '''    /* ---- Background Audio: Tự động bật nhạc 1 lần khi người dùng tương tác ---- */
    let hasAudioStarted = false;

    function tryPlayAudio() {
      if (hasAudioStarted) return;
      const audio = document.getElementById("bg-audio");
      if (!audio) return;
      audio.loop = false; // Chỉ phát 1 lần duy nhất, không lặp lại
      audio.volume = 0.75; // Âm lượng rõ ràng, êm tai
      const promise = audio.play();
      if (promise !== undefined) {
        promise.then(() => {
          hasAudioStarted = true;
          detachAutoPlayEvents();
          console.log("[SGS Audio] Nhạc nền 'Là Vì Em' đang phát...");
        }).catch(err => {
          // Trình duyệt chặn autoplay khi chưa có tương tác người dùng, giữ listener để phát khi bấm
        });
      }
    }

    function onUserGesture() {
      if (!hasAudioStarted) {
        tryPlayAudio();
      }
    }

    const autoPlayGestures = ["click", "pointerdown", "touchstart", "touchend", "keydown", "scroll"];
    function attachAutoPlayEvents() {
      autoPlayGestures.forEach(evt => {
        document.addEventListener(evt, onUserGesture, { passive: true });
        window.addEventListener(evt, onUserGesture, { passive: true });
      });
    }

    function detachAutoPlayEvents() {
      autoPlayGestures.forEach(evt => {
        document.removeEventListener(evt, onUserGesture);
        window.removeEventListener(evt, onUserGesture);
      });
    }

    // Thử kích hoạt ngay khi tải trang, đồng thời lắng nghe tương tác đầu tiên của người dùng
    tryPlayAudio();
    attachAutoPlayEvents();'''

if old_script.replace('\n', '\r\n') in html:
    html = html.replace(old_script.replace('\n', '\r\n'), new_script.replace('\n', '\r\n'))
    print("Replaced script (CRLF)")
elif old_script in html:
    html = html.replace(old_script, new_script)
    print("Replaced script (LF)")
else:
    pattern = re.compile(r'/\* ---- Background Audio.*?attachAutoPlayEvents\(\);', re.DOTALL)
    if pattern.search(html):
        html = pattern.sub(new_script, html)
        print("Replaced script via regex")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html successfully.")

