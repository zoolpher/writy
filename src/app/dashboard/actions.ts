"use server";

import { Liveblocks } from "@liveblocks/node";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export async function createNewBoard() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const roomId = randomUUID();
  const shareToken = randomUUID(); 

  await liveblocks.createRoom(roomId, {
    defaultAccesses: ["room:write"],
    metadata: {
      creatorId: userId,
      title: "New Whiteboard",
      createdAt: new Date().toISOString(),
      shareToken: shareToken, 
    }
  });

  redirect(`/room/${shareToken}`);
}

export async function openBoard(roomId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const room = await liveblocks.getRoom(roomId);
  
  if (room.metadata?.creatorId && room.metadata.creatorId !== userId) {
    throw new Error(`Unauthorized. Creator: ${room.metadata.creatorId}, User: ${userId}`);
  }

  // We no longer rotate the link here! Just redirect to the existing persistent link.
  redirect(`/room/${room.metadata.shareToken}`);
}

export async function endBoardAction(roomId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const room = await liveblocks.getRoom(roomId);
  
  if (room.metadata?.creatorId && room.metadata.creatorId !== userId) {
    throw new Error("Unauthorized");
  }

  // 1. Send a WebSocket message to all currently connected users to kick them out instantly
  await liveblocks.broadcastEvent(roomId, { type: "KICK_ALL" });

  // 2. Rotate the token so the old link is immediately dead
  const newShareToken = randomUUID();
  
  await liveblocks.updateRoom(roomId, {
    metadata: {
      ...room.metadata,
      shareToken: newShareToken,
    }
  });
}

export async function deleteBoard(roomId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const room = await liveblocks.getRoom(roomId);
  
  if (room.metadata?.creatorId && room.metadata.creatorId !== userId) {
    throw new Error(`Unauthorized`);
  }

  await liveblocks.deleteRoom(roomId);
  revalidatePath("/dashboard");
}

export async function renameBoard(roomId: string, newTitle: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const room = await liveblocks.getRoom(roomId);
  
  if (room.metadata?.creatorId && room.metadata.creatorId !== userId) {
    throw new Error(`Unauthorized`);
  }

  await liveblocks.updateRoom(roomId, {
    metadata: {
      ...room.metadata,
      title: newTitle,
    }
  });
  revalidatePath("/dashboard");
}
