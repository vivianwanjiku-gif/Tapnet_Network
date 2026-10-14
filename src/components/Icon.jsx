const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export default function Icon({ name, className = "h-5 w-5" }) {
  const props = { ...common, className };
  switch (name) {
    case "wifi":
      return (
        <svg {...props}>
          <path d="M5 12.5a10 10 0 0 1 14 0" />
          <path d="M8.2 15.4a5.6 5.6 0 0 1 7.6 0" />
          <path d="M12 19h.01" />
        </svg>
      );
    case "menu":
      return (
        <svg {...props}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...props}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...props}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <path d="M5 12.5 9.2 17 19 7" />
        </svg>
      );
    case "home":
      return (
        <svg {...props}>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M7 10.5V20h10v-9.5" />
        </svg>
      );
    case "package":
      return (
        <svg {...props}>
          <path d="M3.5 8 12 4l8.5 4L12 12 3.5 8Z" />
          <path d="M12 12v8M3.5 8v8L12 20l8.5-4V8" />
        </svg>
      );
    case "card":
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
    case "receipt":
      return (
        <svg {...props}>
          <path d="M7 3.5h10v17l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2V3.5Z" />
          <path d="M9 8h6M9 12h6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...props}>
          <path d="M4 19V5M4 19h16" />
          <path d="M8 15v-3M12 15V8M16 15v-5" />
        </svg>
      );
    case "device":
      return (
        <svg {...props}>
          <rect x="7" y="2.5" width="10" height="19" rx="2" />
          <path d="M11 18.5h2" />
        </svg>
      );
    case "bell":
      return (
        <svg {...props}>
          <path d="M6 16V10a6 6 0 1 1 12 0v6l1.5 2H4.5L6 16Z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      );
    case "support":
      return (
        <svg {...props}>
          <path d="M4 13a8 8 0 0 1 16 0" />
          <path d="M4 13v4a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2ZM20 13v4a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
        </svg>
      );
    case "user":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 19.2c1.4-2.8 3.8-4 7-4s5.6 1.2 7 4" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <circle cx="9" cy="9" r="3" />
          <path d="M3.5 19c1.1-2.4 3-3.5 5.5-3.5S13.4 16.6 14.5 19" />
          <circle cx="17" cy="9.5" r="2.2" />
          <path d="M16.2 15.6c1.6.2 2.9 1 3.8 2.4" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...props}>
          <path d="M20 12a8 8 0 1 1-2.2-5.5" />
          <path d="M20 4.5V9h-4.5" />
        </svg>
      );
    case "server":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="6" rx="1.5" />
          <rect x="3" y="14" width="18" height="6" rx="1.5" />
          <path d="M7 7h.01M7 17h.01" />
        </svg>
      );
    case "log":
      return (
        <svg {...props}>
          <path d="M8 4h9a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
          <path d="M6 8H5a2 2 0 0 0-2 2v10h11" />
          <path d="M10 9h6M10 13h6" />
        </svg>
      );
    case "logout":
      return (
        <svg {...props}>
          <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" />
          <path d="M4 12h10M11 8l4 4-4 4" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "pin":
      return (
        <svg {...props}>
          <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
          <circle cx="12" cy="11" r="2" />
        </svg>
      );
    case "phone":
      return (
        <svg {...props}>
          <path d="M8 3.5h3l1.2 3-2 1.2a12 12 0 0 0 5.1 5.1l1.2-2 3 1.2v3A2 2 0 0 1 17.6 17 14.5 14.5 0 0 1 7 6.4a2 2 0 0 1 1-2.9Z" />
        </svg>
      );
    default:
      return null;
  }
}
