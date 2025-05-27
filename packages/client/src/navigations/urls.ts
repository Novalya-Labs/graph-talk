export const publicRoutes = {
  signIn: '/sign-in',
  home: '/',
  notFound: '*',
} as const;

export const routes = {
  ...publicRoutes,
} as const;
