import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'COSMOS — Beyond the Observable', description: 'The universe is not a place you visit. It is a scale you discover. An interactive three-dimensional observatory, from Earth to the cosmic horizon.' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#030508' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
