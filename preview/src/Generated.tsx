// ChatMenu — from: task5_type_2_2 (Figma rootLabel)
// Self-contained for preview HMR.
// Source corpus: design-ready-corpus/screens/chatmenu (375×812 LINE chat-menu screen)

import React from "react";

const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Apple SD Gothic Neo", sans-serif';
const fw = { Regular: 400, Medium: 500, Semibold: 600, Bold: 700, Heavy: 900 } as const;

const ICONS: Record<string, string> = {
  battery: `<svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.35" x="0.5" y="0.5" width="21" height="10.3333" rx="2.16667" stroke="#000"/><path opacity="0.4" d="M23 3.66663V7.66663C23.8047 7.32785 24.328 6.53976 24.328 5.66663C24.328 4.79349 23.8047 4.0054 23 3.66663Z" fill="#000"/><rect x="2" y="2" width="18" height="7.33333" rx="1.33333" fill="#000"/></svg>`,
  wifi: `<svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.44825 8.42669C6.72891 7.34442 8.60509 7.34442 9.88575 8.42669C9.9501 8.4849 9.98749 8.56751 9.98926 8.65423C9.99092 8.74086 9.95644 8.82399 9.89454 8.8847L7.88965 10.9072C7.83087 10.9666 7.7506 10.9999 7.667 10.9999C7.5834 10.9999 7.50311 10.9666 7.44434 10.9072L5.43848 8.8847C5.37688 8.824 5.34303 8.74065 5.34473 8.65423C5.34657 8.56755 5.3839 8.48485 5.44825 8.42669ZM2.77247 5.72942C5.5316 3.16504 9.80432 3.1651 12.5635 5.72942C12.6258 5.78956 12.6612 5.87238 12.6621 5.95892C12.6629 6.04526 12.6293 6.12811 12.5684 6.18938L11.4092 7.36028C11.2897 7.47959 11.0971 7.48144 10.9746 7.36517C10.0685 6.5454 8.88933 6.09165 7.667 6.09173C6.4456 6.09225 5.26773 6.5461 4.36231 7.36517C4.23976 7.48151 4.04623 7.47979 3.92676 7.36028L2.76856 6.18938C2.70748 6.12818 2.67313 6.04533 2.67383 5.95892C2.67465 5.87244 2.71026 5.78954 2.77247 5.72942ZM0.0966847 3.03899C4.3285 -1.01307 11.0044 -1.01292 15.2363 3.03899C15.2976 3.09919 15.3325 3.18166 15.333 3.26751C15.3334 3.35327 15.2998 3.43615 15.2393 3.497L14.0791 4.66692C13.9595 4.78702 13.765 4.7881 13.6436 4.66985C12.0312 3.13845 9.89158 2.28421 7.667 2.28411C5.44211 2.28412 3.30199 3.13822 1.68946 4.66985C1.56818 4.78822 1.37441 4.78703 1.25489 4.66692L0.0937551 3.497C0.0333244 3.43612 -0.000475824 3.35324 5.06194e-06 3.26751C0.000570337 3.18166 0.0353826 3.09915 0.0966847 3.03899Z" fill="#000"/></svg>`,
  cellular: `<svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.66699C2.55228 6.66699 3 7.11471 3 7.66699V9.66699C2.99982 10.2191 2.55218 10.667 2 10.667H1C0.447824 10.667 0.000175969 10.2191 0 9.66699V7.66699C0 7.11471 0.447715 6.66699 1 6.66699H2ZM6.66699 4.66699C7.21913 4.66717 7.66699 5.11482 7.66699 5.66699V9.66699C7.66682 10.219 7.21902 10.6668 6.66699 10.667H5.66699C5.11482 10.667 4.66717 10.2191 4.66699 9.66699V5.66699C4.66699 5.11471 5.11471 4.66699 5.66699 4.66699H6.66699ZM11.333 2.33301C11.8852 2.33301 12.3328 2.78087 12.333 3.33301V9.66699C12.3328 10.2191 11.8852 10.667 11.333 10.667H10.333C9.78098 10.6668 9.33318 10.219 9.33301 9.66699V3.33301C9.33318 2.78098 9.78098 2.33318 10.333 2.33301H11.333ZM16 0C16.5523 0 17 0.447715 17 1V9.66699C16.9998 10.2191 16.5522 10.667 16 10.667H15C14.4478 10.667 14.0002 10.2191 14 9.66699V1C14 0.447715 14.4477 0 15 0H16Z" fill="#000"/></svg>`,
  chevronMore: `<svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.530273 0.530334L6.03027 6.03033L0.530273 11.5303" stroke="#949494" stroke-width="1.5"/></svg>`,
  userCircle: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="9.99998" r="7.16667" stroke="#000" stroke-width="1.1"/><path d="M14.6241 15.4754C13.6954 14.8366 12.0641 13.714 11.7376 13.4849C11.2976 13.1762 11.3412 12.5101 11.5795 12.1337C11.7832 11.812 12.0076 11.4434 12.3359 10.8324C12.4202 10.7834 12.7456 10.5788 12.8451 9.89972C12.8918 9.57931 12.7607 9.35339 12.6846 9.25231C12.6846 9.24389 12.6859 9.23697 12.6859 9.22856C12.6859 7.53639 11.5182 6.35956 9.99998 6.35956C8.48173 6.35956 7.31406 7.53639 7.31406 9.22856C7.31406 9.23697 7.31531 9.24389 7.31531 9.25231C7.23923 9.35339 7.10823 9.57922 7.15481 9.89972C7.25431 10.5788 7.57973 10.7834 7.66406 10.8324C7.99239 11.4434 8.21673 11.812 8.42048 12.1337C8.65873 12.5101 8.70223 13.1761 8.26231 13.4849C7.93581 13.7139 6.30456 14.8366 5.37598 15.4753" stroke="#000" stroke-width="1.1"/></svg>`,
  musicNote: `<svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.2255 9.86555H11.0555C9.85732 9.86555 8.88641 10.8456 8.88641 12.0546C8.88641 13.2637 9.85732 14.2437 11.0555 14.2437C12.2537 14.2437 13.2255 13.2637 13.2255 12.0546V10.4419V3.31555L4.88914 5.15828V11.3101V12.9228C4.88914 14.1319 3.91823 15.1128 2.71914 15.1128C1.52096 15.1128 0.550049 14.1319 0.550049 12.9228C0.550049 11.7137 1.52096 10.7337 2.71914 10.7337H4.88914" stroke="#111" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.277 0.55011L4.83704 2.41647" stroke="#111" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  photoVideo: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.7 8.30078L7 12.6008H12.4L9.7 8.30078Z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.0016 8.2079C13.0016 8.65972 12.6352 9.02608 12.1834 9.02608C11.7316 9.02608 11.3652 8.65972 11.3652 8.2079C11.3652 7.75608 11.7316 7.39062 12.1834 7.39062C12.6352 7.39062 13.0016 7.75608 13.0016 8.2079Z" fill="#000"/><rect x="3.55" y="3.55" width="12.9" height="12.9" rx="0.45" stroke="#111" stroke-width="1.1"/></svg>`,
  vrPlay: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.94995" cy="6.95001" r="5.6" stroke="#fff" stroke-width="0.7"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.54896 9.41095C8.17401 10.6078 7.54952 11.3246 6.95063 11.3246C6.35174 11.3246 5.72725 10.6078 5.35229 9.41095C5.85299 9.49488 6.38901 9.5422 6.95063 9.5422C7.51225 9.5422 8.04827 9.49488 8.54896 9.41095ZM6.94908 5.00555C7.5982 5.00555 8.19418 5.06778 8.72404 5.17505C8.83131 5.70491 8.89353 6.30088 8.89353 6.95C8.89353 7.59912 8.83131 8.19509 8.72404 8.72495C8.19418 8.83222 7.5982 8.89444 6.94908 8.89444C6.29996 8.89444 5.70399 8.83222 5.17413 8.72495C5.06686 8.19509 5.00464 7.59912 5.00464 6.95C5.00464 6.30088 5.06686 5.70491 5.17413 5.17505C5.70399 5.06778 6.29996 5.00555 6.94908 5.00555ZM9.41089 5.35138C10.6077 5.72633 11.3245 6.35082 11.3245 6.94971C11.3245 7.5486 10.6077 8.17309 9.41089 8.54805C9.49482 8.04735 9.54214 7.51133 9.54214 6.94971C9.54214 6.38809 9.49482 5.85207 9.41089 5.35138ZM4.48861 5.35138C4.40467 5.85207 4.35736 6.38809 4.35736 6.94971C4.35736 7.51133 4.40467 8.04735 4.48861 8.54805C3.2918 8.17309 2.57495 7.5486 2.57495 6.94971C2.57495 6.35082 3.2918 5.72633 4.48861 5.35138ZM6.95063 2.57501C7.54952 2.57501 8.17401 3.29186 8.54896 4.48867C8.04827 4.40473 7.51225 4.35742 6.95063 4.35742C6.38901 4.35742 5.85299 4.40473 5.35229 4.48867C5.72725 3.29186 6.35174 2.57501 6.95063 2.57501Z" fill="#fff"/></svg>`,
  album: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1992 8.20801L7.69922 12.208H12.6992L10.1992 8.20801Z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.6364 8.2079C13.6364 8.65972 13.27 9.02608 12.8182 9.02608C12.3664 9.02608 12 8.65972 12 8.2079C12 7.75608 12.3664 7.39062 12.8182 7.39062C13.27 7.39062 13.6364 7.75608 13.6364 8.2079Z" fill="#000"/><rect x="4.55" y="3.55" width="11.9" height="12.9" rx="0.45" stroke="#111" stroke-width="1.1"/><path d="M4 7.5H2" stroke="#000" stroke-width="1.1"/><path d="M4 12.5H2" stroke="#000" stroke-width="1.1"/></svg>`,
  arrowRightSmall: `<svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.76172 1.375L5.93224 5.54552L1.76172 9.71605" stroke="#B7B7B7" stroke-width="1.1"/></svg>`,
  note: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4.05" y="3.55" width="11.9" height="12.9" rx="0.45" stroke="#111" stroke-width="1.1"/><path d="M7.5 10H12.5" stroke="#111" stroke-width="1.1"/><path d="M7.5 7.5H12.5" stroke="#111" stroke-width="1.1"/><path d="M7.5 12.5H12.5" stroke="#111" stroke-width="1.1"/></svg>`,
  event: `<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.55" y="2.55" width="12.9" height="11.9" rx="0.45" stroke="#111" stroke-width="1.1"/><path d="M10.05 6.5L6.35314 10.1969L4 7.84372" stroke="#111" stroke-width="1.1"/><path d="M10 2V0" stroke="#1F1F1F" stroke-width="1.1"/><path d="M4 2V0" stroke="#1F1F1F" stroke-width="1.1"/></svg>`,
  link: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.4141 7.18652C10.644 7.41648 10.8128 7.68745 10.9258 7.98047C10.1879 8.04265 9.46618 8.34143 8.90332 8.9043C7.63596 10.1718 7.63589 12.2335 8.90332 13.501L10.834 15.4307C12.1024 16.697 14.1622 16.697 15.4307 15.4307C16.6971 14.1642 16.6971 12.1014 15.4307 10.834L14.0723 9.47461C14.0997 9.25282 14.1367 9.02968 14.1367 8.80078C14.1367 8.50059 14.0996 8.20604 14.0508 7.91602C14.1291 7.98513 14.2167 8.03803 14.292 8.11328L16.2217 10.043C17.9249 11.7472 17.9249 14.5185 16.2217 16.2217C15.3697 17.0736 14.2514 17.5009 13.1328 17.501C12.013 17.501 10.8951 17.0737 10.043 16.2217L8.11133 14.292C6.40817 12.5888 6.40823 9.81647 8.11133 8.11328C8.70485 7.51976 9.43089 7.14601 10.1924 6.96582L10.4141 7.18652ZM6.87012 2.5C8.03664 2.5 9.13441 2.95484 9.95898 3.78027L11.8906 5.71191C12.7162 6.53652 13.1699 7.63313 13.1699 8.80078C13.1699 9.96742 12.7162 11.065 11.8906 11.8906C11.2971 12.4841 10.5711 12.8569 9.80957 13.0381L9.58789 12.8154C9.35479 12.5833 9.18615 12.3116 9.0752 12.0225C9.81328 11.9593 10.5357 11.6626 11.0986 11.0996C11.7125 10.4847 12.0517 9.6681 12.0518 8.80078C12.0518 7.93244 11.7124 7.1168 11.0986 6.50293L9.16797 4.57129C8.55311 3.95863 7.73734 3.62012 6.87012 3.62012C6.00084 3.62021 5.18611 3.95851 4.57129 4.57129C3.9585 5.18612 3.6202 6.00188 3.62012 6.86914C3.62012 7.73738 3.95863 8.55413 4.57129 9.16797L5.93262 10.5293C5.86747 11.0475 5.86659 11.5708 5.95312 12.0869C5.87377 12.0198 5.78623 11.9659 5.71094 11.8906L3.78027 9.95898C2.95383 9.13441 2.5 8.03668 2.5 6.86914C2.50008 5.70258 2.95369 4.60584 3.78027 3.78027C4.60481 2.95472 5.70153 2.50009 6.87012 2.5Z" fill="#111"/></svg>`,
  file: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.11133 4.0498H8.16309L9.7207 5.63867L9.88184 5.80371H15.8887C16.051 5.80371 16.2002 5.94075 16.2002 6.13086V15.6221C16.2002 15.813 16.0503 15.9502 15.8887 15.9502H4.11133C3.94917 15.9499 3.7998 15.812 3.7998 15.6221V4.37793C3.7998 4.18797 3.94917 4.05007 4.11133 4.0498Z" stroke="#111" stroke-width="1.1"/></svg>`,
  settings: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.124 3.09082L11.1709 3.0957C11.2774 3.11595 11.362 3.20185 11.3779 3.3125L11.3789 3.31445L11.6172 4.91797L11.6631 5.22461L11.9482 5.34473C12.3337 5.50657 12.6982 5.71537 13.0322 5.9668L13.0332 5.96777L13.0459 5.97754L13.2939 6.16309L13.5811 6.04688L15.0811 5.43945C15.1888 5.39987 15.3078 5.4319 15.3818 5.51562L15.4111 5.55469L16.5459 7.52051C16.608 7.63082 16.5807 7.76999 16.4814 7.84863L15.21 8.8418L14.957 9.03906L15.0039 9.35645V9.36133H15.0049C15.0187 9.46697 15.0292 9.57343 15.0361 9.67969L15.0469 10C15.0465 10.2008 15.0342 10.4013 15.0098 10.6006L14.9561 10.9229L15.2139 11.124L16.4971 12.126C16.5958 12.2052 16.6222 12.344 16.5596 12.4541L15.4248 14.4209C15.3573 14.5333 15.2191 14.5805 15.0967 14.5342L13.6074 13.9336L13.3262 13.8193L13.0801 13.9971L13.0674 14.0059L13.0615 14.0107L13.0547 14.0156C12.723 14.2694 12.3602 14.4797 11.9756 14.6426L11.9678 14.6465L11.9551 14.6523L11.6748 14.7754L11.6318 15.0791L11.4062 16.6875C11.3878 16.8139 11.2801 16.9076 11.1523 16.9082H8.87598C8.74817 16.9077 8.6395 16.814 8.62109 16.6875V16.6846L8.38184 15.0811L8.33594 14.7744L8.05078 14.6553L7.76562 14.5244C7.48531 14.3857 7.21803 14.2216 6.96777 14.0332L6.9668 14.0322L6.9541 14.0225L6.70605 13.8369L6.41797 13.9531L4.9209 14.5586C4.79694 14.6055 4.65693 14.5575 4.58789 14.4443L3.45312 12.4785C3.39896 12.3819 3.41331 12.2633 3.48438 12.1826L3.51855 12.1504L4.78906 11.1582L5.02832 10.9707L4.99707 10.668L4.99609 10.6533L4.99512 10.6465L4.99414 10.6387L4.96289 10.3193C4.95599 10.2134 4.95241 10.1072 4.95215 10.001C4.95259 9.79645 4.96563 9.59171 4.99023 9.38867L4.99121 9.38184L4.99219 9.36719L5.02539 9.06348L4.78418 8.875L3.50293 7.87402H3.50391C3.40375 7.79531 3.37624 7.65545 3.43945 7.54492L4.57617 5.57422C4.64479 5.46552 4.7804 5.41903 4.90137 5.46289L6.39258 6.06641L6.68359 6.18359L6.93359 5.99316L6.94434 5.98438C7.27618 5.73073 7.63891 5.51951 8.02344 5.35645L8.03223 5.35352L8.0459 5.34668L8.32422 5.22266L8.36719 4.9209L8.59277 3.3125C8.61103 3.18602 8.71893 3.09155 8.84668 3.09082H11.124Z" stroke="#111" stroke-width="1.1"/><path d="M10 8.11707C10.9749 8.11813 11.7767 8.85903 11.874 9.80847L11.8838 10.0009C11.8834 11.0403 11.0405 11.8826 10.001 11.8827C8.9613 11.8826 8.11827 11.0396 8.11816 9.99988C8.11826 8.96053 8.96072 8.11769 10 8.11707Z" stroke="#111" stroke-width="1.1"/></svg>`,
  divider: `<svg width="375" height="1" viewBox="0 0 375 1" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H375V0.5H0V0Z" fill="#EFEFEF"/></svg>`,
  exitGroup: `<svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.75 15.747V19.75C15.75 20.303 15.3058 20.75 14.7562 20.75H1.74377C1.19521 20.75 0.75 20.303 0.75 19.75V1.75C0.75 1.197 1.19521 0.75 1.74377 0.75H14.7562C15.3058 0.75 15.75 1.197 15.75 1.75V5.753" stroke="#111" stroke-width="1.5"/><path d="M8.75 10.75H21.985" stroke="#111" stroke-width="1.5"/><path d="M17.9854 6.75L21.9854 10.75L17.9854 14.75" stroke="#111" stroke-width="1.5"/></svg>`,
  inviteGroup: `<svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.489 5.84229V15.1923" stroke="#111" stroke-width="1.5"/><path d="M17.8141 10.5173H27.1641" stroke="#111" stroke-width="1.5"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.33 0C13.432 0 15.786 2.433 15.87 5.688C16.057 6.013 16.243 6.521 16.148 7.174C15.975 8.355 15.459 8.955 15.069 9.248L14.6779 9.95677C14.3154 10.599 14.033 11.0558 13.781 11.454C13.548 11.823 13.46 12.568 13.86 12.849L19.109 16.467C20.0202 17.0942 20.5861 18.1037 20.6533 19.1989L20.66 19.419V23.1H0V19.092C0 18.118 0.477 17.205 1.278 16.655L6.8 12.848C7.2 12.568 7.112 11.823 6.879 11.453L6.61517 11.0311C6.33763 10.5802 6.01325 10.028 5.591 9.248C5.201 8.955 4.684 8.356 4.512 7.176C4.416 6.517 4.605 6.007 4.794 5.683C4.896 2.411 7.242 0 10.33 0ZM10.33 1.5C8.05897 1.5 6.39162 3.22735 6.29265 5.64076L6.288 5.869V6.12L6.139 6.364C6.066 6.458 5.953 6.662 5.996 6.959C6.09886 7.66186 6.35233 7.943 6.48373 8.04362L6.538 8.08L6.722 8.187L7.10255 8.88706C7.54211 9.68322 7.8635 10.206 8.146 10.651C8.799 11.683 8.76 13.305 7.661 14.076L2.129 17.89C1.77878 18.1318 1.55419 18.5134 1.5086 18.9331L1.5 19.092V21.6H19.16V19.419C19.16 18.733 18.823 18.091 18.259 17.704L12.999 14.077C11.9 13.305 11.861 11.683 12.514 10.652L12.8763 10.0674C13.1047 9.69022 13.368 9.23678 13.6929 8.63982L13.937 8.187L14.122 8.08C14.219 8.025 14.544 7.779 14.664 6.957C14.7009 6.70414 14.6231 6.51814 14.5542 6.41096L14.37 6.162V5.912C14.372 3.337 12.672 1.5 10.33 1.5Z" fill="#111"/></svg>`,
  membersGroup: `<svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.33 0C13.432 0 15.786 2.433 15.87 5.688C16.057 6.013 16.243 6.521 16.148 7.174C15.975 8.355 15.459 8.955 15.069 9.248L14.6779 9.95677C14.3154 10.599 14.033 11.0558 13.781 11.454C13.548 11.823 13.46 12.568 13.86 12.849L19.109 16.467C20.0202 17.0942 20.5861 18.1037 20.6533 19.1989L20.66 19.419V23.1H0V19.092C0 18.118 0.477 17.205 1.278 16.655L6.8 12.848C7.2 12.568 7.112 11.823 6.879 11.453L6.61517 11.0311C6.33763 10.5802 6.01325 10.028 5.591 9.248C5.201 8.955 4.684 8.356 4.512 7.176C4.416 6.517 4.605 6.007 4.794 5.683C4.896 2.411 7.242 0 10.33 0ZM16.2257 0.0002C19.3277 0.0002 21.6817 2.4332 21.7657 5.6882C21.9527 6.0132 22.1387 6.5212 22.0437 7.1742C21.8707 8.3552 21.3547 8.9552 20.9647 9.2482L20.5749 9.95329C20.2134 10.5933 19.9312 11.052 19.6777 11.4532C19.4427 11.8222 19.3557 12.5672 19.7557 12.8492L25.0047 16.4672C25.9159 17.0944 26.4827 18.103 26.5499 19.1989L26.5567 19.4192V23.1002H21.9097V21.6002H25.0567V19.4192C25.0567 18.7342 24.7197 18.0922 24.1537 17.7032L18.8947 14.0762C17.7947 13.3042 17.7567 11.6822 18.4097 10.6512L18.678 10.2216C18.898 9.86322 19.1482 9.43899 19.4547 8.88421L19.8327 8.1872L20.0177 8.0802C20.1137 8.0252 20.4397 7.7792 20.5597 6.9572C20.5966 6.70349 20.5181 6.5181 20.4495 6.41048L20.4167 6.3632L20.2657 6.1622V5.9112C20.2677 3.3372 18.5677 1.5002 16.2257 1.5002C16.0767 1.5002 15.9397 1.5292 15.7957 1.5422C15.4557 1.0622 15.0577 0.6332 14.6087 0.2632C15.1197 0.1082 15.6537 0.0002 16.2257 0.0002ZM10.33 1.5C8.05897 1.5 6.39162 3.22735 6.29265 5.64076L6.288 5.869V6.12L6.139 6.364C6.066 6.458 5.953 6.662 5.996 6.959C6.09886 7.66186 6.35233 7.943 6.48373 8.04362L6.538 8.08L6.722 8.187L7.10255 8.88706C7.54211 9.68322 7.8635 10.206 8.146 10.651C8.799 11.683 8.76 13.305 7.661 14.076L2.129 17.89C1.77878 18.1318 1.55419 18.5134 1.5086 18.9331L1.5 19.092V21.6H19.16V19.419C19.16 18.733 18.823 18.091 18.259 17.704L12.999 14.077C11.9 13.305 11.861 11.683 12.514 10.652L12.8763 10.0674C13.1047 9.69022 13.368 9.23678 13.6929 8.63982L13.937 8.187L14.122 8.08C14.219 8.025 14.544 7.779 14.664 6.957C14.7009 6.70414 14.6231 6.51814 14.5542 6.41096L14.37 6.162V5.912C14.372 3.337 12.672 1.5 10.33 1.5Z" fill="#111"/></svg>`,
  muteOffGroup: `<svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.5007 7.316H0.75V16.849H8.5007L15.25 23.416V0.75L8.5007 7.316Z" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/><path d="M18.75 8.38196C19.037 8.56296 19.308 8.77796 19.558 9.02796C21.38 10.851 21.38 13.806 19.558 15.628C19.308 15.878 19.037 16.093 18.75 16.275" stroke="#111" stroke-width="1.5"/><path d="M20.75 4.99915C21.282 5.33615 21.785 5.73515 22.249 6.19915C25.634 9.58415 25.634 15.0711 22.249 18.4561C21.785 18.9201 21.282 19.3201 20.75 19.6571" stroke="#111" stroke-width="1.5"/></svg>`,
  subtabBack: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2762 20.5523L2.72388 12L11.2762 3.44775" stroke="#000" stroke-width="1.5"/></svg>`,
};

