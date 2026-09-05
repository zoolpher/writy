"use client";

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { CollaborativeEditor } from "./CollaborativeEditor";

export function Room({ roomId, creatorId }: { roomId: string, creatorId: string }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId}>
        
        <ClientSideSuspense fallback={<div className="flex items-center justify-center h-screen text-xl font-medium text-gray-500 bg-gray-50">Connecting to Whiteboard...</div>}>
          <CollaborativeEditor creatorId={creatorId} roomId={roomId} />
        </ClientSideSuspense>

      </RoomProvider>
    </LiveblocksProvider>
  );
}
