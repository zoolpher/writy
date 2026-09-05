import { Room } from "@/components/whiteboard/Room";

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  // In Next.js 15+, dynamic route params are Promises that must be awaited
  const resolvedParams = await params;
  
  return (
    <main className="w-full h-screen bg-gray-50">
      <Room roomId={resolvedParams.roomId} />
    </main>
  );
}