const Icon: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => (
  <span
    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...style }}
    dangerouslySetInnerHTML={{ __html: ICONS[name] ?? "" }}
  />
);

const labelStyle: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: 13,
  fontWeight: fw.Regular,
  color: "#111",
  lineHeight: "20px",
  height: 20,
  whiteSpace: "nowrap",
};

const AlbumCard: React.FC<{ left: number; title: string; titleW: number; count: string; countLeft: number; countW: number; img: string }> = ({ left, title, titleW, count, countLeft, countW, img }) => (
  <div style={{ position: "absolute", left, top: 45, width: 171, height: 85, background: `#F5F5F5 url(${img}) center/cover no-repeat`, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 47, width: 171, height: 38, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)" }} />
    <span style={{ position: "absolute", left: 11, top: 61, width: titleW, height: 16, fontFamily: fontStack, fontSize: 13, fontWeight: fw.Bold, color: "#FFFFFF", lineHeight: "16px", textShadow: "0 0 1px rgba(0,0,0,0.2)" }}>{title}</span>
    <span style={{ position: "absolute", left: countLeft, top: 61, width: countW, height: 16, fontFamily: fontStack, fontSize: 13, fontWeight: fw.Regular, color: "#FFFFFF", lineHeight: "16px", textShadow: "0 0 1px rgba(0,0,0,0.2)" }}>{count}</span>
  </div>
);

const SimpleRow: React.FC<{ label: string; labelW: number; icon: string; iconL: number; iconT: number; iconW: number; iconH: number }> = ({ label, labelW, icon, iconL, iconT, iconW, iconH }) => (
  <div style={{ position: "relative", width: 375, height: 50, background: "#FFFFFF", flexShrink: 0 }}>
    <Icon name={icon} style={{ position: "absolute", left: iconL, top: iconT, width: iconW, height: iconH }} />
    <span style={{ position: "absolute", left: 45, top: 16, width: labelW, ...labelStyle }}>{label}</span>
    <Icon name="chevronMore" style={{ position: "absolute", left: 351, top: 20, width: 6, height: 11 }} />
  </div>
);

const ChatMenu: React.FC = () => (
  <div style={{ position: "relative", width: 375, height: 812, background: "#FFFFFF", overflow: "hidden", fontFamily: fontStack }}>
    {/* Status Bar */}
    <div style={{ position: "absolute", left: 0, top: 0, width: 375, height: 44 }}>
      <span style={{ position: "absolute", left: 20, top: 14, width: 54, height: 18, fontFamily: fontStack, fontSize: 15, fontWeight: fw.Semibold, color: "#000", textAlign: "center", lineHeight: 1 }}>9:41</span>
      <Icon name="cellular" style={{ position: "absolute", left: 294, top: 18, width: 17, height: 11 }} />
      <Icon name="wifi" style={{ position: "absolute", left: 316, top: 17, width: 15, height: 11 }} />
      <Icon name="battery" style={{ position: "absolute", left: 336, top: 17, width: 24, height: 11 }} />
    </div>

    {/* Subtab */}
    <div style={{ position: "absolute", left: 0, top: 44, width: 375, height: 44, background: "#FFFFFF", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "17px 19px 17px 16px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20 }}>
        <Icon name="subtabBack" style={{ width: 24, height: 24 }} />
        <span style={{ fontFamily: fontStack, fontSize: 17, fontWeight: fw.Semibold, color: "#000", lineHeight: "26px" }}>同期会 (5)</span>
      </div>
    </div>

    {/* Quick layout */}
    <div style={{ position: "absolute", left: 0, top: 88, width: 375, height: 86, background: "#FFFFFF" }}>
      <Icon name="divider" style={{ position: "absolute", left: 0, top: 85, width: 375, height: 1 }} />
      {[
        { label: "通知オフ", icon: "muteOffGroup", iw: 24, ih: 23, ix: 15, iy: 6, left: 0, w: 94, wrapL: 23 },
        { label: "メンバー", icon: "membersGroup", iw: 27, ih: 23, ix: 12, iy: 5, left: 94, w: 93, wrapL: 22 },
        { label: "招待", icon: "inviteGroup", iw: 27, ih: 23, ix: 13, iy: 5, left: 187, w: 94, wrapL: 23 },
        { label: "退会", icon: "exitGroup", iw: 21, ih: 20, ix: 16, iy: 7, left: 281, w: 94, wrapL: 23 },
      ].map((b) => (
        <div key={b.label} style={{ position: "absolute", left: b.left, top: 0, width: b.w, height: 86 }}>
          <div style={{ position: "absolute", left: b.wrapL, top: 11, width: 49, height: 34 }}>
            <Icon name={b.icon} style={{ position: "absolute", left: b.ix, top: b.iy, width: b.iw, height: b.ih }} />
          </div>
          <span style={{ position: "absolute", left: 10, top: 49, width: b.label === "メンバー" ? 73 : 74, height: 17, fontFamily: fontStack, fontSize: 11, fontWeight: fw.Semibold, color: "#111", textAlign: "center", lineHeight: "17px" }}>{b.label}</span>
        </div>
      ))}
    </div>

    {/* Stack */}
    <div style={{ position: "absolute", left: 0, top: 184, width: 375, height: 622, display: "flex", flexDirection: "column", paddingBottom: 21, boxSizing: "border-box" }}>
      {/* グループプロフィール */}
      <div style={{ position: "relative", width: 375, height: 50, background: "#FFFFFF", flexShrink: 0 }}>
        <Icon name="userCircle" style={{ position: "absolute", left: 16, top: 15, width: 20, height: 20 }} />
        <span style={{ position: "absolute", left: 45, top: 16, width: 124, ...labelStyle }}>グループプロフィール</span>
        <Icon name="chevronMore" style={{ position: "absolute", left: 351, top: 20, width: 6, height: 11 }} />
        <div style={{ position: "absolute", left: 275, top: 16, width: 66, height: 23, display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
          <span style={{ width: 17, height: 17, borderRadius: "50%", background: "#17C098", flexShrink: 0 }} />
          <span style={{ fontFamily: fontStack, fontSize: 15, fontWeight: fw.Regular, color: "#949494", lineHeight: "23px" }}>同期会</span>
        </div>
      </div>

      {/* BGM */}
      <div style={{ position: "relative", width: 375, height: 50, background: "#FFFFFF", flexShrink: 0 }}>
        <Icon name="musicNote" style={{ position: "absolute", left: 19, top: 17, width: 13, height: 15 }} />
        <span style={{ position: "absolute", left: 45, top: 16, width: 34, height: 18, fontFamily: fontStack, fontSize: 15, fontWeight: fw.Regular, color: "#111", lineHeight: "18px" }}>BGM</span>
        <Icon name="chevronMore" style={{ position: "absolute", left: 351, top: 20, width: 6, height: 11 }} />
        <div style={{ position: "absolute", left: 248, top: 16, width: 94, height: 18 }}>
          <span style={{ position: "absolute", left: 0, top: 0, width: 97, height: 18, fontFamily: fontStack, fontSize: 15, fontWeight: fw.Regular, color: "#949494", lineHeight: "18px", whiteSpace: "nowrap" }}>Put some mus</span>
        </div>
      </div>

      {/* 写真・動画 */}
      <div style={{ position: "relative", width: 375, height: 136, background: "#FFFFFF", flexShrink: 0 }}>
        <Icon name="photoVideo" style={{ position: "absolute", left: 16, top: 15, width: 20, height: 20 }} />
        <span style={{ position: "absolute", left: 45, top: 16, width: 64, ...labelStyle }}>写真・動画</span>
        <Icon name="chevronMore" style={{ position: "absolute", left: 351, top: 20, width: 6, height: 11 }} />
        {[
          { left: 16, dim: true, vr: true, duration: undefined as string | undefined, img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=170&h=170&fit=crop&auto=format" },
          { left: 102, dim: true, vr: false, duration: undefined as string | undefined, img: "https://images.unsplash.com/photo-1543269664-7eef42226a21?w=170&h=170&fit=crop&auto=format" },
          { left: 188, dim: false, vr: false, duration: undefined as string | undefined, img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=170&h=170&fit=crop&auto=format" },
          { left: 274, dim: true, vr: false, duration: "0:32", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=170&h=170&fit=crop&auto=format" },
        ].map((tile) => (
          <div key={tile.left} style={{ position: "absolute", left: tile.left, top: 45, width: 85, height: 85, background: `#F5F5F5 url(${tile.img}) center/cover no-repeat`, overflow: "hidden" }}>
            {tile.dim && <div style={{ position: "absolute", left: 0, top: 47, width: 85, height: 38, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)" }} />}
            {tile.vr && <Icon name="vrPlay" style={{ position: "absolute", left: 6, top: 69, width: 11, height: 11 }} />}
            {tile.duration && (
              <span style={{ position: "absolute", left: 28, top: 67, width: 50, height: 13, fontFamily: fontStack, fontSize: 11, fontWeight: fw.Regular, color: "#FFFFFF", textAlign: "center", lineHeight: "13px", textShadow: "0 0 1px rgba(0,0,0,0.2)" }}>{tile.duration}</span>
            )}
          </div>
        ))}
      </div>

      {/* アルバム */}
      <div style={{ position: "relative", width: 375, height: 136, flexShrink: 0 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 375, height: 136, background: "#FFFFFF" }} />
        <Icon name="album" style={{ position: "absolute", left: 16, top: 15, width: 20, height: 20 }} />
        <span style={{ position: "absolute", left: 45, top: 16, width: 50, ...labelStyle }}>アルバム</span>
        <Icon name="chevronMore" style={{ position: "absolute", left: 351, top: 20, width: 6, height: 11 }} />
        <div style={{ position: "absolute", left: 16, top: 45, width: 343, height: 85, background: "#FFFFFF", border: "1px solid #EFEFEF", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
          <span style={{ fontFamily: fontStack, fontSize: 12, fontWeight: fw.Semibold, color: "#000", lineHeight: 1 }}>アルバム作成</span>
        </div>
        <AlbumCard left={16} title="Home Party" titleW={77} count="72" countLeft={92} countW={16} img="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=350&h=170&fit=crop&auto=format" />
        <div style={{ position: "absolute", left: 188, top: 45, width: 171, height: 85, background: `#F5F5F5 url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=350&h=170&fit=crop&auto=format) center/cover no-repeat`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 47, width: 171, height: 38, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)" }} />
          <div style={{ position: "absolute", left: 11, top: 61, height: 16, display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: fontStack, fontSize: 13, fontWeight: fw.Bold, color: "#FFFFFF", lineHeight: "16px", textShadow: "0 0 1px rgba(0,0,0,0.2)" }}>Cafetour</span>
            <span style={{ fontFamily: fontStack, fontSize: 13, fontWeight: fw.Regular, color: "#FFFFFF", lineHeight: "16px", textShadow: "0 0 1px rgba(0,0,0,0.22)" }}>131</span>
          </div>
        </div>
      </div>

      {/* description */}
      <div style={{ position: "relative", width: 375, height: 29, padding: "6px 16px", boxSizing: "border-box", flexShrink: 0 }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5, height: 17 }}>
          <div style={{ width: 40, height: 15, background: "#06C755", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
            <span style={{ fontFamily: fontStack, fontSize: 8.3, fontWeight: fw.Heavy, color: "#FFFFFF", lineHeight: 1 }}>CHECK</span>
          </div>
          <div style={{ position: "relative", width: 236, height: 17 }}>
            <span style={{ position: "absolute", left: 0, top: 0, width: 227, height: 17, fontFamily: fontStack, fontSize: 11, fontWeight: fw.Regular, color: "#616161", lineHeight: "17px", whiteSpace: "nowrap" }}>動画やオリジナル画質の写真を追加するには？</span>
            <Icon name="arrowRightSmall" style={{ position: "absolute", left: 229, top: 3, width: 7, height: 11 }} />
          </div>
        </div>
      </div>

      <SimpleRow label="ノート" labelW={39} icon="note" iconL={16} iconT={15} iconW={20} iconH={20} />
      <SimpleRow label="イベント" labelW={50} icon="event" iconL={19} iconT={17} iconW={14} iconH={15} />
      <SimpleRow label="リンク" labelW={39} icon="link" iconL={16} iconT={15} iconW={20} iconH={20} />
      <SimpleRow label="ファイル" labelW={51} icon="file" iconL={16} iconT={15} iconW={20} iconH={20} />
      <div style={{ position: "absolute", left: 0, top: 601, width: 375 }}>
        <div style={{ position: "relative", width: 375, height: 50, background: "#FFFFFF" }}>
          <Icon name="settings" style={{ position: "absolute", left: 16, top: 15, width: 20, height: 20 }} />
          <span style={{ position: "absolute", left: 45, top: 16, width: 30, height: 18, fontFamily: fontStack, fontSize: 15, fontWeight: fw.Regular, color: "#111", lineHeight: "18px" }}>設定</span>
          <Icon name="chevronMore" style={{ position: "absolute", left: 351, top: 20, width: 6, height: 11 }} />
        </div>
      </div>
    </div>

    {/* Home indicator */}
    <div style={{ position: "absolute", left: 0, top: 778, width: 375, height: 34 }}>
      <div style={{ position: "absolute", left: 121, top: 21, width: 134, height: 5, background: "#000", borderRadius: 100 }} />
    </div>
  </div>
);

export default ChatMenu;
