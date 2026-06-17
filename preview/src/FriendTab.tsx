// FriendTab — from: Friends (Figma rootLabel)
// Self-contained for preview HMR.
// Source corpus: design-ready-corpus/screens/friendtab (375×812)

import React from "react";

const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Apple SD Gothic Neo", sans-serif';
const fw = { Regular: 400, Medium: 500, Semibold: 600, Bold: 700, Heavy: 900 } as const;

const ICONS: Record<string, string> = {
  battery: `<svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.35" x="0.5" y="0.5" width="21" height="10.3333" rx="2.16667" stroke="#000"/><path opacity="0.4" d="M23 3.66663V7.66663C23.8047 7.32785 24.328 6.53976 24.328 5.66663C24.328 4.79349 23.8047 4.0054 23 3.66663Z" fill="#000"/><rect x="2" y="2" width="18" height="7.33333" rx="1.33333" fill="#000"/></svg>`,
  wifi: `<svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.44825 8.42669C6.72891 7.34442 8.60509 7.34442 9.88575 8.42669L9.89454 8.8847L7.88965 10.9072C7.83087 10.9666 7.7506 10.9999 7.667 10.9999C7.5834 10.9999 7.50311 10.9666 7.44434 10.9072L5.43848 8.8847C5.34657 8.56755 5.3839 8.48485 5.44825 8.42669ZM2.77247 5.72942C5.5316 3.16504 9.80432 3.1651 12.5635 5.72942C12.6258 5.78956 12.6629 6.04526 12.5684 6.18938L11.4092 7.36028C11.0971 7.48144 10.9746 7.36517C10.0685 6.5454 8.88933 6.09165 7.667 6.09173C6.4456 6.09225 5.26773 6.5461 4.36231 7.36517C4.04623 7.47979 3.92676 7.36028L2.76856 6.18938C2.67313 6.04533 2.77247 5.72942ZM0.0966847 3.03899C4.3285 -1.01307 11.0044 -1.01292 15.2363 3.03899C15.333 3.26751 15.2393 3.497L14.0791 4.66692C13.9595 4.78702 13.765 4.7881 13.6436 4.66985C12.0312 3.13845 9.89158 2.28421 7.667 2.28411C5.44211 2.28412 3.30199 3.13822 1.68946 4.66985C1.37441 4.78703 1.25489 4.66692L0.0937551 3.497C0.0353826 3.09915 0.0966847 3.03899Z" fill="#000"/></svg>`,
  cellular: `<svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.66699C2.55228 6.66699 3 7.11471 3 7.66699V9.66699C2.99982 10.2191 2.55218 10.667 2 10.667H1C0.447824 10.667 0.000175969 10.2191 0 9.66699V7.66699C0 7.11471 0.447715 6.66699 1 6.66699H2ZM6.66699 4.66699C7.21913 4.66717 7.66699 5.11482 7.66699 5.66699V9.66699C7.66682 10.219 7.21902 10.6668 6.66699 10.667H5.66699C5.11482 10.667 4.66717 10.2191 4.66699 9.66699V5.66699C4.66699 5.11471 5.11471 4.66699 5.66699 4.66699H6.66699ZM11.333 2.33301C11.8852 2.33301 12.3328 2.78087 12.333 3.33301V9.66699C12.3328 10.2191 11.8852 10.667 11.333 10.667H10.333C9.78098 10.6668 9.33318 10.219 9.33301 9.66699V3.33301C9.33318 2.78098 9.78098 2.33318 10.333 2.33301H11.333ZM16 0C16.5523 0 17 0.447715 17 1V9.66699C16.9998 10.2191 16.5522 10.667 16 10.667H15C14.4478 10.667 14.0002 10.2191 14 9.66699V1C14 0.447715 14.4477 0 15 0H16Z" fill="#000"/></svg>`,
  // ico_3 friends — top-nav "Chats ▾" rendered SVG (61×21)
  chatsLink: `<svg width="61" height="21" viewBox="0 0 61 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.77637 17.2285C2.9707 17.2285 0.606445 14.7939 0.606445 10.6543V10.6455C0.606445 6.50586 2.98828 4.08887 6.77637 4.08887C10.0898 4.08887 12.3838 6.21582 12.498 9.05469V9.14258H9.39551L9.37793 9.01074C9.17578 7.69238 8.25293 6.76074 6.77637 6.76074C5.00977 6.76074 3.89355 8.21094 3.89355 10.6367V10.6455C3.89355 13.0977 5.01855 14.5566 6.78516 14.5566C8.18262 14.5566 9.17578 13.6865 9.39551 12.2715L9.41309 12.1748H12.5156L12.5068 12.2715C12.3926 15.1104 10.0723 17.2285 6.77637 17.2285ZM13.9679 17V4.31738H17.088V9.15137H17.1496C17.6242 7.90332 18.6173 7.22656 20.0588 7.22656C22.1505 7.22656 23.381 8.61523 23.381 10.918V17H20.2609V11.5859C20.2609 10.4521 19.716 9.7666 18.6877 9.7666C17.7033 9.7666 17.088 10.5225 17.088 11.5771V17H13.9679ZM27.8304 17.1318C25.9056 17.1318 24.596 15.9102 24.596 14.2402V14.2314C24.596 12.4297 25.9847 11.4189 28.4544 11.252L30.6341 11.1113V10.6367C30.6341 9.94238 30.1859 9.51172 29.3157 9.51172C28.4808 9.51172 27.9886 9.89844 27.8831 10.3906L27.8655 10.4785H25.0618L25.0706 10.3643C25.22 8.50098 26.8109 7.22656 29.4739 7.22656C32.0491 7.22656 33.7454 8.52734 33.7454 10.4697V17H30.6341V15.6465H30.5726C30.0277 16.5869 29.0784 17.1318 27.8304 17.1318ZM27.6546 14.0381C27.6546 14.6357 28.1556 14.9785 28.9202 14.9785C29.9222 14.9785 30.6341 14.3809 30.6341 13.5723V12.9307L28.9554 13.0449C28.0853 13.0977 27.6546 13.458 27.6546 14.0293V14.0381ZM39.4868 17.2021C37.1665 17.2021 36.1118 16.3672 36.1118 14.2051V9.71387H34.811V7.42871H36.1118V5.22266H39.2319V7.42871H40.9458V9.71387H39.2319V13.7832C39.2319 14.6094 39.6011 14.917 40.3657 14.917C40.6118 14.917 40.77 14.8994 40.9458 14.873V17.0879C40.603 17.1494 40.1372 17.2021 39.4868 17.2021ZM46.5377 17.2021C43.6901 17.2021 42.1608 15.9453 41.9498 14.082L41.9411 14.0029H44.9645L44.9821 14.0732C45.1315 14.7236 45.6237 15.1016 46.5377 15.1016C47.3639 15.1016 47.8649 14.8027 47.8649 14.3105V14.3018C47.8649 13.8711 47.5573 13.6338 46.7047 13.458L45.0172 13.124C43.1452 12.7637 42.1696 11.7881 42.1696 10.3291V10.3203C42.1696 8.41309 43.8043 7.22656 46.4235 7.22656C49.192 7.22656 50.6598 8.6416 50.6862 10.3555L50.695 10.4258H47.8473L47.8385 10.3555C47.7682 9.79297 47.2848 9.32715 46.4235 9.32715C45.6588 9.32715 45.1666 9.64355 45.1666 10.1445V10.1533C45.1666 10.5664 45.4567 10.8125 46.362 10.9971L48.0495 11.3311C50.0797 11.7354 50.9586 12.5264 50.9586 13.959V13.9678C50.9586 15.9453 49.1657 17.2021 46.5377 17.2021Z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M56.972 13.0819C57.2314 13.4428 57.7684 13.4428 58.0277 13.0819L60.4672 9.68682C60.7762 9.25679 60.4689 8.65753 59.9393 8.65753H55.0604C54.5309 8.65753 54.2236 9.25679 54.5325 9.68682L56.972 13.0819Z" fill="#000"/></svg>`,
  // ico_4 friends — AI/sparkle face icon (20×19)
  aiFriends: `<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.57858 8.33593C9.10135 8.23684 8.82529 7.62281 8.96199 6.96447C9.09868 6.30612 9.59637 5.85276 10.0736 5.95185C10.5508 6.05094 10.8269 6.66496 10.6902 7.32331C10.5535 7.98165 10.0558 8.43502 9.57858 8.33593Z" fill="#000"/><path d="M4.58711 8.6358C4.2045 8.53221 4.03678 7.92209 4.21251 7.27307C4.38824 6.62405 4.84086 6.1819 5.22347 6.28549C5.60608 6.38909 5.77379 6.9992 5.59806 7.64822C5.42234 8.29724 4.96971 8.73939 4.58711 8.6358Z" fill="#000"/><path d="M5.33457 10.6878C5.31503 10.5443 5.4145 10.423 5.55628 10.3934C6.00611 10.2992 7.08867 10.1266 8.64682 10.225C8.77352 10.233 8.86792 10.3419 8.84644 10.467C8.7605 10.9675 8.4191 12.1337 7.09874 12.2295C5.80845 12.3236 5.40916 11.2359 5.33457 10.6878Z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.4794 0.0846911C16.5621 -0.0469739 16.7861 -0.0250856 16.8222 0.150121L16.914 0.527074C17.4386 2.38018 18.9562 3.80278 20.8642 4.19211L20.9296 4.2175C21.0421 4.28858 21.0423 4.46395 20.9296 4.53489L20.8642 4.56028C18.956 4.94964 17.4385 6.37202 16.914 8.22532L16.8222 8.60227L16.7733 8.84153C16.747 8.97037 16.5821 8.98624 16.5214 8.88938L16.5028 8.84153L16.454 8.60227C16.0647 6.69431 14.642 5.17672 12.789 4.65207L12.412 4.56028C12.212 4.51914 12.212 4.23328 12.412 4.19211L12.789 4.10032C14.6421 3.57571 16.0646 2.05808 16.454 0.150121L16.4794 0.0846911ZM16.6425 3.24875C16.3894 3.72834 15.998 4.11963 15.5185 4.37278C15.9977 4.62575 16.3894 5.01671 16.6425 5.49582C16.8955 5.01687 17.2866 4.62578 17.7655 4.37278C17.2864 4.11964 16.8955 3.728 16.6425 3.24875Z" fill="#000"/><path d="M10.9626 1.81713C10.4405 1.71686 9.90137 1.66437 9.35001 1.66437C4.65559 1.66437 0.850006 5.46995 0.850006 10.1644C0.850006 14.8588 4.65559 18.6644 9.35001 18.6644C13.6934 18.6644 17.276 15.4066 17.7874 11.2012" stroke="#000" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  // ico_5 friends — openchat (16×16)
  openchat: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.85 17V5.672C16.85 3.00451 14.5643 0.849998 11.863 0.849998H5.83702C3.03182 0.849998 0.850006 3.00451 0.850006 5.672V11.4174C0.850006 14.0849 3.13572 16.2394 5.83702 16.2394H11.9669" stroke="#000" stroke-width="1.7"/></svg>`,
  // ico_6 friends — plus
  plus: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 8.75H17.5" stroke="#000" stroke-width="1.7"/><path d="M8.75 0V17.5" stroke="#000" stroke-width="1.7"/></svg>`,
  // ico_10 friends — search 11x11
  searchSm: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.85 11.85L8.85 8.85" stroke="#B7B7B7" stroke-width="1.7"/><circle cx="5.62" cy="5.62" r="4.77" stroke="#B7B7B7" stroke-width="1.7"/></svg>`,
  // ico_11 friends — qr scanner
  qr: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><mask id="qrm" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18"><path d="M18 18H0V0H18V18ZM5.50293 5.5H1.00293V12.5H5.50293V17H12.5029V12.5H17.0029V5.5H12.5029V1H5.50293V5.5Z" fill="#fff"/></mask></defs><g mask="url(#qrm)"><rect x="2.25" y="2.25" width="13.5" height="13.5" rx="1.04" stroke="#777" stroke-width="1.7"/></g><path d="M2.25 9H15.75" stroke="#777" stroke-width="1.7" stroke-linecap="square"/></svg>`,
  // ico_15 friends — tiny dot separator (10×10, r=1 #C8C8C8)
  eventDot: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="1" fill="#C8C8C8"/></svg>`,
  // ico_16 friends — bold "+" sign (12×12, stroke 2px #111)
  calendarPlus: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 6H12" stroke="#111" stroke-width="2"/><path d="M6 0V12" stroke="#111" stroke-width="2"/></svg>`,
  // ico_17 friends — bottom nav home (19×20)
  navHome: `<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.1748 2.07837C8.6479 1.65923 9.35988 1.65928 9.83301 2.07837L17.2588 8.65747V17.0198C17.2588 17.71 16.6989 18.2696 16.0088 18.2698H2C1.30966 18.2698 0.750022 17.7101 0.75 17.0198V8.65649L8.1748 2.07837Z" stroke="#111" stroke-width="1.5"/><path d="M9 12.0107V18.6964" stroke="#111" stroke-width="1.5"/></svg>`,
  // ico_18 friends — bottom nav chats (19×20)
  navChats: `<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.83594 0C15.2813 0 19.4619 3.79793 19.4619 8.6748C19.4619 13.4649 15.5991 17.3485 10.8301 17.3486L8.4502 17.3594C7.76793 17.3594 7.30323 17.709 6.9668 18.3564L6.61719 19.3994L6.58398 19.5977C6.45505 20.1142 5.82202 20.3432 5.38965 19.9951L4.53613 19.2207C3.912 18.6096 3.28886 17.9121 2.70605 17.1387C1.01996 14.9011 0 12.4841 0 9.96387C0 4.27207 4.26459 0 9.83594 0ZM6.23535 8.13379C5.64001 8.13392 5.15724 8.61752 5.15723 9.21289C5.15723 9.80828 5.64 10.2919 6.23535 10.292C6.83195 10.292 7.31445 9.80836 7.31445 9.21289C7.31444 8.61744 6.83194 8.13379 6.23535 8.13379ZM9.86914 8.13379C9.27368 8.13379 8.79006 8.6163 8.79004 9.21289C8.79004 9.80836 9.27367 10.292 9.86914 10.292C10.4646 10.292 10.9492 9.80834 10.9492 9.21289C10.9492 8.61632 10.4646 8.13381 9.86914 8.13379ZM13.5049 8.13379C12.9094 8.13379 12.4258 8.6163 12.4258 9.21289C12.4258 9.80836 12.9094 10.292 13.5049 10.292C14.1003 10.2919 14.583 9.80831 14.583 9.21289C14.583 8.61635 14.1003 8.13386 13.5049 8.13379Z" fill="#111"/></svg>`,
  // ico_19 friends — bottom nav voom (24×24)
  navVoom: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.81743 10.0384L6.79743 11.7484C5.43743 12.4384 4.78743 13.7384 4.78743 14.9984V17.4584C4.74743 19.9884 7.55743 21.5384 9.76743 20.2284L18.8974 15.0984C21.0274 13.8984 21.0274 10.8284 18.8974 9.61845L9.81743 4.49845C7.53743 3.12845 4.78743 4.76845 4.78743 7.15845V10.5284C4.78743 11.5484 5.83743 12.2385 6.79743 11.7385L9.81743 10.0384Z" stroke="#111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // ico_20 friends — news (17×18)
  navNews: `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 0.75H15C15.6904 0.75 16.25 1.30964 16.25 2V16.0039C16.25 16.6943 15.6904 17.2539 15 17.2539H2C1.30964 17.2539 0.75 16.6943 0.75 16.0039V2C0.75 1.30965 1.30964 0.75 2 0.75Z" stroke="#111" stroke-width="1.5"/><path d="M5.52295 6.02551H11.4771" stroke="#111" stroke-width="1.5"/><path d="M5.52295 8.9787H11.4771" stroke="#111" stroke-width="1.5"/><path d="M5.52295 11.9787H11.4771" stroke="#111" stroke-width="1.5"/></svg>`,
  // ico_21 friends — wallet (18×16)
  navWallet: `<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C17.1046 0 18 0.89543 18 2V14.1191C17.9997 15.2235 17.1044 16.1191 16 16.1191H2C0.895593 16.1191 0.00026384 15.2235 0 14.1191V2C0 0.89543 0.89543 0 2 0H16ZM2 4.61914C1.75454 4.61914 1.55015 4.79605 1.50781 5.0293L1.5 5.11914V14.1191C1.50023 14.3644 1.67706 14.569 1.91016 14.6113L2 14.6191H16C16.2453 14.6191 16.4497 14.442 16.4922 14.209L16.5 14.1191V5.11914C16.5 4.87371 16.323 4.66932 16.0898 4.62695L16 4.61914H2ZM2 1.5C1.75454 1.5 1.55015 1.67691 1.50781 1.91016L1.5 2V3.18359C1.64697 3.14412 1.82048 3.11914 2 3.11914H16C16.1792 3.11914 16.3523 3.14428 16.5176 3.18848C16.5117 3.18691 16.5059 3.18511 16.5 3.18359V2C16.5 1.75454 16.3231 1.55015 16.0898 1.50781L16 1.5H2Z" fill="#111"/><circle cx="13.0106" cy="9.11865" r="1.2652" fill="#111"/></svg>`,
  // SMC_01_01 ico_0 — AD info "i" icon
  adInfo: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.125 7.5625C2.125 10.5607 4.56366 13 7.56187 13C10.5601 13 13 10.5607 13 7.5625C13 4.56429 10.5601 2.125 7.56187 2.125C4.56366 2.125 2.125 4.56429 2.125 7.5625" stroke="#555" stroke-width="1.03"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.60642 6.62476C6.60642 6.54256 6.67281 6.47681 6.755 6.47681L7.91838 6.47807C8.17381 6.49261 8.37677 6.70569 8.37677 6.96428L8.36349 7.07303L7.94746 8.63967L7.59782 10.0609L7.5877 10.1437C7.5877 10.3031 7.69139 10.439 7.83555 10.4858L7.94746 10.5041H8.17128C8.25411 10.5041 8.31987 10.5711 8.31987 10.6533C8.31987 10.7349 8.25411 10.8 8.17128 10.8H7.00854C6.75311 10.7848 6.55078 10.5718 6.55078 10.3132L6.56406 10.2044L6.94721 8.63967L7.32973 7.21719L7.33922 7.13373C7.33922 6.9744 7.23553 6.8391 7.09137 6.79231L6.97883 6.77334H6.755C6.67281 6.77334 6.60642 6.70695 6.60642 6.62476Z" fill="#555"/><circle cx="8.118" cy="5.038" r="0.628" fill="#555"/></svg>`,
  // SMC_01_01 ico_7 — banner_ch_mute: 9×9 icon inside 17×17 touch target (offset 4,4)
  bannerMute: `<svg width="9" height="9" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="4.66667" cy="4.66667" r="4.66667" transform="matrix(-1 0 0 1 9.83331 0.5)" stroke="#B7B7B7" stroke-linejoin="round"/><path d="M1.95833 1.95825L8.375 8.37492" stroke="#B7B7B7" stroke-linejoin="round"/></svg>`,
  // SMC_01_01 ico_8 — banner_ch_more: 3×11 icon inside 17×17 touch target (offset 8,4)
  bannerMore: `<svg width="3" height="11" viewBox="0 0 3 11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="1.044" cy="1.044" r="1.044" fill="#B7B7B7"/><circle cx="1.044" cy="5.38189" r="1.044" fill="#B7B7B7"/><circle cx="1.044" cy="9.72003" r="1.044" fill="#B7B7B7"/></svg>`,
  // arrow chevron right
  arrowRight: `<svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4L5.5 8L2 12" stroke="#616161" stroke-width="1.2"/></svg>`,
};

