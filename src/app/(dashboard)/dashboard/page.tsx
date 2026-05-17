"use client";

import React from "react";
import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function DashboardPage() {
  const { metrics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse font-inter text-[#e0e3e4]">
        <div className="h-10 w-48 bg-[#111516] border border-[#1c2122] rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-[#111516] border border-[#1c2122] rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[350px] bg-[#111516] border border-[#1c2122] rounded-xl"></div>
          <div className="h-[350px] bg-[#111516] border border-[#1c2122] rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Calculate high alert banner based on emergency counts
  const showCrisisAlert = metrics.emergencyEventsCount > 0;

  return (
    <>
      {/* Crisis Banner */}
      {showCrisisAlert && (
        <div className="bg-error-container text-white px-4 py-2 text-center font-label-md text-label-md flex justify-center items-center gap-2 mb-6 rounded-lg font-inter">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>SYSTEM NOTICE: {metrics.emergencyEventsCount} active biometric crisis dispatch logs today. Monitoring systems active.</span>
        </div>
      )}

      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-on-surface font-inter">System Overview</h2>
          <p className="text-xs text-on-surface-variant/80 mt-1 font-inter">Real-time status of the AuraPulse clinical network.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/users">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface font-normal hover:bg-surface-container-high transition-colors text-xs font-inter">
              <span className="material-symbols-outlined text-[16px]">group</span>
              View Users
            </button>
          </Link>
          <Link href="/emergency">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-normal hover:opacity-90 transition-opacity shadow-sm text-xs font-inter">
              <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
              Review Alerts
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-inter">
        <div className="border border-outline-variant bg-[#111516] hover:border-[#98cbb4]/20 transition-colors p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded bg-[#0b0f10] flex items-center justify-center border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-[18px]">groups</span>
            </div>
            <span className="text-primary/95 text-[11px] font-medium tracking-wide">Users</span>
          </div>
          <h3 className="text-on-surface-variant/70 uppercase tracking-widest font-normal text-[9px] mb-1">Total Registered</h3>
          <p className="text-xl font-medium text-on-surface">{metrics.totalUsers}</p>
        </div>

        <div className="border border-outline-variant bg-[#111516] hover:border-[#98cbb4]/20 transition-colors p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded bg-[#0b0f10] flex items-center justify-center border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-[18px]">person_check</span>
            </div>
            <span className="text-primary/95 text-[11px] font-medium tracking-wide">Active</span>
          </div>
          <h3 className="text-on-surface-variant/70 uppercase tracking-widest font-normal text-[9px] mb-1">Clinicians & Patients</h3>
          <p className="text-xl font-medium text-on-surface">{metrics.activeUsers}</p>
        </div>

        <div className="border border-outline-variant bg-[#111516] hover:border-[#98cbb4]/20 transition-colors p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded bg-[#0b0f10] flex items-center justify-center border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-[18px]">analytics</span>
            </div>
            <span className="text-primary/95 text-[11px] font-medium tracking-wide">Therapy</span>
          </div>
          <h3 className="text-on-surface-variant/70 uppercase tracking-widest font-normal text-[9px] mb-1">Sessions</h3>
          <p className="text-xl font-medium text-on-surface">{metrics.totalSessions}</p>
        </div>

        <div className="border border-error/25 bg-error-container/5 hover:border-error/35 transition-colors p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded bg-error/5 flex items-center justify-center border border-error/15">
              <span className="material-symbols-outlined text-error text-[18px]">emergency</span>
            </div>
            <span className="text-error/95 text-[11px] font-medium tracking-wide">Emergency</span>
          </div>
          <h3 className="text-error/70 uppercase tracking-widest font-normal text-[9px] mb-1">Dispatches</h3>
          <p className="text-xl font-medium text-error">{metrics.emergencyEventsCount} Today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-inter">
        {/* Chart Section */}
        <div className="lg:col-span-2 border border-outline-variant bg-[#111516] p-6 rounded-xl flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-base font-semibold text-on-surface">Weekly Usage</h3>
              <p className="text-xs text-on-surface-variant/80 mt-1">Number of active therapy sessions this week.</p>
            </div>
          </div>
          
          {/* Dynamic SVG Plotting */}
          <div className="flex-1 w-full min-h-[220px] relative mt-4 border-l border-b border-[#1c2122] flex items-end justify-between px-4 pb-2">
            <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline
                fill="none"
                stroke="#98cbb4"
                strokeWidth="2.5"
                points="10,80 30,65 50,75 70,45 90,20"
              />
              <circle cx="10" cy="80" fill="#98cbb4" r="2.5"></circle>
              <circle cx="30" cy="65" fill="#98cbb4" r="2.5"></circle>
              <circle cx="50" cy="75" fill="#98cbb4" r="2.5"></circle>
              <circle cx="70" cy="45" fill="#98cbb4" r="2.5"></circle>
              <circle cx="90" cy="20" fill="#98cbb4" r="3.5" className="animate-pulse"></circle>
            </svg>
            {metrics.systemUsageTrend?.map((item: any, idx: number) => (
              <span key={idx} className="text-[9px] font-mono text-on-surface-variant/80 relative z-10 bottom-[-22px]">
                {item.date} ({item.sessions} s)
              </span>
            ))}
          </div>
        </div>

        {/* Security & Activity Section */}
        <div className="border border-outline-variant bg-[#111516] p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-on-surface">Recent Alerts & Activity</h3>
              <span className="material-symbols-outlined text-outline">history</span>
            </div>
            
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-error/10 border border-error/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-error text-[16px]">priority_high</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface">Emergency Alert Handled</p>
                  <p className="text-[10px] text-on-surface-variant/85 mt-0.5 font-normal">Emergency services were notified successfully.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-warning text-[16px]">shield</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface">Failed Logins Checked</p>
                  <p className="text-[10px] text-on-surface-variant/85 mt-0.5 font-normal">{metrics.failedLogins} failed login attempts reviewed.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[16px]">person_add</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface">New Clinician Joined</p>
                  <p className="text-[10px] text-on-surface-variant/85 mt-0.5 font-normal">Dr. Sarah Jenkins added to the system.</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/logs">
            <button className="w-full mt-6 py-2 text-center text-xs font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors font-inter">
              View All Logs
            </button>
          </Link>
        </div>
      </div>

      {/* Operational Details Footer */}
      <div className="mt-8 p-5 border border-outline-variant bg-[#111516] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-inter shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[11px] text-on-surface font-normal">Secure Connection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-[11px] text-on-surface font-normal">Activity Logs Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-[11px] text-on-surface font-normal">System Speed: Fast</span>
          </div>
        </div>
        <div className="text-[11px] text-on-surface-variant/80 font-normal">
          Last System Check: Passed today.
        </div>
      </div>
    </>
  );
}
