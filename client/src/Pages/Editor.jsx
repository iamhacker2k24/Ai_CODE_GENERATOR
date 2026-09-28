import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Send,
  Sparkles,
  LoaderCircle,
  Check,
  AlertCircle,
  Code2,
  Eye,
  Copy,
  ExternalLink,
  RotateCcw,
  Download,
  Bot,
  User,
} from "lucide-react";

const serverUrl = "http://localhost:3000";

const THINKING_STEPS = [
  "Understanding your request",
  "Planning the changes",
  "Generating website code",
  "Checking the generated code",
  "Preparing live preview",
];

const SUGGESTIONS = [
  "Make the hero section more modern with a glowing gradient badge",
  "Add a responsive pricing table with monthly & yearly switch",
  "Include interactive FAQ accordions and customer testimonials",
  "Change the color theme to sleek obsidian and purple neon accents",
];

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);

  // View Controls
  const [showCode, setShowCode] = useState(false);
  const [deviceView, setDeviceView] = useState("desktop"); // "desktop" | "tablet" | "mobile"
  const [copied, setCopied] = useState(false);

  const iframeRef = useRef(null);
  const messagesEndRef = useRef(null);

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
          }
        );

        console.log("Website result:", result.data);

        const websiteData = result.data;
        setWebsite(websiteData);
        setCode(websiteData?.latestCode || "");
        setMessages(
          Array.isArray(websiteData?.conversation)
            ? websiteData.conversation
            : []
        );
      } catch (err) {
        console.error("Get website error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load website"
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
  // UPDATE WEBSITE (PRESERVED BACKEND LOGIC)
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
        }
      );

      console.log("Update result:", result.data);

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

      if (result.data?.website) {
        const updatedWebsite = result.data.website;
        setWebsite(updatedWebsite);
        setCode(updatedWebsite?.latestCode || newCode || "");

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    }
  };

  // Helper: Copy code to clipboard
  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Helper: Open preview in new tab
  const handleOpenInNewTab = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // Helper: Download HTML file
  const handleDownloadHtml = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(website?.title || "website").toLowerCase().replace(/[^a-z0-9]/g, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper: Reload iframe preview
  const handleReloadPreview = () => {
    if (!iframeRef.current || !code) return;
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
  };

  //  =======
  // ERROR SCREEN
  //  =======
  if (error && !website) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#060608] text-red-400 px-6 font-sans relative">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center max-w-md p-8 rounded-3xl border border-red-500/20 bg-zinc-900/60 backdrop-blur-xl relative z-10 shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">
            Failed to Load Project
          </h2>
          <p className="text-sm text-red-300/80 mb-6 leading-relaxed">
            {error}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  //  =======
  // LOADING WEBSITE
  //  =======
  if (!website) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#060608] text-white font-sans relative overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-600/30 animate-pulse">
            <Sparkles size={22} />
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-300">
            <LoaderCircle size={18} className="animate-spin text-purple-400" />
            <span>Loading workspace & live sandbox...</span>
          </div>
        </div>
      </div>
    );
  }

  //  =======
  // MAIN EDITOR WORKSPACE
  //  =======
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#060608] text-white overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* ========================================================
          LEFT SIDEBAR: AI CO-PILOT CHAT
      ======================================================== */}
      <aside className="w-full lg:w-[380px] lg:min-w-[380px] h-[45vh] lg:h-full flex flex-col bg-[#09090b] border-b lg:border-b-0 lg:border-r border-zinc-800/80 z-20 shadow-2xl">
        {/* Sidebar Header */}
        <SidebarHeader website={website} onBack={() => navigate("/dashboard")} />

        {/* Chat Component */}
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

      {/* ========================================================
          RIGHT MAIN WORKSPACE: TOOLBAR & PREVIEW / CODE
      ======================================================== */}
      <main className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#050507] overflow-hidden">
        {/* Workspace Toolbar */}
        <WorkspaceToolbar
          showCode={showCode}
          setShowCode={setShowCode}
          deviceView={deviceView}
          setDeviceView={setDeviceView}
          onCopy={handleCopyCode}
          copied={copied}
          onReload={handleReloadPreview}
          onOpenNewTab={handleOpenInNewTab}
          onDownload={handleDownloadHtml}
        />

        {/* Workspace Canvas */}
        <div className="flex-1 min-h-0 min-w-0 bg-[#07070a] relative overflow-hidden flex items-center justify-center p-0 lg:p-4 bg-[radial-gradient(#27272a40_1px,transparent_1px)] [background-size:20px_20px]">
          {showCode ? (
            /* Monaco Code Editor View */
            <div className="w-full h-full rounded-none lg:rounded-2xl border-0 lg:border border-zinc-800/80 bg-[#121214] overflow-hidden shadow-2xl">
              <MonacoEditor
                height="100%"
                language="html"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  padding: { top: 16, bottom: 16 },
                  lineNumbersMinChars: 3,
                }}
              />
            </div>
          ) : (
            /* Live Preview Canvas Container */
            <div
              className={`transition-all duration-300 flex flex-col items-center justify-center bg-white ${
                deviceView === "desktop"
                  ? "w-full h-full rounded-none"
                  : deviceView === "tablet"
                    ? "w-[768px] max-w-full h-[95%] rounded-2xl border-4 border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
                    : "w-[375px] max-w-full h-[95%] rounded-3xl border-8 border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
              }`}
            >
              <iframe
                ref={iframeRef}
                title="Website Preview"
                className="w-full h-full border-0 bg-white block"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ========================================================
// SUB-COMPONENT: SIDEBAR HEADER
// ========================================================
function SidebarHeader({ website, onBack }) {
  return (
    <div className="h-16 min-h-16 px-4 flex items-center justify-between border-b border-zinc-800/80 bg-[#09090b]">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onBack}
          aria-label="Back to dashboard"
          className="p-2 rounded-xl bg-zinc-800/80 border border-zinc-700/60 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Live AI Editor
            </span>
          </div>
          <h2 className="font-bold text-sm text-white truncate max-w-[200px]">
            {website?.title || "Website Project"}
          </h2>
        </div>
      </div>

      <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-sm">
        <Sparkles size={16} />
      </div>
    </div>
  );
}

