"use client";

import React, { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { showToast } = useToast();

  // Load backend users via our TanStack React Query hook
  const { 
    users, 
    pagination, 
    isLoading, 
    blockUser, 
    unblockUser, 
    deleteUser 
  } = useUsers({
    search,
    status,
    page,
    limit: 10
  });

  // State management for drawers & modals
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userToBlock, setUserToBlock] = useState<any | null>(null);
  const [userToUnblock, setUserToUnblock] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);

  // Handle blocking user
  const handleBlockConfirm = async () => {
    if (!userToBlock) return;
    setIsActionPending(true);
    try {
      await blockUser(userToBlock.id);
      showToast(`User ${userToBlock.name} blocked successfully`, "success");
      setSelectedUser(null);
    } catch {
      showToast("Failed to block user.", "error");
    } finally {
      setIsActionPending(false);
      setUserToBlock(null);
    }
  };

  // Handle unblocking user
  const handleUnblockConfirm = async () => {
    if (!userToUnblock) return;
    setIsActionPending(true);
    try {
      await unblockUser(userToUnblock.id);
      showToast(`User ${userToUnblock.name} unblocked successfully`, "success");
      setSelectedUser(null);
    } catch {
      showToast("Failed to unblock user.", "error");
    } finally {
      setIsActionPending(false);
      setUserToUnblock(null);
    }
  };

  // Handle deleting user
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsActionPending(true);
    try {
      await deleteUser(userToDelete.id);
      showToast(`User account deleted permanently`, "success");
      setSelectedUser(null);
    } catch {
      showToast("Failed to delete user.", "error");
    } finally {
      setIsActionPending(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full font-inter text-[#e0e3e4]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-on-surface">Users</h2>
          <p className="text-xs text-on-surface-variant/80 mt-1">Manage all registered user accounts.</p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#111516] border border-[#1c2122] p-4 rounded-xl shadow-sm">
        <div className="relative rounded bg-[#0b0f10] border border-outline-variant transition-all focus-within:border-primary">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/80 text-lg">search</span>
          <input 
            type="text"
            className="w-full bg-transparent border-none py-2.5 pl-11 pr-4 text-xs text-on-surface placeholder-surface-variant focus:ring-0 outline-none"
            placeholder="Search by name, email..."
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
          <option value="blocked">Blocked</option>
        </select>

        <div className="flex items-center justify-end text-xs text-on-surface-variant/80 font-normal px-2">
          Total Users: {pagination.total}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#111516] border border-[#1c2122] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0b0f10] border-b border-[#1c2122]">
            <tr>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant/80">User</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant/80">Status</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant/80">Emergency Alert</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant/80">Last Active</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant/80 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c2122]">
            {isLoading ? (
              [...Array(3)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-5"><div className="h-4 bg-[#0b0f10] rounded w-36"></div></td>
                  <td className="px-6 py-5"><div className="h-4 bg-[#0b0f10] rounded w-16"></div></td>
                  <td className="px-6 py-5"><div className="h-4 bg-[#0b0f10] rounded w-20"></div></td>
                  <td className="px-6 py-5"><div className="h-4 bg-[#0b0f10] rounded w-24"></div></td>
                  <td className="px-6 py-5 text-right"><div className="h-4 bg-[#0b0f10] rounded w-12 ml-auto"></div></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-on-surface-variant/80">
                  <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40 mb-2">person_search</span>
                  <p className="font-semibold text-on-surface">No users found</p>
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-surface-container-high/40 transition-colors cursor-pointer group"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0b0f10] border border-outline-variant flex items-center justify-center font-semibold text-xs text-primary shadow-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">{user.name}</div>
                        <div className="text-[10px] text-on-surface-variant/70">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      user.status === "active" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-error/10 text-error"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.emergencyFlag ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-error text-on-error uppercase tracking-wider animate-pulse">
                        HIGH ALERT
                      </span>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant/80">Stable</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[10px] font-mono text-on-surface-variant/80">{user.lastSession}</td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 border border-outline-variant hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                      {user.status === "active" ? (
                        <button 
                          onClick={() => setUserToBlock(user)}
                          className="p-1.5 border border-outline-variant hover:border-error/45 text-on-surface-variant hover:text-error rounded-lg transition-colors"
                          title="Block User"
                        >
                          <span className="material-symbols-outlined text-[16px]">block</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => setUserToUnblock(user)}
                          className="p-1.5 border border-outline-variant hover:border-primary/45 text-on-surface-variant hover:text-primary rounded-lg transition-colors"
                          title="Unblock User"
                        >
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        </button>
                      )}
                      <button 
                        onClick={() => setUserToDelete(user)}
                        className="p-1.5 border border-outline-variant hover:bg-error/10 hover:border-error/40 text-error rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination bar */}
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
      </div>

      {/* Inspect User Drawer */}
      <Drawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name || "User Details"}
        subtitle={`User ID: ${selectedUser?.id || "N/A"}`}
      >
        <div className="space-y-6 font-inter text-xs text-[#e0e3e4]">
          {/* Section: Status */}
          <div className="bg-[#0b0f10] p-4 rounded-xl border border-[#1c2122] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant/80">Email</span>
              <span className="font-semibold text-on-surface">{selectedUser?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant/80">Status</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                selectedUser?.status === "active" ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
              }`}>{selectedUser?.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant/80">Emergency Alert</span>
              <span className="font-semibold">{selectedUser?.emergencyFlag ? "Active Alert" : "None"}</span>
            </div>
          </div>

          {/* Section: Activity logs */}
          <div>
            <h4 className="text-[10px] uppercase font-semibold tracking-wider text-on-surface-variant/80 mb-2">Activity & History</h4>
            <div className="bg-[#0b0f10] p-4 rounded-xl border border-[#1c2122] space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant/80">Last Login</span>
                <span className="text-on-surface">{selectedUser?.lastLogin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant/80">Last Session</span>
                <span className="text-on-surface">{selectedUser?.lastSession}</span>
              </div>
            </div>
          </div>

          {/* Quick modification buttons */}
          <div className="pt-4 border-t border-[#1c2122] flex gap-2">
            {selectedUser?.status === "active" ? (
              <Button 
                variant="outline" 
                className="flex-1 text-error border-error/20 hover:bg-error/10" 
                onClick={() => setUserToBlock(selectedUser)}
              >
                Block User
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="flex-1 text-primary border-primary/20 hover:bg-primary/10" 
                onClick={() => setUserToUnblock(selectedUser)}
              >
                Unblock User
              </Button>
            )}
            <Button 
              variant="danger" 
              className="flex-1"
              onClick={() => setUserToDelete(selectedUser)}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Confirmation Modal: Block User */}
      <Modal
        isOpen={!!userToBlock}
        onClose={() => setUserToBlock(null)}
        onConfirm={handleBlockConfirm}
        title="Block User"
        description={`Are you sure you want to block "${userToBlock?.name}"? They will lose access to the system immediately.`}
        confirmText="Block User"
        isConfirming={isActionPending}
        variant="danger"
      />

      {/* Confirmation Modal: Unblock User */}
      <Modal
        isOpen={!!userToUnblock}
        onClose={() => setUserToUnblock(null)}
        onConfirm={handleUnblockConfirm}
        title="Restore Access"
        description={`Are you sure you want to restore system access for "${userToUnblock?.name}"?`}
        confirmText="Restore Access"
        isConfirming={isActionPending}
      />

      {/* Confirmation Modal: Delete User */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        description={`Are you sure you want to permanently delete "${userToDelete?.name}"? This action cannot be undone.`}
        confirmText="Permanently Delete"
        isConfirming={isActionPending}
        variant="danger"
      />
    </div>
  );
}
