import CheckIn from "../models/CheckIn.js";
import AIAnalysis from "../models/AIAnalysis.js";
import RiskEvent from "../models/RiskEvent.js";

import { analyzeCheckIn } from "../services/aiService.js";
import { success, failure } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const owned = (id, userId) => ({
  _id: id,
  userId,
});

export const createCheckIn = asyncHandler(async (req, res) => {
  console.log(
    "CREATE CHECK-IN USER:",
    req.user?._id
  );

  console.log(
    "CREATE CHECK-IN BODY:",
    req.body
  );

  const checkIn = await CheckIn.create({
    ...req.body,
    userId: req.user._id,
  });

  console.log(
    "CHECK-IN SAVED:",
    checkIn._id
  );

  try {
    const ai = await analyzeCheckIn({
      userId: req.user._id.toString(),

      checkIn: {
        id: checkIn._id.toString(),
        mood: checkIn.mood,
        stressLevel: checkIn.stressLevel,
        energyLevel: checkIn.energyLevel,
        sleepHours: checkIn.sleepHours,
        sleepQuality: checkIn.sleepQuality,
        focusLevel: checkIn.focusLevel,
        journalText: checkIn.journalText || "",
      },
    });

    const result = ai.data || ai;

    const analysis = await AIAnalysis.create({
      ...result,
      userId: req.user._id,
      checkInId: checkIn._id,
    });


    /*
    ==============================================
    RISK EVENT
    ==============================================
    */
    if (
      analysis.supportLevel === "elevated" ||
      analysis.supportLevel === "urgent_support"
    ) {
      await RiskEvent.create({
        userId: req.user._id,
        source: "checkin",
        supportLevel: analysis.supportLevel,
        reason:
          (analysis.insights || []).join("; ") ||
          "AI identified a need for additional support",
      });
    }

  } catch (error) {
    console.error(
      "AI check-in analysis failed:",
      error.message
    );
  }


  return success(
    res,
    { checkIn },
    "Check-in created",
    201
  );
});


