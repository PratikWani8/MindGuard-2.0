import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  Send,
  Sparkles,
  BookMarked,
  AlertCircle,
  RotateCcw,
  Mic,
  MicOff,
} from "lucide-react";

import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";

import {
  sendChatMessage,
} from "../../services/chatApi";

import {
  chatSuggestedPrompts,
} from "../../data/mockData";

import {
  cn,
} from "../../utils/cn";


export default function Assistant() {

  const [messages, setMessages] =
    useState([
      {
        id: "welcome",

        role: "assistant",

        text:
          "Hi, I'm the MindGuard assistant. I can help you understand your patterns, think through wellbeing concerns, and explore practical coping strategies. I'm not a therapist or doctor, so for clinical concerns please reach out to a qualified professional.",
      },
    ]);


  const [conversationId, setConversationId] =
    useState(null);


  const [input, setInput] =
    useState("");


  const [sending, setSending] =
    useState(false);


  const [error, setError] =
    useState("");


  const [voiceEnabled, setVoiceEnabled] =
    useState(false);


  const [isListening, setIsListening] =
    useState(false);


  const recognitionRef =
    useRef(null);


  /*
   * ============================================================
   * VOICE INPUT
   * ============================================================
   */

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

      console.warn(
        "Speech recognition is not supported in this browser."
      );

      return;
    }


    const recognition =
      new SpeechRecognition();


    recognition.continuous = false;

    recognition.interimResults = true;

    recognition.lang = "en-IN";


    recognition.onstart = () => {

      setIsListening(true);

      setVoiceEnabled(true);

    };


    recognition.onresult = (event) => {

      let transcript = "";


      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        transcript +=
          event.results[i][0].transcript;

      }


      setInput(transcript);

    };


    recognition.onend = () => {

      setIsListening(false);

      setVoiceEnabled(false);

    };


    recognition.onerror = (event) => {

      console.error(
        "Speech recognition error:",
        event.error
      );


      setIsListening(false);

      setVoiceEnabled(false);

    };


    recognitionRef.current =
      recognition;


    return () => {

      try {

        recognition.stop();

      } catch (error) {

        console.warn(
          "Speech recognition cleanup error:",
          error
        );

      }


      recognitionRef.current =
        null;

    };

  }, []);


  /*
   * ============================================================
   * TOGGLE VOICE INPUT
   * ============================================================
   */

  const toggleVoiceInput = () => {

    const recognition =
      recognitionRef.current;


    if (!recognition) {

      alert(
        "Voice input is not supported in this browser."
      );

      return;

    }


    if (isListening) {

      recognition.stop();

      setIsListening(false);

      setVoiceEnabled(false);

      return;

    }


    try {

      recognition.start();

      setVoiceEnabled(true);

    } catch (error) {

      console.error(
        "Unable to start voice input:",
        error
      );

    }

  };


  /*
   * ============================================================
   * FAILED MESSAGE
   * ============================================================
   */

  const [lastFailedMessage, setLastFailedMessage] =
    useState("");


  /*
   * ============================================================
   * SCROLL
   * ============================================================
   */

  const scrollRef =
    useRef(null);


  useEffect(() => {

    scrollRef.current?.scrollTo({

      top:
        scrollRef.current.scrollHeight,

      behavior: "smooth",

    });

  }, [
    messages,
    sending,
  ]);

