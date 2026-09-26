import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Code2,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Download,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Save,
  Sparkles,
  PanelLeft,
  PanelRight,
  Maximize2,
  X,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeView, setActiveView] = useState("preview");
  const [device, setDevice] = useState("desktop");

  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);

  /* =====================================================
     GET WEBSITE
  ===================================================== */

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await axios.get(
          `${serverUrl}/api/website/get-by-id/${id}`,
          {
            withCredentials: true,
          }
        );

        console.log("Website response:", result.data);

        if (!result.data) {
          throw new Error("Website not found");
        }

        setWebsite(result.data);
      } catch (error) {
        console.error("Get website error:", error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load website"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      handleGetWebsite();
    }
    handleGetWebsite();
  }, [id]);

  /* =====================================================
     EXTRACT GENERATED CODE
  ===================================================== */

  const generatedCode = useMemo(() => {
    if (!website) return "";

    /*
      Supports different possible backend responses:

      {
        code: "..."
      }

      {
        data: {
          code: "..."
        }
      }

      {
        website: {
          code: "..."
        }
      }

      {
        result: {
          code: "..."
        }
      }
    */

    return (
      website?.code ||
      website?.data?.code ||
      website?.website?.code ||
      website?.result?.code ||
      ""
    );
  }, [website]);

  /* =====================================================
     WEBSITE TITLE
  ===================================================== */

  const websiteTitle = useMemo(() => {
    return (
      website?.name ||
      website?.title ||
      website?.data?.name ||
      website?.website?.name ||
      "Untitled Website"
    );
  }, [website]);

  /* =====================================================
     COPY CODE
  ===================================================== */

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  /* =====================================================
     DOWNLOAD CODE
  ===================================================== */

  const handleDownload = () => {
    if (!generatedCode) return;

    const blob = new Blob([generatedCode], {
      type: "text/html",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${websiteTitle
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}.html`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  /* =====================================================
     OPEN WEBSITE
  ===================================================== */

  const handleOpenWebsite = () => {
    if (!generatedCode) return;

    const blob = new Blob([generatedCode], {
      type: "text/html",
    });

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            <Loader2
              size={22}
              className="animate-spin text-zinc-300"
            />
          </div>

          <div className="text-center">
            <p className="font-medium">
              Loading your website
            </p>

            <p className="text-sm text-zinc-500 mt-1">
              Preparing the editor...
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">

        <div className="max-w-md w-full border border-white/10 bg-white/[0.03] rounded-3xl p-8 text-center">

          <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">

            <X
              size={22}
              className="text-red-400"
            />

          </div>

          <h1 className="text-lg font-semibold">
            Unable to load website
          </h1>

          <p className="text-sm text-zinc-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <header className="h-16 shrink-0 border-b border-white/10 bg-[#080808] flex items-center justify-between px-4">

        {/* LEFT */}

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="h-6 w-px bg-white/10" />

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
              <Sparkles size={16} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Genweb
                <span className="text-zinc-500">
                  .ai
                </span>
              </p>

              <p className="text-[10px] text-zinc-600">
                Website Editor
              </p>
            </div>

          </div>

          <div className="hidden md:flex items-center gap-2 ml-4">

            <span className="text-zinc-700">
              /
            </span>

            <span className="text-sm text-zinc-400 max-w-[200px] truncate">
              {websiteTitle}
            </span>

          </div>

        </div>

        {/* CENTER */}

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center bg-white/[0.04] border border-white/10 rounded-xl p-1">

          <button
            onClick={() => setActiveView("preview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition ${
              activeView === "preview"
                ? "bg-white text-black"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            <Eye size={14} />
            Preview
          </button>

          <button
            onClick={() => setActiveView("code")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition ${
              activeView === "code"
                ? "bg-white text-black"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            <Code2 size={14} />
            Code
          </button>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              setRefreshKey((prev) => prev + 1)
            }
            className="p-2 rounded-lg hover:bg-white/10 transition"
            title="Refresh preview"
          >
            <RefreshCw size={16} />
          </button>

          <button
            onClick={handleDownload}
            disabled={!generatedCode}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-xs transition disabled:opacity-30"
          >
            <Download size={14} />
            Export
          </button>

          <button
            onClick={handleOpenWebsite}
            disabled={!generatedCode}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition disabled:opacity-30"
          >
            <ExternalLink size={14} />
            Open
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN EDITOR
      ===================================================== */}

      <div className="flex flex-1 min-h-0">

        {/* =================================================
            LEFT SIDEBAR
        ================================================= */}

        {showLeftPanel && (
          <aside className="w-64 shrink-0 border-r border-white/10 bg-[#080808] flex flex-col">

            {/* Tools */}

            <div className="p-4">

              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">
                Tools
              </p>

              <div className="space-y-1">

                <button
                  onClick={() => setActiveView("preview")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                    activeView === "preview"
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Eye size={16} />
                  Preview
                </button>

                <button
                  onClick={() => setActiveView("code")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                    activeView === "code"
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Code2 size={16} />
                  Source Code
                </button>

              </div>

            </div>

            <div className="h-px bg-white/10" />

            {/* Website info */}

            <div className="p-4">

              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">
                Website
              </p>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">

                <p className="text-sm font-medium truncate">
                  {websiteTitle}
                </p>

                <p className="text-xs text-zinc-600 mt-1">
                  Generated by AI
                </p>

              </div>

            </div>

            {/* Device */}

            <div className="p-4">

              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">
                Device
              </p>

              <div className="grid grid-cols-3 gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1">

                <button
                  onClick={() => setDevice("desktop")}
                  className={`flex justify-center py-2 rounded-lg ${
                    device === "desktop"
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  <Monitor size={15} />
                </button>

                <button
                  onClick={() => setDevice("tablet")}
                  className={`flex justify-center py-2 rounded-lg ${
                    device === "tablet"
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  <Tablet size={15} />
                </button>

                <button
                  onClick={() => setDevice("mobile")}
                  className={`flex justify-center py-2 rounded-lg ${
                    device === "mobile"
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  <Smartphone size={15} />
                </button>

              </div>

            </div>

            {/* Bottom */}

            <div className="mt-auto p-4 border-t border-white/10">

              <button
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition"
              >
                <Save size={14} />
                Save Changes
              </button>

            </div>

          </aside>
        )}

        {/* =================================================
            CENTER
        ================================================= */}

        <main className="flex-1 min-w-0 bg-[#111111] flex flex-col">

          {/* Preview toolbar */}

          {activeView === "preview" && (
            <div className="h-12 shrink-0 border-b border-white/10 bg-[#0b0b0b] flex items-center justify-between px-4">

              <div className="flex items-center gap-2">

                <button
                  onClick={() => setShowLeftPanel(!showLeftPanel)}
                  className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white"
                >
                  <PanelLeft size={15} />
                </button>

                <span className="text-xs text-zinc-600">
                  Live Preview
                </span>

              </div>

              <div className="flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-emerald-400" />

                <span className="text-[11px] text-zinc-500">
                  Live
                </span>

              </div>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white"
              >
                <Maximize2 size={15} />
              </button>

            </div>
          )}

          {/* ===============================================
              CONTENT
          =============================================== */}

          <div className="flex-1 min-h-0 overflow-auto">

            {activeView === "preview" ? (

              <div className="min-h-full flex justify-center p-6 md:p-10">

                <div
                  className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden ${
                    device === "desktop"
                      ? "w-full"
                      : device === "tablet"
                      ? "w-[768px] max-w-full"
                      : "w-[390px] max-w-full"
                  }`}
                >

                  {generatedCode ? (
                    <iframe
                      key={refreshKey}
                      title="Generated Website"
                      srcDoc={generatedCode}
                      className="w-full h-[calc(100vh-150px)] min-h-[700px] border-0 bg-white"
                      sandbox="allow-scripts allow-forms allow-modals allow-popups"
                    />
                  ) : (
                    <div className="h-[700px] flex items-center justify-center text-black">
                      <div className="text-center">

                        <p className="font-semibold">
                          No website code found
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Your generated code is empty.
                        </p>

                      </div>
                    </div>
                  )}

                </div>

              </div>

            ) : (

              /* ===========================================
                 CODE VIEW
              =========================================== */

              <div className="h-full bg-[#050505]">

                <div className="h-12 border-b border-white/10 flex items-center justify-between px-4">

                  <div className="flex items-center gap-2">

                    <Code2 size={15} className="text-zinc-500" />

                    <span className="text-xs text-zinc-400">
                      index.html
                    </span>

                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-xs text-zinc-400 hover:text-white transition"
                  >

                    {copied ? (
                      <>
                        <Check
                          size={13}
                          className="text-emerald-400"
                        />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        Copy
                      </>
                    )}

                  </button>

                </div>

                <pre className="p-6 text-sm leading-6 text-zinc-300 overflow-auto h-[calc(100%-48px)] font-mono whitespace-pre-wrap">
                  {generatedCode || "// No generated code"}
                </pre>

              </div>

            )}

          </div>

        </main>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        {showRightPanel && activeView === "preview" && (
          <aside className="hidden lg:flex w-72 shrink-0 border-l border-white/10 bg-[#080808] flex-col">

            <div className="h-12 border-b border-white/10 flex items-center justify-between px-4">

              <span className="text-xs font-medium">
                AI Assistant
              </span>

              <button
                onClick={() =>
                  setShowRightPanel(false)
                }
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500"
              >
                <X size={14} />
              </button>

            </div>

            {/* AI section */}

            <div className="p-4">

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-4">

                <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center mb-4">
                  <Sparkles size={17} />
                </div>

                <h3 className="text-sm font-semibold">
                  Improve your website
                </h3>

                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Ask AI to modify your website design,
                  content, layout, colors or functionality.
                </p>

                <button
                  className="w-full mt-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
                >
                  Ask AI
                </button>

              </div>

            </div>

            <div className="h-px bg-white/10" />

            {/* Quick actions */}

            <div className="p-4">

              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">
                Quick Actions
              </p>

              <div className="space-y-2">

                <button className="w-full text-left px-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-zinc-400 hover:text-white transition">
                  Make it responsive
                </button>

                <button className="w-full text-left px-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-zinc-400 hover:text-white transition">
                  Improve typography
                </button>

                <button className="w-full text-left px-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-zinc-400 hover:text-white transition">
                  Add animations
                </button>

                <button className="w-full text-left px-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-zinc-400 hover:text-white transition">
                  Improve accessibility
                </button>

              </div>

            </div>

            {/* Website ID */}

            <div className="mt-auto p-4 border-t border-white/10">

              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                Project ID
              </p>

              <p className="text-[11px] text-zinc-500 font-mono mt-2 break-all">
                {id}
              </p>

            </div>

          </aside>
        )}

      </div>

    </div>
  );
}

export default Editor;