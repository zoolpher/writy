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

      {/* Creator Attribution Footer */}
      <footer className="w-full py-8 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
        <p>
          Crafted with passion by <a href="https://github.com/Zoolpher" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-700 hover:text-blue-600 transition">Zoolpher</a>
        </p>
        <a 
          href="https://github.com/Zoolpher/Writy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition font-medium"
        >
          {/* Using a bulletproof raw SVG for GitHub to avoid Lucide versioning conflicts */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <span>View the Writy project on GitHub</span>
        </a>
      </footer>
    </div>
  );
}
