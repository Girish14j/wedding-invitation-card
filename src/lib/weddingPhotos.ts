const unsplashPhoto = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const weddingPhotos = {
  hero: unsplashPhoto('photo-1519741497674-611481863552', 2200),
  groom: unsplashPhoto('photo-1500648767791-00dcc994a43e', 900),
  bride: unsplashPhoto('photo-1534528741775-53994a69daeb', 900),
  events: [
    unsplashPhoto('photo-1511285560929-80b456fea0bc', 1200),
    unsplashPhoto('photo-1519225421980-888cb5f2a770', 1200),
    unsplashPhoto('photo-1464366400600-7168b8af9bc3', 1200),
    unsplashPhoto('photo-1515934751635-c81c6bc9a2d8', 1200),
  ],
  gallery: [
    { title: 'A moment for two', imageUrl: unsplashPhoto('photo-1519741497674-611481863552', 1000) },
    { title: 'The wedding ceremony', imageUrl: unsplashPhoto('photo-1511285560929-80b456fea0bc', 1000) },
    { title: 'A joyful celebration', imageUrl: unsplashPhoto('photo-1519225421980-888cb5f2a770', 1000) },
    { title: 'Beautiful details', imageUrl: unsplashPhoto('photo-1464366400600-7168b8af9bc3', 1000) },
    { title: 'A day to remember', imageUrl: unsplashPhoto('photo-1515934751635-c81c6bc9a2d8', 1000) },
    { title: 'Together, always', imageUrl: unsplashPhoto('photo-1529636798458-92182e662485', 1000) },
  ],
};
