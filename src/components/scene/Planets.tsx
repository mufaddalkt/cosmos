'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { atmosphereFragment, earthFragment, fallbackTexture, planetVertex, sunFragment } from './materials';
import { ParticleCloud, particleData, type Runtime } from './Particles';

const textureCache=new Map<string,THREE.Texture>();
function usePlanetTexture(id:string) {
  const [texture,setTexture]=useState<THREE.Texture>(()=>textureCache.get(id)??fallbackTexture(id));
  useEffect(()=>{
    let active=true;
    const cached=textureCache.get(id);
    if(cached) {setTexture(cached);return;}
    setTexture(fallbackTexture(id));
    const available=['earth','earth-night','earth-clouds','jupiter','moon'];
    if(!available.includes(id))return;
    const name=id==='earth'?'earth-day':id;
    new THREE.TextureLoader().load(`/textures/${name}.jpg`,loaded=>{
      loaded.colorSpace=THREE.SRGBColorSpace;loaded.anisotropy=4;loaded.wrapS=THREE.RepeatWrapping;
      textureCache.set(id,loaded);if(active)setTexture(loaded);
    },undefined,()=>{/* The deterministic local texture remains available offline. */});
    return ()=>{active=false;};
  },[id]);
  return texture;
}

const light=new THREE.Vector3(-3.4,2.3,3.3).normalize();

function Atmosphere({ color='#509be0',radius=1.022 }:{color?:string;radius?:number}) {
  const uniforms=useMemo(()=>({uLight:{value:light},uColor:{value:new THREE.Color(color)},uOpacity:{value:1}}),[color]);
  return <mesh scale={radius}><sphereGeometry args={[1,64,40]}/><shaderMaterial vertexShader={planetVertex} fragmentShader={atmosphereFragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide}/></mesh>;
}

function EarthSurface({runtime}:{runtime:Runtime}) {
  const day=usePlanetTexture('earth'),night=usePlanetTexture('earth-night'),clouds=usePlanetTexture('earth-clouds');
  const cloud=useRef<THREE.Mesh>(null);
  const uniforms=useMemo(()=>({uDay:{value:day},uNight:{value:night},uLight:{value:light},uOpacity:{value:1}}),[day,night]);
  useFrame(()=>{if(cloud.current&&!runtime.reducedMotion)cloud.current.rotation.y=runtime.elapsed*.012;});
  return <>
    <mesh><sphereGeometry args={[1,96,64]}/><shaderMaterial vertexShader={planetVertex} fragmentShader={earthFragment} uniforms={uniforms} transparent /></mesh>
    <mesh ref={cloud} scale={1.007}><sphereGeometry args={[1,64,48]}/><meshStandardMaterial map={clouds} alphaMap={clouds} transparent opacity={.62} userData={{baseOpacity:.62}} depthWrite={false} roughness={1}/></mesh>
    <Atmosphere/>
  </>;
}

function SunSurface({runtime,tint='#ffffff'}:{runtime:Runtime;tint?:string}) {
  const material=useRef<THREE.ShaderMaterial>(null);
  const uniforms=useMemo(()=>({uTime:{value:0},uOpacity:{value:1},uTint:{value:new THREE.Color(tint)}}),[tint]);
  useFrame(()=>{if(material.current)material.current.uniforms.uTime.value=runtime.reducedMotion?0:runtime.elapsed;});
  return <>
    <mesh><sphereGeometry args={[1,64,48]}/><shaderMaterial ref={material} vertexShader={planetVertex} fragmentShader={sunFragment} uniforms={uniforms} transparent/></mesh>
    <Atmosphere color={tint==='#ffffff'?'#f5a536':tint} radius={1.16}/>
    <Atmosphere color={tint==='#ffffff'?'#c7631e':tint} radius={1.32}/>
    <pointLight color="#fff0cc" intensity={14} distance={28} decay={1.2}/>
  </>;
}

const moonColors:Record<string,string>={io:'#d4b16b',europa:'#c0b49b',ganymede:'#8c8172',callisto:'#58534d',titan:'#ce9141',enceladus:'#c9dce4',triton:'#a7a9a9',pluto:'#b49b83',ceres:'#8e918e',eris:'#aab5b7',haumea:'#b0babd',makemake:'#a07961',phobos:'#716052',deimos:'#746559','trappist-1e':'#a87d65'};

