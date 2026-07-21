/**
 * Escape a string for safe interpolation into HTML email bodies.
 * Prevents user-supplied form input from injecting markup or links into
 * the notification emails we send to ourselves.
 */
export function escapeHtml(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Collapse newlines/control characters out of a value destined for an email
 * subject line, preventing header injection.
 */
export function sanitizeSubject(value: string | null | undefined): string {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}
