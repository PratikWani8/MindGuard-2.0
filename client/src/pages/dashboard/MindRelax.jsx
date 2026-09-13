import { useEffect, useRef, useState } from "react";
import {
  Music2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RefreshCw,
  Sparkles,
  Heart,
  Waves,
  Moon,
  Brain,
} from "lucide-react";

import GlassCard from "../../components/common/GlassCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  getMusicRecommendation,
  getMusicLibrary,
} from "../../services/musicApi";

const FALLBACK_TRACKS = getMusicLibrary();

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function getIntentIcon(intent) {
  switch (intent) {
    case "sleep":
      return Moon;

    case "focus":
      return Brain;

    case "uplifting":
      return Heart;

    case "deep-relaxation":
      return Waves;

    default:
      return Music2;
  }
}

function getIntentLabel(intent) {
  switch (intent) {
    case "sleep":
      return "Sleep & Wind Down";

    case "focus":
      return "Calm Focus";

    case "uplifting":
      return "Gentle Energy";

    case "deep-relaxation":
      return "Deep Relaxation";

    default:
      return "Calm & Relax";
  }
}

export default function MindRelax() {
  const audioRef = useRef(null);

  const [recommendation, setRecommendation] = useState(null);
  const [alternatives, setAlternatives] = useState(FALLBACK_TRACKS);

  const [currentTrack, setCurrentTrack] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    loadRecommendation();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  async function loadRecommendation(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const result = await getMusicRecommendation();

      if (!result?.success || !result?.recommendation) {
        throw new Error("Unable to create a music recommendation.");
      }

      const track = result.recommendation;

      setRecommendation(track);

      setAlternatives(
        Array.isArray(result.alternatives)
          ? result.alternatives
          : FALLBACK_TRACKS
      );

      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.load();
      }
    } catch (err) {
      console.error(
        "MIND RELAX ERROR:",
        err.response?.data || err
      );

      setError(
        "We could not personalize your music right now. You can still choose a relaxing track below."
      );

      if (!currentTrack) {
        setCurrentTrack(FALLBACK_TRACKS[0]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function togglePlayback() {
    if (!audioRef.current || !currentTrack) {
      return;
    }

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("AUDIO PLAY ERROR:", err);

      setError(
        "The selected audio could not be played. Make sure the MP3 file exists in public/music."
      );

      setIsPlaying(false);
    }
  }

function selectTrack(track) {
  if (!track) return;

  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  // Replace the main music block with the selected track
  setCurrentTrack(track);
  setRecommendation({
    ...track,
    intent:
      track.mood === "sleep"
        ? "sleep"
        : track.mood === "focused"
        ? "focus"
        : track.mood === "uplifting"
        ? "uplifting"
        : track.mood === "relaxed"
        ? "deep-relaxation"
        : "calm",
    reason:
      track.description ||
      "A relaxing soundscape selected for your current moment.",
    aiMessage: `You selected ${track.title.toLowerCase()} for your relaxation session.`,
    aiGenerated: false,
  });

  setCurrentTime(0);
  setDuration(0);
  setIsPlaying(false);
  setError("");

  setTimeout(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, 0);
}

  function handleTimeUpdate() {
    if (!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) return;

    setDuration(audioRef.current.duration || 0);
  }

  function handleSeek(event) {
    const newTime = Number(event.target.value);

    if (!audioRef.current) return;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function handleEnded() {
    setIsPlaying(false);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }

  function toggleMute() {
    setVolume((previous) => (previous === 0 ? 0.8 : 0));
  }

  const IntentIcon = getIntentIcon(
    recommendation?.intent
  );

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* ------------------------------------------------ */}
      {/* MUSIC NOTE ANIMATION */}
      {/* ------------------------------------------------ */}

      <style>
        {`
          @keyframes musicNoteFloatOne {
            0% {
              transform: translate3d(0, 12px, 0) rotate(-8deg);
              opacity: 0;
            }

            15% {
              opacity: 1;
            }

            70% {
              opacity: 0.85;
            }

            100% {
              transform: translate3d(-28px, -105px, 0) rotate(-18deg);
              opacity: 0;
            }
          }

          @keyframes musicNoteFloatTwo {
            0% {
              transform: translate3d(0, 10px, 0) rotate(8deg);
              opacity: 0;
            }

            15% {
              opacity: 1;
            }

            70% {
              opacity: 0.9;
            }

            100% {
              transform: translate3d(38px, -118px, 0) rotate(18deg);
              opacity: 0;
            }
          }

          @keyframes musicNoteFloatThree {
            0% {
              transform: translate3d(0, 8px, 0) rotate(-4deg);
              opacity: 0;
            }

            15% {
              opacity: 1;
            }

            70% {
              opacity: 0.75;
            }

            100% {
              transform: translate3d(4px, -128px, 0) rotate(6deg);
              opacity: 0;
            }
          }

          @keyframes musicNoteFloatFour {
            0% {
              transform: translate3d(0, 8px, 0) rotate(12deg);
              opacity: 0;
            }

            15% {
              opacity: 1;
            }

            70% {
              opacity: 0.8;
            }

            100% {
              transform: translate3d(68px, -82px, 0) rotate(22deg);
              opacity: 0;
            }
          }

          @keyframes musicPulse {
            0%,
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.08);
            }

            50% {
              transform: scale(1.08);
              box-shadow: 0 0 0 18px rgba(255, 255, 255, 0.04);
            }
          }

          @keyframes musicWave {
            0%,
            100% {
              transform: scaleY(0.45);
              opacity: 0.35;
            }

            50% {
              transform: scaleY(1);
              opacity: 0.9;
            }
          }

          .mind-relax-note {
            position: absolute;
            color: rgba(255, 255, 255, 0.9);
            pointer-events: none;
            z-index: 20;
          }

          .mind-relax-note-one {
            animation: musicNoteFloatOne 2.8s ease-out infinite;
          }

          .mind-relax-note-two {
            animation: musicNoteFloatTwo 3.2s ease-out infinite 0.7s;
          }

          .mind-relax-note-three {
            animation: musicNoteFloatThree 3s ease-out infinite 1.3s;
          }

          .mind-relax-note-four {
            animation: musicNoteFloatFour 3.4s ease-out infinite 1.8s;
          }

          .mind-relax-pulse {
            animation: musicPulse 2s ease-in-out infinite;
          }

          .mind-relax-wave {
            animation: musicWave 1.2s ease-in-out infinite;
          }

          .mind-relax-wave-delay-1 {
            animation-delay: 0.15s;
          }

          .mind-relax-wave-delay-2 {
            animation-delay: 0.3s;
          }

          .mind-relax-wave-delay-3 {
            animation-delay: 0.45s;
          }

          .mind-relax-wave-delay-4 {
            animation-delay: 0.6s;
          }
        `}
      </style>

      {/* ------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------ */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-600 text-sm font-semibold mb-2">
            <Music2 size={18} />
            Mind Relax
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-semibold text-ink-900">
            Music for your mind
          </h1>

          <p className="text-ink-500 mt-2 max-w-2xl">
            Let MindGuard choose a relaxing soundscape based
            on your recent wellness signals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadRecommendation(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-violet-100 text-ink-700 hover:bg-violet-50 transition disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing
            ? "Updating..."
            : "Refresh AI Suggestion"}
        </button>
      </div>

      {/* ------------------------------------------------ */}
      {/* ERROR */}
      {/* ------------------------------------------------ */}

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* AI RECOMMENDATION */}
      {/* ------------------------------------------------ */}

      <GlassCard className="overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Visual */}
            <div className="relative shrink-0">
              <div className="relative h-52 w-full lg:w-52 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-aqua-500 flex items-center justify-center shadow-soft overflow-hidden">

                {/* Background glow */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute h-40 w-40 rounded-full bg-white blur-3xl -top-10 -right-10" />
                  <div className="absolute h-32 w-32 rounded-full bg-white blur-3xl bottom-0 left-0" />
                </div>

                {/* Animated music notes */}
                {isPlaying && (
                  <>
                    <span className="mind-relax-note mind-relax-note-one text-2xl left-1/2 top-1/2">
                      ♪
                    </span>

                    <span className="mind-relax-note mind-relax-note-two text-xl left-1/2 top-1/2">
                      ♫
                    </span>

                    <span className="mind-relax-note mind-relax-note-three text-3xl left-1/2 top-1/2">
                      ♪
                    </span>

                    <span className="mind-relax-note mind-relax-note-four text-xl left-1/2 top-1/2">
                      ♬
                    </span>
                  </>
                )}

                {/* Animated audio waves */}
                {isPlaying && (
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-8 opacity-80">
                    <span className="w-1 rounded-full bg-white/80 h-4 mind-relax-wave" />
                    <span className="w-1 rounded-full bg-white/80 h-6 mind-relax-wave mind-relax-wave-delay-1" />
                    <span className="w-1 rounded-full bg-white/80 h-8 mind-relax-wave mind-relax-wave-delay-2" />
                    <span className="w-1 rounded-full bg-white/80 h-5 mind-relax-wave mind-relax-wave-delay-3" />
                    <span className="w-1 rounded-full bg-white/80 h-7 mind-relax-wave mind-relax-wave-delay-4" />
                  </div>
                )}

                {/* Center icon */}
                <div
                  className={`relative h-24 w-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ${
                    isPlaying ? "mind-relax-pulse" : ""
                  }`}
                >
                  <IntentIcon
                    size={46}
                    className="text-white"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold">
                  <Sparkles size={13} />
                  AI Recommended
                </span>

                {recommendation?.intent && (
                  <span className="px-3 py-1 rounded-full bg-aqua-50 text-aqua-700 text-xs font-semibold">
                    {getIntentLabel(
                      recommendation.intent
                    )}
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-semibold text-ink-900">
                {currentTrack?.title ||
                recommendation?.title ||
                "Calm Piano"}
              </h2>

              <p className="text-ink-500 mt-1">
               {currentTrack?.artist ||
                recommendation?.artist ||
                "MindGuard"}
              </p>

              <p className="text-ink-600 leading-relaxed mt-5 max-w-2xl">
                {recommendation?.reason ||
                  "A gentle calming track selected for your current state."}
              </p>

              <div className="flex flex-wrap gap-2 mt-5">
                {(currentTrack?.category || recommendation?.category) && (
                <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-ink-600 text-sm">
                    {currentTrack?.category || recommendation?.category}
                </span>
                )}

                {(currentTrack?.duration || recommendation?.duration) && (
                <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-ink-600 text-sm">
                    {currentTrack?.duration || recommendation?.duration}
                </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* AUDIO PLAYER */}
        {/* ------------------------------------------------ */}

        <div className="border-t border-violet-100 bg-white/60 px-6 md:px-8 py-5">
          <audio
            ref={audioRef}
            src={currentTrack?.src || ""}
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={togglePlayback}
              disabled={!currentTrack}
              aria-label={
                isPlaying ? "Pause music" : "Play music"
              }
              className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center shadow-soft hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause
                  size={21}
                  fill="currentColor"
                />
              ) : (
                <Play
                  size={21}
                  fill="currentColor"
                  className="ml-0.5"
                />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs text-ink-400 mb-2">
                <span>{formatTime(currentTime)}</span>

                <span>
                  {formatTime(duration)}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={Math.min(
                  currentTime,
                  duration || 0
                )}
                onChange={handleSeek}
                disabled={!duration}
                className="w-full accent-violet-500 cursor-pointer disabled:cursor-default"
              />
            </div>

            <button
              type="button"
              onClick={toggleMute}
              className="h-10 w-10 shrink-0 rounded-xl hover:bg-violet-50 text-ink-500 flex items-center justify-center"
              aria-label={
                volume === 0
                  ? "Unmute"
                  : "Mute"
              }
            >
              {volume === 0 ? (
                <VolumeX size={19} />
              ) : (
                <Volume2 size={19} />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(event) =>
                setVolume(Number(event.target.value))
              }
              className="hidden sm:block w-20 accent-violet-500"
              aria-label="Volume"
            />
          </div>
        </div>
      </GlassCard>

      {/* ------------------------------------------------ */}
      {/* AI MESSAGE */}
      {/* ------------------------------------------------ */}

      {recommendation?.aiMessage && (
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-aqua-50 p-5">
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-violet-600 shrink-0">
              <Sparkles size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-ink-800">
                MindGuard's suggestion
              </p>

              <p className="text-sm text-ink-600 mt-1 leading-relaxed">
                {recommendation.aiMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* OTHER MUSIC */}
      {/* ------------------------------------------------ */}

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-display font-semibold text-ink-900">
              More relaxing music
            </h2>

            <p className="text-sm text-ink-500 mt-1">
              Choose another soundscape if you prefer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {alternatives.map((track) => {
            const selected =
              currentTrack?.id === track.id;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => selectTrack(track)}
                className={`text-left rounded-2xl border p-5 transition-all ${
                  selected
                    ? "border-violet-300 bg-violet-50 shadow-soft"
                    : "border-violet-100 bg-white hover:border-violet-200 hover:bg-violet-50/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-100 to-aqua-100 flex items-center justify-center text-violet-600">
                    <Music2 size={20} />
                  </div>

                  {selected && (
                    <span className="text-violet-600">
                      <Music2 size={17} />
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-ink-900 mt-4">
                  {track.title}
                </h3>

                <p className="text-sm text-ink-500 mt-1">
                  {track.category}
                </p>

                <p className="text-xs text-ink-400 mt-3">
                  {track.duration}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* WELLNESS NOTE */}
      {/* ------------------------------------------------ */}

      <div className="flex gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-5">
        <Heart
          size={19}
          className="text-violet-500 shrink-0 mt-0.5"
        />

        <p className="text-sm text-ink-500 leading-relaxed">
          Music is offered as a simple wellness activity,
          not as a treatment or diagnosis. If you are
          experiencing significant distress, consider
          reaching out to someone you trust or appropriate
          professional support.
        </p>
      </div>
    </div>
  );
}