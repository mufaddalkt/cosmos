# COSMOS — Beyond the Observable

An interactive 3D scale atlas, from an illuminated Earth to the observable universe. Built with Next.js App Router, strict TypeScript, React Three Fiber, Three.js, GLSL, GSAP ScrollTrigger, and Zustand.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For the production static export:

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

`npm start` previews `out/` with the included Node static server. No API keys or environment variables are required. Vercel detects Next.js and runs `npm run build`; the repository root is the application root.

## Explore

Wheel or pinch to change scale; drag to orbit. Select a world, use search (including M31/M33/M45 aliases), or jump through the scale rail. Double-click a body to focus it. Home restores Earth and camera orientation.

`/` searches, `+` / `−` zoom, `H` returns home, `I` hides controls, and `Esc` exits a mode or closes an overlay. HTML controls and object information provide a keyboard alternative to the 3D scene. Bookmarks and rendering preferences persist only in the current browser.

Journey mode uses scroll position to travel across twelve scale stages. Cosmic history is a separate time experience. “Beyond What We Know” is explicitly speculative.

## Architecture

- `src/components/Observatory.tsx`: application shell and controls.
- `src/components/scene/CanvasScene.tsx`: the sole camera controller, pointer input, scale blending, local system, and lazy scene loading.
- `src/components/scene/LargeScale.tsx`: GPU galaxies, clusters, cosmic web, black hole, cosmic history, and speculative environments.
- `src/components/scene/Labels.tsx`: one shared React DOM owner for labels, positioned from 3D coordinates without nested DOM roots.
- `src/components/scene/Planets.tsx` and `materials.ts`: textured spheres, atmospheric and solar shaders, rings, and deterministic procedural surfaces.
- `src/data/catalog.ts`: 45 curated destinations with science references.
- `src/lib/scales.ts` and `store.ts`: logarithmic physical references, time epochs, and interaction state.
- `tests/navigation.test.ts`: hierarchy, catalog, scene coverage, navigation, and particle invariants.

Scene coordinates are normalized by scale stage; astronomical meter values are never placed in a single enormous world coordinate space. Camera and scene changes use a single R3F frame loop; GSAP drives a scale target during the narrative.

## Scientific interpretation and assets

This is an educational visualization, not an orbital ephemeris or a general-relativistic simulation. Radii, distances, and motion are compressed for navigation; numerical comparison values preserve physical units. Procedural populations do not represent individually cataloged stars. Unavailable measurements are marked “Not listed.”

See [SCIENCE.md](SCIENCE.md) for source conventions, uncertainties, texture provenance, and license notices. Earth and Jupiter use local NASA maps; the Moon uses a Three.js example asset. Other surfaces, comet activity, clusters, nebulae, lensing, and speculative environments are approximations. NASA does not endorse this project.

Adaptive rendering reduces pixel ratio and mobile particle populations; Low power mode is available. OS reduced-motion preferences disable automatic rotation and reduce animated travel. WebGL2 failures retain the searchable HTML catalog with a retry control.

The quality record is in [QA.md](QA.md). Actual mobile hardware, multi-touch input, and throttled mobile networks require additional device testing; desktop viewport checks alone do not certify those environments.
