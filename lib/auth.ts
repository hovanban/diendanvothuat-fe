import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const API_URL = process.env.API_URL || 'http://localhost:4000/api';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // Gọi NestJS API để tạo/tìm user và lấy JWT
          const res = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              picture: user.image,
            }),
          });

          if (!res.ok) return false;

          const data = await res.json();
          // Gắn token vào user object để dùng trong jwt callback
          (user as any).apiToken = data.token;
          (user as any).dbUser = data.user;
          return true;
        } catch (err) {
          console.error('NestJS auth error:', err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.apiToken = (user as any).apiToken;
        token.id = (user as any).dbUser?._id;
        token.username = (user as any).dbUser?.username;
        token.role = (user as any).dbUser?.role;
        token.picture = (user as any).dbUser?.picture;
        token.onboarded = (user as any).dbUser?.onboarded;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.role = token.role as string;
      session.user.image = token.picture as string;
      session.user.onboarded = token.onboarded as boolean;
      (session as any).apiToken = token.apiToken;
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
});
