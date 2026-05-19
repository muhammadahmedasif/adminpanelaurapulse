"use client";

import React, { useState, useEffect } from "react";
import { useSessions } from "@/hooks/useSessions";
import { sessionService } from "@/services/sessionService";
import { useAuth } from "@/hooks/useAuth";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers";
import { useSearchParams } from "next/navigation";

export default function SessionsPage() {
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(querySearch);
  const [debouncedSearch, setDebouncedSearch] = useState(querySearch);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { showToast } = useToast();
  const { adminUser } = useAuth();

  // Sync URL search params
  useEffect(() => {
    if (querySearch) {
      setSearch(querySearch);
      setDebouncedSearch(querySearch);
    }
  }, [querySearch]);

  // Debounce search term to prevent rapid refetching during typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    sessions,
    pagination,
    isLoading,
    refetch
  } = useSessions({
    search: debouncedSearch,
    status: status === "all" ? undefined : status,
    page,
    limit: 9
  });

  const [inspectSession, setInspectSession] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const handleInspect = async (session: any) => {
    setIsDetailLoading(true);
    setInspectSession({ ...session, messages: [], isFetching: true });
    try {
      const detail = await sessionService.getSessionDetail(session.sessionId);
      setInspectSession({
        ...session,
        messages: detail.messages || [],
        isFetching: false
      });
    } catch (e) {
      console.error(e);
      setInspectSession({ ...session, messages: [], isFetching: false, error: true });
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full font-inter text-[#e0e3e4]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-on-surface">Sessions Feed</h2>
          <p className="text-xs text-on-surface-variant/80 mt-1">View and manage clinical counseling chat sessions across all patients.</p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#111516] border border-[#1c2122] p-4 rounded-xl shadow-sm">
        <div className="relative rounded bg-[#0b0f10] border border-outline-variant transition-all focus-within:border-primary">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/80 text-lg">search</span>
          <input
            type="text"
            className="w-full bg-transparent border-none py-2.5 pl-11 pr-4 text-xs text-on-surface placeholder-surface-variant focus:ring-0 outline-none"
            placeholder="Search by patient name, email or title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="bg-[#0b0f10] border border-outline-variant rounded-lg px-3 py-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>

        <div className="flex items-center justify-end text-xs text-on-surface-variant/80 font-normal px-2">
          Total Sessions: {pagination.total}
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-64 bg-[#111516] border border-[#1c2122] rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-[#111516] border border-[#1c2122] rounded-xl py-16 text-center shadow-sm">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-3">chat_bubble_outline</span>
          <h3 className="text-base font-semibold text-on-surface">No Sessions Found</h3>
          <p className="text-xs text-on-surface-variant/75 mt-1">Adjust search parameters or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sessions.map((session: any) => (
            <div
              key={session.sessionId}
              className="bg-[#111516] border border-[#1c2122] rounded-xl p-6 flex flex-col justify-between shadow-sm hover:border-[#98cbb4]/20 transition-all group"
            >
              <div>
                {/* Patient Info Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#0b0f10] border border-outline-variant flex items-center justify-center font-bold text-xs text-primary shadow-sm overflow-hidden group-hover:border-primary/40 transition-colors flex-shrink-0">
                    {session.userProfileImage ? (
                      <img src={session.userProfileImage} alt={session.userName} className="w-full h-full object-cover" />
                    ) : (
                      (session.userName || "Unknown").charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      {session.userName || "Unknown User"}
                    </h3>
                    <p className="text-[10px] text-on-surface-variant/75 mt-0.5 font-mono line-clamp-1">{session.userEmail}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-on-surface-variant/70">ID: {session.sessionId.substring(0, 8)}...</span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                    session.status === "active" 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : session.status === "completed"
                      ? "bg-outline-variant/20 text-on-surface-variant border border-outline-variant/30"
                      : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
                  }`}>
                    {session.status}
                  </span>
                </div>

                <p className="text-[11px] text-on-surface-variant/85 flex items-center gap-1.5 mb-4 font-mono">
                  <span className="material-symbols-outlined text-[13px]">psychology</span>
                  Therapy • {session.duration || "0m"}
                </p>

                <div className="bg-[#0b0f10] p-4 rounded-lg border border-[#1c2122] space-y-2 mb-6 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant/70 font-inter">Therapist</span>
                    <span className="font-semibold text-on-surface font-inter">AI Agent</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant/70 font-inter">Patient Status</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide font-inter ${session.hasRisk ? 'text-error' : 'text-primary'}`}>
                      {session.hasRisk ? "High Risk" : "Stable"}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full text-[11px] font-inter flex items-center justify-center gap-1.5"
                onClick={() => handleInspect(session)}
              >
                <span className="material-symbols-outlined text-[15px]">chat</span>
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination component */}
      {!isLoading && sessions.length > 0 && (
        <div className="px-6 py-4 bg-[#111516] border border-[#1c2122] rounded-xl flex items-center justify-between font-inter text-xs">
          <span className="text-on-surface-variant/80">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Sliding Inspect Session Drawer */}
      <Drawer
        isOpen={!!inspectSession}
        onClose={() => setInspectSession(null)}
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#0b0f10] border border-outline-variant flex items-center justify-center font-bold text-[10px] text-primary shadow-sm overflow-hidden flex-shrink-0">
              {inspectSession?.userProfileImage ? (
                <img src={inspectSession.userProfileImage} alt={inspectSession.userName} className="w-full h-full object-cover" />
              ) : (
                (inspectSession?.userName || "Unknown").charAt(0).toUpperCase()
              )}
            </div>
            <span>Chat History: {inspectSession?.userName}</span>
          </div>
        }
        subtitle={`Session ID: ${inspectSession?.sessionId}`}
      >
        <div className="space-y-6 font-inter text-xs text-[#e0e3e4]">
          {/* Sentiment HUD */}
          <div className="bg-[#0b0f10] p-4 rounded-xl border border-[#1c2122] flex justify-between items-center font-mono">
            <div>
              <div className="text-on-surface-variant/80 text-[10px] uppercase font-inter">Duration</div>
              <div className="text-sm font-semibold text-on-surface mt-1 font-inter">{inspectSession?.duration || "0m"}</div>
            </div>
            <div>
              <div className="text-on-surface-variant/80 text-[10px] uppercase text-right font-inter">Patient Status</div>
              <div className="text-sm font-semibold mt-1 text-right font-inter flex justify-end">
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide font-inter ${inspectSession?.hasRisk ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                  {inspectSession?.hasRisk ? "High Risk" : "Stable"}
                </span>
              </div>
            </div>
          </div>

          {/* Session Status Manager */}
          <div className="bg-[#0b0f10] p-4 rounded-xl border border-[#1c2122] flex justify-between items-center">
            <span className="text-on-surface-variant/80 text-[10px] uppercase font-semibold tracking-wider">Session Status</span>
            {adminUser?.role === "superAdmin" ? (
              <select
                value={inspectSession?.status || "active"}
                onChange={async (e) => {
                  const newStatus = e.target.value as "active" | "completed" | "archived";
                  try {
                    await sessionService.updateSessionStatus(inspectSession.sessionId, newStatus);
                    showToast(`Session status updated to ${newStatus}`, "success");
                    setInspectSession((prev: any) => prev ? { ...prev, status: newStatus } : null);
                    refetch();
                  } catch (err) {
                    showToast("Failed to update session status.", "error");
                  }
                }}
                className="bg-[#111516] border border-[#1c2122] rounded px-3 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            ) : (
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                inspectSession?.status === "active" 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : inspectSession?.status === "completed"
                  ? "bg-outline-variant/20 text-on-surface-variant border border-outline-variant/30"
                  : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
              }`}>
                {inspectSession?.status || "active"}
              </span>
            )}
          </div>

          {/* Transcript logs */}
          <div>
            <h4 className="text-[10px] uppercase font-semibold tracking-wider text-on-surface-variant/80 mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">chat</span>
              Chat Conversation History
            </h4>
            <div className="bg-[#0b0f10] border border-[#1c2122] rounded-xl p-4 space-y-4 max-h-[360px] overflow-y-auto">
              {inspectSession?.isFetching ? (
                <div className="text-center text-on-surface-variant/50 py-8 animate-pulse text-[11px]">Loading transcript...</div>
              ) : !inspectSession?.hasRisk ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#1c2122] border border-outline-variant flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px] text-on-surface-variant/80">lock</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-on-surface">Transcript Privacy Enabled</h5>
                    <p className="text-[10px] text-on-surface-variant/75 mt-1 leading-normal max-w-[240px] mx-auto">
                      To protect patient privacy, chat transcripts are securely encrypted. They are only accessible to administrators when a safety check flags the session as High Risk.
                    </p>
                  </div>
                </div>
              ) : !inspectSession?.messages || inspectSession.messages.length === 0 ? (
                <div className="text-center text-on-surface-variant/50 py-8 text-[11px]">No messages in this session.</div>
              ) : (
                inspectSession.messages.map((msg: any, idx: number) => (
                  <div key={idx} className={`space-y-1 ${msg.role === "user" ? "" : "text-right"}`}>
                    <div className="text-[9px] uppercase tracking-wider text-on-surface-variant/70 font-semibold font-mono">
                      {msg.role === "user" ? inspectSession.userName : "AI Therapist"} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className={`p-3 rounded-lg text-[11px] leading-relaxed max-w-[85%] inline-block text-left ${msg.role === "user"
                        ? "bg-[#111516] border border-[#1c2122] text-[#e0e3e4]"
                        : "bg-[#98cbb4]/10 border border-[#98cbb4]/20 text-[#98cbb4]"
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Compliance dispatch block */}
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
            <div>
              <p className="font-semibold text-primary text-[11px]">Secure Conversation</p>
              <p className="text-[10px] text-on-surface-variant/80 mt-0.5">This conversation is private and securely encrypted.</p>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
