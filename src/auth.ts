import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const googleId = process.env.AUTH_GOOGLE_ID;
const googleSecret = process.env.AUTH_GOOGLE_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers:
    googleId && googleSecret
      ? [Google({ clientId: googleId, clientSecret: googleSecret })]
      : [],
  pages: {
    signIn: "/entrar",
  },
});
