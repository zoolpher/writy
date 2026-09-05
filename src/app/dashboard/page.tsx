import Navbar from "@/components/layout/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  // Extra security: If a guest tries to type /dashboard in the URL, kick them to the home page
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Boards</h1>
          <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm">
            + New Board
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          You haven't created any whiteboards yet. Click "New Board" to get started!
        </div>
      </main>
    </div>
  );
}
