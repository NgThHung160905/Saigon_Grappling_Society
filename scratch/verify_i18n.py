# -*- coding: utf-8 -*-
"""
Verification script for i18n
"""
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

assert 'class="lang-switch"' in html, "lang-switch missing in index.html"
assert 'data-lang="vi"' in html, "lang vi button missing"
assert 'data-lang="en"' in html, "lang en button missing"
assert 'data-i18n="hero_title"' in html, "hero_title i18n missing"
assert 'data-i18n="what_title"' in html, "what_title i18n missing"
assert 'data-i18n="who_title"' in html, "who_title i18n missing"
assert 'data-i18n="tt_poster_title"' in html, "tt_poster_title i18n missing"
assert 'data-i18n="m_monthly_title"' in html, "m_monthly_title i18n missing"
assert 'data-i18n="reg_title"' in html, "reg_title i18n missing"
assert 'setLanguage' in html, "setLanguage function missing"
assert 'I18N' in html, "I18N data dictionary missing"

print("All static and structural assertions passed!")

