import React from 'react';

export async function ManUtdScore() {
    try {
        const res = await fetch(
            "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/360/schedule",
            { cache: "no-store" }
        );
        if (!res.ok) return null;

        const data = await res.json();
        if (!data || !data.events) return null;

        const events = data.events;
        // Sort events by date chronologically
        events.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Current time locally
        const now = new Date();

        const liveMatch = events.find((e: any) => e.competitions[0].status.type.state === "in");
        const upcomingMatch = events.find((e: any) => e.competitions[0].status.type.state === "pre");

        let isUpcomingToday = false;
        if (upcomingMatch) {
            const matchDate = new Date(upcomingMatch.date);
            if (
                matchDate.getDate() === now.getDate() &&
                matchDate.getMonth() === now.getMonth() &&
                matchDate.getFullYear() === now.getFullYear()
            ) {
                isUpcomingToday = true;
            }
        }

        const completedMatches = events.filter((e: any) => e.competitions[0].status.type.state === "post");
        const lastCompletedMatch = completedMatches[completedMatches.length - 1];

        let displayMatch = null;
        let matchStatus = "";

        if (liveMatch) {
            displayMatch = liveMatch;
            matchStatus = "Live Match";
        } else if (isUpcomingToday && upcomingMatch) {
            displayMatch = upcomingMatch;
            matchStatus = "Upcoming Match Today";
        } else if (lastCompletedMatch) {
            displayMatch = lastCompletedMatch;
            matchStatus = "Last Match";
        } else {
            return null;
        }

        const comp = displayMatch.competitions[0];
        const team1 = comp.competitors[0];
        const team2 = comp.competitors[1];

        const manUtd = team1.team.id === "360" ? team1 : team2;
        const opponent = team1.team.id === "360" ? team2 : team1;

        let mood = "watching";
        if (matchStatus === "Last Match") {
            if (manUtd.winner) mood = "win";
            else if (opponent.winner) mood = "lose";
            else mood = "draw";
        }

        return (
            <div className="border-l border-neutral-100 dark:border-neutral-800/50 flex items-center justify-end gap-3">
                <div className="flex-shrink-0 transition-transform duration-300 hover:-rotate-6 hover:scale-110 cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/moods/${mood}.png`} alt={`Mood: ${mood}`} className="w-14 h-14 object-contain drop-shadow-sm" />
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="text-[10px] font-bold text-neutral-500 mb-1 uppercase tracking-wider">{matchStatus}</div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 w-14 justify-end hover:scale-105 transition-transform">
                            <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">{team1.team.abbreviation}</span>
                            {team1.team.logos?.[0]?.href && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={team1.team.logos[0].href} alt={team1.team.displayName} className="w-5 h-5 object-contain" />
                            )}
                        </div>

                        {matchStatus === "Upcoming Match Today" ? (
                            <div className="text-xs font-bold text-neutral-400 px-1">vs</div>
                        ) : (
                            <div className="flex items-center gap-1 font-bold text-sm px-2 py-0.5 rounded shadow-sm border border-neutral-100 dark:border-neutral-800">
                                <span className={team1.winner ? "text-green-600 dark:text-green-500" : ""}>{team1.score?.displayValue ?? "-"}</span>
                                <span className="text-neutral-400 font-normal">-</span>
                                <span className={team2.winner ? "text-green-600 dark:text-green-500" : ""}>{team2.score?.displayValue ?? "-"}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1 w-14 justify-start hover:scale-105 transition-transform">
                            {team2.team.logos?.[0]?.href && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={team2.team.logos[0].href} alt={team2.team.displayName} className="w-5 h-5 object-contain" />
                            )}
                            <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">{team2.team.abbreviation}</span>
                        </div>
                    </div>

                    {(matchStatus === "Live Match" || matchStatus === "Last Match") && (
                        <div className="text-[10px] text-neutral-500 mt-1 font-medium">
                            {comp.status.type.detail}
                        </div>
                    )}
                    {matchStatus === "Upcoming Match Today" && (
                        <div className="text-[10px] text-neutral-500 mt-1 font-medium">
                            {new Date(displayMatch.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch Man Utd score:", error);
        return null;
    }
}
