export const StreamChatRoutes = [
  {
    path: '',
    loadComponent: () => import('./stream-chat').then((m) => m.StreamChat),
    children: [
      {
        path: ':roomId',
        loadComponent: () =>
          import('./stream-chat-view-routing/stream-chat-view').then(
            (m) => m.StreamChatViewRouting,
          ),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./stream-chat-placeholder-routing/stream-chat-placeholder-routing').then(
            (m) => m.StreamChatPlaceholderRouting,
          ),
      },
    ],
  },
];
