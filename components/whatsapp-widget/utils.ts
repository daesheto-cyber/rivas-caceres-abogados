/**
 * Construye un enlace wa.me limpio.
 * - Elimina todo carácter no numérico del teléfono (espacios, guiones, paréntesis).
 * - Omite el parámetro ?text si el mensaje está vacío.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const trimmed = message.trim();
  if (!trimmed) return `https://wa.me/${cleaned}`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(trimmed)}`;
}
