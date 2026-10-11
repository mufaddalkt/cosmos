# COSMOS — scientific interpretation and asset credits

Catalog review: 11 October 2026. This is an educational exploration, not an orbit prediction service, a scientific simulation, or a complete astronomical survey.

## Measurements and conventions

- `radiusKm` means mean, equal-volume radius unless the object’s note says otherwise. Irregular bodies are not asserted to be spherical. Haumea’s radius is intentionally omitted because a single radius hides its elongated shape and model dependence.
- `massKg` is rounded. Planetary values come from [JPL’s physical parameter table](https://ssd.jpl.nasa.gov/planets/phys_par.html). For satellites, JPL supplies the gravitational parameter GM. The catalog calculates mass as GM / G, with G = 6.67430 × 10⁻²⁰ km³ kg⁻¹ s⁻², rounded to four significant digits. These are derived values, not additional independent measurements. Source: [JPL satellite parameters](https://ssd.jpl.nasa.gov/sats/phys_par/).
- `distanceAU` is the solar-system orbital semimajor axis, approximately the conventional average distance from the Sun, **not** the current separation. Rounded semimajor axes can be compared; camera positions cannot. For extrasolar objects, `distanceLy` is an approximate distance from our solar neighborhood. Their distances are not comparable to a planet’s orbital radius without explaining the different reference points.
- `rotationHours` is the magnitude of the sidereal rotation period, relative to distant stars. Positive numbers are used for readability; Venus, Uranus, and Pluto are explicitly described as retrograde. A sidereal period is not the interval between local noons. Gas-giant rotation estimates depend on reference system and measurement method; the Sun rotates differentially and is not assigned one number.
- `orbitalDays` means an orbit around the stated parent. Planetary reference periods are rounded conversions of JPL’s quoted years. A year is converted using 365.25 days; reference values are not intended as high-precision ephemerides.
- `gravity` is in m/s². For giant planets this is a reference at equatorial cloud level, not a solid surface. Temperature text specifies context or range; no universal “surface temperature” is invented for stars, giant planets, or regions.
- Missing catalog fields mean “not supplied,” never zero. Moon lists contain **selected navigable moons**, not complete inventories. Counts change as discoveries are confirmed.
- TRAPPIST-1 e’s radius and mass are rounded conversions of NASA’s catalog values in Earth units. Its atmosphere and surface remain under investigation. An orbital habitable zone is not evidence of water, life, or a habitable environment. Sources: [NASA planet entry](https://science.nasa.gov/exoplanet-catalog/trappist-1-e/), [Webb atmospheric investigation](https://science.nasa.gov/missions/webb/nasa-webb-looks-at-earth-sized-habitable-zone-exoplanet-trappist-1-e/).

## What the graphics mean

Exploration uses deliberately compressed distances, enlarged bodies, and accelerated motion so that planets remain navigable. Transitioning between local coordinate systems communicates scale without placing the entire universe in one meter-based coordinate space. Displayed objects and orbit phases are not their positions on a particular date.

Earth, Jupiter, and Moon maps are historical imagery. Clouds, city lights, storm systems, illumination, and orientation do not represent current conditions. Atmosphere, ring, solar-surface, nebula, and black-hole effects are rendering approximations. Other body surfaces use procedural reconstructions rather than claiming unmeasured terrain is a photograph.

Cataloged objects have names and source links. Background stars, asteroid populations, galaxy particles, and cosmic filaments are synthesized illustrations. A point can represent a population; it is not necessarily one individually cataloged object. Nebular colors illustrate emitting gas and dust rather than naked-eye brightness. Galaxies are depth-bearing particle distributions rather than measured three-dimensional reconstructions.

The Oort Cloud is inferred from comet populations and dynamics and has not been directly imaged. Its inner and outer limits are uncertain. Source: [NASA Oort Cloud facts](https://science.nasa.gov/solar-system/oort-cloud/facts/).

The Virgo Cluster and Virgo Supercluster are different structures. Supercluster boundaries depend on definition, and superclusters are not necessarily gravitationally bound. Source: [NASA galaxies overview](https://science.nasa.gov/universe/galaxies/).

The observable horizon is an observer-dependent limit to information reaching us, not a physical wall, an edge to all space, or a view from a location outside the universe. Present-day cosmic distance differs from light travel time because space expands. A rendered sphere is a conceptual aid.

## Cosmic-time narrative

The time experience is a separate journey through history, not a continuation outward in physical space. Labels below are elapsed time **after** the hot early universe unless stated otherwise. Transitions are gradual; there is no universal instant when all galaxies or stars appear.

| Stage | Appropriate label | Interpretation |
| --- | --- | --- |
| Present | About 13.8 billion years | A measured, model-dependent cosmic age; not the radius of a static sphere. |
| Structure growth | Across billions of years | Gravity builds and reshapes galaxies, groups, clusters, and filaments over time. |
| Early galaxies | First several hundred million years | Small early systems develop; timings are active research. |
| First stars | First few hundred million years; uncertain | About 200 million years is an illustrative benchmark, not a precise established birthday. |
| Cosmic Dark Ages | After recombination, before the first stars | Gas exists before starlight; “dark” does not mean an absence of matter or radiation. |
| Recombination / CMB | About 380,000 years | Electrons bind to nuclei and photons travel much more freely. The CMB is ancient radiation, not a shell enclosing all existence. |
| Hot dense early universe | Seconds and minutes | Particles interact in an expanding plasma; light-element nuclei form during the first minutes. |
| Earliest limits | Fraction of a second | Inflation is a theoretical framework; its physical cause and what preceded it remain unresolved. |

Source for the sequence, approximate 200-million-year benchmark, recombination, nucleosynthesis, and present age: [NASA’s universe history](https://science.nasa.gov/universe/overview/). The first-stars date is explicitly uncertain: [NASA / ESA / CSA / STScI first-stars timeline](https://science.nasa.gov/asset/webb/first-stars-timeline-of-the-universe/). The latter is a 2019 educational graphic, so its historical “oldest-known galaxy” limit must not be treated as today’s discovery record. CMB definition: [NASA universe glossary](https://science.nasa.gov/universe/glossary/).

The Big Bang is not a celestial object, a point in space, or an explosion into an external void. Cosmic history describes how the universe evolved. “Beyond What We Know” is an optional artistic mode: eternal inflation, bubble universes, and multiverse scenarios are hypotheses, not observed neighboring universes. Its persistent label should read **“Speculative visualization — not observationally established.”**

## Texture provenance

All maps are equirectangular/cylindrical textures on actual 3D sphere geometry, not globe screenshots. Files are served locally; the client does not hotlink the source servers. NASA does not endorse this project.

### Earth daylight — `public/textures/earth-day.jpg`

2048 × 1024 JPEG. NASA Blue Marble land, ocean, and sea-ice imagery.

- Credit: NASA Earth Observatory / NASA Goddard Space Flight Center; Reto Stöckli and the Blue Marble team.
- [Exact downloaded file](https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg).
- [Source description and contributor credits](https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/).

### Earth clouds — `public/textures/earth-clouds.jpg`

2048 × 1024 grayscale JPEG, interpreted as cloud opacity.

- Credit: NASA Earth Observatory / NASA Goddard Space Flight Center; Reto Stöckli and the Blue Marble team.
- [Exact downloaded file](https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg).
- This is a stitched historical composite. Some orbital gaps were filled during preparation of the source product; it is not live weather. [NASA explains the construction and reuse](https://science.nasa.gov/blogs/earth-matters/2011/10/06/crafting-the-blue-marble/).

### Earth night lights — `public/textures/earth-night.jpg`

3600 × 1800 JPEG, based on 2012 VIIRS observations.

- Credit: NASA Earth Observatory image by Robert Simmon, using Suomi NPP VIIRS data courtesy of Chris Elvidge, NOAA National Geophysical Data Center. Suomi NPP: NASA / NOAA / Department of Defense partnership.
- [Exact downloaded file](https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg).
- [Source and processing description](https://science.nasa.gov/earth/earth-observatory/night-lights-2012-map-79765/).

### Jupiter — `public/textures/jupiter.jpg`

2048 × 1024 JPEG rendition of Cassini’s PIA07782 global cylindrical map. Original observations: 11–12 December 2000. The NASA image service generated the compact rendition; COSMOS makes no terrain changes.

- Credit: **NASA/JPL/Space Science Institute**.
- [Source product](https://science.nasa.gov/photojournal/cassinis-best-maps-of-jupiter-cylindrical-map/).
- [Exact downloaded rendition](https://assets.science.nasa.gov/dynamicimage/assets/science/psd/photojournal/pia/pia07/pia07782/PIA07782.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1024&w=2048).
- This historical mosaic approximates human-visible color using blue and near-infrared observations. Polar detail is limited.

### Moon — `public/textures/moon.jpg`

1024 × 512 JPEG supplied by the Three.js example texture collection.

- [Exact downloaded file and repository provenance](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg).
- [Three.js repository license](https://github.com/mrdoob/three.js/blob/dev/LICENSE): MIT, Three.js authors. The bundled notice below is retained for this repository-supplied asset. No claim is made that this is live imagery or a high-resolution landing-site map.

> Copyright © 2010–2026 Three.js authors
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

NASA material reuse follows [NASA image and media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/), including maintaining third-party credits and making no endorsement claim. Every catalog entry also carries its own relevant science references.
