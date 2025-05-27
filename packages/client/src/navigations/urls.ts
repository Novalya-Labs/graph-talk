export const publicRoutes = {
  signIn: '/sign-in',
  home: '/',
  howItWorks: '/how-it-works',
  notFound: '*',
} as const;

export const routes = {
  ...publicRoutes,
} as const;
