// Pure, framework-free helpers that turn the mock data into everything the
// dashboard home page renders. All date math is done in UTC so the numbers
// stay stable regardless of the viewer's timezone (the mock timestamps and
// simulation clock are UTC).

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const dayKey = (date) => date.toISOString().slice(0, 10);
const dateFromKey = (key) => new Date(`${key}T00:00:00.000Z`);
const addDays = (date, days) => new Date(date.getTime() + days * MS_PER_DAY);

const mondayOf = (date) => {
  const daysSinceMonday = (date.getUTCDay() + 6) % 7; // 0 for Monday … 6 for Sunday
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      daysSinceMonday * MS_PER_DAY,
  );
};

const monthShortFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});
const monthDayFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const weekdayLongFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  timeZone: "UTC",
});
const weekdayShortFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: "UTC",
});
const timeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

// GitHub-style intensity buckets: minutes logged in a day → 0–4.
const levelForMinutes = (minutes) => {
  if (minutes <= 0) return 0;
  if (minutes < 20) return 1;
  if (minutes < 40) return 2;
  if (minutes < 60) return 3;
  return 4;
};

const formatHours = (minutes) => (minutes / 60).toFixed(1).replace(/\.0$/, "");

function buildMinutesByDay(logs) {
  const minutesByDay = new Map();
  for (const log of logs) {
    const key = dayKey(new Date(log.logged_at));
    const entry = minutesByDay.get(key) ?? { minutes: 0 };
    entry.minutes += log.duration_minutes ?? 0;
    minutesByDay.set(key, entry);
  }
  return minutesByDay;
}

function sumMinutesBetween(minutesByDay, fromKey, toKey) {
  let total = 0;
  for (const [key, { minutes }] of minutesByDay.entries()) {
    if (key >= fromKey && key <= toKey) {
      total += minutes;
    }
  }
  return total;
}

// Consecutive logged days ending today (or yesterday when today isn't
// logged yet — matching the "log today" call to action in the design).
function computeCurrentStreak(loggedDays, now, todayKey) {
  let streak = 0;
  let cursor = loggedDays.has(todayKey) ? todayKey : dayKey(addDays(now, -1));
  while (loggedDays.has(cursor)) {
    streak += 1;
    cursor = dayKey(addDays(dateFromKey(cursor), -1));
  }
  return streak;
}

function computeLongestStreak(loggedDayKeys) {
  let longest = 0;
  let run = 0;
  let previous = null;
  for (const key of loggedDayKeys) {
    run =
      previous && dayKey(addDays(dateFromKey(previous), 1)) === key ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = key;
  }
  return longest;
}

// Column-of-weeks heatmap grid ending at the current week. `monthsBack`
// counts how many full months to include before the current one (12 = from
// last June for the desktop year view, 6 = from last December for mobile).
function buildHeatmap(minutesByDay, now, monthsBack) {
  const rangeStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsBack, 1),
  );
  const start = mondayOf(rangeStart);
  const weeks = [];
  const labeledMonths = new Set();

  let columnStart = start;
  while (columnStart <= now) {
    const days = [];
    let label = null;

    for (let i = 0; i < 7; i += 1) {
      const date = addDays(columnStart, i);
      if (date > now) {
        days.push(null); // future day — keep the grid shape, render nothing
        continue;
      }
      const minutes = minutesByDay.get(dayKey(date))?.minutes ?? 0;
      const monthId = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      if (date.getUTCDate() === 1 && !labeledMonths.has(monthId)) {
        label = monthShortFmt.format(date);
        labeledMonths.add(monthId);
      }
      days.push({
        minutes,
        level: levelForMinutes(minutes),
        tooltip: `${weekdayLongFmt.format(date)}, ${monthDayFmt.format(date)} · ${
          minutes > 0 ? `${minutes} min logged` : "No entries yet"
        }`,
      });
    }

    weeks.push({ label, days });
    columnStart = addDays(columnStart, 7);
  }

  // Label the partial first month too (the design shows "Jun Jul … Jun").
  if (weeks[0] && !weeks[0].label) {
    weeks[0].label = monthShortFmt.format(start);
  }

  return { weeks };
}

