import api from "./api";

export async function submitCheckin(payload) {
  console.log(
    "SUBMIT CHECK-IN:",
    payload
  );

  const response = await api.post(
    "/api/checkins",
    payload
  );

  console.log(
    "CHECK-IN RESPONSE:",
    response.data
  );

  return (
    response.data?.data?.checkIn ||
    null
  );
}

export async function fetchTodayCheckin() {
  const response = await api.get(
    "/api/checkins/today"
  );

  console.log(
    "TODAY CHECK-IN RESPONSE:",
    response.data
  );

  return (
    response.data?.data?.checkIn ||
    null
  );
}


/*
==================================================
FETCH REAL STREAK
==================================================
*/
export async function fetchStreak() {
  const response = await api.get(
    "/api/checkins/streak"
  );

  console.log(
    "STREAK RESPONSE:",
    response.data
  );

  return (
    response.data?.data || {
      currentStreak: 0,
      longestStreak: 0,
      checkedInToday: false,
      streakBroken: false,
      previousStreak: 0,
    }
  );
}


export async function fetchMoodTrend(
  range = "7d"
) {
  const days =
    range === "30d"
      ? 30
      : 7;

  const response = await api.get(
    "/api/checkins/trends",
    {
      params: {
        days,
      },
    }
  );

  console.log(
    "MOOD TREND RESPONSE:",
    response.data
  );

  const checkIns =
    response.data?.data?.checkIns ||
    [];

  if (!Array.isArray(checkIns)) {
    return [];
  }


  const trends = checkIns
    .map((checkIn) => ({
      day: new Date(
        checkIn.createdAt
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
        }
      ),

      mood: Number(
        checkIn.mood ?? 0
      ),

      stress: Number(
        checkIn.stressLevel ?? 0
      ),

      sleep: Number(
        checkIn.sleepHours ?? 0
      ),

      focus: Number(
        checkIn.focusLevel ?? 0
      ),

      energy: Number(
        checkIn.energyLevel ?? 0
      ),

      sleepQuality: Number(
        checkIn.sleepQuality ?? 0
      ),

      createdAt:
        checkIn.createdAt,
    }))
    .sort(
      (a, b) =>
        new Date(a.createdAt) -
        new Date(b.createdAt)
    );


  console.log(
    "TRANSFORMED TREND DATA:",
    trends
  );

  return trends;
}


export async function fetchCheckIns(
  limit = 30
) {
  const response = await api.get(
    "/api/checkins",
    {
      params: {
        limit,
      },
    }
  );

  console.log(
    "CHECK-INS RESPONSE:",
    response.data
  );

  const checkIns =
    response.data?.data?.checkIns ||
    [];

  return Array.isArray(checkIns)
    ? checkIns
    : [];
}


export async function fetchCheckIn(id) {
  const response = await api.get(
    `/api/checkins/${id}`
  );

  console.log(
    "CHECK-IN RESPONSE:",
    response.data
  );

  return (
    response.data?.data?.checkIn ||
    null
  );
}