import Navbar from "@/components/layout/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Liveblocks } from "@liveblocks/node";
import { createNewBoard } from "./actions";
import { BoardCard } from "./BoardCard";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { data: rooms } = await liveblocks.getRooms({
    metadata: { creatorId: userId }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Boards</h1>
          <form action={createNewBoard}>
            <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm">
              + New Board
            </button>
          </form>
        </div>

        {rooms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            You haven't created any whiteboards yet. Click "New Board" to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <BoardCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
