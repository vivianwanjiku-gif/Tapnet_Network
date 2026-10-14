/** Replace with the TapNet WhatsApp desk before launch. Digits only, country code first. */
export const whatsappNumber = "254711000111";

export function whatsappHref(text = "Hello TapNet, I would like to ask about home internet.") {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const trustSignals = [
  { label: "Speed", value: "50 Mbps", detail: "Top speed on Premium" },
  { label: "Uptime", value: "99.9%", detail: "The target we run to" },
  { label: "Support", value: "24/7", detail: "Tickets and WhatsApp" },
  { label: "Payments", value: "M-Pesa", detail: "Airtel Money too" },
];

export const coverageTowns = [
  {
    town: "Nairobi",
    areas: "CBD, Westlands, Karen",
    note: "Home and shop lines in the estates we already light up.",
  },
  {
    town: "Mombasa",
    areas: "Nyali, Tudor",
    note: "Coastal homes that want a bill they can predict.",
  },
  {
    town: "Kisumu",
    areas: "Milimani",
    note: "Lake-side households and small offices.",
  },
  {
    town: "Nakuru",
    areas: "Section 58",
    note: "Growing coverage for family connections.",
  },
];

export const reasons = [
  {
    title: "Pay the way Kenya pays",
    body: "M-Pesa through Safaricom, or Airtel Money through IntaSend. The package starts only after the payment is confirmed.",
  },
  {
    title: "A price for the week you are having",
    body: "Start at KSh 50 for a day, or stay on a monthly plan. There is no long contract on these packages.",
  },
  {
    title: "You can see the line",
    body: "Status, expiry, data used, connected devices, and payment references live in one customer portal.",
  },
  {
    title: "Help with a paper trail",
    body: "Open a support ticket for slow speeds, payments, or the router. You can see whether it is open, in progress, or resolved.",
  },
  {
    title: "Switch when life changes",
    body: "Buy a different package from your account. Admins can activate, suspend, or retire a plan without a spreadsheet.",
  },
  {
    title: "Built for homes and dukas",
    body: "The same account works for a household, a salon, or a small office. Staff run customers, subscriptions, and the network from the admin console.",
  },
];

export const steps = [
  {
    n: "01",
    title: "Choose a plan",
    body: "Compare speed, data, and how many days you need. The monthly plan is the one most households keep.",
  },
  {
    n: "02",
    title: "Approve the payment",
    body: "Approve the M-Pesa or Airtel Money prompt on your phone. The package stays off until that payment is confirmed.",
  },
  {
    n: "03",
    title: "Use the connection",
    body: "The dashboard shows online status and the expiry date. Renew before it lapses, or open a ticket if something feels off.",
  },
];

export const stories = [
  {
    quote: "I only switch the salon Wi-Fi on when we have clients. The daily plan means I am not paying for Monday when we are closed.",
    name: "Wanjiku M.",
    place: "Salon owner, Nairobi",
  },
  {
    quote: "The M-Pesa prompt came through, I approved it, and the monthly package was already active when I opened the dashboard.",
    name: "Otieno K.",
    place: "Kisumu",
  },
  {
    quote: "Schoolwork and evening classes share one line. I check the gigabytes left instead of guessing why YouTube is buffering.",
    name: "Amina H.",
    place: "Mombasa",
  },
];

export const faqs = [
  {
    q: "How do I pay?",
    a: "From your account, choose a package and pay with M-Pesa or Airtel Money. You approve a prompt on your phone. The package starts after Safaricom or IntaSend confirms the payment.",
  },
  {
    q: "Is there a contract?",
    a: "These plans are prepaid. A daily plan lasts a day, a weekly plan lasts seven days, and monthly plans last 30 days. When the time is up, access stops until you pay again.",
  },
  {
    q: "What speeds and data do I get?",
    a: "Each plan lists its speed and data cap before you pay. Premium is the unlimited monthly option. Other plans show a gigabyte allowance in your usage view.",
  },
  {
    q: "Where is TapNet available?",
    a: "Service is live in parts of Nairobi, Mombasa, Kisumu, and Nakuru. If your estate is not listed yet, send a note from the contact form and we will tell you when it is.",
  },
  {
    q: "Can I change or pause a package?",
    a: "Buy another package whenever you want. Staff can suspend a subscription or an account from the admin console if a line needs to be held.",
  },
  {
    q: "How do I get help?",
    a: "Sign in and open a support ticket so the history stays on the account. You can also WhatsApp the desk, or use the contact form for coverage questions before you join.",
  },
];
