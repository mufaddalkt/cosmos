# COSMOS quality record

Reviewed 11 October 2026. Existing Next.js / R3F architecture and implemented controls were retained.

## Automated validation

- Strict TypeScript checks passed.
- ESLint passed with no reported errors or warnings.
- All 14 navigation and scene invariant tests passed: scale bounds, logarithmic interpolation, overlap coverage, catalog consistency, required destinations, object travel, Home, bookmark/comparison behavior, time endpoints, deterministic finite particle buffers, and local-to-solar handoff ownership, position, radius, and camera anchoring for every principal planet.
- Next.js 16.4 production build passed and exported the application and 404 page.
- The static export was opened in the browser through the included local preview server.

The Node test runner has no browser storage, so Zustand reports that persistence is unavailable there. Bookmark persistence was checked separately in the browser.

## Browser checks

- Illuminated Earth, local texture loading, manual drag orbit, and wheel zoom.
- Direct travel across all twelve scale stages, including return to Earth.
- Planet selection, Saturn rings, Moon navigation, measured information, and return-to-system action.
- Search by name and M31 alias; native modal containment and close controls.
- Saving Earth and finding it in Saved discoveries after reloads; three-object comparison with physical values.
- Settings and quality selection, including mobile access.
- Guided Journey: wheel scrolling updates the camera-scale target; horizon jump and exit return to free exploration.
- All eight cosmic-time markers; return to spatial exploration.
- Beyond What We Know: persistent speculative label and return control.
- Keyboard search and hiding/restoring the interface.
- Responsive checks at 1280 × 720/800, 390 × 844, and 844 × 390. Mobile viewport had no horizontal page overflow; landscape overlap was corrected.
- OS reduced motion was active in the test environment and recognized by the application.
- Fresh production browser console reported no errors or warnings during the scale traversal.
- The current desktop browser reported approximately 60 FPS, with four geometries and seven textures in the opening view. These are local observations, not a benchmark across devices.

## Defects corrected

- Selected planets previously remained at the solar-system center while their orbital counterparts appeared, obscuring the Sun. Close-ups now follow the body's orbital location, shrink to the matching solar-system radius, and transfer visibility at one shared boundary. The camera pulls back from the selected body toward the Sun. Earth, Neptune, and Saturn were visually checked through the transition; regression tests cover all eight planets and the Sun in both scale directions.
- React 19 nested DOM-root unmount errors during 3D label transitions: labels now share a single React DOM owner outside the Canvas.
- Abrupt scene disappearance on long jumps: mounted stages follow interpolated visual scale.
- Journey wheel interception and touch-action inheritance.
- Home/focus camera orientation reset when the selected object has not changed.
- Close-in zoom bounds, outer-system framing, and Saturn ring framing.
- Brief reuse of a previous world's surface texture during selection.
- Incorrect shared lunar texture on other moons; those surfaces now use explicitly procedural materials.
- Compare action inadvertently removing an already selected object.
- Missing accessible name for mobile search and inaccessible mobile settings/bookmarks.
- Landscape and horizon-control overlaps; larger mobile control targets.
- Reversed GLSL smoothstep edges in the accretion-disk shader.
- Static-export startup command and asset credit wording.

## Interpretation and remaining verification limits

Vesta, Halley, Pleiades, nearby stellar systems, exoplanet surfaces, and galaxies use educational procedural geometry; their shapes and activity are not current observational reconstructions. Shader-based black-hole rings are not relativistic ray tracing. No live ephemerides or exhaustive star catalog are claimed. See SCIENCE.md.

Real smartphone GPU performance, real multi-touch pinch gestures, throttled 4G loading, WebGL context-loss recovery on hardware, and browsers other than this Chromium-based environment were not tested. Those require a physical-device/browser matrix. Optional sound is not implemented.
