// ChatTab — from: 1_line (Figma rootLabel)
// Self-contained for preview HMR.
// Source corpus: design-ready-corpus/screens/chattab (375×812 LINE chat-list screen)

import React from "react";

const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Apple SD Gothic Neo", sans-serif';
const fw = { Regular: 400, Medium: 500, Semibold: 600, Bold: 700, Heavy: 900 } as const;

const ICONS: Record<string, string> = {
  battery: `<svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.35" x="0.5" y="0.5" width="21" height="10.3333" rx="2.16667" stroke="#000"/><path opacity="0.4" d="M23 3.66663V7.66663C23.8047 7.32785 24.328 6.53976 24.328 5.66663C24.328 4.79349 23.8047 4.0054 23 3.66663Z" fill="#000"/><rect x="2" y="2" width="18" height="7.33333" rx="1.33333" fill="#000"/></svg>`,
  wifi: `<svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.44825 8.42669C6.72891 7.34442 8.60509 7.34442 9.88575 8.42669C9.9501 8.4849 9.98749 8.56751 9.98926 8.65423C9.99092 8.74086 9.95644 8.82399 9.89454 8.8847L7.88965 10.9072C7.83087 10.9666 7.7506 10.9999 7.667 10.9999C7.5834 10.9999 7.50311 10.9666 7.44434 10.9072L5.43848 8.8847C5.37688 8.824 5.34303 8.74065 5.34473 8.65423C5.34657 8.56755 5.3839 8.48485 5.44825 8.42669ZM2.77247 5.72942C5.5316 3.16504 9.80432 3.1651 12.5635 5.72942C12.6258 5.78956 12.6612 5.87238 12.6621 5.95892C12.6629 6.04526 12.6293 6.12811 12.5684 6.18938L11.4092 7.36028C11.2897 7.47959 11.0971 7.48144 10.9746 7.36517C10.0685 6.5454 8.88933 6.09165 7.667 6.09173C6.4456 6.09225 5.26773 6.5461 4.36231 7.36517C4.23976 7.48151 4.04623 7.47979 3.92676 7.36028L2.76856 6.18938C2.70748 6.12818 2.67313 6.04533 2.67383 5.95892C2.67465 5.87244 2.71026 5.78954 2.77247 5.72942ZM0.0966847 3.03899C4.3285 -1.01307 11.0044 -1.01292 15.2363 3.03899C15.2976 3.09919 15.3325 3.18166 15.333 3.26751C15.3334 3.35327 15.2998 3.43615 15.2393 3.497L14.0791 4.66692C13.9595 4.78702 13.765 4.7881 13.6436 4.66985C12.0312 3.13845 9.89158 2.28421 7.667 2.28411C5.44211 2.28412 3.30199 3.13822 1.68946 4.66985C1.56818 4.78822 1.37441 4.78703 1.25489 4.66692L0.0937551 3.497C0.0333244 3.43612 -0.000475824 3.35324 5.06194e-06 3.26751C0.000570337 3.18166 0.0353826 3.09915 0.0966847 3.03899Z" fill="#000"/></svg>`,
  cellular: `<svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.66699C2.55228 6.66699 3 7.11471 3 7.66699V9.66699C2.99982 10.2191 2.55218 10.667 2 10.667H1C0.447824 10.667 0.000175969 10.2191 0 9.66699V7.66699C0 7.11471 0.447715 6.66699 1 6.66699H2ZM6.66699 4.66699C7.21913 4.66717 7.66699 5.11482 7.66699 5.66699V9.66699C7.66682 10.219 7.21902 10.6668 6.66699 10.667H5.66699C5.11482 10.667 4.66717 10.2191 4.66699 9.66699V5.66699C4.66699 5.11471 5.11471 4.66699 5.66699 4.66699H6.66699ZM11.333 2.33301C11.8852 2.33301 12.3328 2.78087 12.333 3.33301V9.66699C12.3328 10.2191 11.8852 10.667 11.333 10.667H10.333C9.78098 10.6668 9.33318 10.219 9.33301 9.66699V3.33301C9.33318 2.78098 9.78098 2.33318 10.333 2.33301H11.333ZM16 0C16.5523 0 17 0.447715 17 1V9.66699C16.9998 10.2191 16.5522 10.667 16 10.667H15C14.4478 10.667 14.0002 10.2191 14 9.66699V1C14 0.447715 14.4477 0 15 0H16Z" fill="#000"/></svg>`,
  // Top-nav icons
  aiFriends: `<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.57858 8.33593C9.10135 8.23684 8.82529 7.62281 8.96199 6.96447C9.09868 6.30612 9.59637 5.85276 10.0736 5.95185C10.5508 6.05094 10.8269 6.66496 10.6902 7.32331C10.5535 7.98165 10.0558 8.43502 9.57858 8.33593Z" fill="#000"/><path d="M4.58711 8.6358C4.2045 8.53221 4.03678 7.92209 4.21251 7.27307C4.38824 6.62405 4.84086 6.1819 5.22347 6.28549C5.60608 6.38909 5.77379 6.9992 5.59806 7.64822C5.42234 8.29724 4.96971 8.73939 4.58711 8.6358Z" fill="#000"/><path d="M5.33457 10.6878C5.31503 10.5443 5.4145 10.423 5.55628 10.3934C6.00611 10.2992 7.08867 10.1266 8.64682 10.225C8.77352 10.233 8.86792 10.3419 8.84644 10.467C8.7605 10.9675 8.4191 12.1337 7.09874 12.2295C5.80845 12.3236 5.40916 11.2359 5.33457 10.6878Z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.4794 0.0846911C16.5621 -0.0469739 16.7861 -0.0250856 16.8222 0.150121L16.914 0.527074C17.4386 2.38018 18.9562 3.80278 20.8642 4.19211L20.9296 4.2175C21.0421 4.28858 21.0423 4.46395 20.9296 4.53489L20.8642 4.56028C18.956 4.94964 17.4385 6.37202 16.914 8.22532L16.8222 8.60227L16.7733 8.84153C16.747 8.97037 16.5821 8.98624 16.5214 8.88938L16.5028 8.84153L16.454 8.60227C16.0647 6.69431 14.642 5.17672 12.789 4.65207L12.412 4.56028C12.212 4.51914 12.212 4.23328 12.412 4.19211L12.789 4.10032C14.6421 3.57571 16.0646 2.05808 16.454 0.150121L16.4794 0.0846911ZM16.6425 3.24875C16.3894 3.72834 15.998 4.11963 15.5185 4.37278C15.9977 4.62575 16.3894 5.01671 16.6425 5.49582C16.8955 5.01687 17.2866 4.62578 17.7655 4.37278C17.2864 4.11964 16.8955 3.728 16.6425 3.24875Z" fill="#000"/><path d="M10.9626 1.81713C10.4405 1.71686 9.90137 1.66437 9.35001 1.66437C4.65559 1.66437 0.850006 5.46995 0.850006 10.1644C0.850006 14.8588 4.65559 18.6644 9.35001 18.6644C13.6934 18.6644 17.276 15.4066 17.7874 11.2012" stroke="#000" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  openchat: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.85 17V5.672C16.85 3.00451 14.5643 0.849998 11.863 0.849998H5.83702C3.03182 0.849998 0.850006 3.00451 0.850006 5.672V11.4174C0.850006 14.0849 3.13572 16.2394 5.83702 16.2394H11.9669" stroke="#000" stroke-width="1.7"/></svg>`,
  plus: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 8.75H17.5" stroke="#000" stroke-width="1.7"/><path d="M8.75 0V17.5" stroke="#000" stroke-width="1.7"/></svg>`,
  // Searchbar
  searchSm: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8504 11.85L8.85586 8.85549" stroke="#B7B7B7" stroke-width="1.7"/><circle cx="5.61884" cy="5.61884" r="4.76884" stroke="#B7B7B7" stroke-width="1.7"/></svg>`,
  qr: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><mask id="qrm" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18"><path d="M18 18H0V0H18V18ZM5.50293 5.5H1.00293V12.5H5.50293V17H12.5029V12.5H17.0029V5.5H12.5029V1H5.50293V5.5Z" fill="#fff"/></mask></defs><g mask="url(#qrm)"><rect x="2.25" y="2.25" width="13.5" height="13.5" rx="1.04" stroke="#777" stroke-width="1.7"/></g><path d="M2.25 9H15.75" stroke="#777" stroke-width="1.7" stroke-linecap="square"/></svg>`,
  // Selected "Chats" pill text — uses Figma-rendered SVG
  chatsPillText: `<svg width="58" height="19" viewBox="0 0 58 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.02344 15.2031C2.64062 15.2031 0.539062 13.0391 0.539062 9.35938V9.35156C0.539062 5.67188 2.65625 3.52344 6.02344 3.52344C8.96875 3.52344 11.0078 5.41406 11.1094 7.9375V8.01562H8.35156L8.33594 7.89844C8.15625 6.72656 7.33594 5.89844 6.02344 5.89844C4.45312 5.89844 3.46094 7.1875 3.46094 9.34375V9.35156C3.46094 11.5312 4.46094 12.8281 6.03125 12.8281C7.27344 12.8281 8.15625 12.0547 8.35156 10.7969L8.36719 10.7109H11.125L11.1172 10.7969C11.0156 13.3203 8.95312 15.2031 6.02344 15.2031ZM12.3359 15V3.72656H15.1094V8.02344H15.1641C15.5859 6.91406 16.4688 6.3125 17.75 6.3125C19.6094 6.3125 20.7031 7.54688 20.7031 9.59375V15H17.9297V10.1875C17.9297 9.17969 17.4453 8.57031 16.5312 8.57031C15.6562 8.57031 15.1094 9.24219 15.1094 10.1797V15H12.3359ZM24.5781 15.1172C22.8672 15.1172 21.7031 14.0312 21.7031 12.5469V12.5391C21.7031 10.9375 22.9375 10.0391 25.1328 9.89062L27.0703 9.76562V9.34375C27.0703 8.72656 26.6719 8.34375 25.8984 8.34375C25.1562 8.34375 24.7188 8.6875 24.625 9.125L24.6094 9.20312H22.1172L22.125 9.10156C22.2578 7.44531 23.6719 6.3125 26.0391 6.3125C28.3281 6.3125 29.8359 7.46875 29.8359 9.19531V15H27.0703V13.7969H27.0156C26.5312 14.6328 25.6875 15.1172 24.5781 15.1172ZM24.4219 12.3672C24.4219 12.8984 24.8672 13.2031 25.5469 13.2031C26.4375 13.2031 27.0703 12.6719 27.0703 11.9531V11.3828L25.5781 11.4844C24.8047 11.5312 24.4219 11.8516 24.4219 12.3594V12.3672ZM34.8594 15.1797C32.7969 15.1797 31.8594 14.4375 31.8594 12.5156V8.52344H30.7031V6.49219H31.8594V4.53125H34.6328V6.49219H36.1562V8.52344H34.6328V12.1406C34.6328 12.875 34.9609 13.1484 35.6406 13.1484C35.8594 13.1484 36 13.1328 36.1562 13.1094V15.0781C35.8516 15.1328 35.4375 15.1797 34.8594 15.1797ZM41.0469 15.1797C38.5156 15.1797 37.1562 14.0625 36.9688 12.4062L36.9609 12.3359H39.6484L39.6641 12.3984C39.7969 12.9766 40.2344 13.3125 41.0469 13.3125C41.7812 13.3125 42.2266 13.0469 42.2266 12.6094V12.6016C42.2266 12.2188 41.9531 12.0078 41.1953 11.8516L39.6953 11.5547C38.0312 11.2344 37.1641 10.3672 37.1641 9.07031V9.0625C37.1641 7.36719 38.6172 6.3125 40.9453 6.3125C43.4062 6.3125 44.7109 7.57031 44.7344 9.09375L44.7422 9.15625H42.2109L42.2031 9.09375C42.1406 8.59375 41.7109 8.17969 40.9453 8.17969C40.2656 8.17969 39.8281 8.46094 39.8281 8.90625V8.91406C39.8281 9.28125 40.0859 9.5 40.8906 9.66406L42.3906 9.96094C44.1953 10.3203 44.9766 11.0234 44.9766 12.2969V12.3047C44.9766 14.0625 43.3828 15.1797 41.0469 15.1797Z" fill="#fff"/><path fill-rule="evenodd" clip-rule="evenodd" d="M53.179 11.3448C53.4384 11.7058 53.9754 11.7058 54.2348 11.3448L56.6742 7.94986C56.9832 7.51983 56.6759 6.92056 56.1463 6.92056H51.2675C50.7379 6.92056 50.4306 7.51983 50.7396 7.94986L53.179 11.3448Z" fill="#fff"/></svg>`,
  // Bottom nav
  navHome: `<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.1748 2.07837C8.6479 1.65923 9.35988 1.65928 9.83301 2.07837L17.2588 8.65747V17.0198C17.2588 17.71 16.6989 18.2696 16.0088 18.2698H2C1.30966 18.2698 0.750022 17.7101 0.75 17.0198V8.65649L8.1748 2.07837Z" stroke="#111" stroke-width="1.5"/><path d="M9 12.0107V18.6964" stroke="#111" stroke-width="1.5"/></svg>`,
  navChats: `<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.83594 0C15.2813 0 19.4619 3.79793 19.4619 8.6748C19.4619 13.4649 15.5991 17.3485 10.8301 17.3486L8.4502 17.3594C7.76793 17.3594 7.30323 17.709 6.9668 18.3564C6.83718 18.606 6.73837 18.8804 6.66992 19.1553C6.64558 19.253 6.62849 19.3365 6.61719 19.3994L6.58398 19.5977C6.45505 20.1142 5.82202 20.3432 5.38965 19.9951C5.25637 19.8878 5.05498 19.7138 4.80371 19.4775L4.53613 19.2207C3.912 18.6096 3.28886 17.9121 2.70605 17.1387C1.01996 14.9011 0.000103898 12.4841 0 9.96387C0 4.27207 4.26459 2.14485e-05 9.83594 0ZM6.23535 8.13379C5.64001 8.13392 5.15724 8.61752 5.15723 9.21289C5.15723 9.80828 5.64 10.2919 6.23535 10.292C6.83195 10.292 7.31445 9.80836 7.31445 9.21289C7.31444 8.61744 6.83194 8.13379 6.23535 8.13379ZM9.86914 8.13379C9.27368 8.13379 8.79006 8.6163 8.79004 9.21289C8.79004 9.80836 9.27367 10.292 9.86914 10.292C10.4646 10.292 10.9492 9.80834 10.9492 9.21289C10.9492 8.61632 10.4646 8.13381 9.86914 8.13379ZM13.5049 8.13379C12.9094 8.13379 12.4258 8.6163 12.4258 9.21289C12.4258 9.80836 12.9094 10.292 13.5049 10.292C14.1003 10.2919 14.583 9.80831 14.583 9.21289C14.583 8.61635 14.1003 8.13386 13.5049 8.13379Z" fill="#111"/></svg>`,
  navVoom: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.81743 10.0384L6.79743 11.7484C5.43743 12.4384 4.78743 13.7384 4.78743 14.9984V17.4584C4.74743 19.9884 7.55743 21.5384 9.76743 20.2284L18.8974 15.0984C21.0274 13.8984 21.0274 10.8284 18.8974 9.61845L9.81743 4.49845C7.53743 3.12845 4.78743 4.76845 4.78743 7.15845V10.5284C4.78743 11.5484 5.83743 12.2385 6.79743 11.7385L9.81743 10.0384Z" stroke="#111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  navNews: `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 0.75H15C15.6904 0.75 16.25 1.30964 16.25 2V16.0039C16.25 16.6943 15.6904 17.2539 15 17.2539H2C1.30964 17.2539 0.75 16.6943 0.75 16.0039V2C0.75 1.30965 1.30964 0.75 2 0.75Z" stroke="#111" stroke-width="1.5"/><path d="M5.52295 6.02551H11.4771" stroke="#111" stroke-width="1.5"/><path d="M5.52295 8.9787H11.4771" stroke="#111" stroke-width="1.5"/><path d="M5.52295 11.9787H11.4771" stroke="#111" stroke-width="1.5"/></svg>`,
  navWallet: `<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C17.1046 0 18 0.89543 18 2V14.1191C17.9997 15.2235 17.1044 16.1191 16 16.1191H2C0.895593 16.1191 0.00026384 15.2235 0 14.1191V2C0 0.89543 0.89543 0 2 0H16ZM2 4.61914C1.75454 4.61914 1.55015 4.79605 1.50781 5.0293L1.5 5.11914V14.1191C1.50023 14.3644 1.67706 14.569 1.91016 14.6113L2 14.6191H16C16.2453 14.6191 16.4497 14.442 16.4922 14.209L16.5 14.1191V5.11914C16.5 4.87371 16.323 4.66932 16.0898 4.62695L16 4.61914H2ZM2 1.5C1.75454 1.5 1.55015 1.67691 1.50781 1.91016L1.5 2V3.18359C1.64697 3.14412 1.82048 3.11914 2 3.11914H16C16.1792 3.11914 16.3523 3.14428 16.5176 3.18848C16.5117 3.18691 16.5059 3.18511 16.5 3.18359V2C16.5 1.75454 16.3231 1.55015 16.0898 1.50781L16 1.5H2Z" fill="#111"/><circle cx="13.0106" cy="9.11865" r="1.2652" fill="#111"/></svg>`,
  // Row indicators
  // ico_3 — circle with down-chevron (despite its filename "mute-badge")
  muteBadge: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="12.5" stroke="#EFEFEF"/><path d="M9 11.5L13.5 16L18 11.5" stroke="#111" stroke-width="1.5"/></svg>`,
  // ico_4 — pin badge (20×20 with 2px white stroke + blue disc + white pushpin)
  pinBadge: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="18" height="18" rx="9" fill="#4270ED" stroke="#fff" stroke-width="2"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1412 8.1412L12.1014 10.1014L10.6776 13.4544C10.5529 13.748 10.1708 13.8223 9.94522 13.5967L6.64593 10.2974C6.42036 10.0719 6.49462 9.68971 6.78824 9.56502L10.1412 8.1412Z" fill="#fff"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.65271 8.65271L11.6109 10.6109L12.8367 10.2655C13.1015 10.191 13.1882 9.85899 12.9937 9.66448L10.5991 7.26987C10.4046 7.07535 10.0726 7.16203 9.99802 7.42682L9.65271 8.65271Z" fill="#fff"/><path d="M10 10L6.67253 13.3275" stroke="#fff" stroke-width="0.9"/></svg>`,
  // ico_7 — filled grey pencil + underline (draft message indicator)
  draftPencil: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.11785L10.1056 2.43005C10.3623 2.18844 10.7627 2.18844 11.0194 2.43005L11.7655 3.13223C12.0451 3.39546 12.0451 3.83993 11.7655 4.10315L4.71875 10.7355H3L3 9.11785Z" fill="#909090" stroke="#909090" stroke-width="1.13333" stroke-linejoin="round"/><path d="M3 13L14 13" stroke="#909090" stroke-width="1.13333" stroke-linecap="square"/></svg>`,
  // ico_14 — group call pill (white bg + green border + active call indicator)
  groupCallBadge: `<svg width="26" height="17" viewBox="0 0 26 17" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="25" height="16" rx="8" fill="#fff" stroke="#06C755"/><path d="M16.7564 11.7436C16.4111 12.0889 15.9704 12.3375 15.4838 12.2969C14.6978 12.2314 13.3742 11.8742 11.9298 10.4298C10.4854 8.98543 10.1283 7.66184 10.0627 6.87584C10.0221 6.38928 10.2708 5.94852 10.616 5.60327L10.9688 5.2505C11.2382 4.98107 11.6804 4.99946 11.9265 5.29033L12.8224 6.34914C13.012 6.57324 12.9982 6.90528 12.7906 7.11286L12.2368 7.66667C12.1885 7.71498 12.1665 7.78306 12.1885 7.84777C12.2557 8.04571 12.4741 8.51798 13.1579 9.20175C13.8417 9.88553 14.3139 10.104 14.5119 10.1712C14.5766 10.1931 14.6447 10.1711 14.693 10.1228L15.2468 9.569C15.4544 9.36142 15.7864 9.34761 16.0105 9.53723L17.0693 10.4331C17.3602 10.6793 17.3786 11.1214 17.1091 11.3909L16.7564 11.7436Z" fill="#06C755" stroke="#06C755" stroke-width="0.4"/><circle opacity="0.5" cx="14.5" cy="5" r="0.5" fill="#06C755"/><circle cx="16.5" cy="5" r="0.5" fill="#06C755"/></svg>`,
  // ico_15 — grey phone handset (subtitle prefix)
  callIcon: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.9777 9.5923C9.5634 10.0066 9.03449 10.305 8.45061 10.2563C7.50741 10.1776 5.9191 9.74901 4.18583 8.01574C2.45256 6.28247 2.02398 4.69416 1.94529 3.75096C1.89658 3.16708 2.19498 2.63817 2.60927 2.22388L3.0326 1.80055C3.35591 1.47724 3.8865 1.49931 4.18185 1.84835L5.25694 3.11892C5.48449 3.38784 5.46791 3.78629 5.21882 4.03538L4.55425 4.69995C4.49627 4.75793 4.46988 4.83962 4.49623 4.91727C4.57684 5.15481 4.83898 5.72153 5.65951 6.54206C6.48004 7.36259 7.04676 7.62473 7.2843 7.70534C7.36195 7.73169 7.44364 7.7053 7.50162 7.64732L8.16619 6.98275C8.41528 6.73366 8.81373 6.71708 9.08265 6.94463L10.3532 8.01972C10.7023 8.31507 10.7243 8.84566 10.401 9.16897L9.9777 9.5923Z" fill="#777" stroke="#777" stroke-width="0.5"/></svg>`,
  // ico_0 — candle flame + blue candle body
  birthdayCandle: `<svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.30262 4.16667C6.42283 4.01109 6.67715 4.01109 6.79736 4.16667L8.59452 6.49253C9.75237 7.99101 8.56905 10.05 6.55 10.05C4.53096 10.05 3.34763 7.99102 4.50547 6.49254L6.30262 4.16667Z" fill="#fff"/><path d="M4.05 11.8341C4.05 11.4011 4.40106 11.05 4.83413 11.05H7.26587C7.69893 11.05 8.05 11.4011 8.05 11.8341V16.05H4.05V11.8341Z" fill="#7FB1F6"/><path d="M4.05 12.5L8.49444 14.1667" stroke="#F1ECE4" stroke-width="1.05556"/><path d="M4.05 14.5L8.49444 16.1667" stroke="#F1ECE4" stroke-width="1.05556"/></svg>`,
  // ico_1 — cake body (pink tiers + cream icing wave)
  birthdayBody: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13.5C1 13.2239 1.22386 13 1.5 13H24.5175C24.7937 13 25.0175 13.2239 25.0175 13.5V15.4147C25.0175 16.5193 24.1221 17.4147 23.0175 17.4147H3C1.89543 17.4147 1 16.5193 1 15.4147V13.5Z" fill="#FF6888"/><path d="M1 9.8C1 9.35817 1.35817 9 1.8 9H24.8667C25.3085 9 25.6667 9.35817 25.6667 9.8V11.4314C25.6667 11.8732 25.3085 12.2314 24.8667 12.2314H1.8C1.35817 12.2314 1 11.8732 1 11.4314Z" fill="#B1304B"/><path d="M1 4H25.0175V8.6048C25.0175 8.88094 24.7937 9.1048 24.5175 9.1048H1.5C1.22386 9.1048 1 8.88094 1 8.6048V4Z" fill="#FF6888"/><path d="M23.3333 0L2.66664 0.000241C1.19389 0.000257 0 1.19416 0 2.66691V4.65818C0 4.84046 0.012996 5.02283 0.0688522 5.19634C0.246542 5.74834 0.83233 6.97292 2.53247 6.97292C4.72727 6.97292 4.72727 4.93207 7.5974 4.93207C10.4675 4.93207 10.1299 6.97292 13 6.97292C15.8701 6.97292 15.8701 4.93207 18.4026 4.93207C20.9351 4.93207 21.2727 6.97292 23.4675 6.97292C25.1677 6.97292 25.7535 5.74834 25.9311 5.19634C25.987 5.02283 26 4.84046 26 4.65818V2.66669C26 1.19392 24.8061 0 23.3333 0Z" fill="url(#cakeGrad)"/><defs><linearGradient id="cakeGrad" x1="11.6" y1="0" x2="11.6" y2="9" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="0.32" stop-color="#FFEFDD"/><stop offset="1" stop-color="#FFCA9B"/></linearGradient></defs></svg>`,
  // ico_2 — confetti decorations
  birthdayDeco: `<svg width="41" height="19" viewBox="0 0 41 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.5273 11.2612C25.3119 11.3801 25.0458 11.3453 24.8666 11.1749L23.7698 10.1319C23.5238 9.89798 23.5751 9.48801 23.8709 9.32485C24.8947 8.75996 25.767 7.94911 26.4119 6.96283L26.4951 6.83555C26.6226 6.64063 26.8918 6.6089 27.0601 6.76895L28.3059 7.95369C28.496 8.13446 28.5298 8.42835 28.3859 8.6485C27.6903 9.71233 26.7494 10.5869 25.6451 11.1962L25.5273 11.2612Z" fill="#FF7BD1"/><path d="M38.5095 1.85887C38.6994 1.85612 38.8615 1.99863 38.8862 2.19013L38.9648 2.79833C38.9772 2.89427 39.0251 2.98187 39.0988 3.04328L39.5976 3.45899C39.8071 3.63361 39.7707 3.96923 39.529 4.09228L39.4657 4.12449C39.3136 4.20188 39.2325 4.37403 39.2683 4.54325L39.2856 4.62533C39.3506 4.93225 39.0423 5.18147 38.7625 5.04831L38.4492 4.8992C38.3317 4.84331 38.1943 4.85319 38.086 4.92532L37.8263 5.09833C37.6468 5.21795 37.4049 5.15913 37.2974 4.96971L36.9206 4.30582C36.8784 4.23153 36.8128 4.17385 36.7344 4.14215L36.034 3.85884C35.8342 3.77801 35.742 3.54308 35.8325 3.34515L35.9633 3.05888C36.0179 2.93954 36.0077 2.79983 35.9363 2.6897L35.746 2.39592C35.576 2.13358 35.7741 1.78746 36.0821 1.80848L36.1645 1.8141C36.3343 1.82569 36.4901 1.71918 36.5435 1.55503L36.5657 1.48669C36.6505 1.22568 36.9719 1.14067 37.1721 1.32627L37.6486 1.76813C37.719 1.8334 37.8111 1.86897 37.9063 1.86759L38.5095 1.85887Z" fill="#FF7BB6"/><path d="M3.13259 9.22705C3.34564 9.41183 3.65257 9.43657 3.89403 9.28843L5.39733 8.36612C5.66394 8.20255 5.69625 7.8237 5.461 7.61967C4.3807 6.68275 3.53715 5.47785 3.01379 4.13658C2.91658 3.88744 2.62001 3.78433 2.39261 3.92385L0.82163 4.88768C0.565504 5.04482 0.457951 5.36588 0.56744 5.64648C1.09269 6.99261 1.93355 8.18715 3.01776 9.12746L3.13259 9.22705Z" fill="#B897FE"/><path d="M36.4576 17.9739C36.6273 18.045 36.8223 18.0109 36.9594 17.8863L38.3767 16.598C38.6058 16.3897 38.5423 16.0099 38.2585 15.8912C36.8239 15.2909 35.6729 14.1513 35.045 12.709L34.9919 12.5869C34.8715 12.3104 34.5206 12.2339 34.2985 12.4358L32.8733 13.7313C32.7172 13.8732 32.6697 14.1031 32.7543 14.2975C33.4765 15.9564 34.8074 17.2835 36.4576 17.9739Z" fill="#829FFF"/><path d="M9.97043 12.5876C10.1624 12.5548 10.3508 12.667 10.4164 12.8534L10.632 13.4661C10.665 13.5596 10.7305 13.638 10.8163 13.6862L11.412 14.0213C11.6686 14.1656 11.692 14.53 11.4558 14.7033C11.3033 14.8151 11.2502 15.0215 11.3278 15.1965C11.4667 15.5094 11.186 15.8451 10.8599 15.7532L10.5531 15.6667C10.4193 15.6291 10.2764 15.664 10.1752 15.7592L9.96005 15.9615C9.79579 16.116 9.53712 16.102 9.38779 15.9305L8.84678 15.3093C8.78997 15.244 8.71412 15.1988 8.63039 15.1803L7.83301 15.0039C7.61292 14.9553 7.47448 14.7326 7.52674 14.5114L7.59519 14.2217C7.62738 14.0854 7.58752 13.9415 7.48983 13.8413L7.26566 13.6113C7.02748 13.3669 7.17835 12.9538 7.51468 12.9241C7.70277 12.9074 7.85389 12.7595 7.87533 12.5695C7.90852 12.2753 8.23259 12.118 8.48181 12.2751L9.06042 12.6398C9.14375 12.6923 9.243 12.7122 9.33936 12.6957L9.97043 12.5876Z" fill="#829FFF"/></svg>`,
  // ico_16 — Keep profile (green disc with white bookmark)
  keepIcon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#06C755"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 27.1209L29.8069 30.4355V16.7978H18.1931V30.4355L24 27.1209ZM16.9988 33.1069C16.8258 33.2056 16.6072 33.1423 16.5106 32.9654C16.4808 32.9107 16.4651 32.8492 16.4651 32.7866V16.5371C16.4651 15.7267 17.1077 15.0698 17.9003 15.0698H30.0997C30.8923 15.0698 31.5349 15.7267 31.5349 16.5371V32.7866C31.5349 32.9892 31.3742 33.1534 31.1761 33.1534C31.1148 33.1534 31.0546 33.1374 31.0012 33.1069L24 29.1105L16.9988 33.1069Z" fill="#fff"/></svg>`,
  // ico_8 — grey ! badge (right area for muted/exclamation state)
  exclaimBadge: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#B7B7B7"/><path d="M12.2915 15C11.5782 15 11 15.5515 11 16.2319C11 16.9123 11.5782 17.4638 12.2915 17.4638C13.0048 17.4638 13.583 16.9123 13.583 16.2319C13.583 15.5515 13.0048 15 12.2915 15Z" fill="#fff"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.0245 7.6856C10.8576 6.80766 11.5647 6 12.5 6C13.4353 6 14.1424 6.80766 13.9755 7.6856L12.8854 13.4204C12.8516 13.5981 12.6894 13.7273 12.5 13.7273C12.3106 13.7273 12.1484 13.5981 12.1146 13.4204L11.0245 7.6856Z" fill="#fff"/></svg>`,
  // ico_17 — green disc with white "N" letter (NEW indicator on Keep right area)
  newBadge: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#06C755"/><path d="M9.91013 16.0605V10.3906H10.0291L14.431 16.0605H16.0833V7H14.1732V12.6448H14.0542L9.66558 7H8V16.0605H9.91013Z" fill="#fff"/></svg>`,
  filterGroups: `<svg width="54" height="18" viewBox="0 0 54 18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="6" stroke="#111" stroke-width="1.4"/><circle cx="18" cy="9" r="6" stroke="#111" stroke-width="1.4" fill="#fff"/><circle cx="27" cy="9" r="6" stroke="#111" stroke-width="1.4" fill="#fff"/><text x="36" y="13" font-family="sans-serif" font-size="13" font-weight="600" fill="#111">Groups</text></svg>`,
  // SMC_01_01 ico_0 — AD info "i" icon (15×15, #555)
  adInfo: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.125 7.5625C2.125 10.5607 4.56366 13 7.56187 13C10.5601 13 13 10.5607 13 7.5625C13 4.56429 10.5601 2.125 7.56187 2.125C4.56366 2.125 2.125 4.56429 2.125 7.5625" stroke="#555" stroke-width="1.03"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.60642 6.62476C6.60642 6.54256 6.67281 6.47681 6.755 6.47681L7.91838 6.47807C8.17381 6.49261 8.37677 6.70569 8.37677 6.96428C8.37677 7.00285 8.37108 7.03826 8.36349 7.07303L7.94746 8.63967L7.59782 10.0609C7.59086 10.0868 7.5877 10.1146 7.5877 10.1437C7.5877 10.3031 7.69139 10.439 7.83555 10.4858C7.87096 10.4978 7.90889 10.5041 7.94746 10.5041H8.17128C8.25411 10.5041 8.31987 10.5711 8.31987 10.6533C8.31987 10.7349 8.25411 10.8 8.17128 10.8H7.00854C6.75311 10.7848 6.55078 10.5718 6.55078 10.3132C6.55078 10.2752 6.55521 10.2386 6.56406 10.2044L6.94721 8.63967L7.32973 7.21719C7.33542 7.19064 7.33922 7.16282 7.33922 7.13373C7.33922 6.9744 7.23553 6.8391 7.09137 6.79231C7.05533 6.77966 7.01866 6.77334 6.97883 6.77334H6.755C6.67281 6.77334 6.60642 6.70695 6.60642 6.62476Z" fill="#555"/><circle cx="8.118" cy="5.038" r="0.628" fill="#555"/></svg>`,
  // SMC_01_01 ico_2 — Ellipse 2984 (11×11 viewBox, displayed 9×9)
  bannerOval: `<svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="5.2" cy="5.2" r="4.7" stroke="#B7B7B7"/></svg>`,
  // SMC_01_01 ico_3 — Vector 64744 diagonal (8×8 viewBox, displayed 6×6)
  bannerSlash: `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.353516 6.83627L6.83627 0.353516" stroke="#B7B7B7"/></svg>`,
};