function MappedSurface({id}:{id:string}) {
  const texture=usePlanetTexture(id);
  return <>
    <mesh castShadow={id==='saturn'}><sphereGeometry args={[1,72,48]}/><meshStandardMaterial map={texture} color={moonColors[id]??'#ffffff'} roughness={1} metalness={0} transparent/></mesh>
    {['venus','uranus','neptune','titan'].includes(id)&&<Atmosphere color={id==='venus'||id==='titan'?'#dba351':'#4f95e9'}/>}
  </>;
}

function SaturnRings() {
  const texture=useMemo(()=>{
    const data=new Uint8Array(256*4);
    for(let i=0;i<256;i++){
      const t=i/256;
      const gap=t>.57&&t<.62;
      const stripe=.52+.28*Math.sin(i*2.17)+.11*Math.sin(i*.41);
      data[i*4]=185+stripe*35;data[i*4+1]=163+stripe*32;data[i*4+2]=126+stripe*24;data[i*4+3]=gap?12:stripe*200;
    }
    const tex=new THREE.DataTexture(data,256,1);tex.needsUpdate=true;tex.colorSpace=THREE.SRGBColorSpace;return tex;
  },[]);
  const geometry=useMemo(()=>{
    const geo=new THREE.RingGeometry(1.25,2.22,160,1);
    const position=geo.attributes.position,uv=geo.attributes.uv;
    for(let i=0;i<position.count;i++)uv.setXY(i,(Math.hypot(position.getX(i),position.getY(i))-1.25)/.97,0);
    return geo;
  },[]);
  useEffect(()=>()=>{geometry.dispose();texture.dispose();},[geometry,texture]);
  return <mesh receiveShadow geometry={geometry} rotation={[-Math.PI/2,0,0]}><meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} roughness={1} depthWrite={false}/></mesh>;
}

function SmallBody({id}:{id:string}) {
  const texture=usePlanetTexture(id);
  const tail=useMemo(()=>particleData(450,61,(_,random)=>{
    const length=random()*4,spread=.06+length*.12;
    return {p:[length,(random()-.5)*spread,(random()-.5)*spread],c:[.46,.66,.8],s:.8+random()*2};
  }),[]);
  return <>
    <mesh scale={id==='halley'?[1,.48,.5]:[1,.9,.82]}><icosahedronGeometry args={[1,3]}/><meshStandardMaterial map={texture} color={id==='halley'?'#574e43':'#a99c83'} roughness={1} transparent/></mesh>
    {id==='halley'&&<group position={[.7,0,0]}><ParticleCloud data={tail} size={1.2} opacity={.18}/></group>}
  </>;
}

export function Planet({id,radius=1,runtime,onSelect,onFocus,position=[0,0,0]}:{id:string;radius?:number;runtime:Runtime;onSelect?:(id:string)=>void;onFocus?:(id:string)=>void;position?:[number,number,number]}) {
  const stellarTint:Record<string,string>={'proxima-centauri':'#eb714b',sirius:'#bde6ff','trappist-1':'#e36e48'};
  const body=useRef<THREE.Group>(null);
  useFrame((_,dt)=>{
    if(body.current&&runtime.rotate&&!runtime.reducedMotion)body.current.rotation.y+=Math.min(dt,.04)*.035*(id==='venus'?-1:1);
  });
  return <group position={position} scale={radius} rotation={[id==='uranus'?1.71:0,0,id==='earth'?.15:id==='saturn'?.42:0]}
    onClick={event=>{if(event.delta>6)return;event.stopPropagation();onSelect?.(id);}}
    onDoubleClick={event=>{event.stopPropagation();onFocus?.(id);}}
    onPointerOver={event=>{event.stopPropagation();document.body.style.cursor='pointer';}}
    onPointerOut={()=>{document.body.style.cursor='';}}>
    <group ref={body} rotation={[0,id==='earth'?3.1:.35,0]}>
      {id==='earth'?<EarthSurface runtime={runtime}/>:id==='sun'||stellarTint[id]?<SunSurface runtime={runtime} tint={stellarTint[id]}/>:['vesta','halley'].includes(id)?<SmallBody key={id} id={id}/>:<MappedSurface key={id} id={id}/>}
    </group>
    {id==='saturn'&&<SaturnRings/>}
    {id==='uranus'&&<mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.6,1.64,96]}/><meshBasicMaterial color="#717d82" transparent opacity={.4} userData={{baseOpacity:.4}} side={THREE.DoubleSide}/></mesh>}
  </group>;
}
