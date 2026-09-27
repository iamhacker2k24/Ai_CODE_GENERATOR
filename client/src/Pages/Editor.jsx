import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Rocket,
  Monitor,
  Send,
  Sparkles,
  LoaderCircle,
  Check,
  AlertCircle,
} from "lucide-react";

const serverUrl = "http://localhost:3000";

const THINKING_STEPS = [
  "Understanding your request",
  "Planning the changes",
  "Generating website code",
  "Checking the generated code",
  "Preparing live preview",
];

const Editor = () => {
  const { id } = useParams();

  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");

  const [code, setCode] = useState("");

  const [messages, setMessages] = useState([]);

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);

  const [thinkingStep, setThinkingStep] = useState(0);

  const iframeRef = useRef(null);

  const messagesEndRef = useRef(null);
  const [showCode, setShowCode] = useState(false);

  //  =======
  // GET WEBSITE
  //  =======

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        setError("");

        const result = await axios.get(
          `${serverUrl}/api/website/get-by-id/${id}`,
          {
            withCredentials: true,
          },
        );

        console.log("Website result:", result.data);

        const websiteData = result.data;

        setWebsite(websiteData);

        setCode(websiteData?.latestCode || "");

        setMessages(
          Array.isArray(websiteData?.conversation)
            ? websiteData.conversation
            : [],
        );
      } catch (err) {
        console.error("Get website error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load website",
        );
      }
    };

    if (id) {
      handleGetWebsite();
    }
  }, [id]);

  //  =======
  // AUTO SCROLL CHAT
  //  =======

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, thinkingStep, loading]);

  //  =======
  // UPDATE IFRAME
  //  =======

  useEffect(() => {
    if (!iframeRef.current || !code) {
      return;
    }

    const blob = new Blob([code], {
      type: "text/html",
    });

    const url = URL.createObjectURL(blob);

    iframeRef.current.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [code]);

  //  =======
  // THINKING STEPS
  //  =======

  useEffect(() => {
    if (!loading) {
      setThinkingStep(0);
      return;
    }

    setThinkingStep(0);

    const interval = setInterval(() => {
      setThinkingStep((current) => {
        if (current < THINKING_STEPS.length - 1) {
          return current + 1;
        }

        return current;
      });
    }, 1800);

    return () => {
      clearInterval(interval);
    };
  }, [loading]);

  //  =======
  // UPDATE WEBSITE
  //  =======

  const handleUpdate = async () => {
    if (!prompt.trim()) {
      return;
    }

    if (loading) {
      return;
    }

    const currentPrompt = prompt.trim();

    // Clear prompt
    setPrompt("");

    // Remove previous error
    setError("");

    // Add user message
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: currentPrompt,
      },
    ]);

    // Start generation
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/website/update/${id}`,
        {
          prompt: currentPrompt,
        },
        {
          withCredentials: true,
        },
      );

      console.log("Update result:", result.data);

      //  ===
      // GET NEW CODE
      //  ===

      const newCode =
        result.data?.latestCode ||
        result.data?.website?.latestCode ||
        result.data?.data?.latestCode ||
        "";

      if (newCode) {
        setCode(newCode);

        setWebsite((previous) => ({
          ...previous,
          ...(result.data?.website || {}),
          latestCode: newCode,
        }));
      }

      //  ===
      // BACKEND MESSAGE
      //  ===

      const aiMessage =
        result.data?.message ||
        result.data?.website?.message ||
        "Website updated successfully.";

      // Add AI response
      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          content: aiMessage,
        },
      ]);

      //  ===
      // IF BACKEND RETURNS COMPLETE WEBSITE
      //  ===

      if (result.data?.website) {
        const updatedWebsite = result.data.website;

        setWebsite(updatedWebsite);

        setCode(updatedWebsite?.latestCode || newCode || "");

        // Don't overwrite the local messages unless
        // backend actually returned conversation.
        if (Array.isArray(updatedWebsite?.conversation)) {
          setMessages(updatedWebsite.conversation);
        }
      }
    } catch (err) {
      console.error("Update website error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update website.";

      setError(errorMessage);

      setMessages((previous) => [
        ...previous,
        {
          role: "error",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  //  =======
  // ENTER KEY
  //  =======

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleUpdate();
    }
  };

  //  =======
  // ERROR SCREEN
  //  =======

  if (error && !website) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-[#080808] text-red-400 px-6">
        <div className="text-center max-w-md">
          <AlertCircle size={40} className="mx-auto mb-4" />

          <h2 className="text-xl font-semibold mb-2 text-white">
            Something went wrong
          </h2>

          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  //  =======
  // LOADING WEBSITE
  //  =======

  if (!website) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-[#080808] text-white">
        <div className="flex items-center gap-3">
          <LoaderCircle size={20} className="animate-spin" />
          Loading editor...
        </div>
      </div>
    );
  }

  //  =======
  // MAIN EDITOR
  //  =======

  return (
    <div className="h-dvh w-full flex flex-col lg:flex-row bg-[#080808] text-white overflow-hidden">
      {/*  ==
          LEFT CHAT SIDEBAR
       == */}

      <aside
        className="
          w-full
          lg:w-[360px]
          lg:min-w-[360px]
          h-[48dvh]
          lg:h-full
          flex
          flex-col
          bg-[#080808]
          border-b
          lg:border-b-0
          lg:border-r
          border-white/[0.08]
          overflow-hidden
        "
      >
        <Header website={website} />

        <Chat
          messages={messages}
          prompt={prompt}
          setPrompt={setPrompt}
          handleUpdate={handleUpdate}
          handleKeyDown={handleKeyDown}
          loading={loading}
          thinkingStep={thinkingStep}
          messagesEndRef={messagesEndRef}
        />
      </aside>

      {/*  ==
          RIGHT PREVIEW
       == */}

      <main
        className="
          flex-1
          min-w-0
          min-h-0
          flex
          flex-col
          bg-[#080808]
          overflow-hidden
        "
      >
        {/* Preview Header */}

        <PreviewHeader />

        {/* Preview */}

        <AnimatePresence>
          {showCode && <motion.dev></motion.dev>}
        </AnimatePresence>

        <div
          className="
            flex-1
            min-h-0
            min-w-0
            bg-[#111111]
            p-0
            overflow-hidden
          "
        >
          <iframe
            ref={iframeRef}
            title="Website Preview"
            className="
              block
              w-full
              h-full
              border-0
              bg-white
            "
          />
        </div>
      </main>
    </div>
  );
};

// HEADER

function Header({ website }) {
  return (
    <div
      className="
        h-14
        min-h-14
        px-4
        flex
        items-center
        justify-between
        bg-[#080808]
        border-b
        border-white/[0.08]
      "
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="
            w-7
            h-7
            rounded-lg
            flex
            items-center
            justify-center
            bg-linear-to-br
            from-indigo-500
            to-purple-600
            shrink-0
          "
        >
          <Sparkles size={14} />
        </div>

        <span className="font-semibold text-sm truncate">
          {website?.title || "Website Editor"}
        </span>
      </div>
    </div>
  );
}

// PREVIEW HEADER

function PreviewHeader() {
  return (
    <div
      className="
        h-14
        min-h-14
        px-4
        flex
        items-center
        justify-between
        border-b
        border-white/[0.08]
        bg-[#080808]
      "
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />

        <span className="text-xs text-zinc-400">Live Preview</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="
            hidden
            sm:flex
            items-center
            gap-2
            px-4
            py-1.5
            rounded-lg
            bg-linear-to-r
            from-indigo-500
            to-purple-500
            text-sm
            font-semibold
            hover:scale-[1.03]
            transition
          "
        >
          <Rocket size={14} />
          Deploy
        </button>

        <button
          type="button"
          className="
            p-2
            rounded-lg
            text-zinc-400
            hover:text-white
            hover:bg-white/[0.06]
            transition
          "
          title="Preview"
        >
          <Monitor size={17} />
        </button>
      </div>
    </div>
  );
}

// CHAT

function Chat({
  messages,
  prompt,
  setPrompt,
  handleUpdate,
  handleKeyDown,
  loading,
  thinkingStep,
  messagesEndRef,
}) {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/*  
          MESSAGE AREA
        */}

      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          overflow-x-hidden
          px-3
          sm:px-4
          py-4
          space-y-4
          scrollbar-thin
          scrollbar-thumb-white/10
          scrollbar-track-transparent
        "
      >
        {messages.length === 0 && !loading ? (
          <div className="h-full flex items-center justify-center px-4">
            <div className="text-center">
              <div
                className="
                  w-10
                  h-10
                  mx-auto
                  mb-3
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  bg-white/[0.05]
                  border
                  border-white/[0.08]
                "
              >
                <Sparkles size={18} className="text-indigo-400" />
              </div>

              <p className="text-sm text-zinc-400">
                Describe the changes you want to make...
              </p>

              <p className="text-xs text-zinc-600 mt-2">
                Example: "Make the hero section more modern"
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <Message key={m._id || m.id || `${m.role}-${i}`} message={m} />
            ))}

            {/*  
                AI THINKING
              */}

            {loading && <ThinkingSteps currentStep={thinkingStep} />}

            {/* Auto scroll anchor */}

            <div ref={messagesEndRef} className="h-px" />
          </>
        )}
      </div>

      {/*  
          INPUT
        */}

      <div
        className="
          shrink-0
          p-3
          border-t
          border-white/[0.08]
          bg-[#080808]
        "
      >
        <div
          className="
            flex
            items-end
            gap-2
            rounded-2xl
            bg-[#111111]
            border
            border-white/[0.08]
            p-2
            focus-within:border-white/20
            transition
          "
        >
          <textarea
            rows={1}
            placeholder="Describe Changes..."
            className="
              flex-1
              min-w-0
              max-h-32
              resize-none
              bg-transparent
              px-2
              py-2
              text-sm
              text-white
              outline-none
              placeholder:text-zinc-600
            "
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading || !prompt.trim()}
            className="
              shrink-0
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              bg-white
              text-black
              disabled:opacity-30
              disabled:cursor-not-allowed
              hover:bg-zinc-200
              transition
            "
          >
            {loading ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>

        <p className="text-[10px] text-zinc-600 mt-2 text-center">
          Press Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}

// MESSAGE

function Message({ message }) {
  const isUser = message.role === "user";

  const isError = message.role === "error";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[88%]
          sm:max-w-[85%]
          px-3.5
          py-2.5
          rounded-2xl
          text-sm
          leading-relaxed
          break-words
          ${
            isUser
              ? "bg-white text-black rounded-br-md"
              : isError
                ? "bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-md"
                : "bg-[#151515] border border-white/[0.08] text-zinc-300 rounded-bl-md"
          }
        `}
      >
        {isError && <AlertCircle size={14} className="inline mr-2" />}

        {message.content || message.message || ""}
      </div>
    </div>
  );
}

