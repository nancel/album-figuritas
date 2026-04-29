/** Etiqueta corta para UI (meta “name” o parte local del email). */
export function displayLabelFromUser(user: {
  user_metadata?: Record<string, unknown>;
  email?: string | null;
}): string {
  const name = user.user_metadata?.name;
  if (typeof name === "string" && name.trim()) return name.trim();
  const email = user.email;
  if (email?.includes("@")) return email.split("@")[0] ?? "Usuario";
  return "Usuario";
}