const Icon: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: ICONS[name] ?? "" }} />
);

// ── Story-ring gradient (Aimee, Meru) ──────────────────────────────────────
const storyRing: React.CSSProperties = {
  background: "conic-gradient(from 180deg, #20A1FF 0%, #00E5BF 25%, #00E75F 50%, #20BDFF 75%, #5855FF 100%)",
  padding: 2.5,
  borderRadius: "50%",
};

// ── Avatar with optional 58×58 story ring (gradient or static) + pin badge ──
// Tree spec: photo 48×48; ring 58×58 at (-5,-5); pin 20×20 at (34,30) — overflows.
type AvatarProps = { img?: string; bg?: string; ring?: "gradient" | "static" | null; pin?: boolean; children?: React.ReactNode };
const Avatar: React.FC<AvatarProps> = ({ img, bg = "#E5E5E5", ring = null, pin = false, children }) => (
  <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
    {ring === "gradient" && (
      <div
        style={{
          position: "absolute", left: -5, top: -5, width: 58, height: 58, borderRadius: "50%",
          background: "conic-gradient(from 180deg, #20A1FF, #00E5BF, #00E75F, #20BDFF, #5855FF, #20A1FF)",
          WebkitMask: "radial-gradient(circle, transparent 26.5px, #000 26.5px)",
          mask: "radial-gradient(circle, transparent 26.5px, #000 26.5px)",
        }}
      />
    )}
    {ring === "static" && (
      <div
        style={{
          position: "absolute", left: -5, top: -5, width: 58, height: 58, borderRadius: "50%",
          border: "2.5px solid #DFDFDF", boxSizing: "border-box",
        }}
      />
    )}
    <div
      style={{
        width: 48, height: 48, borderRadius: "50%",
        background: img ? `${bg} url(${img}) center/cover no-repeat` : bg,
        position: "relative",
      }}
    >
      {children}
    </div>
    {pin && <Icon name="pinBadge" style={{ position: "absolute", left: 30, top: 30, width: 20, height: 20 }} />}
  </div>
);