// THINKING STEPS

function ThinkingSteps({ currentStep }) {
  return (
    <div className="flex justify-start">
      <div
        className="
          w-full
          max-w-[92%]
          rounded-2xl
          bg-[#111111]
          border
          border-white/[0.08]
          p-3
        "
      >
        {/* Header */}

        <div className="flex items-center gap-2 mb-3">
          <div
            className="
              w-6
              h-6
              rounded-lg
              bg-indigo-500/10
              border
              border-indigo-500/20
              flex
              items-center
              justify-center
            "
          >
            <Sparkles size={12} className="text-indigo-400" />
          </div>

          <span className="text-xs font-medium text-zinc-300">
            AI is working...
          </span>
        </div>

        {/* Steps */}

        <div className="space-y-2">
          {THINKING_STEPS.map((step, index) => {
            const completed = index < currentStep;

            const active = index === currentStep;

            return (
              <div
                key={step}
                className={`
                    flex
                    items-center
                    gap-2.5
                    text-xs
                    transition-all
                    duration-300
                    ${
                      completed
                        ? "text-zinc-500"
                        : active
                          ? "text-zinc-200"
                          : "text-zinc-700"
                    }
                  `}
              >
                {/* Icon */}

                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  {completed ? (
                    <Check size={13} className="text-emerald-400" />
                  ) : active ? (
                    <LoaderCircle
                      size={13}
                      className="text-indigo-400 animate-spin"
                    />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  )}
                </div>

                <span>{step}</span>
              </div>
            );
          })}
        </div>

        {/* Progress */}

        <div className="mt-3 h-1 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className="
              h-full
              rounded-full
              bg-linear-to-r
              from-indigo-500
              to-purple-500
              transition-all
              duration-700
            "
            style={{
              width: `${Math.min(
                ((currentStep + 1) / THINKING_STEPS.length) * 100,
                100,
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Editor;
