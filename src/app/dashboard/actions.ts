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

  redirect(`/room/${roomId}?token=${shareToken}`);
}

export async function openBoard(roomId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const room = await liveblocks.getRoom(roomId);
  
  if (room.metadata?.creatorId && room.metadata.creatorId !== userId) {
    throw new Error(`Unauthorized`);
  }

  // Backwards compatibility for older boards that don't have a shareToken yet!
  let token = room.metadata.shareToken as string | undefined;
  if (!token) {
    token = randomUUID();
    await liveblocks.updateRoom(roomId, {
      metadata: { ...room.metadata, shareToken: token }
    });
  }

  redirect(`/room/${roomId}?token=${token}`);
}

export async function endBoardAction(roomId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const room = await liveblocks.getRoom(roomId);
  
  if (room.metadata?.creatorId && room.metadata.creatorId !== userId) {
    throw new Error("Unauthorized");
  }

  await liveblocks.broadcastEvent(roomId, { type: "KICK_ALL" });

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
