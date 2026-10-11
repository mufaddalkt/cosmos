'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clampScale } from './scales';
export type Mode = 'explore' | 'journey' | 'time' | 'beyond';
type State = {
  scale: number; selectedId: string; mode: Mode; time: number; navigationRevision: number;
  quality: 'auto' | 'high' | 'low'; rotate: boolean; labels: boolean; scientific: boolean;
  bookmarks: string[]; compare: string[]; hidden: boolean; info: boolean;
  setScale: (value: number) => void; setMode: (mode: Mode) => void;
  visit: (id: string, scale?: number) => void; home: () => void;
  bookmark: (id: string) => void; toggleCompare: (id: string) => void;
};
export const useUniverse = create<State>()(persist((set) => ({
  scale: 0, selectedId: 'earth', mode: 'explore', time: 0, quality: 'auto', rotate: true, labels: true, scientific: false,
  bookmarks: [], compare: [], hidden: false, info: false, navigationRevision: 0,
  setScale: value => set({ scale: clampScale(value) }),
  setMode: mode => set({ mode, ...(mode === 'time' || mode === 'beyond' ? { scale: 11 } : {}), hidden: false }),
  visit: (id, scale = 0) => set(state => ({ selectedId: id, scale: clampScale(scale), mode: 'explore', info: true, navigationRevision: state.navigationRevision + 1 })),
  home: () => set(state => ({ selectedId: 'earth', scale: 0, mode: 'explore', info: false, hidden: false, navigationRevision: state.navigationRevision + 1 })),
  bookmark: id => set(state => ({ bookmarks: state.bookmarks.includes(id) ? state.bookmarks.filter(x => x !== id) : [...state.bookmarks, id] })),
  toggleCompare: id => set(state => ({ compare: state.compare.includes(id) ? state.compare.filter(x => x !== id) : [...state.compare.slice(-2), id] })),
}), { name: 'cosmos-observatory-v1', partialize: s => ({ quality: s.quality, rotate: s.rotate, labels: s.labels, scientific: s.scientific, bookmarks: s.bookmarks }) }));
