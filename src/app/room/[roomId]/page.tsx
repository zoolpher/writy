import { Room } from "@/components/whiteboard/Room";
import { Liveblocks } from "@liveblocks/node";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export default async function RoomPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ roomId: string }>,
  searchParams: Promise<{ token?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const roomId = resolvedParams.roomId;
  const urlToken = resolvedSearch.token;

  const room = await liveblocks.getRoom(roomId).catch(() => null);

  if (!room) {
    notFound(); 
  }

  const { userId } = await auth();
  const creatorId = room.metadata.creatorId as string;
  const isCreator = userId === creatorId;
  const isGuest = !userId;
  const title = (room.metadata.title as string) || "Untitled Room";

  // Verify the token. If it's an old board without a token, we let the creator in so they don't get locked out.
  if (room.metadata.shareToken !== urlToken && !isCreator) {
    notFound(); 
  }

  return (
    <main className="w-full h-screen bg-gray-50">
      <Room roomId={roomId} creatorId={creatorId} title={title} isGuest={isGuest} />
    </main>
  );
}
