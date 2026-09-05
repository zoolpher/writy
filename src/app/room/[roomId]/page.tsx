import { Room } from "@/components/whiteboard/Room";
import { Liveblocks } from "@liveblocks/node";
import { notFound } from "next/navigation";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = await params;
  const shareToken = resolvedParams.roomId; 

  const { data: rooms } = await liveblocks.getRooms({
    metadata: { shareToken: shareToken }
  });

  if (rooms.length === 0) {
    notFound(); 
  }

  const actualRoomId = rooms[0].id;
  
  // Extract the creatorId directly from the database
  const creatorId = rooms[0].metadata.creatorId as string;

  return (
    <main className="w-full h-screen bg-gray-50">
      {/* Pass the explicit creatorId down to the client so the browser can verify it directly */}
      <Room roomId={actualRoomId} creatorId={creatorId} />
    </main>
  );
}
