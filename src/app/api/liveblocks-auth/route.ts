import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Initialize Liveblocks with your secret key
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export async function POST(request: NextRequest) {
  // 1. Get the current user from Clerk
  const { userId } = await auth();
  
  // 2. If they are logged in, use their Clerk ID. 
  // If they are a guest (no account), assign them a random Guest ID.
  const userIdentifier = userId || `guest_${Math.floor(Math.random() * 10000)}`;

  // 3. Start a new Liveblocks session for this user
  const session = liveblocks.prepareSession(userIdentifier, {
    userInfo: {
      name: userId ? "Host" : "Guest",
    }
  });

  // 4. Get the room they are trying to join from the request
  const { room } = await request.json();

  // 5. Grant them full access to read and write on the whiteboard in this room
  session.allow(room, session.FULL_ACCESS);

  // 6. Authorize the session and send the token back to the browser
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
