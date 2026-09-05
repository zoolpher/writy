import Navbar from "@/components/layout/Navbar";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { HeroSignIn } from "@/components/auth/AuthButtons";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
          Collaborate in <span className="text-blue-600">Real-Time.</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-10">
          Writy is a production-ready whiteboard. Create a room, share the link, and start drawing with your team instantly. No sign-up required for guests.
        </p>
        
        <div className="flex gap-4">
          {!userId ? (
            <HeroSignIn />
          ) : (
            <Link href="/dashboard" className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
              Go to Dashboard
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
