# -*- coding: utf-8 -*-
"""
Add background music player logic and styles
"""

# 1. Update cinematic.css
with open("cinematic.css", "r", encoding="utf-8") as f:
    css = f.read()

music_css = """

/* ---------- Music Toggle Button ---------- */
.music-toggle {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 9990;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(30, 91, 198, 0.25);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .3s var(--ease);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 0;
}
.music-toggle:hover {
  transform: scale(1.08);
  border-color: var(--blue);
  box-shadow: 0 6px 20px rgba(30, 91, 198, 0.25);
}
.music-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 16px;
}
.music-bar {
  width: 3px;
  height: 4px;
  background: var(--blue);
  border-radius: 2px;
  transition: height .2s ease;
}
.music-toggle.is-playing .music-bar:nth-child(1) {
  animation: soundBar .9s ease-in-out infinite alternate;
}
.music-toggle.is-playing .music-bar:nth-child(2) {
  animation: soundBar 1.2s ease-in-out .2s infinite alternate;
}
.music-toggle.is-playing .music-bar:nth-child(3) {
  animation: soundBar .8s ease-in-out .4s infinite alternate;
}
@keyframes soundBar {
  0% { height: 4px; }
  100% { height: 16px; }
}
.music-icon-muted {
  display: block;
  width: 20px;
  height: 20px;
  color: #64748b;
}
.music-toggle.is-playing .music-icon-muted {
  display: none;
}
.music-toggle.is-playing .music-bars {
  display: flex;
}
.music-toggle:not(.is-playing) .music-bars {
  display: none;
}
@media(max-width:700px) {
  .music-toggle {
    bottom: 18px;
    left: 18px;
    width: 38px;
    height: 38px;
  }
  .music-bars {
    height: 13px;
  }
  .music-icon-muted {
    width: 17px;
    height: 17px;
  }
}
"""

if ".music-toggle" not in css:
    css += music_css
    with open("cinematic.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("Updated cinematic.css with .music-toggle styles.")
else:
    print(".music-toggle already in cinematic.css.")

# 2. Update index.html
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Add audio element and toggle button right before </body>
audio_markup = """  <!-- Background Audio: Là Vì Em (Chỉ phát 1 lần, không lặp lại) -->
  <audio id="bg-audio" preload="auto">
    <source src="music/là vì em.mp3" type="audio/mpeg">
  </audio>
  <button class="music-toggle" id="music-toggle" type="button" aria-label="Bật/Tắt nhạc nền" title="Nhạc nền: Là vì em">
    <span class="music-bars" aria-hidden="true">
      <span class="music-bar"></span>
      <span class="music-bar"></span>
      <span class="music-bar"></span>
    </span>
    <svg class="music-icon-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>
  </button>
"""

audio_js = """
    /* ---- Background Audio Controller ---- */
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
      bgAudio.volume = 0.55;
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
    attachAutoPlayEvents();
"""

if 'id="bg-audio"' not in html:
    # Insert before </body>
    target = '  <script type="module" src="cinematic.js"></script>'
    if target in html:
        html = html.replace(target, audio_markup + '\n' + target)
    
    # Insert JS before end of the main <script> tag
    script_close = '    form.addEventListener("submit", async e => {'
    # Let's find end of script: </script>\n  <script type="module" src="cinematic.js">
    end_script = '    });\n  </script>'
    if end_script in html:
        html = html.replace(end_script, '    });\n' + audio_js + '\n  </script>')
    else:
        print("Warning: end_script not matched cleanly, checking CRLF...")
        end_script_crlf = '    });\r\n  </script>'
        if end_script_crlf in html:
            html = html.replace(end_script_crlf, '    });\r\n' + audio_js.replace('\n', '\r\n') + '\r\n  </script>')
            
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Updated index.html with audio element and script.")
else:
    print("bg-audio already in index.html.")

