import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: [
    '/legal-entities/:path*',
    '/trial-balance/:path*',
      '/configuration/:path*',
    '/api/legal-entities/:path*',
    '/api/trial-balance/:path*',
    '/api/configuration/:path*',
  ],
};