/*
==================================================
LIST CHECK-INS
==================================================
*/
export const listCheckIns = asyncHandler(async (req, res) => {
  const limit = Math.min(
    Number(req.query.limit) || 30,
    100
  );

  console.log(
    "LIST CHECK-INS USER:",
    req.user?._id
  );

  const checkIns = await CheckIn.find({
    userId: req.user._id,
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  console.log(
    "CHECK-INS FOUND:",
    checkIns.length
  );

  return success(
    res,
    { checkIns },
    "Check-ins retrieved"
  );
});


/*
==================================================
GET SINGLE CHECK-IN
==================================================
*/
export const getCheckIn = asyncHandler(async (req, res) => {
  const checkIn = await CheckIn.findOne(
    owned(
      req.params.id,
      req.user._id
    )
  );

  if (!checkIn) {
    return failure(
      res,
      "Check-in not found",
      [],
      404
    );
  }

  return success(
    res,
    { checkIn },
    "Check-in retrieved"
  );
});


/*
==================================================
TODAY'S CHECK-IN
==================================================

Uses India time instead of the server timezone.
==================================================
*/
export const today = asyncHandler(async (req, res) => {

  const now = new Date();

  /*
   * Convert current UTC time to India time.
   */
  const indiaDate = new Date(
    now.toLocaleString(
      "en-US",
      {
        timeZone: "Asia/Kolkata",
      }
    )
  );


  /*
   * Start of today in India.
   */
  indiaDate.setHours(
    0,
    0,
    0,
    0
  );


  /*
   * End of today in India.
   */
  const tomorrow = new Date(indiaDate);

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );


  /*
   * Convert India boundaries back into
   * UTC-compatible Date values.
   */
  const indiaOffset = 5.5 * 60 * 60 * 1000;

  const start = new Date(
    indiaDate.getTime() -
      indiaOffset
  );

  const end = new Date(
    tomorrow.getTime() -
      indiaOffset
  );


  console.log(
    "TODAY USER:",
    req.user?._id
  );

  console.log(
    "INDIA DAY START:",
    start
  );

  console.log(
    "INDIA DAY END:",
    end
  );


  const checkIn = await CheckIn.findOne({
    userId: req.user._id,

    createdAt: {
      $gte: start,
      $lt: end,
    },

  }).sort({
    createdAt: -1,
  });


  console.log(
    "TODAY CHECK-IN FOUND:",
    checkIn?._id || null
  );


  return success(
    res,
    { checkIn },
    "Today's check-in retrieved"
  );
});


/*
==================================================
REAL STREAK
==================================================

Rules:

1. India timezone is used.
2. Multiple check-ins on one day = 1 day.
3. Check-in today continues the streak.
4. No check-in today but check-in yesterday:
   current streak is still displayed.
5. Missing both today and yesterday means
   the previous streak is broken.
6. Longest streak is preserved.
==================================================
*/
export const streak = asyncHandler(async (req, res) => {

  const userId = req.user._id;


  /*
  ================================================
  GET ALL USER CHECK-INS
  ================================================
  */
  const checkIns = await CheckIn.find({
    userId,
  })
    .sort({
      createdAt: -1,
    })
    .select("createdAt");


  /*
  ================================================
  NO CHECK-INS
  ================================================
  */
  if (checkIns.length === 0) {
    return success(
      res,
      {
        currentStreak: 0,
        longestStreak: 0,
        checkedInToday: false,
        streakBroken: false,
        previousStreak: 0,
      },
      "Streak retrieved"
    );
  }


  /*
  ================================================
  CONVERT DATE TO INDIA CALENDAR DATE
  ================================================
  */
  const getIndiaDateKey = (date) => {

    return new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Kolkata",

        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(
      new Date(date)
    );
  };


  /*
  ================================================
  UNIQUE CHECK-IN DAYS
  ================================================
  */

  const dates = [
    ...new Set(
      checkIns.map(
        (checkIn) =>
          getIndiaDateKey(
            checkIn.createdAt
          )
      )
    ),
  ];


  /*
  ================================================
  CONVERT YYYY-MM-DD TO DATE
  ================================================
  */
  const dateToNumber = (dateString) => {

    const [
      year,
      month,
      day,
    ] = dateString
      .split("-")
      .map(Number);

    return Date.UTC(
      year,
      month - 1,
      day
    );
  };


  /*
  ================================================
  INDIA TODAY
  ================================================
  */

  const todayString =
    getIndiaDateKey(
      new Date()
    );


  /*
  ================================================
  INDIA YESTERDAY
  ================================================
  */

  const todayNumber =
    dateToNumber(
      todayString
    );

  const yesterdayNumber =
    todayNumber -
    24 * 60 * 60 * 1000;

  const yesterdayDate =
    new Date(
      yesterdayNumber
    );

  const yesterdayString =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "UTC",

        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(
      yesterdayDate
    );


  const checkedInToday =
    dates.includes(
      todayString
    );

  const checkedInYesterday =
    dates.includes(
      yesterdayString
    );

  const sortedDates = [...dates].sort(
    (a, b) =>
      dateToNumber(b) -
      dateToNumber(a)
  );

  let longestStreak = 1;
  let runningStreak = 1;


  for (
    let i = 1;
    i < sortedDates.length;
    i++
  ) {

    const difference =
      (
        dateToNumber(
          sortedDates[i - 1]
        ) -
        dateToNumber(
          sortedDates[i]
        )
      ) /
      (
        24 *
        60 *
        60 *
        1000
      );


    if (difference === 1) {

      runningStreak++;

      longestStreak =
        Math.max(
          longestStreak,
          runningStreak
        );

    } else {

      runningStreak = 1;
    }
  }


  /*
  ================================================
  CURRENT STREAK
  ================================================
  */

  let currentStreak = 0;
  let previousStreak = 0;
  let streakBroken = false;


  /*
  ================================================
  USER CHECKED IN TODAY
  ================================================
  */

  if (checkedInToday) {

    currentStreak = 1;


    for (
      let i = 1;
      i < sortedDates.length;
      i++
    ) {

      const difference =
        (
          dateToNumber(
            sortedDates[i - 1]
          ) -
          dateToNumber(
            sortedDates[i]
          )
        ) /
        (
          24 *
          60 *
          60 *
          1000
        );


      if (difference === 1) {

        currentStreak++;

      } else {

        break;
      }
    }
  }


  /*
  ================================================
  USER HAS NOT CHECKED IN TODAY
  BUT CHECKED IN YESTERDAY
  ================================================
  */

  else if (checkedInYesterday) {

    currentStreak = 1;


    const yesterdayIndex =
      sortedDates.indexOf(
        yesterdayString
      );


    for (
      let i = yesterdayIndex + 1;
      i < sortedDates.length;
      i++
    ) {

      const difference =
        (
          dateToNumber(
            sortedDates[i - 1]
          ) -
          dateToNumber(
            sortedDates[i]
          )
        ) /
        (
          24 *
          60 *
          60 *
          1000
        );


      if (difference === 1) {

        currentStreak++;

      } else {

        break;
      }
    }
  }

  else {

    streakBroken = true;

    previousStreak = 1;


    for (
      let i = 1;
      i < sortedDates.length;
      i++
    ) {

      const difference =
        (
          dateToNumber(
            sortedDates[i - 1]
          ) -
          dateToNumber(
            sortedDates[i]
          )
        ) /
        (
          24 *
          60 *
          60 *
          1000
        );


      if (difference === 1) {

        previousStreak++;

      } else {

        break;
      }
    }


    currentStreak = 0;
  }


  /*
  ================================================
  FINAL LONGEST STREAK
  ================================================
  */

  longestStreak =
    Math.max(
      longestStreak,
      currentStreak
    );


  console.log(
    "STREAK USER:",
    userId
  );

  console.log(
    "STREAK DATES:",
    dates
  );

  console.log(
    "CURRENT STREAK:",
    currentStreak
  );

  console.log(
    "LONGEST STREAK:",
    longestStreak
  );

  console.log(
    "STREAK BROKEN:",
    streakBroken
  );


  return success(
    res,
    {
      currentStreak,
      longestStreak,
      checkedInToday,
      streakBroken,
      previousStreak,
    },
    "Streak retrieved"
  );
});


/*
==================================================
TRENDS
==================================================
*/
export const trends = asyncHandler(
  async (req, res) => {

    const days = Math.min(
      Number(req.query.days) || 7,
      30
    );

    console.log(
      "TRENDS USER:",
      req.user?._id
    );

    console.log(
      "TRENDS DAYS:",
      days
    );


    const start = new Date();

    start.setHours(
      0,
      0,
      0,
      0
    );

    start.setDate(
      start.getDate() -
        (days - 1)
    );


    const end = new Date();

    end.setHours(
      23,
      59,
      59,
      999
    );


    console.log(
      "TRENDS START:",
      start
    );

    console.log(
      "TRENDS END:",
      end
    );


    const checkIns =
      await CheckIn.find({

        userId:
          req.user._id,

        createdAt: {
          $gte: start,
          $lte: end,
        },

      })
        .sort({
          createdAt: 1,
        })
        .select(
          "mood stressLevel energyLevel sleepHours sleepQuality focusLevel createdAt"
        );


    console.log(
      "TRENDS CHECK-INS FOUND:",
      checkIns.length
    );


    console.log(
      "TRENDS DATA:",
      checkIns
    );


    return success(
      res,
      {
        checkIns,
      },
      "Check-in trends retrieved"
    );
  }
);
