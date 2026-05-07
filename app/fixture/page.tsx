import { redirect } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getFlagByTeamName, getTeamNameEs } from "@/lib/worldcup-teams";
import { getClosestMatchDayMatches, getGroupStageMatchesByGroup } from "@/lib/worldcup-fixture";

export default async function FixturePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const groups = getGroupStageMatchesByGroup();
  const nearestMatchDay = getClosestMatchDayMatches();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <section>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
            Fixture del Mundial
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fase de grupos con fechas y horarios en UTC-3 (Argentina).
          </p>
        </section>

        <section aria-labelledby="next-matches-heading">
          <h2
            id="next-matches-heading"
            className="mb-3 font-display text-base font-bold uppercase tracking-wider text-foreground"
          >
            {nearestMatchDay.isToday ? "Partidos de Hoy" : "Próximos Partidos"}
          </h2>
          <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm divide-y divide-border">
            {nearestMatchDay.matches.map((match) => (
              <li key={match.id} className="space-y-1 px-4 py-3">
                <p className="text-sm font-semibold text-foreground">
                  <span className="mr-1" aria-hidden>
                    {getFlagByTeamName(match.team1)}
                  </span>
                  {getTeamNameEs(match.team1)} vs{" "}
                  <span className="mr-1 ml-1" aria-hidden>
                    {getFlagByTeamName(match.team2)}
                  </span>
                  {getTeamNameEs(match.team2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {match.argentinaDateLabel} · {match.argentinaTimeLabel} hs · {match.round}
                </p>
                <p className="text-xs text-muted-foreground/90">{match.ground}</p>
              </li>
            ))}
          </ul>
        </section>

        {groups.map(({ group, matches }) => (
          <section key={group} aria-labelledby={group} className="space-y-3">
            <h2
              id={group}
              className="font-display text-base font-bold uppercase tracking-wider text-foreground"
            >
              {group}
            </h2>

            <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm divide-y divide-border">
              {matches.map((match) => (
                <li key={match.id} className="space-y-1 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">
                    <span className="mr-1" aria-hidden>
                      {getFlagByTeamName(match.team1)}
                    </span>
                    {getTeamNameEs(match.team1)} vs{" "}
                    <span className="mr-1 ml-1" aria-hidden>
                      {getFlagByTeamName(match.team2)}
                    </span>
                    {getTeamNameEs(match.team2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {match.argentinaDateLabel} · {match.argentinaTimeLabel} hs · {match.round}
                  </p>
                  <p className="text-xs text-muted-foreground/90">{match.ground}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          <p className="inline-flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" />
            Horarios convertidos automáticamente a zona horaria Argentina.
          </p>
        </div>
      </main>
    </div>
  );
}
