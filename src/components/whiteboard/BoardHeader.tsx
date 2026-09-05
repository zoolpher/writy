"use client";

import { useState } from "react";
import { Link2, Check, ArrowLeft, Power } from "lucide-react";
import Link from "next/link";
import { endBoardAction } from "@/app/dashboard/actions";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function BoardHeader({ creatorId, roomId }: { creatorId: string, roomId: string }) {
  const [copied, setCopied] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  
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

  return (
    <div className="flex items-center gap-2 pointer-events-auto mr-2">
      <Link 
        href="/dashboard"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200/50 rounded-lg transition-all shadow-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Dashboard
      </Link>

      {/* Force rendering of a debug message just in case the button still doesn't show! */}
      {!isCreator && user && (
         <div className="text-xs text-gray-400">Guest View</div>
      )}

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
