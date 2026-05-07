import worldcupData from "@/data/worldcup.json";

type RawWorldCupMatch = {
  round: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  group?: string;
  ground: string;
};

export type FixtureMatch = {
  id: string;
  round: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  group?: string;
  ground: string;
  kickoffUtc: Date;
  argentinaDateLabel: string;
  argentinaDateKey: string;
  argentinaTimeLabel: string;
};

type RawWorldCupPayload = {
  name: string;
  matches: RawWorldCupMatch[];
};

const ARGENTINA_TIMEZONE = "America/Argentina/Buenos_Aires";
const timeZoneDateFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: ARGENTINA_TIMEZONE,
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});
const timeZoneDateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: ARGENTINA_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const timeZoneTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: ARGENTINA_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function parseKickoffUtc(date: string, time: string): Date {
  const [, year, month, day] = date.match(/^(\d{4})-(\d{2})-(\d{2})$/) ?? [];
  const [, hour, minute, sign, offsetHours] =
    time.match(/^(\d{2}):(\d{2})\sUTC([+-])(\d{1,2})$/) ?? [];

  if (!year || !month || !day || !hour || !minute || !sign || !offsetHours) {
    throw new Error(`Formato de fixture inválido: ${date} ${time}`);
  }

  const offset = Number(offsetHours) * (sign === "+" ? 1 : -1);
  const utcMs =
    Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)) -
    offset * 60 * 60 * 1000;

  return new Date(utcMs);
}

function toFixtureMatch(match: RawWorldCupMatch, index: number): FixtureMatch {
  const kickoffUtc = parseKickoffUtc(match.date, match.time);
  return {
    id: `${match.round}-${index}-${match.team1}-${match.team2}`,
    ...match,
    kickoffUtc,
    argentinaDateLabel: timeZoneDateFormatter.format(kickoffUtc),
    argentinaDateKey: timeZoneDateKeyFormatter.format(kickoffUtc),
    argentinaTimeLabel: timeZoneTimeFormatter.format(kickoffUtc),
  };
}

function getAllMatches(): FixtureMatch[] {
  const payload = worldcupData as RawWorldCupPayload;
  return payload.matches.map(toFixtureMatch).sort((a, b) => a.kickoffUtc.getTime() - b.kickoffUtc.getTime());
}

export function getGroupStageMatchesByGroup() {
  const grouped = new Map<string, FixtureMatch[]>();
  const groupMatches = getAllMatches().filter((match) => Boolean(match.group));

  for (const match of groupMatches) {
    const key = match.group as string;
    const list = grouped.get(key) ?? [];
    list.push(match);
    grouped.set(key, list);
  }

  return Array.from(grouped.entries())
    .sort(([groupA], [groupB]) => groupA.localeCompare(groupB))
    .map(([group, matches]) => ({ group, matches }));
}

export function getClosestMatchDayMatches(referenceDate = new Date()) {
  const matches = getAllMatches();
  const todayKey = timeZoneDateKeyFormatter.format(referenceDate);
  const byDate = new Map<string, FixtureMatch[]>();

  for (const match of matches) {
    const list = byDate.get(match.argentinaDateKey) ?? [];
    list.push(match);
    byDate.set(match.argentinaDateKey, list);
  }

  const orderedDates = Array.from(byDate.keys()).sort((a, b) => a.localeCompare(b));
  const nearestDateKey = orderedDates.find((dateKey) => dateKey >= todayKey) ?? orderedDates[orderedDates.length - 1];
  const dayMatches = byDate.get(nearestDateKey) ?? [];
  const isToday = nearestDateKey === todayKey;

  return {
    isToday,
    dateKey: nearestDateKey,
    matches: dayMatches.sort((a, b) => a.kickoffUtc.getTime() - b.kickoffUtc.getTime()),
  };
}
