import React from "react";

const fw = { Light: 300, Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 };

/* ── Icons ───────────────────────────────────────────────────────────── */
const ICONS: Record<string, string> = {
  // X close (14×14)
  ico_0: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M0.530273 14.583L14.583 0.530273" stroke="black" stroke-width="1.5" stroke-linejoin="round"/><path d="M0.530273 0.530273L14.583 14.583" stroke="black" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  // multi-profile user circle (16×16)
  ico_1: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.36032 10.2152C6.14931 9.88133 5.9158 9.49908 5.57592 8.86429C5.48771 8.81413 5.15042 8.60138 5.04664 7.89654C4.99908 7.56444 5.13485 7.33007 5.21355 7.22456C5.21269 5.44387 6.42346 4.22272 8.00005 4.22272C9.57578 4.22272 10.7865 5.44387 10.7865 7.20035C10.7857 7.21591 10.7857 7.22456C10.8644 7.33007 11.0002 7.56444 10.9526 7.89654C10.8488 8.60138 10.5115 8.81413 10.4233 8.86429C10.0834 9.49908 9.84993 9.88133 9.63891 10.2152C9.39157 10.6061 9.34573 11.2971 9.80236 11.6179C10.0895 11.8186 11.3478 12.6843 12.3121 13.3485C11.1316 14.3024 9.63199 14.8766 8.00005 14.8766C6.36724 14.8766 4.86762 14.3024 3.68712 13.3485C4.4698 12.8097 5.94866 11.7909 6.19687 11.6179C6.6535 11.2971 6.60767 10.6061 6.36032 10.2152ZM8.00032 0C3.58847 0 0 3.58934 0 8.00032C0 12.4122 3.58847 16.0006 8.00032 16.0006C12.4113 16.0006 16.0006 12.4122 16.0006 8.00032C16.0006 3.58934 12.4113 0 8.00032 0Z" fill="#B7B7B7"/></svg>`,
  // small arrow right (8×8)
  ico_2: `<svg width="8" height="10" viewBox="0 0 9 10" fill="none"><path d="M4 0.866699L8 4.8667L4 8.8667" stroke="#B7B7B7" stroke-width="1.22565" stroke-linecap="square"/></svg>`,
  // search (16×16)
  ico_4: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7.6363" cy="7.34089" r="4.31818" stroke="#B7B7B7" stroke-width="1.35"/><path d="M11.5226 11.2272L13.2499 12.9545" stroke="#B7B7B7" stroke-width="1.35" stroke-linecap="square"/></svg>`,
  // chevron right / list arrow (7×11)
  ico_5: `<svg width="7" height="11" viewBox="0 0 7 11" fill="none"><path d="M0.919225 0.919225L5.16187 5.16187L0.919225 9.40451" stroke="#B7B7B7" stroke-width="1.3" stroke-linecap="square"/></svg>`,
  // QR code (22×22)
  ico_6: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5195 3.77051H17.3846C17.7886 3.77051 18.1161 4.09794 18.1161 4.50182V6.86334V8.06399H16.9154H16.7196V9.56467H15.2209V11.0654H16.7196V12.4502H15.2209V13.9509H16.7196V15.1515H15.2188V17.0437H12.5195V15.1515H13.7181V13.9509H12.5195V12.4502H15.2188V11.0654H12.5195V9.56467H15.2188V8.06399H15.023H14.6173H13.8224V4.97116H12.5195V3.77051ZM15.0231 4.97116V6.86334H16.9155V4.97116H15.0231Z" fill="black"/><path d="M18.1161 15.1515H16.9154V17.0437H15.2209V18.2442H17.3847C17.7886 18.2442 18.1161 17.9168 18.1161 17.5128V15.1515H18.1161Z" fill="black"/><path d="M12.5195 17.0436H11.0188V18.2442H12.5195V17.0436V17.0436Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.3174 12.4501H11.0187H11.0189V13.9509H12.5197V15.1515H11.0189V17.0436H9.81826V13.9509H8.31749V15.1515V17.0436V18.2442H6.81673H4.61544C4.21147 18.2442 3.88403 17.9168 3.88403 17.5128V13.9509H4.81876H5.08459H6.81663H8.3174V12.4501ZM5.08459 15.1515V17.0436H6.81663V15.1515H5.08459Z" fill="black"/><path d="M12.5195 4.97113H11.0188V6.86331H9.81812V8.06396H11.0188V9.56464H12.5195V4.97113V4.97113Z" fill="black"/><path d="M12.5195 11.0654H11.0188V12.4501H12.5195V11.0654V11.0654Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.3174 3.77051H6.81663H4.61544C4.21156 3.77051 3.88403 4.09794 3.88403 4.50192V8.06408H4.81876H5.08459H6.81663H8.3174V9.56467V11.0654H11.0187V9.56467H9.81817V8.06399H8.3174V6.86343V4.97125V3.77051ZM5.08468 6.86334V4.97116H6.81673V6.86334H5.08468Z" fill="black"/><path d="M18.1159 9.56464H16.7195V11.0654H18.1159V9.56464V9.56464Z" fill="black"/><path d="M18.1159 12.4501H16.7195V13.9509H18.1159V12.4501V12.4501Z" fill="black"/><path d="M6.81663 9.56464H5.08477H3.88422H3.88403V11.0654H3.88422V12.4501H5.08477V11.0654H6.81663V9.56464V9.56464Z" fill="black"/><path d="M8.31742 11.0654H6.81665V12.4501H8.31742V11.0654V11.0654Z" fill="black"/><path d="M11.0188 3.77051H9.81812V4.97116H11.0188V3.77051V3.77051Z" fill="black"/></svg>`,
  // shield + checkmark (21×21)
  ico_7: `<svg width="21" height="21" viewBox="0 0 21 21" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5171 18.3101C7.27874 16.7053 3.81812 14.1066 3.81812 11.6251V3.91458C4.78149 3.6337 7.31637 3.0632 10.5355 3.0632C13.7537 3.0632 16.2886 3.6337 17.2301 3.8787L17.252 11.6251C17.252 14.1066 13.7914 16.7053 10.553 18.3101L10.5355 18.3153C10.5311 18.3153 10.5241 18.3136 10.5171 18.3101Z" stroke="black" stroke-width="1.8" stroke-linejoin="round"/><path d="M13.1891 8.35266L9.96555 11.5762L7.91455 9.52516" stroke="black" stroke-width="1.8"/></svg>`,
  // folder + backup arrows (27×22)
  ico_8: `<svg width="27" height="22" viewBox="0 0 27 22" fill="none"><g clip-path="url(#cp8)"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.48534 18.5626C6.2184 18.5626 6 18.3442 6 18.0772V4.92278C6 4.65584 6.2184 4.43744 6.48534 4.43744H11.3022L13.3735 6.51392H20.5147C20.7816 6.51392 21 6.73232 21 6.99925V18.0772C21 18.3442 20.7816 18.5626 20.5147 18.5626H6.48534Z" stroke="black" stroke-width="1.8"/><mask style="mask-type:alpha" maskUnits="userSpaceOnUse" x="8" y="7" width="11" height="11"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.2779 7.91557L8.88843 9.89557L10.8679 17.2832L18.2574 15.3032L16.2779 7.91557ZM9.5686 10.8205L16.827 15.5329L17.577 14.3782L10.3186 9.66583L9.5686 10.8205Z" fill="#D9D9D9"/></mask><g mask="url(#m8)"><ellipse cx="13.5758" cy="12.6007" rx="2.67755" ry="2.67688" transform="rotate(-15 13.5758 12.6007)" stroke="black" stroke-width="1.6" stroke-linecap="square"/></g><path d="M16.3968 14.2583C16.3568 14.3122 16.2761 14.3122 16.2361 14.2583L14.905 12.4613C14.8561 12.3953 14.9033 12.3018 14.9854 12.3018L17.6478 12.3016C17.7299 12.3016 17.777 12.3952 17.7281 12.4612L16.3968 14.2583Z" fill="black" stroke="black" stroke-width="0.2"/><path d="M10.5889 11.025C10.6289 10.971 10.7097 10.971 10.7496 11.025L12.0808 12.822C12.1297 12.888 12.0826 12.9815 12.0004 12.9815L9.33809 12.9815C9.25595 12.9815 9.20884 12.888 9.25773 12.822L10.5889 11.025Z" fill="black" stroke="black" stroke-width="0.2"/></g><defs><clipPath id="cp8"><rect width="27" height="22" fill="white"/></clipPath></defs></svg>`,
  // card / receipt icon (17×15) — アカウント
  ico_9: `<svg width="17" height="15" viewBox="0 0 17 15" fill="none"><path d="M8.85107 6.16174H12.8655" stroke="black" stroke-width="1.8"/><path d="M8.85107 8.5719H12.8655" stroke="black" stroke-width="1.8"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0.899902 13.0968V1.33752C0.899902 1.09594 1.09581 0.900024 1.3374 0.900024H15.1624C15.404 0.900024 15.5999 1.09594 15.5999 1.33752V13.0968C15.5999 13.3384 15.404 13.5343 15.1624 13.5343H1.3374C1.09581 13.5343 0.899902 13.3384 0.899902 13.0968Z" stroke="black" stroke-width="1.8"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.72412 6.11096L6.72412 8.62886H4.2071L4.2071 6.11096L6.72412 6.11096Z" stroke="black" stroke-width="1.8"/></svg>`,
  // padlock (15×18) — プライバシー管理
  ico_10: `<svg width="15" height="18" viewBox="0 0 15 18" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.1499 16.153H1.7749C1.29164 16.153 0.899902 15.7613 0.899902 15.278V6.77502C0.899902 6.29176 1.29164 5.90002 1.7749 5.90002H13.1499C13.6332 5.90002 14.0249 6.29176 14.0249 6.77502V15.278C14.0249 15.7613 13.6332 16.153 13.1499 16.153Z" stroke="black" stroke-width="1.8"/><path d="M10.702 5.89776V4.17891C10.702 2.36801 9.23392 0.900024 7.42302 0.900024C5.61212 0.900024 4.14404 2.36801 4.14404 4.17891V5.89776" stroke="black" stroke-width="1.8"/><path d="M7.46234 9.09143C6.8928 9.09143 6.43115 9.55308 6.43115 10.1226C6.43115 10.6922 6.8928 11.1538 7.46234 11.1538C8.03188 11.1538 8.49353 10.6922 8.49353 10.1226C8.49353 9.55308 8.03188 9.09143 7.46234 9.09143Z" fill="black" stroke="black" stroke-width="0.5"/><path d="M7.4624 10.775V12.9189" stroke="black" stroke-width="1.8"/></svg>`,
  // shield + person (16×18) — 年齢確認
  ico_11: `<svg width="16" height="18" viewBox="0 0 16 18" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.9179 16.8729C4.52532 15.1918 0.899902 12.4693 0.899902 9.86961V1.79194C1.90915 1.49769 4.56474 0.900024 7.93715 0.900024C11.3087 0.900024 13.9642 1.49769 14.9497 1.75436L14.9735 9.86961C14.9735 12.4693 11.3481 15.1918 7.95549 16.8729L7.93715 16.8784C7.93165 16.8784 7.92524 16.8766 7.9179 16.8729Z" stroke="black" stroke-width="1.8" stroke-linejoin="round"/><path d="M12.7184 13.4355C11.7578 12.7746 10.0711 11.6141 9.73376 11.3776C9.2791 11.0576 9.32401 10.3692 9.56968 9.97965C9.78143 9.6469 10.0133 9.26648 10.3525 8.6349C10.4396 8.58357 10.776 8.37273 10.8787 7.67057C10.9273 7.33873 10.7916 7.10498 10.7128 7.00048C10.7137 6.97573 10.7137 6.97573 5.16051 6.97573C5.16143 6.99223 5.16143 7.00048 5.0826 7.10498C4.94693 7.33873 4.99551 7.67057C5.09818 8.37273 5.43551 8.58357 5.52168 8.6349C5.86176 9.26648 6.09276 9.6469 6.30451 9.97965C6.55018 10.3692 6.59509 11.0576 6.14043 11.3776C5.80309 11.6141 4.11643 12.7746 3.15576 13.4355" stroke="black" stroke-width="1.8"/></svg>`,
  // Apple Watch (15×20)
  ico_12: `<svg width="15" height="20" viewBox="0 0 15 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.01872 4.16956C1.84782 4.16956 0.899902 5.11747 0.899902 6.28837V13.5107C0.899902 14.6806 1.84782 15.6285 3.01775 15.6285H11.3521C12.522 15.6285 13.4699 14.6806 13.4699 13.5107V6.28741C13.4699 5.11747 12.522 4.16956 11.3521 4.16956H3.01872Z" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.4134 3.96965L10.5659 0.900024H3.80019L2.95459 3.96965" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.95459 15.8297L3.80115 18.8993H10.5679L11.4134 15.8297" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.58177 8.38831L6.62797 11.3411L4.74951 9.46171" stroke="black" stroke-width="1.7"/></svg>`,
  // battery (25×12)
  ico_13: `<svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect opacity="0.35" x="0.5" y="0.5" width="21" height="10.3333" rx="2.16667" stroke="black"/><path opacity="0.4" d="M23 3.66663V7.66663C23.8047 7.32785 24.328 6.53976 24.328 5.66663C24.328 4.79349 23.8047 4.0054 23 3.66663Z" fill="black"/><rect x="2" y="2" width="18" height="7.33333" rx="1.33333" fill="black"/></svg>`,
  // wifi (16×11)
  ico_14: `<svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.44825 8.42669C6.72891 7.34442 8.60509 7.34442 9.88575 8.42669C9.9501 8.4849 9.98749 8.56751 9.98926 8.65423C9.99092 8.74086 9.95644 8.82399 9.89454 8.8847L7.88965 10.9072C7.83087 10.9666 7.7506 10.9999 7.667 10.9999C7.5834 10.9999 7.50311 10.9666 7.44434 10.9072L5.43848 8.8847C5.37688 8.824 5.34303 8.74065 5.34473 8.65423C5.34657 8.56755 5.3839 8.48485 5.44825 8.42669ZM2.77247 5.72942C5.5316 3.16504 9.80432 3.1651 12.5635 5.72942C12.6258 5.78956 12.6612 5.87238 12.6621 5.95892C12.6629 6.04526 12.6293 6.12811 12.5684 6.18938L11.4092 7.36028C11.2897 7.47959 11.0971 7.48144 10.9746 7.36517C10.0685 6.5454 8.88933 6.09165 7.667 6.09173C6.4456 6.09225 5.26773 6.5461 4.36231 7.36517C4.23976 7.48151 4.04623 7.47979 3.92676 7.36028L2.76856 6.18938C2.70748 6.12818 2.67313 6.04533 2.67383 5.95892C2.67465 5.87244 2.71026 5.78954 2.77247 5.72942ZM0.0966847 3.03899C4.3285 -1.01307 11.0044 -1.01292 15.2363 3.03899C15.2976 3.09919 15.3325 3.18166 15.333 3.26751C15.3334 3.35327 15.2998 3.43615 15.2393 3.497L14.0791 4.66692C13.9595 4.78702 13.765 4.7881 13.6436 4.66985C12.0312 3.13845 9.89158 2.28421 7.667 2.28411C5.44211 2.28412 3.30199 3.13822 1.68946 4.66985C1.56818 4.78822 1.37441 4.78703 1.25489 4.66692L0.0937551 3.497C0.0333244 3.43612 -0.000475824 3.35324 5.06194e-06 3.26751C0.000570337 3.18166 0.0353826 3.09915 0.0966847 3.03899Z" fill="black"/></svg>`,
  // cellular bars (17×11)
  ico_15: `<svg width="17" height="11" viewBox="0 0 17 11" fill="none"><path d="M2 6.66699C2.55228 6.66699 3 7.11471 3 7.66699V9.66699C2.99982 10.2191 2.55218 10.667 2 10.667H1C0.447824 10.667 0.000175969 10.2191 0 9.66699V7.66699C0 7.11471 0.447715 6.66699 1 6.66699H2ZM6.66699 4.66699C7.21913 4.66717 7.66699 5.11482 7.66699 5.66699V9.66699C7.66682 10.219 7.21902 10.6668 6.66699 10.667H5.66699C5.11482 10.667 4.66717 10.2191 4.66699 9.66699V5.66699C4.66699 5.11471 5.11471 4.66699 5.66699 4.66699H6.66699ZM11.333 2.33301C11.8852 2.33301 12.3328 2.78087 12.333 3.33301V9.66699C12.3328 10.2191 11.8852 10.667 11.333 10.667H10.333C9.78098 10.6668 9.33318 10.219 9.33301 9.66699V3.33301C9.33318 2.78098 9.78098 2.33318 10.333 2.33301H11.333ZM16 0C16.5523 0 17 0.447715 17 1V9.66699C16.9998 10.2191 16.5522 10.667 16 10.667H15C14.4478 10.667 14.0002 10.2191 14 9.66699V1C14 0.447715 14.4477 0 15 0H16Z" fill="black"/></svg>`,

  /* ── Handcrafted icons for ショップ section ───── */
  // スタンプ — smiley sticker circle
  STAMP: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="10.5" r="7.5" stroke="black" stroke-width="1.8"/><circle cx="8.8" cy="9.5" r="1.1" fill="black"/><circle cx="13.2" cy="9.5" r="1.1" fill="black"/><path d="M8.2 13Q11 15.5 13.8 13" stroke="black" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  // 着せかえ — sparkle / customize
  THEME: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2v4M11 16v4M2 11h4M16 11h4M4.93 4.93l2.83 2.83M14.24 14.24l2.83 2.83M4.93 17.07l2.83-2.83M14.24 7.76l2.83-2.83" stroke="black" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  // 着信音・呼出音 — music note
  RINGTONE: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M8.5 16.5V6.5L18.5 4.5V14.5" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="16.5" r="2.5" stroke="black" stroke-width="1.8"/><circle cx="16.5" cy="14.5" r="2.5" stroke="black" stroke-width="1.8"/></svg>`,
  // フォント — letter A
  FONT: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4.5 18L11 4L17.5 18" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 13.5H15.5" stroke="black" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  // アプリアイコン — phone outline
  APPICON: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4.5" y="1.5" width="13" height="19" rx="2.5" stroke="black" stroke-width="1.8"/><circle cx="11" cy="17.5" r="1.2" fill="black"/><path d="M8.5 4.5h5" stroke="black" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  // コイン — coin circle
  COIN: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8.5" stroke="black" stroke-width="1.8"/><path d="M11 7.5V14.5" stroke="black" stroke-width="1.8" stroke-linecap="round"/><path d="M8.5 9.5C8.5 8.67 9.17 8 10 8h2c.83 0 1.5.67 1.5 1.5S12.83 11 12 11h-2" stroke="black" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  // bell — 通知
  BELL: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2.5V1.5" stroke="black" stroke-width="1.8" stroke-linecap="round"/><path d="M11 2.5C7.96 2.5 5.5 4.96 5.5 8V13.5L3.5 15.5H18.5L16.5 13.5V8C16.5 4.96 14.04 2.5 11 2.5Z" stroke="black" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 16.5C9 17.6 9.9 18.5 11 18.5C12.1 18.5 13 17.6 13 16.5" stroke="black" stroke-width="1.8"/></svg>`,
  // photo / image — 写真と動画
  PHOTO: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="4.5" width="18" height="13" rx="2" stroke="black" stroke-width="1.8"/><circle cx="7.5" cy="9.5" r="1.5" stroke="black" stroke-width="1.5"/><path d="M2 15L7 10.5L10.5 14L13.5 11L20 15.5" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // chat bubble with dots — トーク
  CHAT: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 11C3 6.58 6.58 3 11 3C15.42 3 19 6.58 19 11C19 15.42 15.42 19 11 19C9.9 19 8.85 18.77 7.9 18.36L3.5 19.5L4.64 15.1C3.6 13.97 3 12.56 3 11Z" stroke="black" stroke-width="1.8" stroke-linejoin="round"/><circle cx="8" cy="11" r="1.1" fill="black"/><circle cx="11" cy="11" r="1.1" fill="black"/><circle cx="14" cy="11" r="1.1" fill="black"/></svg>`,
};

