import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/api',
    '/api/trpc/:trpc*', // Agrega esta línea para que todas las rutas bajo /api sean públicas
  ],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/dashboard'],
};
