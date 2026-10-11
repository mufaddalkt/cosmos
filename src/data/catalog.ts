/** Rounded educational measurements; see SCIENCE.md for conventions and sources. */
export type CelestialObject = {
  id: string;
  name: string;
  aliases?: string[];
  category: 'star' | 'planet' | 'moon' | 'dwarf planet' | 'galaxy' | 'nebula' | 'black hole' | 'region' | 'exoplanet';
  classification: string;
  description: string;
  color: string;
  scale: number;
  radiusKm?: number;
  massKg?: number;
  distanceAU?: number;
  distanceLy?: number;
  orbitalDays?: number;
  /** Positive sidereal-period magnitude. Retrograde direction is stated in scientificNote. */
  rotationHours?: number;
  gravity?: number;
  temperature?: string;
  atmosphere?: string;
  parent?: string;
  moons?: string[];
  facts: string[];
  sources: { label: string; url: string }[];
  texture?: string;
  scientificNote?: string;
};

const nasa = (path: string, label = 'NASA Science') => ({ label, url: `https://science.nasa.gov/${path}` });
const jpl = { label: 'JPL physical parameters', url: 'https://ssd.jpl.nasa.gov/planets/phys_par.html' };
const satellites = { label: 'JPL satellite parameters', url: 'https://ssd.jpl.nasa.gov/sats/phys_par/' };
const planetNote = 'Mean radii and rounded reference measurements. Distances are orbital semimajor axes, not current separations. Rotation and orbital motion in the scene are accelerated illustrations, not an ephemeris.';
const reconstructed = 'Procedural appearance is an educational reconstruction, not a measured surface map.';