const Ico = ({ id, style }: { id: string; style?: React.CSSProperties }) => (
  <span
    style={{ display: "inline-flex", flexShrink: 0, lineHeight: 0, ...style }}
    dangerouslySetInnerHTML={{ __html: ICONS[id] ?? "" }}
  />
);

/* ── Reusable pieces ─────────────────────────────────────────────────── */

const RowDivider = () => (
  <div style={{ height: 1, background: "#F5F5F5", marginLeft: 55 }} />
);

const SectionHeader = ({ title }: { title: string }) => (
  <>
    <div style={{ height: 8, background: "#F5F5F5" }} />
    <div
      style={{
        height: 38,
        background: "#F5F5F5",
        display: "flex",
        alignItems: "flex-end",
        paddingLeft: 20,
        paddingBottom: 7,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: fw.Medium, color: "#555555" }}>
        {title}
      </span>
    </div>
  </>
);

interface RowProps {
  iconId: string;
  label: string;
  labelColor?: string;
  value?: string;
  isNew?: boolean;
  rowHeight?: number;
}

const Row = ({
  iconId,
  label,
  labelColor = "#000000",
  value,
  isNew,
  rowHeight = 50,
}: RowProps) => (
  <div
    style={{
      height: rowHeight,
      display: "flex",
      alignItems: "center",
      paddingLeft: 20,
      paddingRight: 20,
      background: "#FFFFFF",
    }}
  >
    {/* Icon container — fixed 22×22 to center any icon */}
    <div
      style={{
        width: 22,
        height: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Ico id={iconId} />
    </div>

    {/* Label + optional "New" badge */}
    <div style={{ display: "flex", alignItems: "center", flex: 1, marginLeft: 13 }}>
      <span style={{ fontSize: 14, fontWeight: fw.Bold, color: labelColor, lineHeight: "21px" }}>
        {label}
      </span>
      {isNew && (
        <div
          style={{
            marginLeft: 5,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#06C755",
            border: "1.5px solid #FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 9, fontWeight: fw.Bold, color: "#FFFFFF" }}>N</span>
        </div>
      )}
    </div>

    {/* Optional status value */}
    {value && (
      <span style={{ fontSize: 13, fontWeight: fw.Bold, color: "#B7B7B7", marginRight: 8 }}>
        {value}
      </span>
    )}

    {/* Right chevron */}
    <Ico id="ico_5" />
  </div>
);

/* ── Main component ──────────────────────────────────────────────────── */

export default function Setting() {
  return (
    <div
      style={{
        width: 375,
        height: 812,
        background: "#FFFFFF",
        overflow: "hidden",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans', sans-serif",
        position: "relative",
      }}
    >
      <style>{`.s-scroll::-webkit-scrollbar{display:none}.s-scroll{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      {/* ── Status bar (fixed overlay) ──────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 375,
          height: 44,
          background: "#FFFFFF",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Time */}
        <span
          style={{
            position: "absolute",
            left: 20,
            top: 11,
            fontSize: 15,
            fontWeight: fw.SemiBold,
            color: "#000000",
            lineHeight: "18px",
          }}
        >
          9:41
        </span>
        {/* Right icons: cellular + wifi + battery */}
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 17,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Ico id="ico_15" />
          <Ico id="ico_14" />
          <Ico id="ico_13" />
        </div>
      </div>

      {/* ── Scrollable content (starts below status bar) ────────────── */}
      <div
        className="s-scroll"
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "auto",
        }}
      >
        {/* ── Navigation header (設定) ─────────────────────────────── */}
        <div
          style={{
            height: 44,
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: fw.SemiBold, color: "#000000" }}>設定</span>
          <div
            style={{
              position: "absolute",
              right: 16,
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ico id="ico_0" />
          </div>
        </div>

        {/* 2 px gap */}
        <div style={{ height: 2, background: "#FFFFFF" }} />

        {/* ── Search bar (y:90) ───────────────────────────────────── */}
        <div style={{ height: 50, background: "#FFFFFF", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 16,
              top: 6,
              width: 343,
              height: 38,
              background: "#F5F5F5",
              borderRadius: 5,
            }}
          >
            <div style={{ position: "absolute", left: 11, top: 11, lineHeight: 0 }}>
              <Ico id="ico_4" />
            </div>
            <span
              style={{
                position: "absolute",
                left: 30,
                top: 11,
                fontSize: 13,
                fontWeight: fw.Medium,
                color: "#B7B7B7",
                lineHeight: "16px",
              }}
            >
              Search
            </span>
          </div>
        </div>

        {/* 24 px gap */}
        <div style={{ height: 24, background: "#FFFFFF" }} />

        {/* ── Profile row (y:164) ─────────────────────────────────── */}
        <div
          style={{
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingRight: 20,
            background: "#FFFFFF",
          }}
        >
          {/* Left: avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                overflow: "hidden",
                border: "0.5px solid rgba(0,0,0,0.05)",
                flexShrink: 0,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=84&fit=crop"
                alt="あおい"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span style={{ fontSize: 16, fontWeight: fw.Bold, color: "#000000" }}>あおい</span>
          </div>
          {/* Sub-profile button */}
          <div
            style={{
              width: 133,
              height: 28,
              border: "1px solid #EFEFEF",
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
              paddingLeft: 8,
              paddingRight: 8,
              gap: 5,
              boxSizing: "border-box",
            }}
          >
            <Ico id="ico_1" />
            <span
              style={{
                fontSize: 10,
                fontWeight: fw.Medium,
                color: "#777777",
                flex: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              サブプロフィール
            </span>
            <Ico id="ico_2" />
          </div>
        </div>

        {/* 23 px gap */}
        <div style={{ height: 23, background: "#FFFFFF" }} />

        {/* ── Account center (y:229) ──────────────────────────────── */}
        <div style={{ height: 85, background: "#FFFFFF", position: "relative" }}>
          {/* Title row (y:12 within section) */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 20,
              right: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 18,
            }}
          >
            <span style={{ fontSize: 17, fontWeight: fw.SemiBold, color: "#000000" }}>
              account center
            </span>
            <Ico id="ico_5" />
          </div>
          {/* Description (y:39 within section) */}
          <p
            style={{
              position: "absolute",
              top: 39,
              left: 20,
              right: 20,
              margin: 0,
              fontSize: 12,
              fontWeight: fw.Light,
              color: "#777777",
              lineHeight: "18px",
            }}
          >
            LINEとYahoo! JAPANのアカウント連携や連携解除、プロフィール情報の管理などが行えます。
          </p>
        </div>

        {/* Divider + white gap */}
        <div style={{ height: 14, background: "#FFFFFF" }} />
        <div style={{ height: 1, background: "#F5F5F5", marginLeft: 20, marginRight: 20 }} />
        <div style={{ height: 28, background: "#FFFFFF" }} />

        {/* ════════════════════════════════════════════════════════════
            SECTION: 個人情報
        ════════════════════════════════════════════════════════════ */}
        <SectionHeader title="個人情報" />
        <Row iconId="ico_9" label="アカウント" />
        <RowDivider />
        <Row iconId="ico_10" label="プライバシー管理" />
        <RowDivider />
        <Row iconId="ico_11" label="年齢確認" />
        <RowDivider />
        <Row iconId="ico_12" label="Apple Watch" labelColor="#000000" />

        {/* ════════════════════════════════════════════════════════════
            SECTION: バックアップ・引き継ぎ
        ════════════════════════════════════════════════════════════ */}
        <SectionHeader title="バックアップ・引き継ぎ" />
        <Row iconId="ico_8" label="トークのバックアップ" />
        <RowDivider />
        <Row iconId="ico_6" label="かんたん引き継ぎQRコード" />
        <RowDivider />
        <Row iconId="ico_7" label="アカウント引き継ぎオプション" />

        {/* ════════════════════════════════════════════════════════════
            SECTION: ショップ
        ════════════════════════════════════════════════════════════ */}
        <SectionHeader title="ショップ" />
        <Row iconId="STAMP" label="スタンプ" isNew />
        <RowDivider />
        <Row iconId="THEME" label="着せかえ" />
        <RowDivider />
        <Row iconId="RINGTONE" label="着信音・呼出音" rowHeight={49} />
        <RowDivider />
        <Row iconId="FONT" label="フォント" />
        <RowDivider />
        <Row iconId="APPICON" label="アプリアイコン" />
        <RowDivider />
        <Row iconId="COIN" label="コイン" />

        {/* ════════════════════════════════════════════════════════════
            SECTION: 一般
        ════════════════════════════════════════════════════════════ */}
        <SectionHeader title="一般" />
        <Row iconId="BELL" label="通知" value="オン" />
        <RowDivider />
        <Row iconId="PHOTO" label="写真と動画" />
        <RowDivider />
        <Row iconId="CHAT" label="トーク" />

        {/* ── Home indicator ─────────────────────────────────────── */}
        <div style={{ height: 8, background: "#F5F5F5" }} />
        <div
          style={{
            height: 34,
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 134,
              height: 5,
              background: "#000000",
              borderRadius: 100,
              opacity: 0.18,
            }}
          />
        </div>
      </div>
    </div>
  );
}
