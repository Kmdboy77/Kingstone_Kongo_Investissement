/**
 * UserAvatar — pastille ronde affichant les 2 initiales de l'utilisateur
 * (ex: "Kenny Kaneki" -> "KK", "Daisy Mudibu" -> "DM").
 * Remplace le badge email dans le header une fois connecté.
 *
 * Priorité de résolution des initiales :
 * 1. profile.full_name  (ex: "Daisy Kongo" -> "DK")
 * 2. user.email          (ex: "daisy@mail.com" -> "D")
 * 3. fallback "?"
 */
function getInitials(fullName, email) {
  if (fullName && fullName.trim().length > 0) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.length > 0) {
    return email.slice(0, 2).toUpperCase();
  }
  return "?";
}

export default function UserAvatar({ user, profile, onClick, size = 36 }) {
  const initials = getInitials(profile?.full_name, user?.email);

  return (
    <button
      onClick={onClick}
      title={profile?.full_name || user?.email || "Mon compte"}
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full font-bold text-[11px] tracking-wide
                 bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25
                 transition-all duration-300 shrink-0"
    >
      {initials}
    </button>
  );
}