# -*- coding: utf-8 -*-
"""
Build bilingual i18n support for Saigon Grappling Society
"""
import re
import sys

def update_css():
    with open("cinematic.css", "r", encoding="utf-8") as f:
        css = f.read()
    
    if ".lang-switch" in css:
        print("CSS already contains .lang-switch")
        return

    # Add .lang-switch right after .top-nav rules
    target = ".top-nav a.l:hover::after {\n  transform: scaleX(1);\n  transform-origin: left\n}"
    
    css_addition = """

/* ---------- Language Switcher ---------- */
.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(30, 91, 198, 0.22);
  padding: 3px 5px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all .3s var(--ease);
}
.lang-switch:hover {
  border-color: rgba(30, 91, 198, 0.45);
  box-shadow: 0 4px 12px rgba(30, 91, 198, 0.12);
}
.lang-btn {
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .08em;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all .22s var(--ease);
  line-height: 1;
}
.lang-btn:hover {
  color: var(--blue);
}
.lang-btn.active {
  background: var(--blue);
  color: #fff;
  box-shadow: 0 2px 6px rgba(30, 91, 198, 0.35);
}
.lang-sep {
  font-size: .68rem;
  color: rgba(30, 91, 198, 0.35);
  font-weight: 600;
  user-select: none;
}
@media(max-width:700px) {
  .lang-switch {
    padding: 2px 4px;
    gap: 2px;
  }
  .lang-btn {
    font-size: .62rem;
    padding: 3px 6px;
    letter-spacing: .04em;
  }
  .lang-sep {
    font-size: .6rem;
  }
}
"""
    if target in css:
        css = css.replace(target, target + css_addition)
    else:
        # Append before the end or after header
        css += css_addition
        
    with open("cinematic.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("Updated cinematic.css with .lang-switch styles.")

if __name__ == "__main__":
    update_css()

