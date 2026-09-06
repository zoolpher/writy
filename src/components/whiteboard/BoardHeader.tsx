"use client";

import { useState } from "react";
import { Link2, Check, ArrowLeft, Power, LogOut } from "lucide-react";
import Link from "next/link";
import { endBoardAction } from "@/app/dashboard/actions";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function BoardHeader({ creatorId, roomId, title }: { creatorId: string, roomId: string, title: string }) {
  const [copied, setCopied] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const router = useRouter();
  
  // Use Clerk's exact client-side session to guarantee 100% accuracy without server-cache issues!
  const { user } = useUser();
  const isCreator = user?.id === creatorId;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndBoard = async () => {
    if (confirm("Are you sure you want to end this board? This will kick everyone out instantly and permanently change the invitation link.")) {
      setIsEnding(true);
      await endBoardAction(roomId);
    }
  };

  const handleLeaveBoard = () => {
    if (confirm("Are you sure you want to leave this board?")) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="flex items-center gap-2 pointer-events-auto mr-2">
      
      {/* Title Display */}
      <div className="flex items-center justify-center px-4 py-1.5 text-sm font-bold text-gray-800 bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-lg shadow-sm mr-2 max-w-[200px] truncate">
        {title}
      </div>

      {/* Only show Dashboard button if they actually have an account */}
      {user && (
        <Link 
          href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200/50 rounded-lg transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </Link>
      )}

      {/* Creator Only: Destructive End Board */}
      {isCreator && (
        <button 
          onClick={handleEndBoard}
          disabled={isEnding}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50/90 hover:bg-rose-100/90 backdrop-blur-md border border-rose-200/50 rounded-lg transition-all shadow-sm disabled:opacity-50"
        >
          {isEnding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Power className="w-3.5 h-3.5" />}
          End Board
        </button>
      )}

      {/* Candidates Only: Non-Destructive Leave Board */}
      {!isCreator && (
        <button 
          onClick={handleLeaveBoard}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50/90 hover:bg-rose-100/90 backdrop-blur-md border border-rose-200/50 rounded-lg transition-all shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          Leave Board
        </button>
      )}

      {/* Share Room Button */}
      <button 
        onClick={copyLink}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold backdrop-blur-md border rounded-lg transition-all shadow-sm ${
          copied 
            ? "bg-green-50/80 hover:bg-green-100 border-green-200/50 text-green-700" 
            : "bg-blue-50/80 hover:bg-blue-100 border-blue-200/50 text-blue-700"
        }`}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Share Room"}
      </button>
    </div>
  );
}
