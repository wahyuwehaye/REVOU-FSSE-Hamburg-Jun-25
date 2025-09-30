export const routes = {
  home: () => '/',
  teams: () => '/teams',
  teamDetail: (slug: string) => `/teams/${slug}`,
  teamAnalytics: (team: string) => `/teams/${team}/analytics`,
} as const;
