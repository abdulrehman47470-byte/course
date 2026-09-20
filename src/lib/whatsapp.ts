// Single source of truth for the site's WhatsApp number, used by the
// eligibility page's registration form and the sitewide floating
// "WhatsApp" button. Set VITE_WHATSAPP_NUMBER in .env (digits only, country
// code first, e.g. "923001234567") to wire these up.
export const WHATSAPP_NUMBER: string = import.meta.env["VITE_WHATSAPP_NUMBER"] ?? "";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
