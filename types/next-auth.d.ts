import 'next-auth';

declare module 'next-auth' {
  interface Session {
    apiToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      username: string;
      role: string;
      onboarded: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string;
    role?: string;
    apiToken?: string;
    onboarded?: boolean;
  }
}
