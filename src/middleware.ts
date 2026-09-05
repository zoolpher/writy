import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(async (auth, req) => {
  // Allow public access to the landing page, room links, and the Liveblocks authentication API
  const isPublic = 
    req.nextUrl.pathname === '/' || 
    req.nextUrl.pathname.startsWith('/room') ||
    req.nextUrl.pathname === '/api/liveblocks-auth';
  
  if (!isPublic) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Crucial for Clerk routing
    '/__clerk/:path*',
  ],
};
