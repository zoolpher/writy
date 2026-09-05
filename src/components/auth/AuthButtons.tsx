"use client";

import { SignInButton } from "@clerk/nextjs";

export function NavSignIn() {
  return (
    <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm">
        Sign In
      </button>
    </SignInButton>
  );
}

export function HeroSignIn() {
  return (
    <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
      <button className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
        Create a Board
      </button>
    </SignInButton>
  );
}
