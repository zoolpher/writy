import Link from "next/link";
import { PenTool } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <PenTool className="w-6 h-6 text-blue-600" />
          <span>Writy</span>
        </Link>

        {/* Auth Section (We will wire Clerk into this later) */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer transition">
            Sign In
          </div>
        </div>
      </div>
    </header>
  );
}
