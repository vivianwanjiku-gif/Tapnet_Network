/** Normalize a Kenyan mobile number to 2547XXXXXXXX or 2541XXXXXXXX. */
export function normalizeKenyanPhone(input) {
  const digits = String(input || "").replace(/\D/g, "");
  let national = digits;
  if (national.startsWith("254") && national.length === 12) {
    national = national.slice(3);
  } else if (national.startsWith("0") && national.length === 10) {
    national = national.slice(1);
  }
  if (!/^[17]\d{8}$/.test(national)) {
    throw new Error("Enter a Kenyan mobile number, for example 0712 345 678.");
  }
  return `254${national}`;
}
