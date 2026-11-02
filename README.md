# ديوان الحماسة – book component

1. `npm i framer-motion`
2. Copy `src/*` and `public/media/*` into your Next.js (App Router, TypeScript, Tailwind) project
   (the `@/` import alias is the create-next-app default).
3. Edit `src/data/hamasa.ts` – each verse takes `media: { src, type?, poster?, alt? }`
   with a local (`/media/x.mp4`) or remote (`https://…`) image or video.

Controls: swipe/drag right→left = next, left→right = back · ← / → keys · the red corner buttons.
Layout: two-page book above 820px, single-page book below.
