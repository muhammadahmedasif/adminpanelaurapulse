"use client";

import React, { useState } from "react";
import { useSessions } from "@/hooks/useSessions";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers";

export default function SessionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { showToast } = useToast();

  const { 
    sessions, 
    pagination, 
    isLoading, 
    flagSession 
  } = useSessions({
    search,
    status,
    page,
    limit: 9
  });

  const [inspectSession, setInspectSession] = useState<any | null>(null);
  const [flaggingId, setFlaggingId] = useState<string | null>(null);

  // Toggle flagging a session
  const handleFlagSession = async (id: string, isFlagged: boolean) => {
    setFlaggingId(id);
    try {
      await flagSession(id);
      showToast(
        !isFlagged ? "Session flagged for clinical review" : "Session unflagged successfully", 
        "success"
      );
    } catch {
      showToast("Failed to flag session.", "error");
    } finally {
      setFlaggingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full font-inter text-[#e0e3e4]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-on-surface">Sessions</h2>
          <p className="text-xs text-on-surface-variant/80 mt-1">View and manage active counseling chat sessions.</p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#111516] border border-[#1c2122] p-4 rounded-xl shadow-sm">
        <div className="relative rounded bg-[#0b0f10] border border-outline-variant transition-all focus-within:border-primary">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/80 text-lg">search</span>
          <input 
            type="text"
            className="w-full bg-transparent border-none py-2.5 pl-11 pr-4 text-xs text-on-surface placeholder-surface-variant focus:ring-0 outline-none"
            placeholder="Search by name..."
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
          <h3 className="text-base font-semibold text-on-surface">No Therapy Sessions Found</h3>
          <p className="text-xs text-on-surface-variant/75 mt-1">Adjust search parameters or status filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sessions.map((session: any) => (
            <div 
              key={session.id} 
              className={`bg-[#111516] border rounded-xl p-6 flex flex-col justify-between shadow-sm transition-colors duration-300 ${
                session.flagged ? "border-error/40 hover:border-error/60" : "border-[#1c2122] hover:border-[#98cbb4]/20"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-on-surface-variant/70">{session.id}</span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                    session.status === "active" ? "bg-primary/10 text-primary" : "bg-outline-variant/20 text-on-surface-variant"
                  }`}>
                    {session.status}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <h3 className="text-base font-semibold text-on-surface mb-1">{session.userName}</h3>
                  {session.flagged && (
                    <span className="text-[9px] font-bold text-error bg-error/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px] animate-pulse">warning</span>
                      FLAGGED
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-on-surface-variant/80 flex items-center gap-1.5 mb-4 font-mono">
                  <span className="material-symbols-outlined text-[13px]">psychology</span>
                  {session.type} • {session.duration}
                </p>

                <div className="bg-[#0b0f10] p-4 rounded-lg border border-[#1c2122] space-y-2 mb-6 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant/70 font-inter">Supervisor</span>
                    <span className="font-semibold text-on-surface font-inter">{session.practitioner}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant/70 font-inter">Patient Status</span>
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wide font-inter">
                      {session.sentiment}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 text-[11px]" 
                  onClick={() => setInspectSession(session)}
                >
                  <span className="material-symbols-outlined text-[15px]">chat</span>
                  View Chat
                </Button>
                
                <Button
                  variant={session.flagged ? "primary" : "danger"}
                  className="px-3"
                  isLoading={flaggingId === session.id}
                  onClick={() => handleFlagSession(session.id, session.flagged)}
                  title={session.flagged ? "Unflag Session" : "Flag Session"}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {session.flagged ? "outlined_flag" : "flag"}
                  </span>
                </Button>
              </div>
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
        title={`Chat History: ${inspectSession?.userName}`}
        subtitle={`Session ID: ${inspectSession?.id} • Clinician: ${inspectSession?.practitioner}`}
      >
        <div className="space-y-6 font-inter text-xs text-[#e0e3e4]">
          {/* Sentiment HUD */}
          <div className="bg-[#0b0f10] p-4 rounded-xl border border-[#1c2122] flex justify-between items-center font-mono">
            <div>
              <div className="text-on-surface-variant/80 text-[10px] uppercase font-inter">Duration</div>
              <div className="text-sm font-semibold text-on-surface mt-1 font-inter">{inspectSession?.duration}</div>
            </div>
            <div>
              <div className="text-on-surface-variant/80 text-[10px] uppercase text-right font-inter">Patient Status</div>
              <div className="text-sm font-semibold text-primary mt-1 text-right font-inter">{inspectSession?.sentiment}</div>
            </div>
          </div>

          {/* Transcript logs */}
          <div>
            <h4 className="text-[10px] uppercase font-semibold tracking-wider text-on-surface-variant/80 mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">chat</span>
              Chat Conversation History
            </h4>
            <div className="bg-[#0b0f10] border border-[#1c2122] rounded-xl p-4 space-y-4 max-h-[360px] overflow-y-auto">
              {inspectSession?.messages?.map((msg: any, idx: number) => (
                <div key={idx} className={`space-y-1 ${msg.sender === "Patient" ? "" : "text-right"}`}>
                  <div className="text-[9px] uppercase tracking-wider text-on-surface-variant/70 font-semibold font-mono">
                    {msg.sender === "Patient" ? inspectSession.userName : "AI Therapist"} • {msg.time}
                  </div>
                  <div className={`p-3 rounded-lg text-[11px] leading-relaxed max-w-[85%] inline-block text-left ${
                    msg.sender === "Patient" 
                      ? "bg-[#111516] border border-[#1c2122] text-[#e0e3e4]" 
                      : "bg-[#98cbb4]/10 border border-[#98cbb4]/20 text-[#98cbb4]"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
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
