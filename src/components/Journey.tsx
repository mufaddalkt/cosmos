'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useUniverse } from '@/lib/store';
gsap.registerPlugin(ScrollTrigger);
export default function Journey({ reducedMotion }: { reducedMotion: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const proxy = { scale: useUniverse.getState().scale };
    window.scrollTo(0, 0);
    const context = gsap.context(() => {
      gsap.fromTo(proxy, { scale: 0 }, { scale: 11, ease: 'none', onUpdate: () => useUniverse.getState().setScale(proxy.scale), scrollTrigger: { trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: reducedMotion ? true : .65 } });
    }, track);
    return () => { context.revert(); window.scrollTo(0, 0); };
  }, [reducedMotion]);
  return <div ref={track} className="journey-track" aria-label="Scroll to travel from Earth to the observable universe"><span className="sr-only">From One World to Everything. Scroll down to travel outward or use the scale controls.</span></div>;
}