function buildActivity(minutesByDay, now) {
  const days = [];
  for (let i = 13; i >= 0; i -= 1) {
    const date = addDays(now, -i);
    const minutes = minutesByDay.get(dayKey(date))?.minutes ?? 0;
    days.push({
      key: dayKey(date),
      weekday: weekdayShortFmt.format(date),
      minutes,
      tooltip: `${monthDayFmt.format(date)} · ${minutes} min`,
    });
  }
  return days;
}

function buildRecentLogs(logs, todayKey, limit = 4) {
  const sorted = [...logs].sort(
    (a, b) => new Date(b.logged_at) - new Date(a.logged_at),
  );

  return sorted.slice(0, limit).map((log) => {
    const date = new Date(log.logged_at);
    const diffDays = Math.round(
      (dateFromKey(todayKey) - dateFromKey(dayKey(date))) / MS_PER_DAY,
    );
    const dayPart =
      diffDays <= 0
        ? "Today"
        : diffDays === 1
          ? "Yesterday"
          : diffDays < 7
            ? weekdayShortFmt.format(date)
            : monthDayFmt.format(date);

    return {
      id: log.id,
      title: log.title,
      tag: log.tag,
      durationMinutes: log.duration_minutes,
      when: `${dayPart} · ${timeFmt.format(date)}`,
    };
  });
}

function greetingFor(now) {
  const hour = now.getUTCHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function createDashboardData(appData) {
  const now = new Date(appData.simulation_context.dashboard_as_of);
  const todayKey = dayKey(now);
  const logs = appData.learning_logs ?? [];

  const minutesByDay = buildMinutesByDay(logs);
  const loggedDayKeys = [...minutesByDay.keys()].sort();
  const loggedDays = new Set(loggedDayKeys);

  const weekStart = mondayOf(now);
  const thisWeekMinutes = sumMinutesBetween(
    minutesByDay,
    dayKey(weekStart),
    todayKey,
  );
  const lastWeekMinutes = sumMinutesBetween(
    minutesByDay,
    dayKey(addDays(weekStart, -7)),
    dayKey(addDays(weekStart, -1)),
  );
  const hoursDelta = thisWeekMinutes / 60 - lastWeekMinutes / 60;

  return {
    now: now.toISOString(),
    greeting: greetingFor(now),
    dateLine: `${weekdayLongFmt.format(now)} · ${monthDayFmt.format(now)}, ${now.getUTCFullYear()}`,
    profile: appData.profiles?.[0] ?? null,
    metrics: {
      currentStreak: computeCurrentStreak(loggedDays, now, todayKey),
      longestStreak: computeLongestStreak(loggedDayKeys),
      daysLoggedThisMonth: loggedDayKeys.filter(
        (key) => key.slice(0, 7) === todayKey.slice(0, 7),
      ).length,
      daysSoFarThisMonth: now.getUTCDate(),
      hoursThisWeek: formatHours(thisWeekMinutes),
      hoursDeltaLabel: `${hoursDelta >= 0 ? "+" : "-"}${Math.abs(hoursDelta).toFixed(1)} vs last week`,
      todayMinutes: minutesByDay.get(todayKey)?.minutes ?? 0,
    },
    heatmapYear: buildHeatmap(minutesByDay, now, 12),
    heatmapMobile: buildHeatmap(minutesByDay, now, 6),
    recentLogs: buildRecentLogs(logs, todayKey),
    goals: (appData.goals ?? []).map((goal) => ({
      id: goal.id,
      title: goal.title,
      current: goal.current_value,
      target: goal.target_value,
      unit: goal.unit,
      percent: Math.min(
        100,
        Math.round(
          (goal.current_value / Math.max(goal.target_value, 1)) * 100,
        ),
      ),
    })),
    activity: buildActivity(minutesByDay, now),
  };
}