// ── Unread count badge ──────────────────────────────────────────────────────
const UnreadBadge: React.FC<{ count: string }> = ({ count }) => (
  <div style={{ minWidth: 21, height: 21, padding: "0 7px", borderRadius: "50px", background: "#06C755", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: fw.Bold, color: "#fff", lineHeight: 1, boxSizing: "border-box" }}>{count}</div>
);

// ── Chat row (avatar + middle col + right col) ──────────────────────────────
type RowProps = {
  avatar: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  right?: React.ReactNode;
  divider?: boolean;
};
const ChatRow: React.FC<RowProps> = ({ avatar, title, subtitle, right, divider = true }) => (
  <div style={{ position: "relative", height: 68, display: "flex", flexDirection: "row", alignItems: "center", padding: "10px 16px", boxSizing: "border-box", background: "#fff" }}>
    <div style={{ flexShrink: 0, marginRight: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{avatar}</div>
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
      <div style={{ fontFamily: fontStack, fontSize: 15, fontWeight: fw.Medium, color: "#111", lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>{title}</div>
      <div style={{ fontFamily: fontStack, fontSize: 13, fontWeight: fw.Regular, color: "#616161", lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subtitle}</div>
    </div>
    <div style={{ flexShrink: 0, marginLeft: 8, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, minWidth: 50 }}>{right}</div>
    {divider && <div style={{ position: "absolute", left: 78, right: 0, bottom: 0, height: 1, background: "transparent" }} />}
  </div>
);

const ChatTab: React.FC = () => (
  <div style={{ position: "relative", width: 375, height: 812, background: "#fff", overflow: "hidden", fontFamily: fontStack }}>
    {/* Header — status bar */}
    <div style={{ position: "absolute", left: 0, top: 0, width: 375, height: 44 }}>
      <span style={{ position: "absolute", left: 20, top: 14, width: 54, height: 18, fontSize: 15, fontWeight: fw.Semibold, color: "#000", textAlign: "center", lineHeight: 1 }}>9:41</span>
      <Icon name="cellular" style={{ position: "absolute", left: 294, top: 18, width: 17, height: 11 }} />
      <Icon name="wifi" style={{ position: "absolute", left: 316, top: 17, width: 15, height: 11 }} />
      <Icon name="battery" style={{ position: "absolute", left: 336, top: 17, width: 24, height: 11 }} />
    </div>

    {/* Top Navigation */}
    <div style={{ position: "absolute", left: 0, top: 44, width: 375, height: 44, background: "#fff" }}>
      {/* Tab area: Chats pill (selected) + Friends */}
      <div style={{ position: "absolute", left: 16, top: 2, width: 198, height: 39, display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
        <div style={{ width: 83, height: 39, background: "#111", borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
          <Icon name="chatsPillText" style={{ width: 57, height: 19 }} />
        </div>
        <span style={{ fontSize: 18, fontWeight: fw.Heavy, color: "#000", lineHeight: "21px" }}>Friends</span>
      </div>
      {/* Right buttons */}
      <div style={{ position: "absolute", left: 261, top: 10, width: 98, height: 24, display: "flex", flexDirection: "row", alignItems: "center", gap: 13 }}>
        <Icon name="aiFriends" style={{ width: 24, height: 24 }} />
        <Icon name="openchat" style={{ width: 24, height: 24 }} />
        <Icon name="plus" style={{ width: 24, height: 24 }} />
      </div>
      {/* Green status dot */}
      <div style={{ position: "absolute", left: 357, top: 8, width: 5, height: 5, background: "#06C755", borderRadius: "50%" }} />
    </div>

    {/* Searchbar */}
    <div style={{ position: "absolute", left: 0, top: 88, width: 363, height: 50, background: "#fff", display: "flex", alignItems: "center", paddingLeft: 11 }}>
      <div style={{ width: 341, height: 39, background: "#F7F7F7", borderRadius: 100, display: "flex", flexDirection: "row", alignItems: "center", padding: "10px 16px 10px 12px", gap: 12, boxSizing: "border-box" }}>
        <Icon name="searchSm" style={{ width: 19, height: 19 }} />
        <span style={{ flex: 1, fontSize: 14, fontWeight: fw.Medium, color: "#B7B7B7" }}>Enter search keyword</span>
        <Icon name="qr" style={{ width: 19, height: 19 }} />
      </div>
    </div>

    {/* SMC_01_01 — new smartCH banner (375×110) */}
    <div style={{ position: "absolute", left: 0, top: 138, width: 375, height: 110, background: "#fff" }}>
      {/* Performance frame: 326×86 at (16,12), HORIZONTAL gap=18 */}
      <div style={{ position: "absolute", left: 16, top: 12, width: 326, height: 86, display: "flex", flexDirection: "row", gap: 18 }}>
        {/* Text block 222×86 — VERTICAL gap=12 */}
        <div style={{ width: 222, height: 86, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          {/* Title 3 lines, fs=14 Semibold #2A2A2A, total 54h with line-height 18 */}
          <div
            style={{
              width: 222,
              height: 54,
              fontSize: 14,
              fontWeight: fw.Semibold,
              color: "#2A2A2A",
              lineHeight: "18px",
              overflow: "hidden",
              wordBreak: "break-all",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
            }}
          >
            WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
          </div>
          {/* Sponsor row HORIZONTAL gap=3 */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3, height: 18 }}>
            {/* AD Label LAD — Portal_ad_badge_lad (info i 15×15) + Frame "AD" 17×14, gap 2 */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, height: 15 }}>
              <Icon name="adInfo" style={{ width: 15, height: 15 }} />
              <span style={{ width: 17, height: 14, fontSize: 12, fontWeight: fw.Regular, color: "#555", lineHeight: "14px" }}>AD</span>
            </div>
            {/* dot 2×2 #C8C8C8 inside 4×4 frame */}
            <span style={{ width: 4, height: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ width: 2, height: 2, background: "#C8C8C8", borderRadius: "50%" }} />
            </span>
            {/* sponsor text */}
            <span style={{ fontSize: 12, fontWeight: fw.Regular, color: "#909090", lineHeight: "18px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>LUSH Cosmetics</span>
          </div>
        </div>
        {/* Thumb 86×86 */}
        <div style={{ width: 86, height: 86, borderRadius: 5, background: `#F5F5F5 url(https://images.unsplash.com/photo-1556228720-195a672e8a03?w=180&h=180&fit=crop&auto=format) center/cover no-repeat`, flexShrink: 0 }} />
      </div>
      {/* banner_ch_overlay_block_normal — 17×17 at (345,10): 9×9 circle at (4,4) + 6×6 slash at (5,5) */}
      <div style={{ position: "absolute", left: 345, top: 10, width: 17, height: 17 }}>
        <Icon name="bannerOval" style={{ position: "absolute", left: 4, top: 4, width: 9, height: 9 }} />
        <Icon name="bannerSlash" style={{ position: "absolute", left: 5, top: 5, width: 6, height: 6 }} />
      </div>
    </div>

    {/* Filter Tabs */}
    <div style={{ position: "absolute", left: 0, top: 265, width: 375, height: 49, background: "#fff", display: "flex", flexDirection: "row", alignItems: "center", padding: "7px 17px", gap: 5, boxSizing: "border-box" }}>
      {/* All — selected (padding 13/13) */}
      <div style={{ height: 35, padding: "0 13px", borderRadius: 100, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: fw.Semibold, color: "#fff", boxSizing: "border-box" }}>All</div>
      {/* Friends (padding 13/13) */}
      <div style={{ height: 35, padding: "0 13px", borderRadius: 100, border: "1px solid #EFEFEF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: fw.Semibold, color: "#111", boxSizing: "border-box" }}>Friends</div>
      {/* Groups + green-dot (notification) — padding 13/10 */}
      <div style={{ height: 35, paddingLeft: 13, paddingRight: 10, borderRadius: 100, border: "1px solid #EFEFEF", display: "flex", alignItems: "center", gap: 6, boxSizing: "border-box" }}>
        <span style={{ fontSize: 13, fontWeight: fw.Semibold, color: "#111", whiteSpace: "nowrap" }}>Groups</span>
        <span style={{ width: 5, height: 5, background: "#06C755", borderRadius: "50%" }} />
      </div>
      {/* Official accounts (padding 13/13) */}
      <div style={{ height: 35, padding: "0 13px", borderRadius: 100, border: "1px solid #EFEFEF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: fw.Semibold, color: "#111", whiteSpace: "nowrap", boxSizing: "border-box" }}>Official accounts</div>
    </div>

    {/* Chat list */}
    <div style={{ position: "absolute", left: 0, top: 320, width: 375, height: 612, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Row 1 — Birthday promo: pink circle + confetti deco + cake body + candle */}
      <ChatRow
        avatar={<div style={{ position: "relative", width: 48, height: 48, borderRadius: "50%", background: "#FFDCE4", overflow: "visible" }}>
          <Icon name="birthdayDeco" style={{ position: "absolute", left: 4, top: 5, width: 41, height: 19 }} />
          <Icon name="birthdayBody" style={{ position: "absolute", left: 11, top: 24, width: 26, height: 18 }} />
          <Icon name="birthdayCandle" style={{ position: "absolute", left: 17, top: 12, width: 14, height: 17 }} />
        </div>}
        title="Wish friends a happy birthday!"
        subtitle="Olivia, Hirao kanno"
        right={<Icon name="muteBadge" style={{ width: 26, height: 26 }} />}
      />
      {/* Row 2 — Aimee: story ring (gradient) + pin badge */}
      <ChatRow
        avatar={<Avatar img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format" ring="gradient" pin />}
        title="Aimee"
        subtitle="Pancakes are best eaten fresh"
        right={<><span style={{ fontSize: 11, color: "#909090" }}>3min ago</span><UnreadBadge count="999+" /></>}
      />
      {/* Row 3 — Shota saito with draft pencil + timestamp + ! badge on right */}
      <ChatRow
        avatar={<Avatar img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format" ring="static" />}
        title={<>Shota saito<Icon name="draftPencil" style={{ width: 16, height: 16, marginLeft: 4 }} /></>}
        subtitle="Okay"
        right={<><span style={{ fontSize: 11, color: "#909090" }}>5min ago</span><Icon name="exclaimBadge" style={{ width: 24, height: 24 }} /></>}
      />
      {/* Row 4 — Europe Travelers (group, mention) */}
      <ChatRow
        avatar={<Avatar img="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=120&h=120&fit=crop&auto=format" />}
        title="Europe Travelers (268)"
        subtitle={<>Pancakes are best eaten fresh from <span style={{ color: "#4D73FF", fontWeight: fw.Regular }}>You were mentioned.</span></>}
        right={<><span style={{ fontSize: 11, color: "#909090" }}>3min ago</span><UnreadBadge count="12" /></>}
      />
      {/* Row 5 — Singles group video call */}
      <ChatRow
        avatar={<Avatar img="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=120&h=120&fit=crop&auto=format" />}
        title={<>Singles (3) <Icon name="groupCallBadge" style={{ width: 25, height: 16, marginLeft: 4 }} /></>}
        subtitle={<><Icon name="callIcon" style={{ width: 12, height: 12, marginRight: 4, verticalAlign: "middle" }} />Group video call started.</>}
        right={<><span style={{ fontSize: 11, color: "#909090" }}>2:30 PM</span><UnreadBadge count="23" /></>}
      />
      {/* Row 6 — Keep (green disc + bookmark profile, NEW badge on right) */}
      <ChatRow
        avatar={<Icon name="keepIcon" style={{ width: 48, height: 48 }} />}
        title="Keep"
        subtitle="This is a talk room that only you can see. Instead of notes, try sending text…"
        right={<Icon name="newBadge" style={{ width: 24, height: 24 }} />}
      />
      {/* Row 7 — Meru with story ring */}
      <ChatRow
        avatar={<Avatar img="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format" ring="gradient" />}
        title="Meru minami"
        subtitle="Hey Arthur, how are you?"
        right={<><span style={{ fontSize: 11, color: "#909090" }}>3min ago</span><UnreadBadge count="9" /></>}
      />
      {/* Row 8 — LINE cafe OA */}
      <ChatRow
        avatar={<Avatar img="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&h=120&fit=crop&auto=format" />}
        title="LINE cafe OA"
        subtitle="Live is on air."
        right={<span style={{ fontSize: 11, color: "#909090" }}>Yesterday</span>}
      />
      {/* Row 9 — Meru OpenChat */}
      <ChatRow
        avatar={<Avatar img="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=120&h=120&fit=crop&auto=format" />}
        title="Meru minami"
        subtitle="Hey Arthur, how are you?"
        right={<span style={{ fontSize: 11, color: "#909090" }}>Yesterday</span>}
      />
    </div>

    {/* Bottom Navigation */}
    <div style={{ position: "absolute", left: 0, top: 728, width: 375, height: 84, background: "#fff", boxShadow: "0 -3px 5px rgba(0,0,0,0.05)", display: "flex", flexDirection: "row", justifyContent: "space-around", paddingTop: 8, boxSizing: "border-box" }}>
      {[
        { name: "navHome", label: "Home", w: 19, h: 20 },
        { name: "navChats", label: "Chats", w: 19, h: 20, selected: true },
        { name: "navVoom", label: "Voom", w: 24, h: 24 },
        { name: "navNews", label: "News", w: 17, h: 18 },
        { name: "navWallet", label: "Wallet", w: 18, h: 16 },
      ].map((tab) => (
        <div key={tab.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", width: 64, gap: 4, paddingTop: tab.name === "navVoom" ? 0 : 2 }}>
          <div style={{ height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={tab.name} style={{ width: tab.w, height: tab.h }} />
          </div>
          <span style={{ fontSize: 9, color: "#111", fontWeight: tab.selected ? fw.Bold : fw.Regular }}>{tab.label}</span>
        </div>
      ))}
      {/* Home indicator */}
      <div style={{ position: "absolute", left: 121, bottom: 8, width: 134, height: 5, background: "#000", borderRadius: 100 }} />
    </div>
  </div>
);

export default ChatTab;