const Icon: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      ...style,
    }}
    dangerouslySetInnerHTML={{ __html: ICONS[name] ?? "" }}
  />
);

// Avatar with optional online dot
const Avatar: React.FC<{ size?: number; img?: string; online?: boolean }> = ({
  size = 48,
  img,
  online,
}) => (
  <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: img ? `#E5E5E5 url(${img}) center/cover no-repeat` : "#E5E5E5",
      }}
    />
    {online && (
      <span
        style={{
          position: "absolute",
          left: 44,
          top: -1,
          width: 5,
          height: 5,
          background: "#06C755",
          borderRadius: "50%",
        }}
      />
    )}
  </div>
);

const FriendTab: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 375,
      height: 812,
      background: "#fff",
      overflow: "hidden",
      fontFamily: fontStack,
    }}
  >
    <style>{`
      .hide-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      .hide-scroll::-webkit-scrollbar { display: none; }
    `}</style>
    {/* Header */}
    <div style={{ position: "absolute", left: 0, top: 0, width: 375, height: 88 }}>
      {/* Status bar */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 375, height: 44 }}>
        <span
          style={{
            position: "absolute",
            left: 20,
            top: 14,
            width: 54,
            height: 18,
            fontSize: 15,
            fontWeight: fw.Semibold,
            color: "#000",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          9:41
        </span>
        <Icon
          name="cellular"
          style={{ position: "absolute", left: 294, top: 18, width: 17, height: 11 }}
        />
        <Icon
          name="wifi"
          style={{ position: "absolute", left: 316, top: 17, width: 15, height: 11 }}
        />
        <Icon
          name="battery"
          style={{ position: "absolute", left: 336, top: 17, width: 24, height: 11 }}
        />
      </div>
      {/* Top nav */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 44,
          width: 375,
          height: 44,
          background: "#fff",
        }}
      >
        {/* Tab area: Chats link + Friends pill (selected) */}
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 3,
            width: 188,
            height: 39,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* "Chats ▾" link as ico_3 */}
          <Icon name="chatsLink" style={{ width: 61, height: 21 }} />
          {/* Selected "Friends" pill */}
          <div
            style={{
              width: 86,
              height: 39,
              background: "#111",
              borderRadius: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: fw.Heavy, color: "#fff", lineHeight: "19px" }}>
              Friends
            </span>
          </div>
        </div>
        {/* Right buttons */}
        <div
          style={{
            position: "absolute",
            left: 261,
            top: 10,
            width: 98,
            height: 24,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 13,
          }}
        >
          <Icon name="aiFriends" style={{ width: 24, height: 24 }} />
          <Icon name="openchat" style={{ width: 24, height: 24 }} />
          <Icon name="plus" style={{ width: 24, height: 24 }} />
        </div>
      </div>
    </div>

    {/* Searchbar */}
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 88,
        width: 375,
        height: 50,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 16,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          height: 39,
          background: "#F7F7F7",
          borderRadius: 100,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "10px 16px 10px 12px",
          gap: 12,
          boxSizing: "border-box",
        }}
      >
        <Icon name="searchSm" style={{ width: 19, height: 19 }} />
        <span style={{ flex: 1, fontSize: 14, fontWeight: fw.Medium, color: "#B7B7B7" }}>
          Enter search keyword
        </span>
        <Icon name="qr" style={{ width: 19, height: 19 }} />
      </div>
    </div>

    {/* Scrollable content: banner + filter tabs (sticky) + sections */}
    <div
      className="hide-scroll"
      style={{
        position: "absolute",
        left: 0,
        top: 138,
        width: 375,
        height: 590,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* SMC_01_01 banner — 121px */}
      <div
        style={{ position: "relative", width: 375, height: 121, background: "#fff", flexShrink: 0 }}
      >
        {/* image: 86×86 at (256, 18) */}
        <div
          style={{
            position: "absolute",
            left: 256,
            top: 18,
            width: 86,
            height: 86,
            borderRadius: 5,
            background: `#F5F5F5 url(https://images.unsplash.com/photo-1556228720-195a672e8a03?w=180&h=180&fit=crop&auto=format) center/cover no-repeat`,
          }}
        />
        {/* text type 2: (18, 32) 218×58 */}
        <div style={{ position: "absolute", left: 18, top: 32, width: 218, height: 58 }}>
          {/* main text: 2 lines × 18px */}
          <div
            style={{
              width: 218,
              height: 36,
              fontSize: 14,
              fontWeight: fw.Semibold,
              color: "#2A2A2A",
              lineHeight: "18px",
              overflow: "hidden",
              wordBreak: "break-all",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
            }}
          >
            WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
          </div>
          {/* sub text: AD · brand — at offset (0, 44) */}
          <div
            style={{
              position: "absolute",
              top: 44,
              left: 0,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
              height: 14,
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Icon name="adInfo" style={{ width: 15, height: 15 }} />
              <span
                style={{ fontSize: 12, fontWeight: fw.Regular, color: "#555", lineHeight: "14px" }}
              >
                AD
              </span>
            </div>
            <span
              style={{
                width: 2,
                height: 2,
                background: "#C8C8C8",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: fw.Regular,
                color: "#909090",
                lineHeight: "14px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              LUSH Cosmetics
            </span>
          </div>
        </div>
        {/* banner_ch_mute — 17×17 at (345, 10), icon 9×9 at offset (4, 4) */}
        <div style={{ position: "absolute", left: 345, top: 10, width: 17, height: 17 }}>
          <Icon name="bannerMute" style={{ position: "absolute", left: 4, top: 4 }} />
        </div>
        {/* banner_ch_more — 17×17 at (345, 93), icon 3×11 at offset (8, 4) */}
        <div style={{ position: "absolute", left: 345, top: 93, width: 17, height: 17 }}>
          <Icon name="bannerMore" style={{ position: "absolute", left: 8, top: 4 }} />
        </div>
      </div>

      {/* Filter tabs — sticky below search bar */}
      <div
        className="hide-scroll"
        style={{
          width: 375,
          height: 49,
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          flexShrink: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          padding: "7px 17px",
          boxSizing: "border-box",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            height: 35,
            padding: "0 13px",
            borderRadius: 100,
            background: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: fw.Semibold,
            color: "#fff",
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        >
          Friends
        </div>
        {["Favorites", "Groups", "OpenChats", "Official"].map((label) => (
          <div
            key={label}
            style={{
              height: 35,
              padding: "0 13px",
              borderRadius: 100,
              border: "1px solid #EFEFEF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: fw.Semibold,
              color: "#111",
              whiteSpace: "nowrap",
              flexShrink: 0,
              boxSizing: "border-box",
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Content sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 50, paddingBottom: 100 }}>
        {/* Friends list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 6 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              {
                name: "Adela",
                body: "on a business trip in paris",
                img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format",
              },
              {
                name: "Alison Lee",
                body: "Body",
                img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format",
              },
              {
                name: "Becky",
                body: "Scheduled to arrive in Tokyo next Wednesday afternoon.",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format",
              },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  height: 68,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 16px",
                  boxSizing: "border-box",
                  background: "#fff",
                }}
              >
                <Avatar img={r.img} online />
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: fw.Medium,
                      color: "#111",
                      lineHeight: "20px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.name}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: fw.Regular,
                      color: "#616161",
                      lineHeight: "16px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.body}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* See more button — 339×42, border radius 50, stroke #EFEFEF */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 42,
              padding: "0 18px",
            }}
          >
            <div
              style={{
                width: 339,
                height: 42,
                border: "1px solid #EFEFEF",
                borderRadius: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: fw.Regular, color: "#616161" }}>
                See more friends
              </span>
            </div>
          </div>
        </div>

        {/* My schedule section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
            }}
          >
            <span
              style={{ fontSize: 15, fontWeight: fw.Semibold, color: "#111", lineHeight: "19px" }}
            >
              My schedule within 30 days
            </span>
            <span
              style={{ fontSize: 13, fontWeight: fw.Regular, color: "#616161", lineHeight: "19px" }}
            >
              See more
            </span>
          </div>
          {/* Event 1 — Jazz Concert: 28/Fri date + blue bar (#587EFF) + title + green Today + time + Besties profile */}
          <div style={{ display: "flex", flexDirection: "row", padding: "10px 18px", gap: 12 }}>
            <div
              style={{ width: 30, display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <span
                style={{ fontSize: 18, fontWeight: fw.Heavy, color: "#111", lineHeight: "21px" }}
              >
                28
              </span>
              <span
                style={{ fontSize: 13, fontWeight: fw.Regular, color: "#111", lineHeight: "16px" }}
              >
                Fri
              </span>
            </div>
            <div style={{ width: 4, height: 58, background: "#587EFF", borderRadius: 2 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{ fontSize: 15, fontWeight: fw.Medium, color: "#111", lineHeight: "18px" }}
              >
                Jazz Concert
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 13,
                }}
              >
                <span style={{ fontWeight: fw.Medium, color: "#06C755" }}>Today</span>
                <Icon name="eventDot" style={{ width: 10, height: 10 }} />
                <span style={{ color: "#616161" }}>19:00 - 21:00</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#FFB347",
                    border: "0.5px solid rgba(0,0,0,0.1)",
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: fw.Regular, color: "#616161" }}>
                  Besties
                </span>
              </div>
            </div>
          </div>
          {/* Event 2 — Make a event: gray bar (#909090) + black Medium title */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "0 18px",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 30,
                height: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="calendarPlus" style={{ width: 12, height: 12 }} />
            </div>
            <div style={{ width: 4, height: 26, background: "#909090", borderRadius: 2 }} />
            <span
              style={{ fontSize: 15, fontWeight: fw.Medium, color: "#111", lineHeight: "18px" }}
            >
              Make a event with friends
            </span>
          </div>
        </div>

        {/* Album section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "0 18px" }}>
            <span
              style={{ fontSize: 15, fontWeight: fw.Semibold, color: "#111", lineHeight: "19px" }}
            >
              The album with my friends
            </span>
          </div>
          {/* Album banner — 343×120, 1px #EFEFEF border, radius 9, padding 23/20, gap 18 */}
          <div
            style={{
              margin: "0 16px",
              height: 120,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 18,
              padding: "23px 20px",
              border: "1px solid #EFEFEF",
              borderRadius: 9,
              boxSizing: "border-box",
            }}
          >
            {/* Composite polaroid stack 83×78 */}
            <div style={{ position: "relative", width: 83, height: 78, flexShrink: 0 }}>
              {/* Back photo — gray placeholder (Group 2085665917, fill #D9D9D9), 47×54 at (4,7), tilted left */}
              <div
                style={{
                  position: "absolute",
                  left: 4,
                  top: 7,
                  width: 47,
                  height: 54,
                  background: "#D9D9D9",
                  borderRadius: 6,
                  transform: "rotate(-10deg)",
                }}
              />
              {/* Front photo — image (Group 2085665916), 50×56 at (32,15), tilted right */}
              <div
                style={{
                  position: "absolute",
                  left: 32,
                  top: 15,
                  width: 50,
                  height: 56,
                  background: `url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=160&h=180&fit=crop&auto=format) center/cover no-repeat`,
                  borderRadius: 6,
                  transform: "rotate(8deg)",
                }}
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{ fontSize: 14, fontWeight: fw.Semibold, color: "#111", lineHeight: "17px" }}
              >
                Let's look back on the past memories
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  color: "#616161",
                }}
              >
                <span>Go to my albums</span>
                <Icon name="arrowRight" style={{ width: 8, height: 16 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recommended carousel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "0 18px" }}>
            <span
              style={{ fontSize: 15, fontWeight: fw.Semibold, color: "#111", lineHeight: "19px" }}
            >
              Recommended For you
            </span>
          </div>
          <div
            className="hide-scroll"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              paddingLeft: 14,
              paddingRight: 14,
              overflowX: "auto",
            }}
          >
            {[
              {
                name: "Alison Lee",
                img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format",
              },
              {
                name: "Suzumi",
                img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&auto=format",
              },
              {
                name: "Hosoya",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format",
              },
              {
                name: "Profile Studio",
                img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format",
              },
              { name: "Edit my profile", img: undefined },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  width: 58,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <Avatar img={r.img} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: fw.Regular,
                    color: "#111",
                    lineHeight: "15px",
                    textAlign: "center",
                    maxWidth: 58,
                    wordBreak: "break-word",
                  }}
                >
                  {r.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* end content sections */}
    </div>
    {/* end scroll container */}

    {/* Bottom navigation — Chats not selected here either */}
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 728,
        width: 375,
        height: 84,
        background: "#fff",
        boxShadow: "0 -3px 5px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 8,
        boxSizing: "border-box",
      }}
    >
      {[
        { name: "navHome", label: "Home", w: 19, h: 20 },
        { name: "navChats", label: "Chats", w: 19, h: 20 },
        { name: "navVoom", label: "Voom", w: 24, h: 24 },
        { name: "navNews", label: "News", w: 17, h: 18 },
        { name: "navWallet", label: "Wallet", w: 18, h: 16 },
      ].map((tab) => (
        <div
          key={tab.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: 64,
            gap: 4,
            paddingTop: tab.name === "navVoom" ? 0 : 2,
          }}
        >
          <div
            style={{ height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Icon name={tab.name} style={{ width: tab.w, height: tab.h }} />
          </div>
          <span style={{ fontSize: 9, color: "#111", fontWeight: fw.Regular }}>{tab.label}</span>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 121,
          bottom: 8,
          width: 134,
          height: 5,
          background: "#000",
          borderRadius: 100,
        }}
      />
    </div>
  </div>
);

export default FriendTab;