const send = async (text = input) => {

  const content =
    typeof text === "string"
      ? text.trim()
      : input.trim();

  if (!content || sending) {
    return;
  }

  if (
    recognitionRef.current &&
    isListening
  ) {
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.warn(
        "Unable to stop voice recognition:",
        error
      );
    }

    setIsListening(false);
    setVoiceEnabled(false);
  }

  setError("");
  setLastFailedMessage("");
  setInput("");

  const userMsg = {
    id: `u_${Date.now()}`,
    role: "user",
    text: content,
  };

  setMessages((current) => [
    ...current,
    userMsg,
  ]);

  setSending(true);

  try {
    const reply = await sendChatMessage(
      content,
      conversationId
    );

    if (reply.conversationId) {
      setConversationId(
        reply.conversationId
      );
    }

    setMessages((current) => [
      ...current,
      {
        id:
          reply.id ||
          `a_${Date.now()}`,

        role: "assistant",

        text:
          reply.text,

        sources:
          reply.sources || [],
      },
    ]);

  } catch (err) {
    console.error(
      "MindGuard chat error:",
      err
    );

    setError(
      "The assistant couldn't respond right now. Please try again."
    );

    setLastFailedMessage(content);

  } finally {
    setSending(false);
  }
};

  /*
   * ============================================================
   * RETRY
   * ============================================================
   */

  const retry = () => {

    if (
      lastFailedMessage
    ) {

      send(
        lastFailedMessage
      );

    }

  };


  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (

    <div
      className="
        max-w-3xl
        mx-auto
        flex
        flex-col
        h-[calc(100vh-9rem)]
      "
    >

      <GlassCard
        strong
        className="
          flex-1
          flex
          flex-col
          overflow-hidden
          p-0
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-3
            px-5
            py-4
            border-b
            border-violet-100/70
          "
        >

          <div
            className="
              h-10
              w-10
              rounded-2xl
              bg-gradient-to-br
              from-violet-500
              to-aqua-500
              text-white
              flex
              items-center
              justify-center
            "
          >

            <Sparkles
              size={18}
            />

          </div>


          <div>

            <p
              className="
                font-display
                font-semibold
                text-ink-900
              "
            >
              MindGuard Assistant
            </p>


            <p
              className="
                text-xs
                text-ink-400
              "
            >
              AI-powered wellbeing support
            </p>

          </div>

        </div>


        {/* =================================================
            MESSAGES
        ================================================= */}

        <div
          ref={scrollRef}
          className="
            flex-1
            overflow-y-auto
            scrollbar-thin
            px-5
            py-5
            space-y-4
          "
        >

          {messages.map((m) => (

            <motion.div
              key={m.id}

              initial={{
                opacity: 0,
                y: 8,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              className={cn(
                "flex",

                m.role === "user"
                  ? "justify-end"
                  : "justify-start"
              )}
            >

              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",

                 m.role === "user"
                ? "bg-gradient-to-br from-violet-500 to-aqua-500 text-white"
                : "assistant-response bg-white/80 text-ink-700 border border-violet-100 dark:bg-gray-800 dark:border-gray-700"
                )}
              >

                <p className="whitespace-pre-wrap">
                  {m.text}
                </p>


                {/* =========================================
                    SOURCES
                ========================================= */}

                {m.sources?.length > 0 && (

                  <div
                    className="
                      mt-2.5
                      pt-2.5
                      border-t
                      border-violet-100/70
                      space-y-1
                    "
                  >

                    {m.sources.map(
                      (source, index) => (

                        <div
                          key={`${source}-${index}`}
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-[11px]
                            text-violet-500
                          "
                        >

                          <BookMarked
                            size={11}
                          />

                          {source}

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </motion.div>

          ))}


          {/* =================================================
              TYPING INDICATOR
          ================================================= */}

          {sending && (

            <div
              className="
                flex
                justify-start
              "
            >

              <div
                className="
                  bg-white/80
                  border
                  border-violet-100
                  rounded-2xl
                  px-4
                  py-3
                  flex
                  gap-1.5
                  items-center
                "
              >

                {[0, 1, 2].map(
                  (i) => (

                    <span
                      key={i}
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-violet-400
                        animate-bounce
                      "
                      style={{
                        animationDelay:
                          `${i * 0.15}s`,
                      }}
                    />

                  )
                )}

              </div>

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div
              className="
                flex
                items-center
                gap-2
                text-xs
                text-calm-red
                bg-red-50
                rounded-xl
                px-3
                py-2
                w-fit
              "
            >

              <AlertCircle
                size={14}
              />


              <span>
                {error}
              </span>


              <button
                onClick={retry}
                disabled={sending}
                className="ml-1"
                aria-label="Retry"
              >

                <RotateCcw
                  size={13}
                />

              </button>

            </div>

          )}

        </div>


        {/* =================================================
            SUGGESTED PROMPTS
        ================================================= */}

        {messages.length <= 1 && (

          <div
            className="
              px-5
              pb-3
              flex
              flex-wrap
              gap-2
            "
          >

            {chatSuggestedPrompts.map(
              (prompt) => (

                <button
                  key={prompt}
                  onClick={() =>
                    send(prompt)
                  }

                  disabled={sending}

                  className="
                    text-xs
                    bg-violet-50
                    text-violet-700
                    px-3
                    py-2
                    rounded-xl
                    font-medium
                    hover:bg-violet-100
                    transition-colors
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  {prompt}

                </button>

              )
            )}

          </div>

        )}


        {/* =================================================
            INPUT
        ================================================= */}

        <div
          className="
            p-4
            border-t
            border-violet-100/70
            flex
            items-center
            gap-2
          "
        >

          <input
            value={input}

            onChange={(event) =>
              setInput(
                event.target.value
              )
            }

            onKeyDown={(event) => {

              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {

                event.preventDefault();

                send();

              }

            }}

            placeholder={
              isListening
                ? "Listening…"
                : "Ask MindGuard something…"
            }

            disabled={sending}

            className="
              flex-1
              px-4
              py-2.5
              rounded-xl
              border
              border-violet-100
              bg-white/70
              text-sm
              outline-none
              transition
              focus:border-violet-300
              focus:ring-2
              focus:ring-violet-100
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          />


          {/* =================================================
              VOICE INPUT TOGGLE
          ================================================= */}

          <button
            type="button"

            onClick={
              toggleVoiceInput
            }

            disabled={sending}

            aria-label={
              isListening
                ? "Stop voice input"
                : "Start voice input"
            }

            title={
              isListening
                ? "Stop listening"
                : "Voice input"
            }

            className={`
              h-10
              w-10
              flex
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              transition-all
              duration-200

              ${
                isListening
                  ? "border-red-300 bg-red-50 text-red-500 shadow-sm animate-pulse"
                  : voiceEnabled
                  ? "border-violet-300 bg-violet-100 text-violet-600"
                  : "border-violet-100 bg-white/70 text-violet-500 hover:bg-violet-50 hover:border-violet-200"
              }

              disabled:opacity-50
              disabled:cursor-not-allowed
            `}
          >

            {isListening ? (

              <Mic
                size={17}
              />

            ) : (

              <MicOff
                size={17}
              />

            )}

          </button>


          {/* =================================================
              SEND
          ================================================= */}
            <Button
              size="md"
              onClick={() => send()}
              disabled={
                sending ||
                !input.trim()
              }
            >
              <Send size={16} />
            </Button>

        </div>

      </GlassCard>

    </div>

  );

}
