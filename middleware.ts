// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect everything EXCEPT:
    // - NextAuth API routes
    // - your public auth routes
    // - your register API (must stay public!)
    // - Next.js internals & static files
    "/((?!api/auth|api/register|signin|signup|_next|favicon.ico|public|assets|images).*)",
  ],
};