export const objects: CelestialObject[] = [
  {
    id: 'sun', name: 'Sun', aliases: ['Sol'], category: 'star', classification: 'G-type main-sequence star',
    description: 'The star that makes every world in our solar system possible. Deep in its core, hydrogen fusion supplies the light that reaches Earth.',
    color: '#f2c879', scale: 0, radiusKm: 695700, massKg: 1.989e30,
    temperature: 'Photosphere ≈ 5,500 °C; core ≈ 15 million °C', atmosphere: 'Hydrogen and helium plasma',
    facts: ['The Sun contains about 99.8% of the solar system’s mass.', 'Its equatorial regions rotate faster than its poles.', 'Sunlight takes about eight minutes to reach Earth.'],
    sources: [nasa('sun/facts/')], scientificNote: 'The Sun has no solid surface. Solar granulation and the corona are artistic shader approximations. Rotation depends on latitude.',
  },
  {
    id: 'mercury', name: 'Mercury', category: 'planet', classification: 'Terrestrial planet', parent: 'sun',
    description: 'A small, cratered world moving through the Sun’s harshest light. Its nearly airless surface experiences extreme changes between day and night.',
    color: '#b5ada0', scale: 0, radiusKm: 2439.4, massKg: 3.301e23, distanceAU: 0.387, orbitalDays: 87.97, rotationHours: 1407.51, gravity: 3.7,
    temperature: 'About −180 to 430 °C', atmosphere: 'Extremely thin exosphere', moons: [],
    facts: ['Mercury is the smallest of the eight planets.', 'A solar day lasts about 176 Earth days.', 'Water ice can survive in permanently shadowed polar craters.'],
    sources: [jpl, nasa('mercury/facts/')], scientificNote: `${planetNote} ${reconstructed}`,
  },
  {
    id: 'venus', name: 'Venus', category: 'planet', classification: 'Terrestrial planet', parent: 'sun',
    description: 'An Earth-sized world hidden beneath thick clouds. A powerful greenhouse effect makes its surface hotter than any other planet’s.',
    color: '#e5c79c', scale: 0, radiusKm: 6051.8, massKg: 4.867e24, distanceAU: 0.723, orbitalDays: 224.7, rotationHours: 5832.43, gravity: 8.87,
    temperature: 'Surface ≈ 465 °C', atmosphere: 'Mostly carbon dioxide, with nitrogen; sulfuric-acid clouds', moons: [],
    facts: ['Venus rotates in the opposite direction to most planets.', 'Its sidereal rotation takes longer than its year.', 'Its surface pressure is roughly 90 times Earth’s.'],
    sources: [jpl, nasa('venus/venus-facts/')], scientificNote: `${planetNote} Rotation is retrograde; the number is its positive period. Clouds are reconstructed.`,
  },
  {
    id: 'earth', name: 'Earth', aliases: ['Terra', 'Home', 'Pale blue dot'], category: 'planet', classification: 'Terrestrial planet', parent: 'sun',
    description: 'A living ocean world suspended in sunlight. A thin atmosphere shelters the only life we have yet discovered in the universe.',
    color: '#74b8d8', scale: 0, radiusKm: 6371, massKg: 5.972e24, distanceAU: 1, orbitalDays: 365.26, rotationHours: 23.9345, gravity: 9.8,
    atmosphere: 'About 78% nitrogen and 21% oxygen', moons: ['moon'], texture: '/textures/earth-day.jpg',
    facts: ['Liquid oceans cover about 71% of Earth’s surface.', 'Our atmosphere is astonishingly thin compared with the planet.', 'Earth formed approximately 4.5 billion years ago.'],
    sources: [jpl, nasa('earth/facts/')], scientificNote: `${planetNote} Satellite texture mosaics show historical land, cloud and night-light observations, not live weather.`,
  },
  {
    id: 'mars', name: 'Mars', aliases: ['Red Planet'], category: 'planet', classification: 'Terrestrial planet', parent: 'sun',
    description: 'A cold desert with the traces of ancient rivers, immense volcanoes, and polar ice. Iron minerals give its dust a rusty color.',
    color: '#c77451', scale: 0, radiusKm: 3389.5, massKg: 6.417e23, distanceAU: 1.524, orbitalDays: 686.98, rotationHours: 24.623, gravity: 3.71,
    temperature: 'Roughly −153 to 20 °C', atmosphere: 'Thin atmosphere, mostly carbon dioxide', moons: ['phobos', 'deimos'],
    facts: ['Mars has two small, irregular moons.', 'Olympus Mons is the largest volcano in the solar system.', 'Evidence shows that liquid water flowed across ancient Mars.'],
    sources: [jpl, nasa('mars/facts/')], scientificNote: `${planetNote} ${reconstructed}`,
  },
  {
    id: 'jupiter', name: 'Jupiter', category: 'planet', classification: 'Gas giant', parent: 'sun',
    description: 'A vast atmosphere of banded clouds and persistent storms. Jupiter is more massive than all the other planets combined.',
    color: '#d9b99b', scale: 0, radiusKm: 69911, massKg: 1.898e27, distanceAU: 5.203, orbitalDays: 4332.59, rotationHours: 9.925, gravity: 24.79,
    atmosphere: 'Mostly hydrogen and helium', moons: ['io', 'europa', 'ganymede', 'callisto'], texture: '/textures/jupiter.jpg',
    facts: ['The Great Red Spot is an enormous long-lived storm.', 'Jupiter has a faint ring system.', 'Its four largest moons are miniature worlds with radically different surfaces.'],
    sources: [jpl, nasa('jupiter/jupiter-facts/')], scientificNote: `${planetNote} The map is a Cassini mosaic from December 2000. There is no solid surface; gravity is a reference value at the equatorial cloud level.`,
  },
  {
    id: 'saturn', name: 'Saturn', category: 'planet', classification: 'Gas giant', parent: 'sun',
    description: 'A pale giant encircled by countless fragments of ice and rock. Its rings are broad, intricate, and remarkably thin.',
    color: '#dcca9e', scale: 0, radiusKm: 58232, massKg: 5.683e26, distanceAU: 9.537, orbitalDays: 10755.7, rotationHours: 10.656, gravity: 10.44,
    atmosphere: 'Mostly hydrogen and helium', moons: ['titan', 'enceladus'],
    facts: ['Saturn’s average density is lower than water’s.', 'Its rings consist mostly of water ice particles.', 'Titan and Enceladus are two of its remarkable ocean-world candidates.'],
    sources: [jpl, nasa('saturn/facts/')], scientificNote: `${planetNote} Rotation is the cited reference estimate; Saturn’s interior rotation is difficult to measure. No solid surface; gravity is at equatorial cloud level. Ring structure is reconstructed.`,
  },
  {
    id: 'uranus', name: 'Uranus', category: 'planet', classification: 'Ice giant', parent: 'sun',
    description: 'A quiet-looking blue-green world with an extraordinary tilt. Uranus effectively rolls on its side as it travels around the Sun.',
    color: '#a1d6d8', scale: 0, radiusKm: 25362, massKg: 8.681e25, distanceAU: 19.19, orbitalDays: 30687.2, rotationHours: 17.24, gravity: 8.87,
    atmosphere: 'Hydrogen, helium, and methane', moons: [],
    facts: ['Its axis is tilted by about 98 degrees.', 'Methane absorbs red light and contributes to its blue-green color.', 'Uranus has a dark ring system.'],
    sources: [jpl, nasa('uranus/facts/')], scientificNote: `${planetNote} Rotation is retrograde. This catalog does not list all its moons. Gravity refers to equatorial cloud level.`,
  },
  {
    id: 'neptune', name: 'Neptune', category: 'planet', classification: 'Ice giant', parent: 'sun',
    description: 'The outermost planet, where a dynamic atmosphere moves beneath weak sunlight. Storms and fast winds reshape its cloud patterns.',
    color: '#6a93c8', scale: 0, radiusKm: 24622, massKg: 1.024e26, distanceAU: 30.07, orbitalDays: 60190, rotationHours: 16.11, gravity: 11.15,
    atmosphere: 'Hydrogen, helium, and methane', moons: ['triton'],
    facts: ['Neptune was predicted mathematically before its 1846 discovery.', 'A year here lasts about 165 Earth years.', 'Its largest moon, Triton, travels in a retrograde orbit.'],
    sources: [jpl, nasa('neptune/')], scientificNote: `${planetNote} Natural color is less saturated than familiar enhanced Voyager images. Gravity is at equatorial cloud level.`,
  },
  {
    id: 'pluto', name: 'Pluto', category: 'dwarf planet', classification: 'Kuiper Belt dwarf planet', parent: 'sun',
    description: 'An icy world with nitrogen glaciers, mountains of water ice, and an unexpectedly varied geological story.',
    color: '#c2ad99', scale: 0, radiusKm: 1188.3, massKg: 1.302e22, distanceAU: 39.48, orbitalDays: 90560, rotationHours: 153.29, gravity: 0.62,
    atmosphere: 'Thin, mostly nitrogen atmosphere', moons: ['charon'],
    facts: ['New Horizons flew past Pluto in July 2015.', 'Its bright heart-shaped terrain includes the nitrogen-ice plain Sputnik Planitia.', 'Pluto and Charon orbit a center of mass outside Pluto.'],
    sources: [jpl, nasa('dwarf-planets/pluto/facts/')], scientificNote: `${planetNote} Rotation is retrograde. Charon is one of five known moons; surface appearance is reconstructed.`,
  },
  {
    id: 'ceres', name: 'Ceres', category: 'dwarf planet', classification: 'Main-belt dwarf planet', parent: 'sun',
    description: 'The largest body in the main asteroid belt. Bright mineral deposits preserve clues to briny liquids beneath its crust.',
    color: '#aaa79e', scale: 0, radiusKm: 469.7, massKg: 9.384e20, distanceAU: 2.77, orbitalDays: 1684, rotationHours: 9.074, gravity: 0.27,
    facts: ['Ceres was discovered in 1801.', 'NASA’s Dawn spacecraft entered orbit in 2015.', 'It is the only dwarf planet in the inner solar system.'],
    sources: [jpl, nasa('dwarf-planets/ceres/facts/')], scientificNote: `${planetNote} ${reconstructed}`,
  },
  {
    id: 'eris', name: 'Eris', category: 'dwarf planet', classification: 'Scattered-disk dwarf planet', parent: 'sun',
    description: 'A distant icy world on an elongated orbit, comparable to Pluto in size and more massive.',
    color: '#d9d9d2', scale: 0, massKg: 1.66e22, orbitalDays: 203650,
    facts: ['The discovery of Eris helped prompt the 2006 planet-definition debate.', 'Its moon is named Dysnomia.'],
    sources: [jpl, nasa('dwarf-planets/')], scientificNote: 'Measurements and rotation estimates vary across publications. Uncertain values are omitted here. Appearance is an artistic reconstruction.',
  },
  {
    id: 'haumea', name: 'Haumea', category: 'dwarf planet', classification: 'Elongated Kuiper Belt dwarf planet', parent: 'sun',
    description: 'A rapidly spinning icy body whose elongated shape makes it unlike the familiar spherical planets.',
    color: '#d7d3ca', scale: 0, massKg: 4.006e21, rotationHours: 3.914,
    facts: ['Haumea has a ring and two known moons.', 'Its rotation takes less than four hours.'],
    sources: [jpl, { label: 'NASA: Haumea’s origins', url: 'https://www.nasa.gov/solar-system/nasa-studies-origins-of-weird-solar-system-object-dwarf-planet-haumea/' }],
    scientificNote: 'Haumea is not spherical. A single radius is omitted because its shape and size estimates are model dependent. Appearance is reconstructed.',
  },
  {
    id: 'makemake', name: 'Makemake', category: 'dwarf planet', classification: 'Kuiper Belt dwarf planet', parent: 'sun',
    description: 'A bright, cold world beyond Neptune, belonging to the ancient population of icy bodies at the solar system’s edge.',
    color: '#be9c83', scale: 0, radiusKm: 714, orbitalDays: 112330,
    facts: ['Makemake is one of the five officially recognized dwarf planets.', 'It belongs to the trans-Neptunian population.'],
    sources: [jpl, nasa('dwarf-planets/')], scientificNote: 'Radius and orbital period are rounded estimates. Its detailed surface is unresolved; appearance is reconstructed.',
  },
  ...([
    ['moon', 'Moon', 'earth', 1737.4, 4902.8, '#c3c5c6', 'Earth’s natural satellite', 'A cratered archive of the inner solar system, keeping nearly the same face turned toward Earth.', 'The Moon orbits Earth in about 27.3 days.', 'moon/facts/'],
    ['phobos', 'Phobos', 'mars', 11.08, 0.0007087, '#93857a', 'Irregular Martian moon', 'A small, battered moon orbiting close to Mars.', 'Phobos orbits Mars faster than Mars rotates.', 'mars/moons/phobos/'],
    ['deimos', 'Deimos', 'mars', 6.2, 0.0000962, '#b8a995', 'Irregular Martian moon', 'The smaller, more distant of Mars’s two moons.', 'Its small size and irregular form distinguish it from the large rounded moons.', 'mars/moons/deimos/'],
    ['io', 'Io', 'jupiter', 1821.49, 5959.91547, '#d7bd66', 'Volcanic Galilean moon', 'An intensely active world whose interior is heated by gravitational tides.', 'Io is the most volcanically active world in the solar system.', 'jupiter/jupiter-moons/io/'],
    ['europa', 'Europa', 'jupiter', 1560.8, 3202.7121, '#cfbdab', 'Icy Galilean moon', 'A fractured shell of water ice conceals strong evidence for a global ocean.', 'Europa is a major target in the search for potentially habitable environments.', 'jupiter/jupiter-moons/europa/'],
    ['ganymede', 'Ganymede', 'jupiter', 2631.2, 9887.83275, '#a39a8d', 'Icy Galilean moon', 'The largest moon in the solar system, a world of ancient dark terrain and brighter grooves.', 'Ganymede has its own magnetic field.', 'jupiter/jupiter-moons/ganymede/facts/'],
    ['callisto', 'Callisto', 'jupiter', 2410.3, 7179.2834, '#8f877f', 'Icy Galilean moon', 'An ancient, heavily cratered world near the outer edge of the Galilean system.', 'Its battered surface records billions of years of impacts.', 'jupiter/jupiter-moons/callisto/'],
    ['titan', 'Titan', 'saturn', 2574.76, 8978.1371, '#d3ad61', 'Atmosphere-bearing icy moon', 'A hazy world with rivers, lakes, and seas of liquid hydrocarbons.', 'Titan has a thick nitrogen-rich atmosphere.', 'saturn/moons/titan/'],
    ['enceladus', 'Enceladus', 'saturn', 252.1, 7.21037, '#e0e4e1', 'Ocean-bearing icy moon', 'A brilliant white moon that vents material from its subsurface ocean into space.', 'Water-rich plumes emerge near its south pole.', 'saturn/moons/enceladus/'],
    ['triton', 'Triton', 'neptune', 1352.6, 1428.49546, '#c0c7c2', 'Retrograde icy moon', 'Neptune’s largest moon, probably captured from an independent orbit around the Sun.', 'Voyager 2 observed active geyser-like plumes in 1989.', 'neptune/moons/triton/'],
    ['charon', 'Charon', 'pluto', 606, 106.1, '#a9a19a', 'Pluto’s largest moon', 'A large companion that forms a remarkable paired system with Pluto.', 'Pluto and Charon are mutually tidally locked.', 'dwarf-planets/pluto/moons/charon/'],
  ] as const).map(([id, name, parent, radiusKm, gm, color, classification, description, fact, path]): CelestialObject => ({
    id, name, parent, category: 'moon', scale: 0, radiusKm,
    // JPL publishes GM in km^3/s^2. CODATA G=6.67430e-20 km^3/kg/s^2; rounded to four significant digits.
    massKg: Number((gm / 6.6743e-20).toPrecision(4)), color, classification, description,
    facts: [fact], sources: [satellites, nasa(path)],
    ...(id === 'moon' ? { texture: '/textures/moon.jpg', aliases: ['Luna'], orbitalDays: 27.3, rotationHours: 655.7 } : {}),
    scientificNote: `Mean radius is the radius of an equal-volume sphere; Phobos and Deimos are irregular. Mass is calculated from JPL’s GM using the gravitational constant. ${id === 'moon' ? 'The lunar texture is a historical educational map from the Three.js asset collection.' : reconstructed}`,
  })),
  {
    id: 'vesta', name: 'Vesta', aliases: ['4 Vesta'], category: 'region', classification: 'Main-belt asteroid', parent: 'sun', color: '#a99c83', scale: 0,
    description: 'A differentiated remnant of planetary formation, with a crust, mantle, and core.',
    facts: ['Vesta is the second most massive body in the main asteroid belt.', 'Dawn orbited Vesta from 2011 to 2012.'],
    sources: [nasa('solar-system/asteroids/4-vesta/')], scientificNote: 'The shape and surface are procedural educational approximations. Individual small-body positions are illustrative; no live ephemeris is used.',
  },
  {
    id: 'halley', name: 'Halley’s Comet', aliases: ['1P/Halley', 'Halley'], category: 'region', classification: 'Periodic comet', parent: 'sun', color: '#bddbe1', scale: 0,
    description: 'An icy traveler whose repeating visits helped reveal that comets follow orbits around the Sun.',
    facts: ['Its orbital period is approximately 76 years and varies between returns.', 'ESA’s Giotto spacecraft imaged its nucleus in 1986.', 'Its orbit is retrograde.'],
    sources: [nasa('solar-system/comets/1p-halley/')], scientificNote: 'The nucleus shape, coma, and tail are artistic approximations, not Halley’s current activity or location. A comet’s tail changes with illumination and solar wind.',
  },
  {
    id: 'asteroid-belt', name: 'Asteroid Belt', category: 'region', classification: 'Main-belt small-body population', color: '#a99c83', scale: 3,
    description: 'A sparse population of rocky remnants orbiting between Mars and Jupiter.',
    facts: ['The belt contains Ceres and many smaller bodies.', 'Real asteroids are separated by enormous distances.'],
    sources: [nasa('solar-system/asteroids/')], scientificNote: 'Particle density is greatly exaggerated to make the population visible. Points are representative, not individually identified asteroids.',
  },
  {
    id: 'kuiper-belt', name: 'Kuiper Belt', category: 'region', classification: 'Trans-Neptunian small-body population', color: '#91acba', scale: 4,
    description: 'An icy reservoir beyond Neptune, preserving remnants of the solar system’s formation.',
    facts: ['The main belt extends roughly from 30 to 50 AU.', 'Pluto belongs to this distant population.'],
    sources: [nasa('solar-system/kuiper-belt/facts/')], scientificNote: 'The displayed disk is a simplified population model with enlarged particles, not a catalog of measured orbits.',
  },
  {
    id: 'oort-cloud', name: 'Oort Cloud', category: 'region', classification: 'Inferred comet reservoir', color: '#82969f', scale: 5,
    description: 'A proposed distant reservoir of icy bodies surrounding the planetary system in a vast shell.',
    facts: ['The Oort Cloud has not been directly imaged.', 'Long-period comet orbits motivate the hypothesis.', 'Its outer extent may reach tens of thousands of AU.'],
    sources: [nasa('solar-system/oort-cloud/facts/')], scientificNote: 'Inferred structure, not a direct observation. Its boundaries and population are uncertain; displayed density is illustrative.',
  },
  {
    id: 'proxima-centauri', name: 'Proxima Centauri', aliases: ['Alpha Centauri C', 'Proxima'], category: 'star', classification: 'Red dwarf · flare star', color: '#e9a081', scale: 6, distanceLy: 4.24,
    description: 'The Sun’s nearest stellar neighbor: a faint red dwarf in the Alpha Centauri system.',
    facts: ['It is too faint to see with the unaided eye.', 'Its brightness can change dramatically during flares.'],
    sources: [{ label: 'ESA/Hubble: Proxima Centauri', url: 'https://esahubble.org/images/potw1343a/' }, { label: 'NASA: solar neighborhood', url: 'https://imagine.gsfc.nasa.gov/features/cosmic/solar_neighborhood_info.html' }],
    scientificNote: 'Distance is rounded. Stars are enlarged for visibility; the surrounding field is a procedural population.',
  },
  {
    id: 'sirius', name: 'Sirius', aliases: ['Sirius A', 'Dog Star', 'Alpha Canis Majoris'], category: 'star', classification: 'Main-sequence star · binary system', color: '#d5e7ff', scale: 6, distanceLy: 8.6,
    description: 'The brightest star in Earth’s night sky, accompanied by the compact white dwarf Sirius B.',
    facts: ['Sirius is about 8.6 light-years away.', 'Its companion is a white dwarf, the remnant of a once larger star.'],
    sources: [nasa('asset/hubble/the-dog-star-sirius-and-its-tiny-companion/')], scientificNote: 'This point represents Sirius A and its system; the binary orbit is not dynamically simulated.',
  },
  {
    id: 'trappist-1', name: 'TRAPPIST-1', category: 'star', classification: 'Ultracool red dwarf · planetary system', color: '#ed986e', scale: 6, distanceLy: 40,
    description: 'A small, cool star hosting seven rocky, roughly Earth-sized planets packed into close orbits.',
    facts: ['The system lies about 40 light-years away.', 'A planet’s location in the habitable zone does not establish that it is habitable.'],
    sources: [nasa('exoplanets/trappist1/')], scientificNote: 'Planet surfaces and atmospheric appearances are not resolved. The visualization is conceptual.',
  },
  {
    id: 'trappist-1e', name: 'TRAPPIST-1 e', aliases: ['TRAPPIST-1e'], category: 'exoplanet', classification: 'Terrestrial exoplanet', color: '#ae8d78', scale: 0, parent: 'trappist-1', distanceLy: 40, radiusKm: 5861, massKg: 4.133e24, orbitalDays: 6.1,
    description: 'A roughly Earth-sized planet in the temperate orbital region of an ultracool dwarf star.',
    facts: ['Its orbit takes about 6.1 Earth days.', 'It orbits about 0.02925 AU from TRAPPIST-1.', 'The existence and properties of its atmosphere remain under investigation.'],
    sources: [nasa('exoplanet-catalog/trappist-1-e/'), nasa('missions/webb/nasa-webb-looks-at-earth-sized-habitable-zone-exoplanet-trappist-1-e/')],
    scientificNote: 'Radius and mass are rounded conversions from 0.92 Earth radii and 0.692 Earth masses. All surface features are artistic; no oceans or life have been established.',
  },
  {
    id: 'pleiades', name: 'Pleiades', aliases: ['M45', 'Messier 45', 'Seven Sisters'], category: 'region', classification: 'Open star cluster', color: '#b6d4f3', scale: 6, distanceLy: 445,
    description: 'A nearby family of stars, dominated in our sky by a handful of brilliant blue-white members.',
    facts: ['The cluster contains over a thousand stars.', 'It is visible to the unaided eye under suitable conditions.'],
    sources: [nasa('mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-45/')], scientificNote: 'Distance is rounded. Displayed star positions are representative, not an astrometric reconstruction of the cluster.',
  },
  {
    id: 'orion-nebula', name: 'Orion Nebula', aliases: ['M42', 'Messier 42', 'NGC 1976'], category: 'nebula', classification: 'Emission nebula · stellar nursery', color: '#ca9b9c', scale: 6,
    description: 'A nearby region of glowing gas and dust where young stars illuminate their birth environment.',
    facts: ['It lies roughly 1,300–1,500 light-years away; published distance estimates differ.', 'The central Trapezium stars illuminate surrounding gas.'],
    sources: [nasa('mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-42/')],
    scientificNote: 'The nebula’s shape and color are a procedural interpretation, not a volumetric reconstruction of measured gas. Distance uncertainty is stated rather than hidden.',
  },
  {
    id: 'milky-way', name: 'Milky Way', aliases: ['Our galaxy'], category: 'galaxy', classification: 'Barred spiral galaxy', color: '#d7c5a8', scale: 7,
    description: 'Our home galaxy: a stellar disk, central bar, and halo threaded by dust and star-forming regions.',
    facts: ['The stellar disk spans more than 100,000 light-years.', 'Our solar system lies in the Orion Spur.', 'The Sun takes roughly 240 million years to orbit the galaxy.'],
    sources: [nasa('universe/galaxies/'), nasa('solar-system/solar-system-facts/')],
    scientificNote: 'We observe the Milky Way from inside it. The external view is a scientific illustration; particles do not represent a complete star catalog.',
  },
  {
    id: 'sagittarius-a', name: 'Sagittarius A*', aliases: ['Sgr A*', 'Sagittarius A star', 'Galactic black hole'], category: 'black hole', classification: 'Supermassive black hole', color: '#edbf84', scale: 7, massKg: 7.956e36,
    description: 'The compact gravitational anchor at the center of the Milky Way, with a mass of roughly four million Suns.',
    facts: ['Stellar orbits reveal the enormous mass concentrated at the galactic center.', 'Radiation comes from surrounding material, not from inside the event horizon.'],
    sources: [nasa('mission/webb/science-overview/science-explainers/what-is-the-center-of-our-galaxy-like/')],
    scientificNote: 'Mass is an approximate conversion from four million solar masses. The disk and photon-ring effects are artistic approximations, not general-relativistic ray tracing or a current observation.',
  },
  {
    id: 'andromeda', name: 'Andromeda Galaxy', aliases: ['M31', 'Messier 31', 'NGC 224'], category: 'galaxy', classification: 'Spiral galaxy', color: '#dcccae', scale: 8, distanceLy: 2500000,
    description: 'The nearest large galactic neighbor to the Milky Way, with an immense stellar disk and bright central bulge.',
    facts: ['Its light travels about 2.5 million years to reach us.', 'Andromeda is a major member of the Local Group.'],
    sources: [nasa('photojournal/andromeda/')], scientificNote: 'A procedural stellar distribution conveys morphology; it is not a catalog of measured star positions.',
  },
  {
    id: 'triangulum', name: 'Triangulum Galaxy', aliases: ['M33', 'Messier 33', 'NGC 598'], category: 'galaxy', classification: 'Spiral galaxy', color: '#a9c8dc', scale: 8, distanceLy: 3000000,
    description: 'A smaller spiral neighbor in the Local Group, rich in regions where new stars are forming.',
    facts: ['Triangulum lies approximately three million light-years away.', 'It is the Local Group’s third-largest galaxy.'],
    sources: [nasa('mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-33/')], scientificNote: 'Distance is approximate. The galaxy is a procedural interpretation of its spiral morphology.',
  },
  {
    id: 'local-group', name: 'Local Group', category: 'region', classification: 'Gravitationally bound galaxy group', color: '#b6c8db', scale: 8,
    description: 'The neighborhood of galaxies containing the Milky Way, Andromeda, Triangulum, and many smaller companions.',
    facts: ['The group contains dozens of known galaxies.', 'Its large members are accompanied by many dwarf galaxies.'],
    sources: [nasa('universe/galaxies/')], scientificNote: 'Named galaxies are identifiable; other points are representative. Positions and sizes are compressed for exploration.',
  },
  {
    id: 'virgo-cluster', name: 'Virgo Cluster', category: 'region', classification: 'Galaxy cluster', color: '#d1c3b1', scale: 9,
    description: 'The nearest large galaxy cluster, containing more than a thousand galaxies in a complex shared environment.',
    facts: ['Virgo contains spiral, elliptical, and irregular galaxies.', 'The cluster is distinct from the much larger Virgo Supercluster.'],
    sources: [{ label: 'NASA/Hubble: Virgo Cluster', url: 'https://www.nasa.gov/image-article/hubble-glimpses-galactic-gas-making-a-getaway/' }],
    scientificNote: 'Galaxies are representative particles. The cluster has physical depth and no single exact distance for every member.',
  },
  {
    id: 'virgo-supercluster', name: 'Virgo Supercluster', aliases: ['Local Supercluster'], category: 'region', classification: 'Large-scale galaxy structure', color: '#b6c8db', scale: 9,
    description: 'A historical description of our wider galactic neighborhood, including the Local Group and Virgo Cluster.',
    facts: ['Galaxy groups and clusters trace a larger network.', 'Unlike bound clusters, superclusters need not remain gravitationally bound.'],
    sources: [nasa('universe/galaxies/'), { label: 'NASA: Local Supercluster', url: 'https://imagine.gsfc.nasa.gov/features/cosmic/local_supercluster_info.html' }],
    scientificNote: 'Supercluster boundaries depend on how structure is defined. This is a schematic distribution, not a redshift survey.',
  },
  {
    id: 'cosmic-web', name: 'Cosmic Web', category: 'region', classification: 'Large-scale matter distribution', color: '#91adbc', scale: 10,
    description: 'Matter gathers into filaments, sheets, and clusters around vast voids. Gravity turns early density differences into structure.',
    facts: ['Galaxies trace a much larger distribution of matter.', 'The network includes dark matter and diffuse gas as well as stars.'],
    sources: [nasa('universe/galaxies/'), nasa('universe/overview/')],
    scientificNote: 'A generated network illustrates cosmic structure. It is not a reconstruction of our observed universe or a cosmological simulation.',
  },
  {
    id: 'observable-universe', name: 'Observable Universe', aliases: ['Universe', 'Cosmic horizon'], category: 'region', classification: 'Observer-dependent cosmic horizon', color: '#bed2df', scale: 11,
    description: 'The part of the cosmos whose signals can reach us. Its horizon marks an observational limit, not an edge to all of existence.',
    facts: ['The universe is approximately 13.8 billion years old.', 'Cosmic expansion separates present-day distance from light travel time.', 'The Big Bang describes an early hot, dense state everywhere in space.'],
    sources: [nasa('universe/overview/'), nasa('universe/glossary/')],
    scientificNote: 'The boundary is conceptual and observer dependent. The Big Bang is explored through time, never as an object beyond a spatial edge. Multiverse scenes are speculative and not observationally established.',
  },
];

export const categories: CelestialObject['category'][] = ['planet', 'moon', 'dwarf planet', 'star', 'exoplanet', 'galaxy', 'nebula', 'black hole', 'region'];

const objectIndex = new Map(objects.map((object) => [object.id, object]));
export function getObject(id: string): CelestialObject {
  return objectIndex.get(id) ?? objectIndex.get('earth')!;
}
