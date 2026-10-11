'use client';
import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { opacityOf } from './materials';
import type { Runtime } from './Particles';

export function stageOpacity(scale:number,start:number,end:number,fade=.7) {
  return Math.min(start===0?1:THREE.MathUtils.smoothstep(scale,start,start+fade),end===12?1:1-THREE.MathUtils.smoothstep(scale,end-fade,end));
}
export function Stage({runtime,start,end,children,zoom=false}:{runtime:Runtime;start:number;end:number;children:ReactNode;zoom?:boolean}) {
  const group=useRef<THREE.Group>(null);
  useFrame(()=>{
    if(!group.current)return;
    const opacity=stageOpacity(runtime.scale,start,end);
    group.current.visible=opacity>.005;
    opacityOf(group.current,opacity);
    if(zoom)group.current.scale.setScalar(Math.pow(.72,runtime.scale-(start+end)/2));
  });
  return <group ref={group}>{children}</group>;
}
