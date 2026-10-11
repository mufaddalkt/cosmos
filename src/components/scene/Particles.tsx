'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { pointFragment, pointVertex, seededRandom } from './materials';

export interface Runtime { scale: number; time: number; elapsed: number; reducedMotion: boolean; rotate: boolean }
export interface ParticleData { positions: Float32Array; colors: Float32Array; sizes: Float32Array }

export function ParticleCloud({ data, size=1, opacity=1, heat=0 }: { data: ParticleData; size?:number;opacity?:number;heat?:number }) {
  const { gl }=useThree();
  const geometry=useMemo(()=>{
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(data.positions,3));
    geometry.setAttribute('aColor',new THREE.BufferAttribute(data.colors,3));
    geometry.setAttribute('aSize',new THREE.BufferAttribute(data.sizes,1));
    return geometry;
  },[data]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  const uniforms=useMemo(()=>({uSize:{value:size},uPixelRatio:{value:gl.getPixelRatio()},uOpacity:{value:opacity},uHeat:{value:heat}}),[gl,size,opacity,heat]);
  return <points geometry={geometry} frustumCulled={false}><shaderMaterial uniforms={uniforms} vertexShader={pointVertex} fragmentShader={pointFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} userData={{baseOpacity:opacity}} /></points>;
}

export function particleData(count:number, seed:number, create:(i:number,random:()=>number)=>{p:number[];c:number[];s?:number}):ParticleData {
  const positions=new Float32Array(count*3),colors=new Float32Array(count*3),sizes=new Float32Array(count), random=seededRandom(seed);
  for(let i=0;i<count;i++) { const {p,c,s=1}=create(i,random);positions.set(p,i*3);colors.set(c,i*3);sizes[i]=s; }
  return {positions,colors,sizes};
}

export function Starfield({ low, runtime, hidden=false }:{low:boolean;runtime:Runtime;hidden?:boolean}) {
  const group=useRef<THREE.Group>(null);
  const data=useMemo(()=>particleData(low?1100:2600,29,(_,random)=>{
    const theta=random()*Math.PI*2, cosPhi=random()*2-1, sinPhi=Math.sqrt(1-cosPhi*cosPhi),radius=50+random()*65;
    const warm=random()>.83,bright=random();
    return {p:[Math.cos(theta)*sinPhi*radius,cosPhi*radius,Math.sin(theta)*sinPhi*radius],c:warm?[.93,.76,.55]:[.63+random()*.3,.77+random()*.18,1],s:bright>.99?3.7:bright>.9?1.4:.4+random()*.5};
  }),[low]);
  useFrame(()=>{if(group.current)group.current.rotation.y=runtime.reducedMotion?0:runtime.elapsed*.0012;});
  return <group ref={group} visible={!hidden}><ParticleCloud data={data} size={3.5} opacity={.64}/></group>;
}

export function DustBelt({ inner, outer, count, seed=22, thickness=.06, spherical=false }:{inner:number;outer:number;count:number;seed?:number;thickness?:number;spherical?:boolean}) {
  const data=useMemo(()=>particleData(count,seed,(_,random)=>{
    const angle=random()*Math.PI*2,r=inner+(outer-inner)*random(),y=(random()-.5)*thickness;
    if(spherical) {const c=random()*2-1,s=Math.sqrt(1-c*c);return {p:[r*s*Math.cos(angle),r*c,r*s*Math.sin(angle)],c:[.42,.59,.69],s:.35+random()*.6};}
    return {p:[Math.cos(angle)*r,y,Math.sin(angle)*r],c:[.39+random()*.2,.43+random()*.19,.48+random()*.2],s:.45+random()*.65};
  }),[inner,outer,count,seed,thickness,spherical]);
  return <ParticleCloud data={data} size={.65} opacity={.6}/>;
}
