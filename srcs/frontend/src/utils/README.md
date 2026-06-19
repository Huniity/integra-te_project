# utils

Page-level static data and small helpers used by the section pages (Aside-driven sidebars) and cookie handling.

| File | Exports | Purpose |
|---|---|---|
| [aprender.ts](aprender.ts) | `subjects`, `getLevelBadgeClassName` | Subject list + level badge color for the `/aprender` section. |
| [resolver.ts](resolver.ts) | `subjects`, `getLevelBadgeClassName`, `ResolverSubjectId` | Subject list + level badge color for the `/exercicios` (Resolver) section. |
| [descarregar.ts](descarregar.ts) | `subjects` | Subject list for the `/descarregar` section. |
| [videos.ts](videos.ts) | `subjects` | Subject list for the `/videos` section. |
| [cookies.ts](cookies.ts) | `getCookie`, `setCookie` | Thin wrappers around `document.cookie` (read/write, URL-encoded, `SameSite=Lax`). |

Each `subjects` array implements the `Subject` type from [`components/core/Aside`](../components/core/Aside.tsx) and feeds that section's sidebar (`id`, `label`, `iconImg`, `path`). `aprender.ts` and `resolver.ts` are otherwise duplicates of each other plus a badge-color helper — `descarregar.ts` and `videos.ts` don't need one since those sections have no levels.
