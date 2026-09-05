import Link from "next/link";
import { PenTool } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { NavSignIn } from "@/components/auth/AuthButtons";

export default async function Navbar() {
  const { userId } = await auth();

  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <PenTool className="w-6 h-6 text-blue-600" />
          <span>Writy</span>
        </Link>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {!userId ? (
            <NavSignIn />
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </header>
  );
}
