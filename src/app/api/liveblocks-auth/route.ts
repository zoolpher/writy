import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const user = await currentUser();
  
  const { room, guestName } = await request.json();

  const userIdentifier = userId || `guest_${Math.floor(Math.random() * 100000)}`;

  let displayName = "Anonymous";
  if (user) {
    displayName = user.firstName || user.username || "Creator";
  } else if (guestName) {
    displayName = guestName;
  }

  const session = liveblocks.prepareSession(userIdentifier, {
    userInfo: {
      name: displayName,
    }
  });

  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
