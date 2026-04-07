/** Expected catalog size (matches `supabase/migrations` seed). */
export const TOTAL_STICKERS = 60;

export const countryFlags: Record<string, string> = {
  ARG: "🇦🇷",
  BRA: "🇧🇷",
  FRA: "🇫🇷",
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  GER: "🇩🇪",
  ESP: "🇪🇸",
  POR: "🇵🇹",
  NED: "🇳🇱",
  ITA: "🇮🇹",
  MAR: "🇲🇦",
  USA: "🇺🇸",
  JPN: "🇯🇵",
};

export const countryColors: Record<string, { bg: string; text: string }> = {
  ARG: { bg: "bg-sky-100", text: "text-sky-800" },
  BRA: { bg: "bg-yellow-100", text: "text-yellow-800" },
  FRA: { bg: "bg-blue-100", text: "text-blue-800" },
  ENG: { bg: "bg-red-100", text: "text-red-800" },
  GER: { bg: "bg-gray-100", text: "text-gray-800" },
  ESP: { bg: "bg-orange-100", text: "text-orange-800" },
  POR: { bg: "bg-green-100", text: "text-green-800" },
  NED: { bg: "bg-orange-100", text: "text-orange-700" },
  ITA: { bg: "bg-indigo-100", text: "text-indigo-800" },
  MAR: { bg: "bg-red-100", text: "text-red-700" },
  USA: { bg: "bg-blue-100", text: "text-blue-700" },
  JPN: { bg: "bg-red-100", text: "text-red-700" },
};
