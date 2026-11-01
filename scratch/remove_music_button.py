# -*- coding: utf-8 -*-
import re

# 1. Update index.html
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Remove the button
btn_pattern = re.compile(r'\s*<button class="music-toggle"[^>]*>.*?</button>', re.DOTALL)
html = btn_pattern.sub('', html)

# Replace the script block
old_script_block = '''    /* ---- Background Audio Controller ---- */
    const bgAudio = document.getElementById("bg-audio");
    const musicBtn = document.getElementById("music-toggle");
    let hasAudioStarted = false;

    function setMusicUiState(isPlaying) {
      if (musicBtn) {
        musicBtn.classList.toggle("is-playing", isPlaying);
        musicBtn.setAttribute("aria-pressed", String(isPlaying));
      }
    }

    function playBgMusic() {
      if (hasAudioStarted || !bgAudio) return;
      bgAudio.loop = false; // Chỉ phát 1 lần rồi tắt, không lặp lại
      bgAudio.volume = 0.45; // Âm lượng dịu nhẹ chuẩn lofi / background
      const p = bgAudio.play();
      if (p !== undefined) {
        p.then(() => {
          hasAudioStarted = true;
          setMusicUiState(true);
          detachAutoPlayEvents();
        }).catch(() => {
          setMusicUiState(false);
        });
      }
    }

    function onFirstUserInteraction() {
      if (!hasAudioStarted && bgAudio) {
        playBgMusic();
      }
    }

    const autoEvents = ["click", "touchstart", "scroll", "keydown"];
    function attachAutoPlayEvents() {
      autoEvents.forEach(evt => window.addEventListener(evt, onFirstUserInteraction, { once: true, passive: true }));
    }
    function detachAutoPlayEvents() {
      autoEvents.forEach(evt => window.removeEventListener(evt, onFirstUserInteraction));
    }

    if (bgAudio) {
      bgAudio.addEventListener("ended", () => {
        setMusicUiState(false);
      });
    }

    if (musicBtn && bgAudio) {
      musicBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (bgAudio.paused) {
          bgAudio.play().then(() => {
            hasAudioStarted = true;
            setMusicUiState(true);
          }).catch(() => {});
        } else {
          bgAudio.pause();
          setMusicUiState(false);
        }
      });
    }

    // Tự động bật nhạc ngay khi vào trang (hoặc khi tương tác lần đầu theo chính sách trình duyệt)
    playBgMusic();
    attachAutoPlayEvents();'''

new_script_block = '''    /* ---- Background Audio: Tự động bật nhạc 1 lần khi người dùng tương tác ---- */
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

if old_script_block.replace('\n', '\r\n') in html:
    html = html.replace(old_script_block.replace('\n', '\r\n'), new_script_block.replace('\n', '\r\n'))
    print("Updated index.html script (CRLF)")
elif old_script_block in html:
    html = html.replace(old_script_block, new_script_block)
    print("Updated index.html script (LF)")
else:
    print("Script block not matched directly, checking regex replacement...")
    pattern = re.compile(r'/\* ---- Background Audio Controller ---- \*/.*?attachAutoPlayEvents\(\);', re.DOTALL)
    if pattern.search(html):
        html = pattern.sub(new_script_block, html)
        print("Updated index.html script via regex")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

# 2. Clean up cinematic.css
with open("cinematic.css", "r", encoding="utf-8") as f:
    css = f.read()

css_clean = re.sub(r'/\* ---------- Music Toggle Button ---------- \*/.*?(?=\n\n|\Z)', '', css, flags=re.DOTALL)
with open("cinematic.css", "w", encoding="utf-8") as f:
    f.write(css_clean)
print("Cleaned cinematic.css")