// ========================================================
// SUB-COMPONENT: WORKSPACE TOOLBAR
// ========================================================
function WorkspaceToolbar({
  showCode,
  setShowCode,
  deviceView,
  setDeviceView,
  onCopy,
  copied,
  onReload,
  onOpenNewTab,
  onDownload,
}) {
  return (
    <div className="h-16 min-h-16 px-4 sm:px-6 flex items-center justify-between border-b border-zinc-800/80 bg-[#09090b] z-10">
      {/* Left side: View Mode Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
          <button
            onClick={() => setShowCode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
              !showCode
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>

          <button
            onClick={() => setShowCode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
              showCode
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Code2 size={14} />
            <span>Source Code</span>
          </button>
        </div>

        {/* Device Switcher (Visible only in preview mode) */}
        {!showCode && (
          <div className="hidden md:flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
            <button
              onClick={() => setDeviceView("desktop")}
              title="Desktop View (100%)"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                deviceView === "desktop"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "hover:text-white"
              }`}
            >
              <Monitor size={15} />
            </button>
            <button
              onClick={() => setDeviceView("tablet")}
              title="Tablet View (768px)"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                deviceView === "tablet"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "hover:text-white"
              }`}
            >
              <Tablet size={15} />
            </button>
            <button
              onClick={() => setDeviceView("mobile")}
              title="Mobile View (375px)"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                deviceView === "mobile"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "hover:text-white"
              }`}
            >
              <Smartphone size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Copy Code Button */}
        <button
          onClick={onCopy}
          title="Copy HTML to clipboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="hidden sm:inline">Copy Code</span>
            </>
          )}
        </button>

        {/* Reload Preview Button */}
        {!showCode && (
          <button
            onClick={onReload}
            title="Reload Preview"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
        )}

        {/* Open in New Window Button */}
        <button
          onClick={onOpenNewTab}
          title="Open preview in new tab"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <ExternalLink size={15} />
        </button>

        {/* Download HTML Button */}
        <button
          onClick={onDownload}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Export HTML</span>
        </button>
      </div>
    </div>
  );
}

// ========================================================
// SUB-COMPONENT: CHAT
// ========================================================
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
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[#09090b]">
      {/* MESSAGE SCROLL CONTAINER */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {messages.length === 0 && !loading ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-2 py-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
              <Bot size={22} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Ask AI Co-Pilot
            </h4>
            <p className="text-xs text-zinc-400 max-w-[260px] leading-relaxed mb-4">
              Describe what you want to add, style, or adjust in your generated website.
            </p>

            {/* Starter Suggestion Pills */}
            <div className="w-full space-y-2 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Suggested Prompts
              </p>
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(s)}
                  className="w-full text-left p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 hover:border-purple-500/40 text-xs text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <MessageItem key={m._id || m.id || `${m.role}-${i}`} message={m} />
            ))}

            {/* AI THINKING PROCESS */}
            {loading && <ThinkingSteps currentStep={thinkingStep} />}

            <div ref={messagesEndRef} className="h-1" />
          </>
        )}
      </div>

      {/* CHAT INPUT AREA */}
      <div className="shrink-0 p-3.5 border-t border-zinc-800/80 bg-[#09090b]">
        <div className="flex items-end gap-2 rounded-2xl bg-zinc-950/80 border border-zinc-800 p-2.5 focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/10 transition-all duration-200">
          <textarea
            rows={2}
            placeholder="Ask AI to change styles, add sections, or fix layout..."
            className="flex-1 min-w-0 max-h-32 resize-none bg-transparent px-2 py-1 text-sm text-white outline-none placeholder:text-zinc-600 leading-relaxed"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading || !prompt.trim()}
            className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-purple-600/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {loading ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>

        <p className="text-[10px] text-zinc-500 mt-2 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}

// ========================================================
// SUB-COMPONENT: MESSAGE ITEM
// ========================================================
function MessageItem({ message }) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  return (
    <div className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
          <Bot size={14} />
        </div>
      )}

      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed break-words shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-xs"
            : isError
              ? "bg-red-500/10 border border-red-500/25 text-red-300 rounded-bl-xs"
              : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-xs"
        }`}
      >
        {isError && <AlertCircle size={14} className="inline mr-1.5 text-red-400" />}
        {message.content || message.message || ""}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
          <User size={14} />
        </div>
      )}
    </div>
  );
}

// ========================================================
// SUB-COMPONENT: THINKING STEPS
// ========================================================
function ThinkingSteps({ currentStep }) {
  return (
    <div className="flex justify-start pl-9">
      <div className="w-full max-w-[95%] rounded-2xl bg-zinc-900/90 border border-purple-500/25 p-3.5 shadow-lg shadow-purple-900/10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
            <Sparkles size={12} className="text-purple-400" />
          </div>
          <span className="text-xs font-semibold text-purple-300">
            Synthesizing Code Revisions...
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
                className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                  completed
                    ? "text-zinc-500"
                    : active
                      ? "text-purple-200 font-medium"
                      : "text-zinc-600"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  {completed ? (
                    <Check size={13} className="text-emerald-400" />
                  ) : active ? (
                    <LoaderCircle size={13} className="text-purple-400 animate-spin" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  )}
                </div>
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-3.5 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 transition-all duration-700 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            style={{
              width: `${Math.min(
                ((currentStep + 1) / THINKING_STEPS.length) * 100,
                100
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
