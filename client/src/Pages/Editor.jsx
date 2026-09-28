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
  ExternalLink,
  RotateCcw,
  Download,
  Bot,
  User,
  Rocket,
  Save,
  X,
  Copy,
  QrCode,
  ChevronDown,
  Link2,
  Globe,
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

  // Desktop View Controls
  const [showCode, setShowCode] = useState(false);
  const [deviceView, setDeviceView] = useState("desktop"); // "desktop" | "tablet" | "mobile"

  // Mobile Tab Control: "chat" | "preview" | "code"
  const [mobileTab, setMobileTab] = useState("preview");

  // Save Code Manually State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Deploy State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedData, setDeployedData] = useState(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [copiedDeployUrl, setCopiedDeployUrl] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

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
        setCode(websiteData?.latestCode || websiteData?.code || "");
        setIsDeployed(Boolean(websiteData?.deployed));
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

    iframeRef.current.srcdoc = code;
  }, [code, showCode, mobileTab, previewKey]);

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
        result.data?.code ||
        result.data?.latestCode ||
        result.data?.website?.latestCode ||
        result.data?.website?.code ||
        result.data?.data?.code ||
        result.data?.data?.latestCode ||
        "";

      if (newCode) {
        setCode(newCode);

        setWebsite((previous) => ({
          ...previous,
          ...(result.data?.website || {}),
          latestCode: newCode,
        }));

        // Force preview iframe to immediately refresh with the newly generated code
        setPreviewKey((k) => k + 1);

        if (iframeRef.current) {
          iframeRef.current.srcdoc = "";
          setTimeout(() => {
            if (iframeRef.current) {
              iframeRef.current.srcdoc = newCode;
            }
          }, 30);
        }
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
        if (updatedWebsite?.latestCode || updatedWebsite?.code) {
          setCode(updatedWebsite.latestCode || updatedWebsite.code);
        }

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

  //  =======
  // SAVE MANUALLY API CALL
  //  =======
  const handleSaveManually = async () => {
    if (!id) return;
    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const res = await axios.post(
        `${serverUrl}/api/website/editmanually/${id}`,
        {
          prompt: code,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Edit manually result:", res.data);

      setSaveSuccess(true);

      // Refresh live preview iframe with updated code
      if (iframeRef.current) {
        iframeRef.current.srcdoc = code;
      }

      // Reset success status after 2.5s
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2500);
    } catch (err) {
      console.error("Save manually error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Failed to save code";
      alert(`Error saving code: ${errMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  //  =======
  // DEPLOY API CALL (GET request to /api/website/deployed/:id)
  //  =======
  const handleDeploy = async () => {
    if (!id) return;
    try {
      setIsDeploying(true);

      // Auto-save any manual code modifications first so deployed site is up to date
      if (code) {
        try {
          await axios.post(
            `${serverUrl}/api/website/editmanually/${id}`,
            { prompt: code },
            { withCredentials: true }
          );
        } catch (saveErr) {
          console.warn("Auto-save before deploy notice:", saveErr);
        }
      }

      const res = await axios.get(
        `${serverUrl}/api/website/deployed/${id}`,
        {
          withCredentials: true,
        }
      );

      console.log("Deployed result:", res.data);
      setDeployedData(res.data);
      setIsDeployed(true);
      setWebsite((prev) => (prev ? { ...prev, deployed: true } : prev));
      setShowDeployModal(true);
    } catch (err) {
      console.error("Deploy error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Failed to deploy website.";
      alert(`Deploy Error: ${errMsg}`);
    } finally {
      setIsDeploying(false);
    }
  };

  // Helper: Open preview in new tab
  const handleOpenInNewTab = () => {
    if (id) {
      window.open(`/live/${id}`, "_blank");
    } else if (code) {
      const blob = new Blob([code], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
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
    iframeRef.current.srcdoc = "";
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = code;
      }
    }, 20);
  };

  //  =======
  // ERROR SCREEN
  //  =======
  if (error && !website) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[#060608] text-red-400 px-6 font-sans relative">
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
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[#060608] text-white font-sans relative overflow-hidden">
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
    <div className="h-[100dvh] w-full flex flex-col lg:flex-row bg-[#060608] text-white overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* ========================================================
          MOBILE TOP BAR (< lg screens): Header + Segmented Tabs
      ======================================================== */}
      <header className="lg:hidden flex flex-col border-b border-zinc-800/80 bg-[#09090b] z-30 shrink-0">
        {/* Top Header Row */}
        <div className="h-14 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => navigate("/dashboard")}
              aria-label="Back to dashboard"
              className="p-2 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-400 hover:text-white transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="min-w-0">
              <h2 className="font-bold text-xs sm:text-sm text-white truncate max-w-[130px] sm:max-w-[200px]">
                {website?.title || "Website Project"}
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-zinc-400">
                  {loading ? "AI Generating..." : "Live Ready"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions on Mobile Header */}
          <div className="flex items-center gap-1.5">
            {mobileTab === "code" && (
              <button
                onClick={handleSaveManually}
                disabled={isSaving}
                title="Save Code"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-white text-xs font-semibold active:scale-95 shadow-md cursor-pointer ${
                  saveSuccess
                    ? "bg-emerald-600 shadow-emerald-600/30"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-600/20"
                } disabled:opacity-50`}
              >
                {isSaving ? (
                  <LoaderCircle size={13} className="animate-spin" />
                ) : saveSuccess ? (
                  <Check size={13} className="text-emerald-200" />
                ) : (
                  <Save size={13} />
                )}
                <span>{isSaving ? "Saving" : saveSuccess ? "Saved" : "Save"}</span>
              </button>
            )}
            <button
              onClick={handleReloadPreview}
              title="Reload Preview"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 cursor-pointer"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={handleOpenInNewTab}
              title="Open in new tab"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 cursor-pointer"
            >
              <ExternalLink size={14} />
            </button>
            <button
              onClick={handleDownloadHtml}
              title="Download HTML"
              className="p-2 rounded-xl bg-purple-600/90 text-white active:scale-95 shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Download size={14} />
            </button>
            <DeployButtonMenu
              id={id}
              isDeployed={isDeployed}
              isDeploying={isDeploying}
              onDeploy={handleDeploy}
              onOpenQr={() => setShowQrModal(true)}
              size="sm"
              align="right"
            />
          </div>
        </div>

        {/* Mobile Segmented Tab Switcher */}
        <div className="px-3 pb-2.5 pt-0.5">
          <div className="grid grid-cols-3 p-1 rounded-xl bg-zinc-950 border border-zinc-800/90 text-xs font-semibold">
            <button
              onClick={() => setMobileTab("chat")}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === "chat"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bot size={14} />
              <span>Chat</span>
              {loading && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>

            <button
              onClick={() => {
                setMobileTab("preview");
                setShowCode(false);
              }}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === "preview"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Eye size={14} />
              <span>Preview</span>
            </button>

            <button
              onClick={() => {
                setMobileTab("code");
                setShowCode(true);
              }}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === "code"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Code2 size={14} />
              <span>Code Editor</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          SIDEBAR: AI CO-PILOT CHAT
          - Mobile (< lg): Shown ONLY when mobileTab === 'chat'
          - Desktop (>= lg): Always shown as left column (w-[380px])
      ======================================================== */}
      <aside
        className={`w-full lg:w-[380px] lg:min-w-[380px] flex-1 lg:flex-none lg:h-full flex-col bg-[#09090b] lg:border-r border-zinc-800/80 z-20 shadow-2xl ${
          mobileTab === "chat" ? "flex" : "hidden lg:flex"
        }`}
      >
        {/* Desktop Sidebar Header */}
        <div className="hidden lg:block">
          <SidebarHeader website={website} onBack={() => navigate("/dashboard")} />
        </div>

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
          onSwitchToPreview={() => {
            setMobileTab("preview");
            setShowCode(false);
          }}
        />
      </aside>

      {/* ========================================================
          MAIN WORKSPACE: TOOLBAR & PREVIEW / CODE
          - Mobile (< lg): Shown ONLY when mobileTab !== 'chat'
          - Desktop (>= lg): Always shown as right column (flex-1)
      ======================================================== */}
      <main
        className={`flex-1 min-w-0 min-h-0 flex-col bg-[#050507] overflow-hidden ${
          mobileTab !== "chat" ? "flex" : "hidden lg:flex"
        }`}
      >
        {/* Desktop Workspace Toolbar */}
        <div className="hidden lg:block">
          <WorkspaceToolbar
            id={id}
            showCode={showCode}
            setShowCode={setShowCode}
            setMobileTab={setMobileTab}
            deviceView={deviceView}
            setDeviceView={setDeviceView}
            onReload={handleReloadPreview}
            onOpenNewTab={handleOpenInNewTab}
            onDownload={handleDownloadHtml}
            onSave={handleSaveManually}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            onDeploy={handleDeploy}
            isDeploying={isDeploying}
            isDeployed={isDeployed}
            onOpenQr={() => setShowQrModal(true)}
          />
        </div>

        {/* Workspace Canvas */}
        <div className="flex-1 min-h-0 min-w-0 bg-[#07070a] relative overflow-hidden flex items-center justify-center p-0 lg:p-4 bg-[radial-gradient(#27272a40_1px,transparent_1px)] [background-size:20px_20px]">
          {/* Monaco Code Editor View */}
          <div
            className={`w-full h-full rounded-none lg:rounded-2xl border-0 lg:border border-zinc-800/80 bg-[#121214] overflow-hidden shadow-2xl ${
              showCode ? "flex flex-col relative z-10" : "hidden"
            }`}
          >
            {/* Code Editor Header */}
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-800 bg-zinc-950 text-xs">
              <span className="text-zinc-300 font-medium flex items-center gap-2">
                <Code2 size={14} className="text-purple-400" />
                <span>HTML Code Editor</span>
              </span>

              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                  {code ? `${code.length} characters` : "Empty"}
                </span>

                {/* Save Manual Edit Button */}
                <button
                  type="button"
                  onClick={handleSaveManually}
                  disabled={isSaving}
                  title="Save manual code changes"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer ${
                    saveSuccess
                      ? "bg-emerald-600 text-white shadow-emerald-600/30"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                  } disabled:opacity-50`}
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle size={13} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check size={13} className="text-emerald-200" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      <span>Save Code</span>
                    </>
                  )}
                </button>

                {/* Deploy Button with Deployed status & Dropdown Menu */}
                <DeployButtonMenu
                  id={id}
                  isDeployed={isDeployed}
                  isDeploying={isDeploying}
                  onDeploy={handleDeploy}
                  onOpenQr={() => setShowQrModal(true)}
                  size="sm"
                  align="right"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 w-full h-full">
              <MonacoEditor
                height="100%"
                width="100%"
                language="html"
                theme="vs-dark"
                value={code || ""}
                onChange={(val) => setCode(val || "")}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  smoothScrolling: true,
                  padding: { top: 12, bottom: 12 },
                  lineNumbersMinChars: 3,
                }}
              />
            </div>
          </div>

          {/* Live Preview Canvas Container */}
          <div
            className={`transition-all duration-300 flex-col items-center justify-center bg-white ${
              !showCode ? "flex" : "hidden"
            } ${
              deviceView === "desktop"
                ? "w-full h-full rounded-none"
                : deviceView === "tablet"
                  ? "w-full lg:w-[768px] max-w-full h-full lg:h-[95%] rounded-none lg:rounded-2xl border-0 lg:border-4 border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
                  : "w-full lg:w-[375px] max-w-full h-full lg:h-[95%] rounded-none lg:rounded-3xl border-0 lg:border-8 border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
            }`}
          >
            <iframe
              key={previewKey}
              ref={iframeRef}
              srcDoc={code}
              title="Website Preview"
              className="w-full h-full border-0 bg-white block"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          </div>
        </div>
      </main>

      {/* ========================================================
          DEPLOYED SUCCESS MODAL
      ======================================================== */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-zinc-900 border border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.15)] text-center relative overflow-hidden font-sans">
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setShowDeployModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Celebratory Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Rocket size={26} className="animate-bounce" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1.5">
              Website Deployed! 🚀
            </h3>

            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              {deployedData?.message ||
                deployedData?.msg ||
                "Your website is now live and published to the web."}
            </p>

            {/* URL Box */}
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2 mb-5 text-left">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 mb-0.5">
                  Public Live URL
                </p>
                <p className="text-xs text-zinc-200 truncate font-mono">
                  {deployedData?.deployedUrl ||
                    deployedData?.url ||
                    `${window.location.origin}/live/${id}`}
                </p>
              </div>

              <button
                onClick={() => {
                  const targetUrl =
                    deployedData?.deployedUrl ||
                    deployedData?.url ||
                    `${window.location.origin}/live/${id}`;
                  navigator.clipboard.writeText(targetUrl);
                  setCopiedDeployUrl(true);
                  setTimeout(() => setCopiedDeployUrl(false), 2000);
                }}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer active:scale-95"
                title="Copy Live URL"
              >
                {copiedDeployUrl ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeployModal(false)}
                className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer active:scale-95"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setShowDeployModal(false);
                  setShowQrModal(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                title="View QR Code"
              >
                <QrCode size={13} />
                <span>QR Code</span>
              </button>

              <button
                onClick={() => {
                  const targetUrl =
                    deployedData?.deployedUrl ||
                    deployedData?.url ||
                    `/live/${id}`;
                  window.open(targetUrl, "_blank");
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Visit Site</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          QR CODE MODAL
      ======================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#121214] border border-purple-500/30 shadow-[0_25px_60px_-15px_rgba(168,85,247,0.2)] text-center relative overflow-hidden font-sans">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header Icon */}
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <QrCode size={22} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Live Website QR Code
            </h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Scan with your phone camera to preview this site live on mobile
            </p>

            {/* QR Code Container */}
            <div className="p-3.5 bg-white rounded-2xl inline-block mx-auto mb-4 shadow-2xl border border-zinc-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  `${window.location.origin}/live/${id}`
                )}&margin=4`}
                alt="Website QR Code"
                className="w-44 h-44 rounded-lg block"
              />
            </div>

            {/* Live URL with Copy */}
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2 mb-4 text-left">
              <p className="text-xs text-zinc-300 truncate font-mono flex-1">
                {`${window.location.origin}/live/${id}`}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/live/${id}`);
                  setCopiedDeployUrl(true);
                  setTimeout(() => setCopiedDeployUrl(false), 2000);
                }}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                title="Copy Link"
              >
                {copiedDeployUrl ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.open(`/live/${id}`, "_blank");
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/25"
              >
                <span>Open Site</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================================
// SUB-COMPONENT: SIDEBAR HEADER (Desktop)
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
// SUB-COMPONENT: DEPLOY BUTTON WITH DROPDOWN MENU
// ========================================================
function DeployButtonMenu({
  id,
  isDeployed,
  isDeploying,
  onDeploy,
  onOpenQr,
  size = "md",
  align = "right",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const liveUrl = `${window.location.origin}/live/${id}`;

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLive = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    window.open(liveUrl, "_blank");
  };

  const handleQrClick = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    onOpenQr?.();
  };

  const handleRedeploy = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    onDeploy?.();
  };

  // If NOT deployed: render standard Deploy Live button
  if (!isDeployed) {
    return (
      <button
        type="button"
        onClick={onDeploy}
        disabled={isDeploying}
        className={`flex items-center gap-1.5 rounded-xl font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer ${
          size === "sm"
            ? "px-2.5 py-1.5 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
            : "px-3.5 py-1.5 text-xs bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-white"
        }`}
      >
        {isDeploying ? (
          <LoaderCircle size={size === "sm" ? 13 : 14} className="animate-spin text-white" />
        ) : (
          <Rocket size={size === "sm" ? 13 : 14} />
        )}
        <span>{isDeploying ? "Deploying..." : "Deploy Live"}</span>
      </button>
    );
  }

  // If DEPLOYED: render Deployed status button with Dropdown trigger
  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-xl font-semibold border transition-all active:scale-95 cursor-pointer ${
          isOpen
            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20"
            : "bg-emerald-950/50 hover:bg-emerald-900/60 border-emerald-500/40 hover:border-emerald-400 text-emerald-300"
        } ${size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-1.5 text-xs"}`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Deployed</span>
        <ChevronDown
          size={13}
          className={`text-emerald-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-56 rounded-2xl bg-[#121214] border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          {/* Header indicator */}
          <div className="px-3 py-1.5 border-b border-zinc-800/80 mb-1 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <Globe size={12} />
              <span>Live on Web</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Public</span>
          </div>

          {/* Option: Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Link2 size={14} className="text-zinc-400" />
              <span>{copied ? "Link Copied!" : "Copy Link"}</span>
            </div>
            {copied ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={13} className="text-zinc-500" />
            )}
          </button>

          {/* Option: View QR Code */}
          <button
            type="button"
            onClick={handleQrClick}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer"
          >
            <QrCode size={14} className="text-purple-400" />
            <span>QR Code</span>
          </button>

          {/* Option: Open Live Website */}
          <button
            type="button"
            onClick={handleOpenLive}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={14} className="text-cyan-400" />
              <span>Open Website</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">↗</span>
          </button>

          <div className="h-px bg-zinc-800 my-1" />

          {/* Option: Re-deploy / Update */}
          <button
            type="button"
            onClick={handleRedeploy}
            disabled={isDeploying}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition cursor-pointer disabled:opacity-50"
          >
            {isDeploying ? (
              <LoaderCircle size={14} className="animate-spin text-emerald-400" />
            ) : (
              <RotateCcw size={14} className="text-emerald-400" />
            )}
            <span>{isDeploying ? "Updating..." : "Update Live Site"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ========================================================
// SUB-COMPONENT: WORKSPACE TOOLBAR (Desktop)
// ========================================================
function WorkspaceToolbar({
  id,
  showCode,
  setShowCode,
  setMobileTab,
  deviceView,
  setDeviceView,
  onReload,
  onOpenNewTab,
  onDownload,
  onSave,
  isSaving,
  saveSuccess,
  onDeploy,
  isDeploying,
  isDeployed,
  onOpenQr,
}) {
  return (
    <div className="h-16 min-h-16 px-4 sm:px-6 flex items-center justify-between border-b border-zinc-800/80 bg-[#09090b] z-10">
      {/* Left side: View Mode Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
          <button
            onClick={() => {
              setShowCode(false);
              setMobileTab?.("preview");
            }}
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
            onClick={() => {
              setShowCode(true);
              setMobileTab?.("code");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
              showCode
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Code2 size={14} />
            <span>Code Editor</span>
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
        {/* Save Code Button (shown when viewing Code Editor) */}
        {showCode && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              saveSuccess
                ? "bg-emerald-600 text-white shadow-emerald-600/25"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25"
            } disabled:opacity-50`}
          >
            {isSaving ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : saveSuccess ? (
              <Check size={14} className="text-emerald-200" />
            ) : (
              <Save size={14} />
            )}
            <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Code"}</span>
          </button>
        )}

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
          title="Open live preview in new tab"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <ExternalLink size={15} />
        </button>

        {/* Download HTML Button */}
        <button
          onClick={onDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Export HTML</span>
        </button>

        {/* Deploy Live / Deployed Button with Dropdown Menu */}
        <DeployButtonMenu
          id={id}
          isDeployed={isDeployed}
          isDeploying={isDeploying}
          onDeploy={onDeploy}
          onOpenQr={onOpenQr}
          size="md"
          align="right"
        />
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
  onSwitchToPreview,
}) {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[#09090b]">
      {/* MESSAGE SCROLL CONTAINER */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3.5 sm:space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {messages.length === 0 && !loading ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-2 py-4 sm:py-6">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2.5 sm:mb-3 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
              <Bot size={20} className="sm:size-22" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Ask AI Co-Pilot
            </h4>
            <p className="text-xs text-zinc-400 max-w-[260px] leading-relaxed mb-3.5">
              Describe what you want to add, style, or adjust in your website.
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

            {/* Helper pill on mobile when not loading and messages exist */}
            {!loading && messages.length > 0 && onSwitchToPreview && (
              <div className="lg:hidden flex justify-center pt-2">
                <button
                  onClick={onSwitchToPreview}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-xs font-semibold text-purple-300 active:scale-95"
                >
                  <Eye size={13} />
                  <span>View Live Preview</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} className="h-1" />
          </>
        )}
      </div>

      {/* CHAT INPUT AREA */}
      <div className="shrink-0 p-2.5 sm:p-3.5 border-t border-zinc-800/80 bg-[#09090b]">
        <div className="flex items-end gap-2 rounded-2xl bg-zinc-950/80 border border-zinc-800 p-2 sm:p-2.5 focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/10 transition-all duration-200">
          <textarea
            rows={1}
            placeholder="Ask AI to change styles, add sections..."
            className="flex-1 min-w-0 max-h-28 resize-none bg-transparent px-2 py-1 text-base sm:text-sm text-white outline-none placeholder:text-zinc-600 leading-relaxed"
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

        <p className="hidden sm:block text-[10px] text-zinc-500 mt-2 text-center">
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
    <div className={`flex gap-2 sm:gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
          <Bot size={13} className="sm:size-14" />
        </div>
      )}

      <div
        className={`max-w-[88%] sm:max-w-[85%] px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed break-words shadow-sm ${
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
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
          <User size={13} className="sm:size-14" />
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
    <div className="flex justify-start pl-8 sm:pl-9">
      <div className="w-full max-w-[95%] rounded-2xl bg-zinc-900/90 border border-purple-500/25 p-3 sm:p-3.5 shadow-lg shadow-purple-900/10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
            <Sparkles size={11} className="sm:size-12 text-purple-400" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-purple-300">
            Synthesizing Code Revisions...
          </span>
        </div>

        {/* Steps */}
        <div className="space-y-1.5 sm:space-y-2">
          {THINKING_STEPS.map((step, index) => {
            const completed = index < currentStep;
            const active = index === currentStep;

            return (
              <div
                key={step}
                className={`flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs transition-all duration-300 ${
                  completed
                    ? "text-zinc-500"
                    : active
                      ? "text-purple-200 font-medium"
                      : "text-zinc-600"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  {completed ? (
                    <Check size={12} className="sm:size-13 text-emerald-400" />
                  ) : active ? (
                    <LoaderCircle size={12} className="sm:size-13 text-purple-400 animate-spin" />
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
        <div className="mt-3 h-1 sm:h-1.5 rounded-full bg-zinc-800 overflow-hidden">
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
