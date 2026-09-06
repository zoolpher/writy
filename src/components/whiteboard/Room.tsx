"use client";

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { CollaborativeEditor } from "./CollaborativeEditor";
import { useState, useEffect } from "react";

export function Room({ roomId, creatorId, title, isGuest }: { roomId: string, creatorId: string, title: string, isGuest: boolean }) {
  const [guestName, setGuestName] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isGuest) {
      const saved = localStorage.getItem("writy_guest_name");
      if (saved) setGuestName(saved);
    }
  }, [isGuest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) {
      setError("Username cannot be empty");
      return;
    }
    // Strict validation: Only alphabets and numbers, no symbols, no spaces
    if (!/^[a-zA-Z0-9]+$/.test(val)) {
      setError("Only letters and numbers allowed (no spaces or symbols).");
      return;
    }
    localStorage.setItem("writy_guest_name", val);
    setGuestName(val);
  };

  if (isGuest && guestName === null) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Whiteboard</h2>
          <p className="text-gray-500 mb-6">Enter a username to join the room.</p>
          <form onSubmit={handleSubmit}>
            <input 
              autoFocus
              type="text" 
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              placeholder="your user name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 text-gray-900 bg-white placeholder:text-gray-400"
            />
            {error && <p className="text-rose-500 text-sm font-medium mb-4">{error}</p>}
            {!error && <div className="h-6 mb-4"></div>}
            
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm">
              Join Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <LiveblocksProvider 
      authEndpoint={async (room) => {
        const res = await fetch("/api/liveblocks-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room, guestName })
        });
        return await res.json();
      }}
    >
      <RoomProvider id={roomId}>
        
        <ClientSideSuspense fallback={<div className="flex items-center justify-center h-screen text-xl font-medium text-gray-500 bg-gray-50">Connecting to Whiteboard...</div>}>
          <CollaborativeEditor creatorId={creatorId} roomId={roomId} title={title} />
        </ClientSideSuspense>

      </RoomProvider>
    </LiveblocksProvider>
  );
}
