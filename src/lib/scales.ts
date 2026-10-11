export const scales = [
  { name: 'One world', short: 'Earth', distance: '12,742 km', meters: 1.2742e7, title: 'Our pale blue home.', text: 'Every life we have ever known has unfolded on this small world. Begin here. Then keep going.' },
  { name: 'Earth & Moon', short: 'Lunar orbit', distance: '384,400 km', meters: 3.844e8, title: 'A companion in the dark.', text: 'Light takes a little over a second to cross the average distance between Earth and the Moon.' },
  { name: 'Inner Solar System', short: 'Inner planets', distance: '1 astronomical unit', meters: 1.495978707e11, title: 'In the warmth of a star.', text: 'Four rocky worlds trace their paths around the Sun. One astronomical unit is approximately the distance from Earth to our star.' },
  { name: 'Solar System', short: 'Solar System', distance: '60 AU across', meters: 8.9759e12, title: 'A family of worlds.', text: 'Beyond the rocky planets, gas and ice giants inhabit a realm where sunlight grows faint.' },
  { name: 'Kuiper Belt', short: 'Kuiper Belt', distance: '100 AU across', meters: 1.495978707e13, title: 'The worlds beyond Neptune.', text: 'Icy remnants preserve clues to the birth of our solar system. Pluto is one member of this distant population.' },
  { name: 'Oort Cloud', short: 'Oort Cloud', distance: 'Up to ~100,000 AU radius', meters: 2.991957414e16, title: 'At the edge of the Sun’s reach.', text: 'The inferred Oort Cloud is a vast reservoir of icy bodies. Its structure is a scientific hypothesis, not a directly imaged shell.' },
  { name: 'Stellar neighborhood', short: 'Nearby stars', distance: '100 light-years', meters: 9.4607e17, title: 'Our Sun becomes a star.', text: 'Distances are now measured in years of light travel. Even the nearest stellar neighbors are unimaginably far away.' },
  { name: 'Milky Way', short: 'Milky Way', distance: '~100,000 light-years', meters: 9.4607e20, title: 'An island of starlight.', text: 'A barred spiral galaxy, seen here as a three-dimensional statistical reconstruction. Each point evokes a population of stars.' },
  { name: 'Local Group', short: 'Local Group', distance: '~10 million light-years', meters: 9.4607e22, title: 'We are not the only island.', text: 'The Milky Way, Andromeda, Triangulum, and many smaller galaxies form our galactic neighborhood.' },
  { name: 'Virgo region', short: 'Galaxy clusters', distance: '~100 million light-years', meters: 9.4607e23, title: 'Gravity writes in galaxies.', text: 'Galaxies gather in groups and clusters. This is an illustrative distribution, not a survey of individual galaxy positions.' },
  { name: 'Cosmic web', short: 'Cosmic web', distance: '~1 billion light-years', meters: 9.4607e24, title: 'A universe of connections.', text: 'Across the largest scales, gravity has shaped matter into filaments, clusters, and immense, sparsely populated voids.' },
  { name: 'Observable universe', short: 'Cosmic horizon', distance: '~93 billion light-years across', meters: 8.799e26, title: 'The edge of what reaches us.', text: 'The observable horizon is a limit to our view, not a physical edge. Space has expanded while the oldest light traveled toward us.' },
] as const;
export const clampScale = (v: number) => Math.max(-.65, Math.min(11, Number.isFinite(v) ? v : 0));
export const scaleIndex = (v: number) => Math.round(Math.max(0, clampScale(v)));
export function physicalSpan(scale: number) {
  const s = Math.max(0, clampScale(scale)), a = Math.floor(s), b = Math.min(11, a + 1);
  return Math.exp(Math.log(scales[a].meters) * (1 - s + a) + Math.log(scales[b].meters) * (s - a));
}
export const epochs = [
  { at: 0, age: '13.8 billion years', title: 'The universe today', text: 'Galaxies trace a vast cosmic web. Expansion is accelerating. This is the universe we observe from our place in time.' },
  { at: .17, age: '3 billion years', title: 'Structure takes shape', text: 'Gravity builds groups and clusters as galaxies grow and merge. The arrangement shown is a procedural reconstruction.' },
  { at: .34, age: '~500 million years', title: 'The first galaxies', text: 'Early galaxies assemble and their light begins transforming the surrounding hydrogen. Their detailed formation remains an active field of research.' },
  { at: .5, age: 'First few hundred million years', title: 'The first stars ignite', text: 'The first stars likely formed during this broad interval. Their exact timing and properties are still being investigated.' },
  { at: .66, age: 'Before the first stars', title: 'The cosmic dark ages', text: 'Neutral hydrogen fills a universe without stars. “Dark” here describes the absence of stellar light, not empty space.' },
  { at: .8, age: '~380,000 years', title: 'The oldest light', text: 'Atoms form and light travels freely. We detect this ancient radiation today as the cosmic microwave background. The colors are a conceptual temperature map.' },
  { at: .91, age: 'First minutes', title: 'A hot, dense beginning', text: 'The universe is hot and dense; light nuclei form. This happened throughout space, not at one central point in an empty surrounding room.' },
  { at: 1, age: 'Earliest moments', title: 'The limit of our knowledge', text: 'Our tested descriptions become incomplete at the earliest times. Inflation is a theoretical framework; a definitive account of the beginning is not established.' },
] as const;
export function epochAt(time: number) { return epochs.reduce((nearest, epoch) => Math.abs(epoch.at - time) < Math.abs(nearest.at - time) ? epoch : nearest, epochs[0] as typeof epochs[number]); }
