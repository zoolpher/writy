"use client";

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { CollaborativeEditor } from "./CollaborativeEditor";

export function Room({ roomId }: { roomId: string }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={
          <div className="flex items-center justify-center h-screen text-xl font-medium text-gray-500">
            Connecting to Whiteboard...
          </div>
        }>
          {() => <CollaborativeEditor />}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
