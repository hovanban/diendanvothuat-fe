import React from 'react';
import { signIn } from '@/lib/auth';

export default function SignInPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h1>Đăng nhập</h1>
      <form
        action={async () => {
          'use server';
          await signIn('google', { redirectTo: '/' });
        }}
      >
        <button type="submit">Đăng nhập với Google</button>
      </form>
    </div>
  );
}
