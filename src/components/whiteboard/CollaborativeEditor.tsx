"use client";

import { Tldraw } from "tldraw";
import { useYjsStore } from "./useYjsStore";
import { BoardHeader } from "./BoardHeader";
import { useEventListener } from "@liveblocks/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function CollaborativeEditor({ creatorId, roomId, title }: { creatorId: string, roomId: string, title: string }) {
  const storeWithStatus = useYjsStore();
  const router = useRouter();
  
  // Get the current user's session from Clerk
  const { user, isLoaded } = useUser();

  useEventListener(({ event }) => {
    const e = event as { type?: string };
    if (e && e.type === "KICK_ALL") {
      // If the user has a signed-in account, send them to their dashboard
      if (user) {
        router.push("/dashboard");
      } else {
        // If they are an anonymous guest, kick them to the home page
        router.push("/");
      }
    }
  });

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw 
        store={storeWithStatus} 
        components={{
          SharePanel: () => <BoardHeader creatorId={creatorId} roomId={roomId} title={title} />
        }}
      />
    </div>
  );
}
