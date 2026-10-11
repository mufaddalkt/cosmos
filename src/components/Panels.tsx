'use client';
import { useMemo, useState } from 'react';
import { ArrowUpRight, Bookmark, Check, ChevronRight, ExternalLink, Orbit, Plus, Search, X } from 'lucide-react';
import { objects, getObject, type CelestialObject } from '@/data/catalog';
import { useUniverse } from '@/lib/store';
import Dialog from './Dialog';
export function number(value: number | undefined, suffix = '') { return value === undefined ? 'Not listed' : `${value > 1e10 || value < .001 ? value.toExponential(3) : value.toLocaleString('en-US', { maximumFractionDigits: 2 })}${suffix}`; }
const planetIds = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
export function SearchPanel({ onClose, saved = false }: { onClose: () => void; saved?: boolean }) {
  const [query, setQuery] = useState(''); const [category, setCategory] = useState('all');
  const bookmarks = useUniverse(s => s.bookmarks); const visit = useUniverse(s => s.visit);
  const results = useMemo(() => objects.filter(o => (!saved || bookmarks.includes(o.id)) && (category === 'all' || o.category === category) && `${o.name} ${o.id} ${o.aliases?.join(' ') ?? ''} ${o.classification}`.toLowerCase().includes(query.trim().toLowerCase())), [query, category, saved, bookmarks]);
  return <Dialog title={saved ? 'Your discoveries' : 'Find your next world'} onClose={onClose}>
    <label className="search-field"><Search size={19}/><input autoFocus placeholder="A name, a world, a catalog number…" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search celestial objects"/><kbd>ESC</kbd></label>
    <div className="filter-row" aria-label="Object categories">{['all', 'planet', 'moon', 'star', 'galaxy', 'region'].map(c => <button key={c} aria-pressed={category === c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c === 'all' ? 'All objects' : c === 'galaxy' ? 'Galaxies' : `${c}s`}</button>)}</div>
    <div className="search-results">{results.map(o => <button className="search-result" key={o.id} onClick={() => { visit(o.id, o.scale); onClose(); }}><span className={`object-swatch ${o.id}`} style={{ '--object-color': o.color } as React.CSSProperties}/><span><strong>{o.name}</strong><small>{o.classification}</small></span><span className="result-distance">{o.distanceAU ? `${number(o.distanceAU)} AU` : o.distanceLy ? `${number(o.distanceLy)} ly` : o.category}</span><ArrowUpRight size={16}/></button>)}{results.length === 0 && <p className="empty-state">{saved && !query ? 'Your log begins with a discovery. Open an object and select Save.' : 'No matches in this curated catalog. Try Earth, M31, or a category above.'}</p>}</div>
    <p className="panel-footnote">{objects.length} curated destinations · background populations are procedural.</p>
  </Dialog>;
}
export function ObjectPanel({ object, onCompare }: { object: CelestialObject; onCompare: () => void }) {
  const { bookmark, bookmarks, toggleCompare, compare, visit } = useUniverse();
  const [tab, setTab] = useState<'overview' | 'measurements'>('overview');
  const related = object.moons?.length ? object.moons.map(id => getObject(id)).filter((o): o is CelestialObject => !!o) : objects.filter(o => o.parent === object.id);
  const metrics: [string, string][] = [
    ['Mean radius', number(object.radiusKm, ' km')], ['Mass', number(object.massKg, ' kg')],
    [object.distanceAU !== undefined ? 'Mean distance from Sun' : 'Distance from Earth', object.distanceAU !== undefined ? number(object.distanceAU, ' AU') : number(object.distanceLy, ' ly')],
    ['Orbital period', number(object.orbitalDays, ' days')], ['Rotation period', number(object.rotationHours, ' hours')], ['Gravity', number(object.gravity, ' m/s²')],
  ];
  return <aside className="object-panel" aria-label={`${object.name} information`}>
    <div className="panel-topline"><span className="eyebrow">FIELD NOTES / {object.category.toUpperCase()}</span><button aria-label="Close object information" className="icon-button" onClick={() => useUniverse.setState({ info: false })}><X size={17}/></button></div>
    <h1>{object.name}</h1><p className="object-class">{object.classification}</p>
    <div className="object-actions"><button aria-pressed={bookmarks.includes(object.id)} onClick={() => bookmark(object.id)}><Bookmark size={15} fill={bookmarks.includes(object.id) ? 'currentColor' : 'none'}/>{bookmarks.includes(object.id) ? 'Saved' : 'Save'}</button><button onClick={() => { if (!compare.includes(object.id)) toggleCompare(object.id); onCompare(); }}><Plus size={15}/>Compare</button><button onClick={() => visit(object.id, object.scale)}><Orbit size={15}/>Focus</button></div>
    <div className="tabs"><button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Overview</button><button className={tab === 'measurements' ? 'active' : ''} onClick={() => setTab('measurements')}>Measurements</button></div>
    <div className="object-scroll">{tab === 'overview' ? <><p className="object-description">{object.description}</p><div className="key-metrics"><div><span>{object.radiusKm ? 'MEAN RADIUS' : 'DISTANCE'}</span><strong>{object.radiusKm ? number(object.radiusKm) : number(object.distanceLy)} <small>{object.radiusKm ? 'km' : 'ly'}</small></strong></div><div><span>{object.orbitalDays ? 'ORBITAL PERIOD' : 'CLASSIFICATION'}</span><strong>{object.orbitalDays ? number(object.orbitalDays) : object.category} <small>{object.orbitalDays ? 'days' : ''}</small></strong></div></div><ul className="facts">{object.facts.map(f => <li key={f}>{f}</li>)}</ul></> : <><dl className="measurements">{metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}{object.temperature && <div><dt>Temperature</dt><dd>{object.temperature}</dd></div>}{object.atmosphere && <div><dt>Atmosphere</dt><dd>{object.atmosphere}</dd></div>}</dl><p className="panel-footnote">Values are rounded reference measurements, not a live ephemeris. “Not listed” means this catalog does not supply a value.</p></>}
    {related.length > 0 && <div className="related"><span className="eyebrow">NEAR THIS WORLD</span>{related.map(o => <button key={o.id} onClick={() => { visit(o.id, o.scale); setTab('overview'); }}><span className="tiny-dot" style={{ background: o.color }}/>{o.name}<ChevronRight size={14}/></button>)}</div>}
    {object.parent && <button className="text-link" onClick={() => visit(object.parent!, getObject(object.parent!)?.scale ?? 0)}>Visit {getObject(object.parent)?.name ?? object.parent}<ArrowUpRight size={14}/></button>}
    {object.scale <= 4 && <button className="text-link" onClick={() => useUniverse.setState({ scale: 3, info: false })}>Return to the Solar System<ArrowUpRight size={14}/></button>}
    {object.scientificNote && <p className="science-note">{object.scientificNote}</p>}
    <div className="sources"><span className="eyebrow">EXPLORE THE SCIENCE</span>{object.sources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label}<ExternalLink size={12}/></a>)}</div></div>
  </aside>;
}
export function ComparePanel({ onClose }: { onClose: () => void }) {
  const { compare, toggleCompare } = useUniverse();
  const selected = compare.map(id => getObject(id)).filter((o): o is CelestialObject => !!o);
  return <Dialog title="A matter of perspective" onClose={onClose} wide>
    <p className="dialog-intro">Compare up to three destinations. Numerical values retain their physical units even when the scene uses compressed distances.</p>
    <div className="compare-picker">{objects.filter(o => planetIds.includes(o.id) || o.id === 'sun' || o.id === 'moon').map(o => <button className={compare.includes(o.id) ? 'active' : ''} onClick={() => toggleCompare(o.id)} key={o.id}>{compare.includes(o.id) ? <Check size={13}/> : <Plus size={13}/>} {o.name}</button>)}</div>
    {selected.length ? <><div className="size-comparison">{selected.map(o => <div key={o.id}><div className="comparison-sphere" style={{ background: `radial-gradient(circle at 30% 30%, ${o.color}, #05080e 85%)`, width: `${Math.max(8, ((o.radiusKm ?? 1) / Math.max(...selected.map(p => p.radiusKm ?? 1))) * 130)}px` }}/><strong>{o.name}</strong></div>)}</div><p className="panel-footnote">Circle diameters use a linear radius scale; tiny bodies have an 8 px visibility minimum.</p><div className="table-scroll"><table><thead><tr><th>Measurement</th>{selected.map(o => <th key={o.id}>{o.name}<button aria-label={`Remove ${o.name}`} onClick={() => toggleCompare(o.id)}><X size={12}/></button></th>)}</tr></thead><tbody>{[['Mean radius (km)', 'radiusKm'], ['Mass (kg)', 'massKg'], ['Distance from Sun (AU)', 'distanceAU'], ['Distance from Earth (ly)', 'distanceLy'], ['Orbital period (days)', 'orbitalDays'], ['Rotation (hours)', 'rotationHours'], ['Gravity (m/s²)', 'gravity']].map(([label, key]) => <tr key={key}><th>{label}</th>{selected.map(o => <td key={o.id}>{number(o[key as keyof CelestialObject] as number | undefined)}</td>)}</tr>)}</tbody></table></div></> : <p className="empty-state">Select a destination above to begin your comparison.</p>}
  </Dialog>;
}
export function SettingsPanel({ onClose, fps, reducedMotion }: { onClose: () => void; fps: number; reducedMotion: boolean }) {
  const { quality, rotate, labels, scientific } = useUniverse();
  return <Dialog title="Tune your observatory" onClose={onClose}>
    <div className="setting-row"><span><strong>Rendering quality</strong><small>Auto adapts to your screen and frame rate.</small></span><select aria-label="Rendering quality" value={quality} onChange={e => useUniverse.setState({ quality: e.target.value as 'auto' | 'high' | 'low' })}><option value="auto">Adaptive</option><option value="high">High</option><option value="low">Low power</option></select></div>
    {[['Planet rotation', 'Let worlds turn slowly.', 'rotate', rotate], ['Object labels', 'Identify nearby destinations.', 'labels', labels], ['Scientific scale', 'Show physical spans and scale explanations.', 'scientific', scientific]].map(([label, hint, key, value]) => <label className="setting-row" key={String(key)}><span><strong>{label}</strong><small>{hint}</small></span><input type="checkbox" checked={Boolean(value)} onChange={e => useUniverse.setState({ [String(key)]: e.target.checked })}/></label>)}
    <div className="performance-readout"><span className="live-dot"/> {fps > 0 ? `${Math.round(fps)} FPS · ${Math.round(1000 / fps)} ms per frame` : 'Measuring renderer…'}<small>Current device, current scene</small></div>
    <p className="science-note">Reduced motion: {reducedMotion ? 'enabled by your system. Automatic rotation and animated travel are reduced.' : 'follows your operating system preference.'} Bookmarks and these settings are saved only in this browser.</p>
    <div className="keyboard-guide"><span className="eyebrow">FLIGHT CONTROLS</span><p><kbd>+ / −</kbd> Zoom in / out <kbd>H</kbd> Return to Earth</p><p><kbd>/</kbd> Search <kbd>I</kbd> Hide interface <kbd>Esc</kbd> Close / exit</p><p>Drag to orbit · Pinch or wheel to change scale</p></div>
  </Dialog>;
}
