import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/ask-question', '/profile/edit', '/collection'];
const ADMIN_ROUTES = ['/admin'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Bảo vệ admin routes
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Bảo vệ user routes
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
