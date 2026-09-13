import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Smile,
  Flame,
  Moon,
  Target,
  ArrowRight,
  CalendarCheck,
  Wind,
  BookOpen,
  Sparkles,
  MessageCircle,
} from "lucide-react";

import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatCard from "../../components/cards/StatCard";
import InsightCard from "../../components/cards/InsightCard";
import RiskBadge from "../../components/cards/RiskBadge";
import MultiTrendChart from "../../components/charts/MultiTrendChart";

import { useAuth } from "../../context/AuthContext";

import {
  fetchMoodTrend,
  fetchTodayCheckin,
  fetchStreak,
} from "../../services/checkinApi";

import {
  fetchWellbeingStatus,
  fetchDailyInsight,
} from "../../services/insightApi";

import {
  runAgent,
  getLatestAgentDecision,
} from "../../services/agentApi";

import {
  fetchRecommendations,
} from "../../services/wellnessApi";


export default function Dashboard() {

  const { user } = useAuth();


  /*
  ================================================
  DASHBOARD STATE
  ================================================
  */

  const [trend, setTrend] =
    useState([]);

  const [status, setStatus] =
    useState(null);

  const [insight, setInsight] =
    useState(null);

  const [checkedInToday, setCheckedInToday] =
    useState(null);

  const [recs, setRecs] =
    useState([]);

  const [agent, setAgent] =
    useState(null);

  const [agentLoading, setAgentLoading] =
    useState(false);

  const [agentError, setAgentError] =
    useState("");

  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0,
    checkedInToday: false,
    streakBroken: false,
    previousStreak: 0,
  });


  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadDashboard = async () => {

      setLoading(true);

      try {

        const result =
          await fetchMoodTrend("7d");

        console.log(
          "DASHBOARD - TREND:",
          result
        );

        if (Array.isArray(result)) {

          setTrend(result);

        } else if (
          Array.isArray(
            result?.checkIns
          )
        ) {

          setTrend(
            result.checkIns
          );

        } else {

          setTrend([]);
        }

      } catch (error) {

        console.error(
          "DASHBOARD - TREND ERROR:",
          error.response?.data ||
            error
        );

        setTrend([]);
      }

      try {

        const result =
          await fetchTodayCheckin();

        console.log(
          "DASHBOARD - TODAY:",
          result
        );

        setCheckedInToday(
          result || null
        );

      } catch (error) {

        console.error(
          "DASHBOARD - TODAY ERROR:",
          error.response?.data ||
            error
        );

        setCheckedInToday(null);
      }

      try {

        const result =
          await fetchStreak();

        console.log(
          "DASHBOARD - STREAK:",
          result
        );

        setStreak({

          currentStreak:
            Number(
              result?.currentStreak ??
                0
            ),

          longestStreak:
            Number(
              result?.longestStreak ??
                0
            ),

          checkedInToday:
            Boolean(
              result?.checkedInToday
            ),

          streakBroken:
            Boolean(
              result?.streakBroken
            ),

          previousStreak:
            Number(
              result?.previousStreak ??
                0
            ),
        });

      } catch (error) {

        console.error(
          "DASHBOARD - STREAK ERROR:",
          error.response?.data ||
            error
        );

        setStreak({
          currentStreak: 0,
          longestStreak: 0,
          checkedInToday: false,
          streakBroken: false,
          previousStreak: 0,
        });
      }

      try {

        const result =
          await fetchWellbeingStatus();

        console.log(
          "DASHBOARD - STATUS:",
          result
        );

        setStatus(
          result || null
        );

      } catch (error) {

        console.error(
          "DASHBOARD - STATUS ERROR:",
          error.response?.data ||
            error
        );

        setStatus(null);
      }


      try {

        const result =
          await fetchDailyInsight();

        console.log(
          "DASHBOARD - INSIGHT:",
          result
        );

        setInsight(
          result || null
        );

      } catch (error) {

        console.error(
          "DASHBOARD - INSIGHT ERROR:",
          error.response?.data ||
            error
        );

        setInsight(null);
      }

      try {

        const result =
          await getLatestAgentDecision();

        console.log(
          "DASHBOARD - AGENT:",
          result
        );


        setAgent(
          result?.data ||
            result ||
            null
        );

      } catch (error) {

        if (
          error.response?.status !==
          404
        ) {

          console.error(
            "DASHBOARD - AGENT ERROR:",
            error.response?.data ||
              error
          );

          setAgentError(
            "Unable to load AI agent."
          );
        }

        setAgent(null);
      }


      /*
      ============================================
      RECOMMENDATIONS
      ============================================
      */

      try {

        const result =
          await fetchRecommendations();

        console.log(
          "DASHBOARD - RECOMMENDATIONS:",
          result
        );


        const recommendations =
          Array.isArray(result)
            ? result
            : result?.recommendations ||
              [];


        setRecs(
          recommendations.slice(
            0,
            3
          )
        );

      } catch (error) {

        console.error(
          "DASHBOARD - RECOMMENDATIONS ERROR:",
          error.response?.data ||
            error
        );

        setRecs([]);
      }


      setLoading(false);
    };


    /*
     * ONLY RUN WHEN DASHBOARD OPENS
     */
    loadDashboard();

  }, []);


  /*
  ================================================
  RUN AI AGENT
  ================================================
  */

  const handleRunAgent =
    async () => {

      try {

        setAgentLoading(true);

        setAgentError("");


        const result =
          await runAgent();


        console.log(
          "DASHBOARD - AGENT RESULT:",
          result
        );


        const agentResult =
          result?.data ||
          result;


        if (
          agentResult?.agent
        ) {

          setAgent(
            agentResult.agent
          );

        } else {

          setAgent(
            agentResult
          );
        }

      } catch (error) {

        console.error(
          "DASHBOARD - AGENT RUN ERROR:",
          error.response?.data ||
            error
        );


        setAgentError(
          error.response?.data
            ?.message ||
            "Unable to analyze your wellbeing right now."
        );

      } finally {

        setAgentLoading(false);
      }
    };


  /*
  ================================================
  LOADING
  ================================================
  */

  if (loading) {

    return (
      <LoadingSpinner
        label="Loading your dashboard"
        size="lg"
      />
    );
  }


  /*
  ================================================
  LATEST CHECK-IN
  ================================================
  */

  const latest =
    trend.length > 0
      ? trend[
          trend.length - 1
        ]
      : null;


  console.log(
    "DASHBOARD - LATEST CHECK-IN:",
    latest
  );


  const mood =
    latest?.mood ??
    null;

  const stressLevel =
    latest?.stress ??
    null;

  const sleepHours =
    latest?.sleep ??
    null;


  /*
  ================================================
  WELLBEING
  ================================================
  */

  const wellbeingScore =
    status?.score ??
    status?.wellbeingScore ??
    0;


  const riskLevel =
    status?.level ||
    status?.riskLevel ||
    "stable";


  /*
  ================================================
  RENDER
  ================================================
  */

  return (

    <div className="space-y-6">


      {/* ========================================
          HEADER
      ======================================== */}

      <GlassCard
        strong
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-5
        "
      >

        {/* WELCOME */}

        <div>

          <p className="text-sm text-ink-400">
            Welcome back,
          </p>

          <h2 className="
            font-display
            text-2xl
            font-semibold
            text-ink-900
          ">
            {user?.name?.split(" ")[0] ||
              "there"} 👋
          </h2>

        </div>


        {/* ======================================
            RIGHT SIDE
        ====================================== */}

        <div className="
          flex
          items-center
          gap-3
          flex-wrap
          justify-end
        ">


          {/* ====================================
              STREAK
          ==================================== */}

          <div
            className={`
              flex
              items-center
              gap-3
              rounded-2xl
              px-4
              py-3
              border
              ${
                streak.streakBroken
                  ? "bg-slate-50 border-slate-200"
                  : "bg-amber-50 border-amber-100"
              }
            `}
          >

            <div
              className={`
                h-10
                w-10
                rounded-xl
                flex
                items-center
                justify-center
                ${
                  streak.streakBroken
                    ? "bg-slate-100 text-slate-400"
                    : "bg-amber-100 text-amber-500"
                }
              `}
            >

              <Flame
                size={21}
                className={
                  streak.currentStreak >
                  0
                    ? "animate-pulse"
                    : ""
                }
              />

            </div>


            <div>

              <p
                className={`
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-wide
                  ${
                    streak.streakBroken
                      ? "text-slate-500"
                      : "text-amber-600"
                  }
                `}
              >

                {streak.streakBroken
                  ? "Streak broken"
                  : "Current streak"}

              </p>


              <div className="
                flex
                items-baseline
                gap-1
              ">

                <span className="
                streak-number
                font-display
                text-xl
                font-bold
              ">
                {streak.currentStreak}
              </span>

                <span className="
                  streak-days
                  text-xs
                ">
                  {streak.currentStreak === 1 ? "day" : "days"}
                </span>

              </div>


              {/* Previous streak */}

              {streak.streakBroken &&
                streak.previousStreak >
                  0 && (

                  <p className="
                    text-[10px]
                    text-ink-400
                    mt-0.5
                  ">
                    Previous:{" "}
                    {streak.previousStreak}{" "}
                    days
                  </p>

                )}

            </div>

          </div>


          {/* ====================================
              RISK
          ==================================== */}

          <RiskBadge
            level={riskLevel}
            size="lg"
          />

        </div>

      </GlassCard>


      {/* ========================================
          STATS
      ======================================== */}

      <div className="
        grid
        sm:grid-cols-2
        lg:grid-cols-4
        gap-4
      ">


        <StatCard
          icon={Target}
          label="Wellbeing score"
          value={wellbeingScore}
          unit="/100"
          accent="violet"
        />


        <StatCard
          icon={Smile}
          label="Mood today"
          value={
            mood !== null
              ? mood.toFixed(1)
              : "—"
          }
          unit="/10"
          accent="green"
        />


        <StatCard
          icon={Flame}
          label="Stress today"
          value={
            stressLevel !== null
              ? stressLevel.toFixed(1)
              : "—"
          }
          unit="/10"
          accent="amber"
        />


        <StatCard
          icon={Moon}
          label="Sleep last night"
          value={
            sleepHours !== null
              ? sleepHours.toFixed(1)
              : "—"
          }
          unit="hrs"
          accent="aqua"
        />

      </div>


      {/* ========================================
          AI AGENT
      ======================================== */}

      <GlassCard strong>

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-start
          md:justify-between
          gap-5
        ">

          <div className="
            flex
            items-start
            gap-4
          ">

            <div className="
              h-12
              w-12
              rounded-2xl
              bg-violet-100
              text-violet-600
              flex
              items-center
              justify-center
              shrink-0
            ">
              <Sparkles size={23} />
            </div>


            <div>

              <p className="
                text-xs
                font-medium
                text-violet-600
                uppercase
                tracking-wide
              ">
                MindGuard AI Agent
              </p>


              <h3 className="
                font-display
                text-xl
                font-semibold
                text-ink-900
                mt-1
              ">
                Your wellbeing companion
              </h3>


              <p className="
                text-sm
                text-ink-400
                mt-1
              ">
                I analyze your recent patterns and suggest your next best step.
              </p>

            </div>

          </div>


          <Button
            onClick={handleRunAgent}
            disabled={agentLoading}
          >

            <Sparkles
              size={16}
              className={
                agentLoading
                  ? "animate-pulse"
                  : ""
              }
            />

            {agentLoading
              ? "Analyzing..."
              : "Analyze my wellbeing"}

          </Button>

        </div>

        {!agent ? (

          <div className="
            mt-6
            rounded-2xl
            bg-violet-50/60
            border
            border-violet-100
            p-5
          ">

            <p className="
              text-sm
              text-ink-600
            ">
              Your AI agent hasn't analyzed your latest wellbeing data yet.
            </p>

            <p className="
              text-xs
              text-ink-400
              mt-1
            ">
              Complete a check-in, then let MindGuard analyze your recent patterns.
            </p>

          </div>

        ) : (

          <div className="
            mt-6
            grid
            lg:grid-cols-3
            gap-4
          ">


            {/* Observation */}

            <div className="
              rounded-2xl
              bg-slate-50
              p-5
            ">

              <p className="
                text-xs
                font-medium
                text-ink-400
                uppercase
                tracking-wide
              ">
                What I noticed
              </p>

              <p className="
                text-sm
                text-ink-700
                leading-6
                mt-2
              ">
                {agent.observation ||
                  "No observation available."}
              </p>

            </div>


            {/* Reasoning */}

            <div className="
              rounded-2xl
              bg-slate-50
              p-5
            ">

              <p className="
                text-xs
                font-medium
                text-ink-400
                uppercase
                tracking-wide
              ">
                AI reasoning
              </p>

              <p className="
                text-sm
                text-ink-700
                leading-6
                mt-2
              ">
                {agent.reasoning ||
                  "No reasoning available."}
              </p>

            </div>


            {/* Action */}

            <div className="
              rounded-2xl
              bg-violet-50
              p-5
            ">

              <p className="
                text-xs
                font-medium
                text-violet-600
                uppercase
                tracking-wide
              ">
                Recommended action
              </p>


              <p className="
                font-display
                font-semibold
                text-ink-900
                mt-2
              ">
                {agent.action
                  ?.replaceAll(
                    "_",
                    " "
                  )
                  .toLowerCase()
                  .replace(
                    /\b\w/g,
                    (char) =>
                      char.toUpperCase()
                  ) ||
                  "No action"}
              </p>


              <p className="
                text-sm
                text-ink-600
                leading-6
                mt-2
              ">
                {agent.recommendation ||
                  "No recommendation available."}
              </p>

            </div>

          </div>

        )}


        {/* Follow-up */}

        {agent?.followUpRequired &&
          agent?.followUpQuestion && (

            <div className="
              mt-4
              rounded-2xl
              bg-aqua-400/10
              border
              border-aqua-400/20
              p-4
            ">

              <div className="
                flex
                items-start
                gap-3
              ">

                <MessageCircle
                  size={18}
                  className="
                    text-aqua-500
                    mt-0.5
                    shrink-0
                  "
                />


                <div>

                  <p className="
                    text-xs
                    font-medium
                    text-aqua-600
                    uppercase
                    tracking-wide
                  ">
                    AI follow-up
                  </p>


                  <p className="
                    text-sm
                    text-ink-700
                    mt-1
                  ">
                    {agent.followUpQuestion}
                  </p>

                </div>

              </div>

            </div>

          )}

      </GlassCard>


      {/* ========================================
          NO CHECK-IN
      ======================================== */}

      {!latest && (

        <GlassCard strong>

          <div className="
            text-center
            py-8
          ">

            <div className="
              h-14
              w-14
              rounded-2xl
              bg-violet-100
              text-violet-600
              flex
              items-center
              justify-center
              mx-auto
              mb-4
            ">
              <CalendarCheck size={25} />
            </div>


            <h3 className="
              font-display
              text-xl
              font-semibold
              text-ink-900
            ">
              No check-ins yet
            </h3>


            <p className="
              text-sm
              text-ink-400
              mt-2
              max-w-md
              mx-auto
            ">
              Complete your first check-in and your real mood, stress, sleep and wellbeing data will appear here.
            </p>


            <Button
              as={Link}
              to="/dashboard/checkin"
              className="mt-5"
            >
              Start check-in
              <ArrowRight size={16} />
            </Button>

          </div>

        </GlassCard>

      )}


      {/* ========================================
          CONTENT
      ======================================== */}

      <div className="
        grid
        lg:grid-cols-3
        gap-6
      ">


        <div className="
          lg:col-span-2
          space-y-6
        ">


          {/* TREND */}

          <GlassCard>

            <div className="
              flex
              items-center
              justify-between
              mb-1
            ">

              <p className="
                font-display
                font-semibold
                text-ink-900
              ">
                7-day trend
              </p>


              <Link
                to="/dashboard/trends"
                className="
                  text-xs
                  font-medium
                  text-violet-600
                  hover:underline
                  flex
                  items-center
                  gap-1
                "
              >
                Full trends
                <ArrowRight size={13} />
              </Link>

            </div>


            {trend.length > 0 ? (

              <MultiTrendChart
                data={trend}
              />

            ) : (

              <div className="
                h-64
                flex
                items-center
                justify-center
                text-sm
                text-ink-400
              ">
                Complete a check-in to see your trends.
              </div>

            )}

          </GlassCard>


          {/* INSIGHT */}

          {insight ? (

            <InsightCard
              title={
                insight.title ||
                insight.heading ||
                "Daily insight"
              }
              body={
                insight.body ||
                insight.summary ||
                insight.text ||
                "Your personalized insight will appear here."
              }
            />

          ) : (

            <GlassCard>

              <p className="
                font-display
                font-semibold
                text-ink-900
              ">
                Daily insight
              </p>


              <p className="
                text-sm
                text-ink-400
                mt-2
              ">
                Complete a check-in to receive personalized insights.
              </p>

            </GlassCard>

          )}

        </div>


        {/* ======================================
            RIGHT SIDEBAR
        ====================================== */}

        <div className="
          space-y-6
        ">


          {/* TODAY CHECK-IN */}

          <GlassCard strong>

            <div className="
              flex
              items-center
              gap-3
              mb-3
            ">

              <div className="
                h-10
                w-10
                rounded-2xl
                bg-violet-100
                text-violet-600
                flex
                items-center
                justify-center
              ">
                <CalendarCheck size={19} />
              </div>


              <p className="
                font-display
                font-semibold
                text-ink-900
              ">
                {checkedInToday
                  ? "You checked in today"
                  : "Have you checked in today?"}
              </p>

            </div>


            <p className="
              text-sm
              text-ink-500
              mb-4
            ">
              {checkedInToday
                ? "Great consistency — come back tomorrow to keep your trend accurate."
                : "A quick check-in keeps your insights sharp and your plan personalized."}
            </p>


            <Button
              as={Link}
              to="/dashboard/checkin"
              className="w-full"
              disabled={!!checkedInToday}
            >
              {checkedInToday
                ? "Checked in ✓"
                : "Start check-in"}
            </Button>

          </GlassCard>


          {/* RECOMMENDATIONS */}

          <GlassCard>

            <p className="
              font-display
              font-semibold
              text-ink-900
              mb-3
            ">
              Recommended for you
            </p>


            <div className="
              space-y-3
            ">

              {recs.length > 0 ? (

                recs.map(
                  (r, index) => (

                    <div
                      key={
                        r.id ||
                        r._id ||
                        index
                      }
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div className="
                        h-9
                        w-9
                        rounded-xl
                        bg-aqua-400/20
                        text-aqua-500
                        flex
                        items-center
                        justify-center
                        shrink-0
                      ">
                        <Wind size={16} />
                      </div>


                      <div className="
                        min-w-0
                      ">

                        <p className="
                          text-sm
                          font-medium
                          text-ink-800
                          truncate
                        ">
                          {r.title ||
                            "Wellness activity"}
                        </p>


                        <p className="
                          text-xs
                          text-ink-400
                        ">
                          {r.duration ||
                            "Personalized activity"}
                        </p>

                      </div>

                    </div>

                  )
                )

              ) : (

                <p className="
                  text-sm
                  text-ink-400
                ">
                  Complete a check-in to get personalized recommendations.
                </p>

              )}

            </div>


            <Button
              as={Link}
              to="/dashboard/wellness-plan"
              variant="secondary"
              size="sm"
              className="w-full mt-4"
            >
              View wellness plan
            </Button>

          </GlassCard>


          {/* JOURNAL */}

          <GlassCard
            className="
              flex
              items-center
              gap-3
            "
          >

            <div className="
              h-10
              w-10
              rounded-2xl
              bg-violet-100
              text-violet-600
              flex
              items-center
              justify-center
              shrink-0
            ">
              <BookOpen size={18} />
            </div>


            <div className="
              min-w-0
              flex-1
            ">

              <p className="
                text-sm
                font-medium
                text-ink-800
              ">
                Write in your journal
              </p>


              <p className="
                text-xs
                text-ink-400
              ">
                Unpack today in a few sentences.
              </p>

            </div>


            <Link
              to="/dashboard/journal"
              className="text-violet-600"
            >
              <ArrowRight size={17} />
            </Link>

          </GlassCard>

        </div>

      </div>

    </div>
  );
}