# -*- coding: utf-8 -*-
import sys
import re

def apply_i18n():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Update Header Navigation with data-i18n and add .lang-switch
    old_nav = """      <nav class="top-nav">
        <a class="l" href="#thong-tin">Thông tin lớp học</a>
        <a class="l" href="#merchandise">Merchandise</a>
        <a class="btn sm" href="#dang-ky">Đăng ký ngay</a>
      </nav>"""
    
    new_nav = """      <nav class="top-nav">
        <a class="l" href="#thong-tin" data-i18n="nav_info">Thông tin lớp học</a>
        <a class="l" href="#merchandise" data-i18n="nav_merch">Merchandise</a>
        <a class="btn sm" href="#dang-ky" data-i18n="nav_reg">Đăng ký ngay</a>
      </nav>
      <div class="lang-switch" role="group" aria-label="Language selection">
        <button type="button" class="lang-btn active" data-lang="vi" aria-pressed="true">VIE</button>
        <span class="lang-sep">/</span>
        <button type="button" class="lang-btn" data-lang="en" aria-pressed="false">ENG</button>
      </div>"""
    
    if old_nav in html:
        html = html.replace(old_nav, new_nav)
        print("Updated Header Navigation and inserted .lang-switch")
    else:
        print("Header nav target not matched, checking if already modified...")

    # 2. Hero Section
    old_hero_title = """        <h1 class="t">
          <span>Rèn thể lực</span>
          <span>Luyện <em>trí lực</em></span>
        </h1>"""
    new_hero_title = """        <h1 class="t" data-i18n="hero_title">
          <span>Rèn thể lực</span>
          <span>Luyện <em>trí lực</em></span>
        </h1>"""
    html = html.replace(old_hero_title, new_hero_title)

    old_hero_sub = """        <p class="sub">Môn võ kết hợp sức mạnh, kỹ thuật và khả năng tư duy giải quyết vấn đề.</p>
        <div class="hero-cta">
          <a class="btn lime" href="#dang-ky">Đăng ký ngay</a>
          <a class="btn ghost" href="#lich">Xem lịch tập</a>
        </div>"""
    new_hero_sub = """        <p class="sub" data-i18n="hero_sub">Môn võ kết hợp sức mạnh, kỹ thuật và khả năng tư duy giải quyết vấn đề.</p>
        <div class="hero-cta">
          <a class="btn lime" href="#dang-ky" data-i18n="hero_btn_reg">Đăng ký ngay</a>
          <a class="btn ghost" href="#lich" data-i18n="hero_btn_schedule">Xem lịch tập</a>
        </div>"""
    html = html.replace(old_hero_sub, new_hero_sub)

    # 3. What is Jiu Jitsu Section
    old_what = """        <div class="what">
          <h2 class="t t-lg">Jiu Jitsu<br>là gì?</h2>
          <div>
            <p>Brazilian Jiu-Jitsu (BJJ) là môn võ tập trung vào kỹ thuật khống chế, vật và khóa siết, giúp bạn kiểm
              soát đối thủ ngay cả khi họ to khỏe hơn mình.</p>
            <p>Khác với những môn võ thiên về đấm đá, Jiu-Jitsu đề cao kỹ thuật, tư duy chiến thuật và khả năng tận dụng
              đòn bẩy cơ thể thay vì chỉ dựa vào sức mạnh.</p>
          </div>
        </div>"""
    new_what = """        <div class="what">
          <h2 class="t t-lg" data-i18n="what_title">Jiu Jitsu<br>là gì?</h2>
          <div data-i18n="what_desc">
            <p>Brazilian Jiu-Jitsu (BJJ) là môn võ tập trung vào kỹ thuật khống chế, vật và khóa siết, giúp bạn kiểm
              soát đối thủ ngay cả khi họ to khỏe hơn mình.</p>
            <p>Khác với những môn võ thiên về đấm đá, Jiu-Jitsu đề cao kỹ thuật, tư duy chiến thuật và khả năng tận dụng
              đòn bẩy cơ thể thay vì chỉ dựa vào sức mạnh.</p>
          </div>
        </div>"""
    html = html.replace(old_what, new_what)

    # Tags in frames
    html = html.replace('<span class="tag">Khống chế</span>', '<span class="tag" data-i18n="tag_control">Khống chế</span>')
    html = html.replace('<span class="tag">Vật</span>', '<span class="tag" data-i18n="tag_takedown">Vật</span>')
    html = html.replace('<span class="tag">Khóa siết</span>', '<span class="tag" data-i18n="tag_submission">Khóa siết</span>')

    # Pillars
    old_pillars = """        <div class="pillars">
          <div class="pillar">
            <h3 class="t t-md">Fitness</h3>
            <div class="pillar-lead">~300–700 kcal</div>
            <p class="pillar-note">Năng lượng tiêu hao ước tính trong 60 phút tập BJJ.</p>
            <p class="pillar-desc">Một buổi tập phối hợp vận động toàn thân, sức bền, sức mạnh, khả năng phối hợp cơ thể
              và trí óc</p>
          </div>
          <div class="pillar">
            <h3 class="t t-md">Defense</h3>
            <div class="pillar-lead">TECHNIQUE OVER BRUTE FORCE.</div>
            <p class="pillar-desc">Học cách tạo lợi thế bằng đòn bẩy, vị trí và khả năng kiểm soát.</p>
            <p class="pillar-desc">BJJ giúp bạn luyện tập các tình huống đối kháng có kiểm soát và cho bạn khả năng tự
              vệ dù bất lợi về mặt hình thể</p>
          </div>
          <div class="pillar">
            <h3 class="t t-md">Train Your Mind</h3>
            <div class="pillar-lead">TRAIN YOUR BODY.<br>CHALLENGE YOUR MIND.</div>
            <p class="pillar-desc">Không chỉ tập thể lực, bạn còn liên tục phải quan sát và ra quyết định.</p>
            <p class="pillar-desc">Đây là một hình thức luyện tập kết hợp vận động và giải quyết vấn đề cùng một lúc,
              đòi hỏi sự bình tĩnh tuyệt đối và đầu óc minh mẫn để đối phó với thử thách.</p>
          </div>
        </div>"""

    new_pillars = """        <div class="pillars">
          <div class="pillar">
            <h3 class="t t-md" data-i18n="pillar_fitness_title">Fitness</h3>
            <div class="pillar-lead">~300–700 kcal</div>
            <p class="pillar-note" data-i18n="pillar_fitness_note">Năng lượng tiêu hao ước tính trong 60 phút tập BJJ.</p>
            <p class="pillar-desc" data-i18n="pillar_fitness_desc">Một buổi tập phối hợp vận động toàn thân, sức bền, sức mạnh, khả năng phối hợp cơ thể
              và trí óc</p>
          </div>
          <div class="pillar">
            <h3 class="t t-md" data-i18n="pillar_defense_title">Defense</h3>
            <div class="pillar-lead">TECHNIQUE OVER BRUTE FORCE.</div>
            <p class="pillar-desc" data-i18n="pillar_defense_desc1">Học cách tạo lợi thế bằng đòn bẩy, vị trí và khả năng kiểm soát.</p>
            <p class="pillar-desc" data-i18n="pillar_defense_desc2">BJJ giúp bạn luyện tập các tình huống đối kháng có kiểm soát và cho bạn khả năng tự
              vệ dù bất lợi về mặt hình thể</p>
          </div>
          <div class="pillar">
            <h3 class="t t-md" data-i18n="pillar_mind_title">Train Your Mind</h3>
            <div class="pillar-lead">TRAIN YOUR BODY.<br>CHALLENGE YOUR MIND.</div>
            <p class="pillar-desc" data-i18n="pillar_mind_desc1">Không chỉ tập thể lực, bạn còn liên tục phải quan sát và ra quyết định.</p>
            <p class="pillar-desc" data-i18n="pillar_mind_desc2">Đây là một hình thức luyện tập kết hợp vận động và giải quyết vấn đề cùng một lúc,
              đòi hỏi sự bình tĩnh tuyệt đối và đầu óc minh mẫn để đối phó với thử thách.</p>
          </div>
        </div>"""
    html = html.replace(old_pillars, new_pillars)

    # 4. Who can train Section
    old_who = """        <div class="who-top">
          <h2 class="t t-lg">Ai có thể tập<br>Jiu-Jitsu?</h2>
          <div class="age">
            <div class="n">5<sup>+</sup></div>
            <p>Mọi người, từ 5 tuổi trở lên, không phân biệt giới tính, độ tuổi hay thể trạng hay ngành nghề.</p>
          </div>
        </div>
        <div class="roles" id="roles"></div>
        <div class="who-cta">
          <a class="btn" href="#dang-ky">
            <span>Trải nghiệm miễn phí</span>"""

    new_who = """        <div class="who-top">
          <h2 class="t t-lg" data-i18n="who_title">Ai có thể tập<br>Jiu-Jitsu?</h2>
          <div class="age">
            <div class="n">5<sup>+</sup></div>
            <p data-i18n="who_desc">Mọi người, từ 5 tuổi trở lên, không phân biệt giới tính, độ tuổi hay thể trạng hay ngành nghề.</p>
          </div>
        </div>
        <div class="roles" id="roles"></div>
        <div class="who-cta">
          <a class="btn" href="#dang-ky">
            <span data-i18n="who_btn_trial">Trải nghiệm miễn phí</span>"""
    html = html.replace(old_who, new_who)

    # 5. Timetable guide bar
    old_tt_guide = """        <!-- Hướng dẫn cho người mới bắt đầu -->
        <div class="tt-guide-bar">
          <div class="tt-guide-item">
            <span class="tt-guide-tag gi">BJJ GI</span>
            <div class="tt-guide-text">
              <b>BJJ có võ phục (Gi)</b>
            </div>
          </div>
          <div class="tt-guide-item">
            <span class="tt-guide-tag nogi">BJJ NOGI</span>
            <div class="tt-guide-text">
              <b>BJJ không võ phục</b>
            </div>
          </div>
          <div class="tt-guide-item">
            <span class="tt-guide-tag str">STRIKING</span>
            <div class="tt-guide-text">
              <b>Đánh đứng</b>
            </div>
          </div>
          <div class="tt-guide-item">
            <span class="tt-guide-tag open">OPEN MAT</span>
            <div class="tt-guide-text">
              <b>Giao lưu</b>
            </div>
          </div>
        </div>"""

    new_tt_guide = """        <!-- Hướng dẫn cho người mới bắt đầu -->
        <div class="tt-guide-bar">
          <div class="tt-guide-item">
            <span class="tt-guide-tag gi">BJJ GI</span>
            <div class="tt-guide-text">
              <b data-i18n="tt_legend_gi">BJJ có võ phục (Gi)</b>
            </div>
          </div>
          <div class="tt-guide-item">
            <span class="tt-guide-tag nogi">BJJ NOGI</span>
            <div class="tt-guide-text">
              <b data-i18n="tt_legend_nogi">BJJ không võ phục</b>
            </div>
          </div>
          <div class="tt-guide-item">
            <span class="tt-guide-tag str">STRIKING</span>
            <div class="tt-guide-text">
              <b data-i18n="tt_legend_str">Đánh đứng</b>
            </div>
          </div>
          <div class="tt-guide-item">
            <span class="tt-guide-tag open">OPEN MAT</span>
            <div class="tt-guide-text">
              <b data-i18n="tt_legend_open">Giao lưu</b>
            </div>
          </div>
        </div>"""
    html = html.replace(old_tt_guide, new_tt_guide)

    # Timetable poster title & footer
    old_tt_poster_title = """                <h2 class="tt-poster-title">THỜI KHÓA BIỂU</h2>
                <div class="tt-poster-sub">WEEKLY SCHEDULE <span class="tt-arrow">↘</span></div>"""
    new_tt_poster_title = """                <h2 class="tt-poster-title" data-i18n="tt_poster_title">THỜI KHÓA BIỂU</h2>
                <div class="tt-poster-sub" data-i18n="tt_poster_sub">WEEKLY SCHEDULE <span class="tt-arrow">↘</span></div>"""
    html = html.replace(old_tt_poster_title, new_tt_poster_title)

    old_tt_foot = """                <span>LỊCH TẬP THAM KHẢO - CÓ THỂ THAY ĐỔI</span>"""
    new_tt_foot = """                <span data-i18n="tt_poster_foot">LỊCH TẬP THAM KHẢO - CÓ THỂ THAY ĐỔI</span>"""
    html = html.replace(old_tt_foot, new_tt_foot)

    # 6. Membership Section
    old_m_groups = """        <div class="m-group">
          <div class="m-title">
            <h3 class="m-h">Đăng ký theo tháng</h3>
          </div>
          <div class="matrix" id="matrix"></div>
        </div>
        <div class="m-group">
          <div class="m-title">
            <h3 class="m-h">Đăng ký drop-in</h3>
          </div>
          <div class="cards2" id="dropin"></div>
        </div>
        <div class="m-group">
          <div class="m-title">
            <h3 class="m-h">Đăng ký gói</h3><small>*Áp dụng cho gói tập theo khung giờ</small>
          </div>
          <div class="cards2" id="packs"></div>
        </div>"""

    new_m_groups = """        <div class="m-group">
          <div class="m-title">
            <h3 class="m-h" data-i18n="m_monthly_title">Đăng ký theo tháng</h3>
          </div>
          <div class="matrix" id="matrix"></div>
        </div>
        <div class="m-group">
          <div class="m-title">
            <h3 class="m-h" data-i18n="m_dropin_title">Đăng ký drop-in</h3>
          </div>
          <div class="cards2" id="dropin"></div>
        </div>
        <div class="m-group">
          <div class="m-title">
            <h3 class="m-h" data-i18n="m_packs_title">Đăng ký gói</h3><small data-i18n="m_packs_note">*Áp dụng cho gói tập theo khung giờ</small>
          </div>
          <div class="cards2" id="packs"></div>
        </div>"""
    html = html.replace(old_m_groups, new_m_groups)

    # 7. Form Registration Section
    old_reg_head = """        <div class="reg-head">
          <h2 class="t t-xl" style="font-size:clamp(3rem,9vw,6.4rem);line-height:1.05">Đăng ký<br><em>tập thử 1
              buổi</em></h2>
        </div>"""
    new_reg_head = """        <div class="reg-head">
          <h2 class="t t-xl" style="font-size:clamp(3rem,9vw,6.4rem);line-height:1.05" data-i18n="reg_title">Đăng ký<br><em>tập thử 1 buổi</em></h2>
        </div>"""
    html = html.replace(old_reg_head, new_reg_head)

    # Form fields
    html = html.replace('<span class="lg">Bộ môn</span>', '<span class="lg" data-i18n="lbl_program">Bộ môn</span>')
    html = html.replace('<label for="date">Chọn ngày <span class="date-format-hint">(DD/MM/YY)</span></label>', '<label for="date" data-i18n="lbl_date">Chọn ngày <span class="date-format-hint">(DD/MM/YY)</span></label>')
    html = html.replace('<label for="slot">Khung giờ</label>', '<label for="slot" data-i18n="lbl_slot">Khung giờ</label>')
    html = html.replace('<label for="name">Họ và tên</label>', '<label for="name" data-i18n="lbl_name">Họ và tên</label>')
    html = html.replace('<label for="phone">Số điện thoại</label>', '<label for="phone" data-i18n="lbl_phone">Số điện thoại</label>')
    html = html.replace('<label for="email">Email</label>', '<label for="email" data-i18n="lbl_email">Email</label>')
    html = html.replace('<button class="btn" type="submit" id="submit">Gửi đăng ký</button>', '<button class="btn" type="submit" id="submit" data-i18n="btn_submit">Gửi đăng ký</button>')

    # Ticket confirmation
    old_ticket = """            <div class="tk-body">
              <h3 class="t">Cảm ơn bạn<br>đã đăng ký.</h3>
              <p class="tk-msg">Hãy screenshot lại trang này và đưa cho HLV đứng lớp.</p>
              <dl class="tk-info">
                <div>
                  <dt>Tên</dt>
                  <dd id="tk-name"></dd>
                </div>
                <div>
                  <dt>SĐT</dt>
                  <dd id="tk-phone"></dd>
                </div>
                <div>
                  <dt>Ngày tập</dt>
                  <dd id="tk-date"></dd>
                </div>
                <div>
                  <dt>Lớp đã đăng ký</dt>
                  <dd id="tk-class"></dd>
                </div>
              </dl>
              <p class="tk-dev" id="tk-dev" hidden>Chế độ thử: đăng ký chưa được lưu vào Google Sheet.</p>
              <button type="button" class="tk-again" id="tk-again">Đăng ký cho người khác</button>
            </div>"""

    new_ticket = """            <div class="tk-body">
              <h3 class="t" data-i18n="tk_title">Cảm ơn bạn<br>đã đăng ký.</h3>
              <p class="tk-msg" data-i18n="tk_msg">Hãy screenshot lại trang này và đưa cho HLV đứng lớp.</p>
              <dl class="tk-info">
                <div>
                  <dt data-i18n="tk_name">Tên</dt>
                  <dd id="tk-name"></dd>
                </div>
                <div>
                  <dt data-i18n="tk_phone">SĐT</dt>
                  <dd id="tk-phone"></dd>
                </div>
                <div>
                  <dt data-i18n="tk_date">Ngày tập</dt>
                  <dd id="tk-date"></dd>
                </div>
                <div>
                  <dt data-i18n="tk_class">Lớp đã đăng ký</dt>
                  <dd id="tk-class"></dd>
                </div>
              </dl>
              <p class="tk-dev" id="tk-dev" hidden data-i18n="tk_dev">Chế độ thử: đăng ký chưa được lưu vào Google Sheet.</p>
              <button type="button" class="tk-again" id="tk-again" data-i18n="tk_again">Đăng ký cho người khác</button>
            </div>"""
    html = html.replace(old_ticket, new_ticket)

    # Address / Directions button
    html = html.replace('Chỉ đường</a>', '<span data-i18n="addr_directions">Chỉ đường</span></a>')

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Updated index.html HTML markup successfully.")

if __name__ == "__main__":
    apply_i18n()

