"use client";

import React, { useState } from "react";
import { useLogs } from "@/hooks/useLogs";
import { Button } from "@/components/ui/Button";

export default function LogsPage() {
  const [category, setCategory] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [page, setPage] = useState(1);

  const { logs, pagination, isLoading } = useLogs({
    category,
    severity,
    page,
    limit: 15
  });

  return (
    <div className="flex-1 flex flex-col gap-6 w-full font-inter text-[#e0e3e4]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-on-surface">Activity Logs</h2>
          <p className="text-xs text-on-surface-variant/80 mt-1.5 font-inter">History of system activity and emergency alerts.</p>
        </div>
      </div>

      {/* Filters HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#111516] border border-[#1c2122] p-4 rounded-xl shadow-sm">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-semibold tracking-wider text-on-surface-variant/80">Category</label>
          <select 
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="w-full bg-[#0b0f10] border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTH">Login & Auth</option>
            <option value="CRISIS">Emergency Alerts</option>
            <option value="SECURITY">Security Warnings</option>
            <option value="SYSTEM">Settings Changes</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-semibold tracking-wider text-on-surface-variant/80">Severity</label>
          <select 
            value={severity}
            onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
            className="w-full bg-[#0b0f10] border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#111516] border border-[#1c2122] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0b0f10]/80 border-b border-[#1c2122]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/80">Timestamp</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/80">Category</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/80">Description</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/80 text-right">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c2122] font-mono text-[11px] text-on-surface-variant/85">
            {isLoading ? (
              [...Array(5)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-3.5 bg-[#0b0f10] rounded w-28"></div></td>
                  <td className="px-6 py-4"><div className="h-3.5 bg-[#0b0f10] rounded w-14"></div></td>
                  <td className="px-6 py-4"><div className="h-3.5 bg-[#0b0f10] rounded w-80"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-3.5 bg-[#0b0f10] rounded w-12 ml-auto"></div></td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-xs text-on-surface-variant/80">
                  <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40 mb-2">description</span>
                  <p className="font-semibold text-on-surface">No logs found</p>
                </td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-surface-container-high/20 transition-colors">
                  <td className="px-6 py-3.5 text-on-surface-variant/80 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-3.5">
                    <span className="bg-[#0b0f10] px-2 py-0.5 rounded border border-[#1c2122] text-[9px] font-semibold font-inter text-on-surface">
                      {log.category === "AUTH" ? "Auth" : log.category === "CRISIS" ? "Crisis" : log.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-on-surface font-inter leading-relaxed max-w-lg truncate" title={log.description}>
                    {log.description}
                  </td>
                  <td className="px-6 py-3.5 text-right font-inter">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-semibold border ${
                      log.severity === "CRITICAL"
                        ? "bg-error/10 border-error text-error animate-pulse"
                        : log.severity === "WARNING"
                        ? "bg-warning/10 border-warning text-warning"
                        : "bg-primary/10 border-primary text-primary"
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination component */}
        {!isLoading && logs.length > 0 && (
          <div className="px-6 py-4 bg-[#0b0f10]/50 border-t border-[#1c2122] flex items-center justify-between font-inter text-xs">
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
      </div>

      {/* Cryptographic integrity footer */}
      <div className="p-4 border border-[#1c2122] bg-[#111516] rounded-xl flex items-center justify-between font-inter text-[11px] shadow-sm">
        <div className="text-on-surface-variant/80">
          Log Security: <span className="font-mono text-on-surface font-normal">Signed & Encrypted</span>
        </div>
        <div className="flex items-center gap-1.5 text-primary">
          <span className="material-symbols-outlined text-[15px]">verified</span>
          <span className="font-semibold uppercase tracking-wider text-[9px]">Logs Saved Securely</span>
        </div>
      </div>
    </div>
  );
}
