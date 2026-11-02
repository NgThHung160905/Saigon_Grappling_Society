/* SGS · dùng chung cho mọi trang: i18n VIE/ENG, cấu hình, render lịch/giá/HLV/merch, nhạc nền */
    /* ============ BILINGUAL i18n & CONFIGURATION ============ */
    let currentLang = "vi";
    try { const s = localStorage.getItem("sgs_lang"); if (s === "vi" || s === "en") currentLang = s; } catch (e) { /* storage bị chặn */ }

    const I18N = {
      vi: {
        nav_info: "Thông tin lớp học",
        nav_merch: "Merchandise",
        nav_schedule: "Lịch & Membership",
        nav_reg: "Đăng ký ngay",
        hero_title: "<span>Rèn thể lực</span>\n          <span>Luyện <em>trí lực</em></span>",
        hero_sub: "Môn võ kết hợp sức mạnh, kỹ thuật và khả năng tư duy giải quyết vấn đề.",
        hero_btn_reg: "Đăng ký ngay",
        hero_btn_schedule: "Xem lịch tập",
        what_title: "Jiu Jitsu<br>là gì?",
        what_desc: "<p>Brazilian Jiu-Jitsu (BJJ) là môn võ tập trung vào kỹ thuật khống chế, vật và khóa siết, giúp bạn kiểm soát đối thủ ngay cả khi họ to khỏe hơn mình.</p><p>Khác với những môn võ thiên về đấm đá, Jiu-Jitsu đề cao kỹ thuật, tư duy chiến thuật và khả năng tận dụng đòn bẩy cơ thể thay vì chỉ dựa vào sức mạnh.</p>",
        tag_control: "Khống chế",
        tag_takedown: "Vật",
        tag_submission: "Khóa siết",
        pillar_fitness_title: "Fitness",
        pillar_fitness_note: "Năng lượng tiêu hao ước tính trong 60 phút tập BJJ.",
        pillar_fitness_desc: "Một buổi tập phối hợp vận động toàn thân, sức bền, sức mạnh, khả năng phối hợp cơ thể và trí óc",
        pillar_defense_title: "Defense",
        pillar_defense_desc1: "Học cách tạo lợi thế bằng đòn bẩy, vị trí và khả năng kiểm soát.",
        pillar_defense_desc2: "BJJ giúp bạn luyện tập các tình huống đối kháng có kiểm soát và cho bạn khả năng tự vệ dù bất lợi về mặt hình thể",
        pillar_mind_title: "Train Your Mind",
        pillar_mind_desc1: "Không chỉ tập thể lực, bạn còn liên tục phải quan sát và ra quyết định.",
        pillar_mind_desc2: "Đây là một hình thức luyện tập kết hợp vận động và giải quyết vấn đề cùng một lúc, đòi hỏi sự bình tĩnh tuyệt đối và đầu óc minh mẫn để đối phó với thử thách.",
        who_title: "Ai có thể tập<br>Jiu-Jitsu?",
        who_desc: "Mọi người, từ 5 tuổi trở lên, không phân biệt giới tính, độ tuổi hay thể trạng hay ngành nghề.",
        who_btn_trial: "Trải nghiệm miễn phí",
        tt_legend_gi: "BJJ có võ phục (Gi)",
        tt_legend_nogi: "BJJ không võ phục",
        tt_legend_str: "Đánh đứng",
        tt_legend_open: "Giao lưu",
        tt_poster_title: "THỜI KHÓA BIỂU",
        tt_poster_sub: 'WEEKLY SCHEDULE <span class="tt-arrow">↘</span>',
        tt_poster_foot: "LỊCH TẬP THAM KHẢO - CÓ THỂ THAY ĐỔI",
        m_monthly_title: "Đăng ký theo tháng",
        m_dropin_title: "Đăng ký drop-in",
        m_packs_title: "Đăng ký gói",
        m_packs_note: "*Áp dụng cho gói tập theo khung giờ",
        m_cta: "Đăng ký học viên",
        reg_tab_trial: "Tập thử 1 buổi",
        reg_tab_member: "Đăng ký học viên",
        reg_title: "Đăng ký<br><em>tập thử 1 buổi</em>",
        lbl_program: "Bộ môn",
        lbl_date: 'Chọn ngày <span class="date-format-hint">(DD/MM/YY)</span>',
        lbl_slot: "Khung giờ",
        lbl_name: "Họ và tên",
        lbl_phone: "Số điện thoại",
        lbl_email: "Email",
        btn_submit: "Gửi đăng ký",
        tk_title: "Cảm ơn bạn<br>đã đăng ký.",
        tk_msg: "Hãy screenshot lại trang này và đưa cho HLV đứng lớp.",
        tk_name: "Tên",
        tk_phone: "SĐT",
        tk_date: "Ngày tập",
        tk_class: "Lớp đã đăng ký",
        tk_dev: "Chế độ thử: đăng ký chưa được lưu vào Google Sheet.",
        tk_again: "Đăng ký cho người khác",
        addr_directions: "Chỉ đường",
        roles: [
          ["Nhân viên văn phòng", "office"], ["Giáo viên", "teacher"], ["Kỹ sư", "engineer"], ["Bác sĩ", "doctor"],
          ["Luật sư", "lawyer"], ["Công an", "police"], ["Quân nhân", "soldier"], ["Tài xế công nghệ", "rider"],
          ["Lập trình viên", "dev"], ["Tiểu thương", "shop"], ["Công nhân", "worker"], ["CEO", "ceo"],
          ["Founder", "founder"], ["Học sinh", "pupil"], ["Sinh viên", "student"], ["Và bạn", "you"]
        ],
        belts: { white: "Đai trắng", blue: "Đai xanh", purple: "Đai tím", brown: "Đai nâu", black: "Đai đen" },
        days: ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
        periods: { morning: "Sáng", noon: "Trưa", afternoon: "Chiều", evening: "Tối" },
        pricing: {
          monthly: {
            cols: [
              { name: "Theo khung giờ", desc: "Tập theo lớp 2-4-6 hoặc 3-5-7" },
              { name: "All-access", desc: "Tập tất cả lớp / khung giờ", hot: true }
            ],
            rows: [
              { who: "Người lớn 22+", prices: [1200000, 1800000] },
              { who: "Học sinh / sinh viên", note: "*Áp dụng cho ai có thẻ HSSV", prices: [900000, 1500000] }
            ]
          },
          dropin: [
            { name: "1-day pass", price: 350000, desc: "Tập bao nhiêu lớp / ngày cũng được" },
            { name: "1 lớp tập", price: 150000, desc: "Tham gia 01 lớp tập tùy chọn" }
          ],
          packs: [
            { name: "Gói 3 tháng | Người lớn", price: 3240000, desc: "Giảm 10% và tặng 1 áo thun SGS trị giá 159K", img: "/images/thumb-tee.jpg" },
            { name: "Gói 6 tháng | Người lớn", price: 6480000, desc: "Giảm 10% và tặng 1 áo rashguard SGS trị giá 375K", img: "/images/thumb-rash.jpg" }
          ],
          foot: "Bảng giá hiệu lực từ tháng 11/2026"
        },
        merch: [
          { name: "SGS Tee", sub: "Áo thun oversize", img: "/images/merch-tee.jpg", url: "" },
          { name: "SGS Genesis", sub: "Rashguard tay dài và tay ngắn", img: "/images/merch-rash.jpg", url: "" }
        ],
        coachAchLabelDefault: "Thành tích",
        coachAchLabels: { 0: "Ghi chú", 1: "Thành tích" },
        coachAch: {
          0: ["Một trong những người tập luyện BJJ đầu tiên ở Sài Gòn thập kỷ trước"],
          1: ["Cựu võ sĩ LION Championship (MMA 1-1-0)", "Huy chương bạc 🥈 nội dung full contact tại giải vô địch các câu lạc bộ jiujitsu quốc gia năm 2024"]
        },
        calendar: {
          months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
          weekdays: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
          quickDays: ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
          quickLabel: "Gợi ý ngày gần nhất:",
          infoStriking: "Chỉ mở lớp vào Thứ 3, Thứ 5, Thứ 7 (19:30 - 21:00)",
          infoBJJ: "Lớp BJJ mở từ Thứ 2 đến Thứ 7 (Chủ Nhật nghỉ)",
          tooltipSunday: "Chủ Nhật: Phòng tập nghỉ (OFF)",
          tooltipStrikingOff: "Không có lớp Striking (Chỉ mở T3, T5, T7)",
          tooltipPast: "Ngày đã qua",
          tooltipStrikingClass: "Lớp Striking: 19:30 - 21:00",
          tooltipBJJClass: "Có lớp BJJ",
          slotDefault: "Chọn khung giờ",
          slotSunday: "Chủ Nhật: Phòng tập nghỉ (OFF)",
          slotStrikingOff: "Ngày này không có lớp Striking (Chỉ mở T3, T5, T7)"
        },
        rules: {
          dateRequired: "Vui lòng chọn hoặc nhập ngày tập.",
          dateFormat: "Định dạng ngày phải là DD/MM/YY (VD: 27/10/26).",
          monthInvalid: "Tháng không hợp lệ (01–12).",
          dayInvalid: (m) => `Ngày không hợp lệ trong tháng ${m}.`,
          datePast: "Vui lòng chọn ngày hôm nay hoặc trong tương lai.",
          dateSunday: "Chủ Nhật phòng tập nghỉ (OFF). Vui lòng chọn ngày khác.",
          strikingDays: "Lớp Striking chỉ mở vào Thứ 3, Thứ 5, Thứ 7 (19:30 - 21:00).",
          slot: "Chọn một khung giờ.",
          name: "Nhập họ và tên.",
          phone: "Số điện thoại chưa đúng (VD: 0901234567).",
          email: "Email chưa đúng.",
          submitSending: "Đang gửi...",
          submitDefault: "Gửi đăng ký",
          submitError: "Chưa gửi được. Kiểm tra kết nối rồi thử lại."
        }
      },
      en: {
        nav_info: "Class Info",
        nav_merch: "Merchandise",
        nav_schedule: "Schedule & Pricing",
        nav_reg: "Register Now",
        hero_title: "<span>Forge Body</span>\n          <span>Sharpen <em>Mind</em></span>",
        hero_sub: "A martial art combining physical strength, technique, and strategic problem-solving.",
        hero_btn_reg: "Register Now",
        hero_btn_schedule: "View Schedule",
        what_title: "What is<br>Jiu-Jitsu?",
        what_desc: "<p>Brazilian Jiu-Jitsu (BJJ) is a grappling-based martial art focusing on control, takedowns, and submissions, enabling you to control an opponent even if they are larger and stronger.</p><p>Unlike striking disciplines, Jiu-Jitsu emphasizes technique, tactical thinking, and mechanical leverage over brute force.</p>",
        tag_control: "Control",
        tag_takedown: "Takedowns",
        tag_submission: "Submissions",
        pillar_fitness_title: "Fitness",
        pillar_fitness_note: "Estimated energy burn in a 60-minute BJJ session.",
        pillar_fitness_desc: "A full-body workout building cardiovascular endurance, functional strength, motor coordination, and mental stamina.",
        pillar_defense_title: "Defense",
        pillar_defense_desc1: "Learn how to gain tactical superiority through leverage, posture, and positional control.",
        pillar_defense_desc2: "BJJ equips you with live, controlled sparring experience and proven self-defense skills regardless of size differences.",
        pillar_mind_title: "Train Your Mind",
        pillar_mind_desc1: "Far beyond physical exertion, you must continuously observe, analyze, and adapt in real time.",
        pillar_mind_desc2: "Known as high-speed human chess, it tests your problem-solving capacity under pressure, demanding calm composure and mental sharpness.",
        who_title: "Who can train<br>Jiu-Jitsu?",
        who_desc: "Everyone from age 5 and up, regardless of gender, fitness background, or profession.",
        who_btn_trial: "Free Trial Session",
        tt_legend_gi: "BJJ with Gi (Kimono)",
        tt_legend_nogi: "BJJ No-Gi (Rashguard)",
        tt_legend_str: "Striking (Boxing/Kickboxing)",
        tt_legend_open: "Open Mat (Free Sparring)",
        tt_poster_title: "WEEKLY SCHEDULE",
        tt_poster_sub: 'CLASS TIMETABLE <span class="tt-arrow">↘</span>',
        tt_poster_foot: "REFERENCE SCHEDULE - SUBJECT TO CHANGE",
        m_monthly_title: "Monthly Memberships",
        m_dropin_title: "Drop-in Passes",
        m_packs_title: "Term Packages",
        m_packs_note: "*Applicable to fixed-schedule packages",
        m_cta: "Register as a member",
        reg_tab_trial: "Free trial class",
        reg_tab_member: "Become a member",
        reg_title: "Register for a<br><em>Free Trial Class</em>",
        lbl_program: "Discipline",
        lbl_date: 'Select Date <span class="date-format-hint">(DD/MM/YY)</span>',
        lbl_slot: "Time Slot",
        lbl_name: "Full Name",
        lbl_phone: "Phone Number",
        lbl_email: "Email Address",
        btn_submit: "Submit Registration",
        tk_title: "Thank You<br>For Registering!",
        tk_msg: "Please take a screenshot of this confirmation ticket and show it to our coaches upon arrival.",
        tk_name: "Name",
        tk_phone: "Phone",
        tk_date: "Date",
        tk_class: "Registered Class",
        tk_dev: "Test mode: registration not yet saved to Google Sheet.",
        tk_again: "Register for someone else",
        addr_directions: "Directions",
        roles: [
          ["Office Worker", "office"], ["Teacher", "teacher"], ["Engineer", "engineer"], ["Doctor", "doctor"],
          ["Lawyer", "lawyer"], ["Police Officer", "police"], ["Military", "soldier"], ["Ride-hail Driver", "rider"],
          ["Developer", "dev"], ["Shop Owner", "shop"], ["Worker", "worker"], ["CEO", "ceo"],
          ["Founder", "founder"], ["Pupil", "pupil"], ["Student", "student"], ["And You", "you"]
        ],
        belts: { white: "White Belt", blue: "Blue Belt", purple: "Purple Belt", brown: "Brown Belt", black: "Black Belt" },
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        periods: { morning: "Morning", noon: "Noon", afternoon: "Afternoon", evening: "Evening" },
        pricing: {
          monthly: {
            cols: [
              { name: "Fixed Schedule", desc: "Train Mon-Wed-Fri or Tue-Thu-Sat" },
              { name: "All-access", desc: "Unlimited classes & all time slots", hot: true }
            ],
            rows: [
              { who: "Adults 22+", prices: [1200000, 1800000] },
              { who: "Students", note: "*Valid Student ID required", prices: [900000, 1500000] }
            ]
          },
          dropin: [
            { name: "1-Day Pass", price: 350000, desc: "Unlimited classes for the whole day" },
            { name: "Single Class", price: 150000, desc: "Join any single class of your choice" }
          ],
          packs: [
            { name: "3-Month Pass | Adults", price: 3240000, desc: "10% off + free SGS T-shirt (worth 159K)", img: "/images/thumb-tee.jpg" },
            { name: "6-Month Pass | Adults", price: 6480000, desc: "10% off + free SGS Rashguard (worth 375K)", img: "/images/thumb-rash.jpg" }
          ],
          foot: "Pricing valid from November 2026"
        },
        merch: [
          { name: "SGS Tee", sub: "Oversized T-shirt", img: "/images/merch-tee.jpg", url: "" },
          { name: "SGS Genesis", sub: "Long & Short Sleeve Rashguard", img: "/images/merch-rash.jpg", url: "" }
        ],
        coachAchLabelDefault: "Achievements",
        coachAchLabels: { 0: "Note", 1: "Achievements" },
        coachAch: {
          0: ["One of the earliest BJJ practitioners in Saigon over a decade ago"],
          1: ["Former LION Championship fighter (MMA 1-1-0)", "Silver Medalist 🥈 Full Contact at 2024 National Jiu-Jitsu Clubs Championship"]
        },
        calendar: {
          months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          quickDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          quickLabel: "Suggested upcoming dates:",
          infoStriking: "Striking classes on Tue, Thu, Sat only (19:30 - 21:00)",
          infoBJJ: "BJJ classes run Mon to Sat (Closed on Sunday)",
          tooltipSunday: "Sunday: Academy closed (OFF)",
          tooltipStrikingOff: "No Striking class (Tue, Thu, Sat only)",
          tooltipPast: "Past date",
          tooltipStrikingClass: "Striking Class: 19:30 - 21:00",
          tooltipBJJClass: "BJJ Class available",
          slotDefault: "Select a time slot",
          slotSunday: "Sunday: Academy closed (OFF)",
          slotStrikingOff: "No Striking class on this day (Tue, Thu, Sat only)"
        },
        rules: {
          dateRequired: "Please select or enter a training date.",
          dateFormat: "Date format must be DD/MM/YY (e.g. 27/10/26).",
          monthInvalid: "Invalid month (01–12).",
          dayInvalid: (m) => `Invalid day for month ${m}.`,
          datePast: "Please select today or a future date.",
          dateSunday: "Sunday is gym rest day (OFF). Please select another date.",
          strikingDays: "Striking classes are held on Tue, Thu, Sat only (19:30 - 21:00).",
          slot: "Please select a time slot.",
          name: "Please enter your full name.",
          phone: "Invalid phone number (e.g. 0901234567).",
          email: "Invalid email address.",
          submitSending: "Submitting...",
          submitDefault: "Submit Registration",
          submitError: "Failed to submit. Please check your connection and try again."
        }
      }
    };

    const CONFIG = {
      endpoint: "https://script.google.com/macros/s/AKfycbwnw3IAtyxlG6oeiYb1vcygVnu05YtnXHU5FA_DroimnN_Iutd8J6CEc7FOXSSuxmOf/exec",
      address: {
        name: "Saigon Grappling Society",
        phone: "055 943 4418",
        email: "saigongrappling@gmail.com",
        line: "36 Đường A4, Phường Bảy Hiền, Tp Hồ Chí Minh",
        mapUrl: "https://maps.app.goo.gl/HM5DHnMpqVvZvkd87",
        mapQuery: "36 A4, Phường Bảy Hiền, Hồ Chí Minh"
      },
      coaches: [
        {
          name: "Chế Hoàng Huy",
          title: "Coach",
          disc: "BJJ",
          img: "/images/COACHES/Chế Hoàng Huy.jpg",
          link: "https://www.facebook.com/photo?fbid=122113327659498376&set=a.122108037897498376"
        },
        {
          name: "Tạ Quang Hải",
          title: "Coach",
          disc: "Striking",
          img: "/images/COACHES/Tạ Quang Hải.jpg",
          link: "https://www.facebook.com/photo?fbid=122113529673498376&set=a.122108037897498376"
        },
        {
          name: "Nguyễn Thành Luân",
          title: "Coach",
          disc: "BJJ",
          belt: "blue",
          img: "/images/COACHES/Nguyễn Thành Luân.jpg",
          link: "https://www.facebook.com/photo?fbid=122113950639498376&set=a.122108037897498376"
        },
        {
          name: "Nguyễn Thế Hùng",
          title: "Coach",
          disc: "BJJ",
          belt: "blue",
          img: "/images/COACHES/Nguyễn Thế Hùng.jpg",
          link: "https://www.facebook.com/photo?fbid=122114861301498376&set=a.122108037897498376"
        },
        {
          name: "Trần Khánh Huân",
          title: "Coach",
          disc: "BJJ",
          belt: "blue",
          img: "/images/COACHES/Trần Khánh Huân.jpg",
          link: "https://www.facebook.com/photo?fbid=122114368413498376&set=a.122108037897498376"
        }
      ],
      timetable: [
        { periodKey: "morning", time: "7:00 - 10:00", cells: [null, null, null, null, null, null] },
        { periodKey: "morning", time: "10:00 - 12:00", cells: ["nogi", "gi", "nogi", "gi", "nogi", "nogi"] },
        { periodKey: "noon", time: "12:00 - 14:00", cells: ["gn", "gn", "gn", "gn", "gn", null] },
        { periodKey: "afternoon", time: "14:00 - 15:00", cells: [null, null, null, null, null, null] },
        { periodKey: "afternoon", time: "15:00 - 17:00", cells: [null, null, null, null, null, "open"] },
        { periodKey: "evening", time: "18:00 - 19:15", note: "Fundamental", cells: ["nogi", "nogi", "gi", "nogi", "nogi", "gi"] },
        { periodKey: "evening", time: "19:30 - 21:00", note: "Competition", cells: ["nogi", "str", "gi", "str", "nogi", "str"] }
      ]
    };
    window.CONFIG = CONFIG;

    const $ = (s, r = document) => r.querySelector(s);
    const vnd = n => n.toLocaleString("en-US") + "<small>đ</small>";
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    /* ---- Ai có thể tập (Roles) ---- */
    const ICONS = { "office": "M3 8h18v11H3z M9 8V5.5h6V8 M3 13h18 M11 13h2v2h-2z", "teacher": "M3 4h18v11H3z M7 8h7 M7 11h4 M8 15l-2 5.5 M16 15l2 5.5 M12 15v5.5", "engineer": "M18.47 10.69 L20.53 10.89 L20.53 13.11 L18.47 13.31 L17.50 15.65 L18.82 17.24 L17.24 18.82 L15.65 17.50 L13.31 18.47 L13.11 20.53 L10.89 20.53 L10.69 18.47 L8.35 17.50 L6.76 18.82 L5.18 17.24 L6.50 15.65 L5.53 13.31 L3.47 13.11 L3.47 10.89 L5.53 10.69 L6.50 8.35 L5.18 6.76 L6.76 5.18 L8.35 6.50 L10.69 5.53 L10.89 3.47 L13.11 3.47 L13.31 5.53 L15.65 6.50 L17.24 5.18 L18.82 6.76 L17.50 8.35z M12 9.2a2.8 2.8 0 1 0 0 5.6a2.8 2.8 0 0 0 0-5.6z", "doctor": "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z", "lawyer": "M12 4v16 M7 20h10 M4 8h16 M4 8l-2.5 6.5a3 3 0 0 0 5.5 0z M20 8l-2.5 6.5a3 3 0 0 0 5.5 0z", "police": "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M12 8.5l1.2 2.4 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z", "soldier": "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z", "rider": "M2.5 5.5h7v5.5h-7z M2 17.5a3 3 0 1 0 6 0a3 3 0 1 0-6 0z M16 17.5a3 3 0 1 0 6 0a3 3 0 1 0-6 0z M5 14.5V11 M8 17.5h8 M7 11.5h7.5 M19 17.5l-2.3-8.5h-2.4", "dev": "M8 7l-5 5 5 5 M16 7l5 5-5 5 M14 5l-4 14", "shop": "M3 9l2-5h14l2 5 M3 9a3 3 0 0 0 6 0a3 3 0 0 0 6 0 M5 12v8h14v-8 M10 20v-5h4v5", "worker": "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z", "ceo": "M10 3h4l-1 3.2L14.8 19 12 21.5 9.2 19 11 6.2z", "founder": "M12 3c3 2 5 5 5 9l-2 3H9l-2-3c0-4 2-7 5-9z M9 15l-2 4 3-1 M15 15l2 4-3-1 M10.5 10a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0z", "student": "M2 9l10-5 10 5-10 5z M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5 M22 9v6", "pupil": "M9 6a3 3 0 0 1 6 0 M5.5 9a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z M9 15h6v4H9z M9.5 11.5h5", "you": "M12 5v14 M5 12h14" };
    function renderRoles() {
      const rolesContainer = $("#roles");
      if (!rolesContainer) return;
      rolesContainer.innerHTML = "";
      const t = I18N[currentLang];
      t.roles.forEach(([label, ic], i) => {
        const d = document.createElement("div");
        d.className = "role" + (ic === "you" ? " you" : "");
        d.style.setProperty("--i", i);
        d.innerHTML = `<div class="a"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[ic]}"/></svg><span>${label}</span></div>`;
        rolesContainer.appendChild(d);
      });
    }

    /* ---- Coaches carousel ---- */
    const BELT_COLORS = { white: "#F4F4F4", blue: "#1E5BC6", purple: "#6B3FA0", brown: "#6B4423", black: "#111" };
    function renderCoaches() {
      const track = $("#track");
      if (!track) return;
      track.innerHTML = "";
      const t = I18N[currentLang];
      CONFIG.coaches.forEach((c, i) => {
        const achList = t.coachAch[i] || [];
        const hasAch = achList.length > 0;
        const el = document.createElement(c.link ? "a" : "div");
        if (c.link) { el.href = c.link; el.target = "_blank"; el.rel = "noopener noreferrer"; }
        el.className = "coach" + (hasAch ? "" : " no-ach");
        el.tabIndex = 0;
        if (!c.link && hasAch) {
          el.setAttribute("role", "button");
          el.setAttribute("aria-expanded", "false");
        }
        el.setAttribute("aria-label", hasAch ? `${c.name}, ${c.title} ${c.disc}` : `${c.name}, ${c.title} ${c.disc}`);
        const beltName = c.belt ? (t.belts[c.belt] || "") : "";
        const belt = c.belt ? `<div class="belt"><i style="--bc:${BELT_COLORS[c.belt]}"></i>${beltName}</div>` : "";
        const imgSrc = c.img || `images/coach-${i + 1}.jpg`;
        const achLabel = (t.coachAchLabels && t.coachAchLabels[i]) || t.coachAchLabelDefault;
        const hintHtml = hasAch ? `<span class="hint">+</span>` : "";
        const achHtml = hasAch ? `<div class="ach"><span class="k">${esc(c.title)} · ${esc(c.disc)}</span><div class="nm">${esc(c.name)}</div><span class="k">${esc(achLabel)}</span><ul>${achList.map(a => `<li>${esc(a)}</li>`).join("")}</ul></div>` : "";
        el.innerHTML = `<img class="mk" src="/images/mono-white.png" alt=""><img class="ph" src="${encodeURI(imgSrc)}" onerror="this.src='${imgSrc}'; this.onerror=function(){this.remove();}" alt="${esc(c.name)}">${hintHtml}
      <div class="info"><span class="chip-role">${esc(c.title)} · ${esc(c.disc)}</span><h3>${esc(c.name)}</h3>${belt}</div>
      ${achHtml}`;
        if (!c.link && hasAch) {
          const toggle = () => { const o = el.classList.toggle("open"); el.setAttribute("aria-expanded", o); };
          el.addEventListener("click", toggle);
          el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
        }
        track.appendChild(el);
      });
    }

    const step = () => ($("#track") && $("#track").firstElementChild ? $("#track").firstElementChild.getBoundingClientRect().width + 14 : 300);
    if ($("#prev")) $("#prev").onclick = () => $("#track").scrollBy({ left: -step(), behavior: "smooth" });
    if ($("#next")) $("#next").onclick = () => $("#track").scrollBy({ left: step(), behavior: "smooth" });

    /* ---- Thời khóa biểu ---- */
    const TYPES = {
      gi: { label: "BJJ GI", cls: "gi", kind: "b" },
      nogi: { label: "BJJ NOGI", cls: "nogi", kind: "b" },
      gn: { label: "GI / NOGI", cls: "gn", kind: "b", sub: "FULL SPARRING", trial: false },
      nogi_sp: { label: "NOGI", cls: "nogi-sp", kind: "b", sub: "FULL SPARRING", trial: false },
      str: { label: "STRIKING", cls: "str", kind: "s" },
      open: { label: "OPEN MAT", cls: "open", kind: "o", sub: "GI / NOGI", trial: false }
    };
    const tag = k => {
      const item = TYPES[k];
      if (!item) return "";
      if (k === "open") {
        return `<div class="cell-open"><span class="open-title">${item.label}</span><span class="open-sub">${item.sub}</span></div>`;
      }
      return `<div class="cell-class ${item.cls}"><span class="c-title">${item.label}</span>` +
        (item.sub ? `<span class="c-sub">${item.sub}</span>` : "") +
        `</div>`;
    };

    function renderTimetable() {
      const ttGrid = $("#tt-grid");
      if (!ttGrid) return;
      const t = I18N[currentLang];
      let g = `<div class="tt-cell th th-time">TIME</div>` + t.days.map(d => `<div class="tt-cell th">${d.toUpperCase()}</div>`).join("");
      CONFIG.timetable.forEach(r => {
        g += `<div class="tt-cell tm"><span class="tm-time">${r.time}</span>${r.note ? `<span class="tm-note">${r.note}</span>` : ""}</div>` +
          r.cells.map(c => c ? `<div class="tt-cell has-class">${tag(c)}</div>` : `<div class="tt-cell cell-off">OFF</div>`).join("");
      });
      ttGrid.innerHTML = g;
    }

    /* ---- Membership (Pricing) ---- */
    function renderPricing() {
      const t = I18N[currentLang];
      const P = t.pricing;
      const matrix = $("#matrix");
      if (matrix) {
        matrix.innerHTML = `<div class="mh top-who"><svg class="diag-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="0" x2="100" y2="100" vector-effect="non-scaling-stroke" /></svg></div>` +
          P.monthly.cols.map(c => `<div class="mh ${c.hot ? "hot hot-col" : "std-col"}"><b>${c.name}</b><span>${c.desc}</span></div>`).join("") +
          P.monthly.rows.map(r => `<div class="who">${r.who}${r.note ? `<small>${r.note}</small>` : ""}</div>` + r.prices.map((p, pi) => `<div class="${P.monthly.cols[pi].hot ? "hot-col" : "std-col"}"><span class="price">${vnd(p)}</span></div>`).join("")).join("");
      }
      const dropin = $("#dropin");
      if (dropin) {
        dropin.innerHTML = P.dropin.map(d => `<div class="mcard"><div class="nm">${d.name}</div><div class="price">${vnd(d.price)}</div><div class="ds">${d.desc}</div></div>`).join("");
      }
      const packs = $("#packs");
      if (packs) {
        packs.innerHTML = P.packs.map(d => `<div class="mcard pack"><div class="tx"><div class="nm">${d.name}</div><div class="price">${vnd(d.price)}</div><div class="ds">${d.desc}</div></div><img src="${d.img}" alt=""></div>`).join("");
      }
      const mFoot = $("#m-foot");
      if (mFoot) mFoot.textContent = P.foot;
    }

    /* ---- Merchandise ---- */
    function renderMerch() {
      const merchContainer = $("#merch");
      if (!merchContainer) return;
      merchContainer.innerHTML = "";
      const t = I18N[currentLang];
      const viewText = currentLang === "vi" ? "Xem" : "View";
      t.merch.forEach(m => {
        const el = document.createElement(m.url ? "a" : "div");
        el.className = "tile";
        if (m.url) { el.href = m.url; el.target = "_blank"; el.rel = "noopener"; }
        el.innerHTML = `<img class="ph" src="${m.img}" alt="${m.name}" onerror="this.remove()"><div class="cap"><div><b>${m.name}</b><span>${m.sub}</span></div>${m.url ? `<span class="go">${viewText}</span>` : ""}</div>`;
        merchContainer.appendChild(el);
      });
    }

    /* ---- Set Language & Static String Updater ---- */
    function setLanguage(lang) {
      if (!I18N[lang]) return;
      currentLang = lang;
      try { localStorage.setItem("sgs_lang", lang); } catch (e) { /* storage bị chặn */ }
      document.documentElement.lang = lang;

      // Update button active state
      document.querySelectorAll(".lang-btn").forEach(btn => {
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      // Update static elements with data-i18n
      const t = I18N[lang];
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key] !== undefined) {
          el.innerHTML = t[key];
        }
      });

      // Update dynamic modules
      renderRoles();
      renderCoaches();
      renderTimetable();
      renderPricing();
      renderMerch();

      // Dispatch event for other modules (like chatbox)
      window.dispatchEvent(new CustomEvent("sgs_language_change", { detail: { lang } }));
    }

    // Bind language toggle buttons
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
    });

    /* ---- Address & Map ---- */
    const A = CONFIG.address, q = encodeURIComponent(A.mapQuery);
    const _fp = $("#fact-place"); if (_fp) _fp.textContent = A.line;
    if ($("#addr-name")) $("#addr-name").textContent = A.name;
    if ($("#addr-line")) $("#addr-line").textContent = A.line;
    if ($("#foot-addr")) $("#foot-addr").textContent = A.line;
    if ($("#addr-link")) $("#addr-link").href = A.mapUrl;
    if ($("#map")) $("#map").src = "https://www.google.com/maps?q=" + q + "&output=embed";

    // Khởi tạo ngôn ngữ + render mọi khối có mặt trên trang
    setLanguage(currentLang);

    /* ---- Background Audio: Tự động bật nhạc 1 lần khi người dùng tương tác ---- */
    let hasAudioStarted = false;
    try { if (sessionStorage.getItem("sgs_audio_played")) hasAudioStarted = true; } catch (e) { /* storage bị chặn */ }

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
          try { sessionStorage.setItem("sgs_audio_played", "1"); } catch (e) { /* bỏ qua */ }
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
    attachAutoPlayEvents();

const getLang = () => currentLang;
export { $, I18N, CONFIG, TYPES, esc, vnd, getLang };
