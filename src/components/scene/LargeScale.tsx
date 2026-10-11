'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleCloud, particleData, type Runtime } from './Particles';
import { Stage } from './Stage';
import { opacityOf } from './materials';
import { ScreenLabel } from './Labels';
import { Planet } from './Planets';

interface Props {runtime:Runtime;scale:number;low:boolean;labels:boolean;mode:string;time:number;selectedId:string;onSelect:(id:string)=>void;onFocus:(id:string)=>void}

export function SpaceLabel({name,position,onClick,accent=false}:{name:string;position:[number,number,number];onClick?:()=>void;accent?:boolean}) {
  return <ScreenLabel name={name} position={position} onClick={onClick} accent={accent}/>;
}

function Galaxy({count=10000,seed=73,radius=4,elliptical=false}:{count?:number;seed?:number;radius?:number;elliptical?:boolean}) {
  const data=useMemo(()=>particleData(count,seed,(i,random)=>{
    const core=i<count*.2;
    const r=core?Math.pow(random(),1.8)*radius*.28:Math.pow(random(),.64)*radius;
    const arm=i%4;
    const theta=arm*Math.PI*.5+r*1.8+(random()-.5)*(core?7:.7);
    const scatter=(random()-.5)*radius*.06;
    const height=(random()-.5)*(core?.75:.14)*(1-r/radius*.7);
    const blue=Math.max(0,r/radius);
    const color=core?[1,.81,.49]:[.45+blue*.23,.56+blue*.25,.73+blue*.26];
    return {p:elliptical?[Math.cos(theta)*r,height*3+scatter,Math.sin(theta)*r*.65]:[Math.cos(theta)*r+scatter,height,Math.sin(theta)*r+scatter],c:color,s:core?.5+random()*.7:.35+random()*1.2};
  }),[count,seed,radius,elliptical]);
  return <ParticleCloud data={data} size={.65}/>;
}

function Nebula({seed=31,position=[0,0,0]}:{seed?:number;position?:[number,number,number]}) {
  const data=useMemo(()=>particleData(600,seed,(_,random)=>{
    const theta=random()*Math.PI*2,r=Math.pow(random(),.6)*1.2;
    return {p:[Math.cos(theta)*r,(random()-.5)*.7,Math.sin(theta)*r*.5],c:random()>.5?[.29,.36,.67]:[.51,.27,.37],s:5+random()*7};
  }),[seed]);
  return <group position={position}><ParticleCloud data={data} opacity={.065} size={1.5}/></group>;
}

const nearby=[
  {id:'sun',name:'Our Sun',p:[0,0,0],c:'#f6d59a',r:.055},
  {id:'proxima-centauri',name:'Proxima Centauri',p:[-1.6,-.3,.6],c:'#de714c',r:.045},
  {id:'sirius',name:'Sirius',p:[2.0,.5,-.3],c:'#c3e6ff',r:.11},
  {id:'trappist-1',name:'TRAPPIST-1',p:[-2.7,1.4,-1.5],c:'#cc5542',r:.055},
] as const;

function Nearby({labels,onSelect}:Pick<Props,'labels'|'onSelect'>) {
  const data=useMemo(()=>particleData(900,25,(_,random)=>({p:[(random()-.5)*16,(random()-.5)*10,(random()-.5)*14],c:random()>.5?[.7,.8,1]:[1,.71,.44],s:.4+random()*1.6})),[]);
  return <>
    <ParticleCloud data={data} size={.85}/>
    <Nebula position={[3,-1,-4]}/>
    {nearby.map(star=><group key={star.id} position={[...star.p]}>
      <mesh onClick={event=>{event.stopPropagation();onSelect(star.id);}}><sphereGeometry args={[star.r,24,16]}/><meshBasicMaterial color={star.c} transparent/></mesh>
      <mesh><sphereGeometry args={[star.r*2.6,24,16]}/><meshBasicMaterial color={star.c} transparent opacity={.08} userData={{baseOpacity:.08}} depthWrite={false}/></mesh>
      {labels&&<SpaceLabel name={star.name} position={[0,-.22,0]} onClick={()=>onSelect(star.id)} accent={star.id==='sun'}/>}
    </group>)}
  </>;
}

function MilkyWay({runtime,low,labels,onSelect}:Pick<Props,'runtime'|'low'|'labels'|'onSelect'>) {
  const group=useRef<THREE.Group>(null);
  useFrame(()=>{if(group.current&&!runtime.reducedMotion&&runtime.rotate)group.current.rotation.y=runtime.elapsed*.014;});
  return <group rotation={[.43,0,-.16]}><group ref={group}>
    <Galaxy count={low?5500:18000}/>
    <Nebula position={[-1.7,0,1.4]}/><Nebula position={[2.3,0,-1]} seed={27}/>
    <mesh position={[2.08,.08,1.05]}><sphereGeometry args={[.025,12,12]}/><meshBasicMaterial color="#f5d695" transparent/></mesh>
    <mesh position={[2.08,.08,1.05]} rotation={[Math.PI/2,0,0]}><ringGeometry args={[.07,.078,32]}/><meshBasicMaterial color="#f5d695" side={THREE.DoubleSide} transparent/></mesh>
    {labels&&<>
      <SpaceLabel name="You are here" position={[2.08,.25,1.05]} onClick={()=>onSelect('earth')} accent/>
      <SpaceLabel name="Sagittarius A*" position={[0,.22,0]} onClick={()=>onSelect('sagittarius-a')}/>
    </>}
    <mesh visible={false} onClick={event=>{event.stopPropagation();onSelect('milky-way');}}><sphereGeometry args={[4,16,16]}/><meshBasicMaterial/></mesh>
  </group></group>;
}

function LocalGroup({low,labels,onSelect}:Pick<Props,'low'|'labels'|'onSelect'>) {
  return <>
    <group position={[-2.05,.05,.3]} rotation={[.4,.8,.28]} scale={.4}><Galaxy count={low?2600:6500}/></group>
    <group position={[1.65,.5,-.7]} rotation={[.7,-.6,-.3]} scale={.58}><Galaxy count={low?3200:8000} seed={128}/></group>
    <group position={[2.6,-1,1.2]} rotation={[.35,.2,-.55]} scale={.18}><Galaxy count={1500} seed={200}/></group>
    <group position={[-2.8,-.7,.9]} scale={.1}><Galaxy count={500} seed={20} elliptical/></group>
    {labels&&<>
      <SpaceLabel name="Milky Way" position={[-2.05,-.45,1]} onClick={()=>onSelect('milky-way')} accent/>
      <SpaceLabel name="Andromeda · M31" position={[1.7,-.3,1]} onClick={()=>onSelect('andromeda')}/>
      <SpaceLabel name="Triangulum · M33" position={[2.6,-1.25,1.2]} onClick={()=>onSelect('triangulum')}/>
    </>}
  </>;
}

function GalaxyCluster({low}:{low:boolean}) {
  const data=useMemo(()=>particleData(low?1400:4000,823,(_,random)=>{
    const theta=random()*Math.PI*2,phi=Math.acos(random()*2-1),r=Math.pow(random(),1.3)*4.5;
    return {p:[r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi)*.55,r*Math.sin(phi)*Math.sin(theta)],c:[.71+random()*.29,.65+random()*.25,.49+random()*.48],s:.65+random()*2.3};
  }),[low]);
  return <><ParticleCloud data={data} size={.6}/><group scale={.18} rotation={[.4,0,.2]}><Galaxy count={2200} elliptical/></group></>;
}

function OpenCluster({low,labels}:{low:boolean;labels:boolean}) {
  const data=useMemo(()=>particleData(low?450:1200,45,(_,random)=>{
    const theta=random()*Math.PI*2,r=Math.pow(random(),1.5)*3.2;
    return {p:[Math.cos(theta)*r,(random()-.5)*r,Math.sin(theta)*r],c:[.57,.75,1],s:.5+random()*2};
  }),[low]);
  return <><ParticleCloud data={data} size={1.1}/><Nebula position={[.3,.1,0]}/>{labels&&<SpaceLabel name="Pleiades · procedural cluster" position={[0,-2.1,0]}/>}</>;
}

function CosmicWeb({low,time}:{low:boolean;time:number}) {
  const data=useMemo(()=>{
    const nodes:THREE.Vector3[]=[];
    for(let x=-2;x<=2;x++)for(let y=-1;y<=1;y++)for(let z=-2;z<=2;z++)nodes.push(new THREE.Vector3(x*2+Math.sin(y*9+z)*.8,y*2+Math.cos(x*7-z)*.6,z*2+Math.sin(x*3+y)*.8));
    return particleData(low?5000:14500,914,(i,random)=>{
      const a=nodes[i%nodes.length];
      const near=nodes.filter(b=>a.distanceTo(b)<3.7&&a!==b);
      const b=near[Math.floor(random()*near.length)]??a;
      const t=random(), spread=.025+Math.sin(t*Math.PI)*.12;
      const p=a.clone().lerp(b,t).add(new THREE.Vector3((random()-.5)*spread,(random()-.5)*spread,(random()-.5)*spread));
      return {p:[p.x,p.y,p.z],c:t<.1||t>.9?[.92,.76,.52]:[.32,.45,.69],s:.4+random()*.9};
    });
  },[low]);
  return <group rotation={[.2,-.4,.12]} scale={1-time*.22}><ParticleCloud data={data} size={.57} heat={Math.max(0,(time-.7)*3)}/></group>;
}

function ObservableSphere({low,time}:{low:boolean;time:number}) {
  const data=useMemo(()=>particleData(low?3200:9500,743,(_,random)=>{
    const theta=random()*Math.PI*2,c=random()*2-1,s=Math.sqrt(1-c*c),r=2.9*(.7+random()*.3);
    const warm=random()>.5;
    return {p:[r*s*Math.cos(theta),r*c,r*s*Math.sin(theta)],c:warm?[.64,.26,.08]:[.15,.31,.42],s:.3+random()*.9};
  }),[low]);
  return <>
    <ParticleCloud data={data} size={.8} heat={time}/>
    <mesh><sphereGeometry args={[2.98,64,40]}/><meshBasicMaterial color="#965b2b" wireframe transparent opacity={.025} userData={{baseOpacity:.025}} depthWrite={false}/></mesh>
    <mesh><sphereGeometry args={[2.94,64,40]}/><meshBasicMaterial color="#bc702d" side={THREE.BackSide} transparent opacity={.055} userData={{baseOpacity:.055}} depthWrite={false}/></mesh>
  </>;
}

function Beyond({low,labels}:{low:boolean;labels:boolean}) {
  return <>
    {[[-2,.45,0],[1.4,-.2,-1],[0,1.9,-3],[3,1.5,-2],[-3,-1.7,-1]].map((p,i)=><group key={i} position={p as [number,number,number]} scale={i===0?.62:.35}>
      <ObservableSphere low={low} time={i*.12}/>
      <mesh><sphereGeometry args={[3,48,32]}/><meshBasicMaterial color={i%2?'#577b9c':'#d19857'} wireframe transparent opacity={.025} userData={{baseOpacity:.025}}/></mesh>
    </group>)}
    {labels&&<SpaceLabel name="A speculative landscape" position={[0,-2.2,1]}/>}
  </>;
}

function BlackHole({runtime,labels}:{runtime:Runtime;labels:boolean}) {
  const material=useRef<THREE.ShaderMaterial>(null);
  const uniforms=useMemo(()=>({uTime:{value:0},uOpacity:{value:1}}),[]);
  useFrame(()=>{if(material.current)material.current.uniforms.uTime.value=runtime.elapsed;});
  return <group rotation={[.36,0,-.15]} scale={.87}>
    <mesh><sphereGeometry args={[.84,64,48]}/><meshBasicMaterial color="#000103"/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]}>
      <ringGeometry args={[1.13,3.3,160,32]}/>
      <shaderMaterial ref={material} uniforms={uniforms} transparent side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending}
        vertexShader={`varying vec3 vPosition; void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
        fragmentShader={`varying vec3 vPosition;uniform float uTime;uniform float uOpacity;void main(){float r=length(vPosition.xy);float a=atan(vPosition.y,vPosition.x);float ripples=.72+.17*sin(r*67.-a*3.+uTime*.7)+.08*sin(r*131.+a*7.);float fade=(1.0-smoothstep(1.25,3.3,r));float doppler=.65+.35*cos(a);vec3 c=mix(vec3(.72,.14,.025),vec3(1.5,1.13,.62),pow(fade,.7));gl_FragColor=vec4(c* doppler,ripples*fade*.85*uOpacity);}`}/>
    </mesh>
    <mesh rotation={[0,0,.04]}><torusGeometry args={[.96,.033,12,144]}/><meshBasicMaterial color="#ffd59a" transparent opacity={.9}/></mesh>
    <mesh rotation={[0,0,.04]}><torusGeometry args={[1.06,.018,8,144]}/><meshBasicMaterial color="#cb9958" transparent opacity={.35}/></mesh>
    <mesh rotation={[.03,0,0]}><torusGeometry args={[1.58,.09,12,144,Math.PI]}/><meshBasicMaterial color="#e7a958" transparent opacity={.22} depthWrite={false}/></mesh>
    {labels&&<SpaceLabel name="Sagittarius A* · artistic approximation" position={[0,-1.9,0]}/>}
  </group>;
}

function CosmicHistory({time,low}:{time:number;low:boolean}) {
  const structure=useRef<THREE.Group>(null),stars=useRef<THREE.Group>(null),radiation=useRef<THREE.Group>(null);
  const firstStars=useMemo(()=>particleData(low?350:900,911,(_,random)=>({p:[(random()-.5)*11,(random()-.5)*7,(random()-.5)*9],c:[.58+random()*.4,.73+random()*.25,1],s:.5+random()*1.4})),[low]);
  useFrame(()=>{
    if(structure.current){const opacity=1-THREE.MathUtils.smoothstep(time,.08,.42);structure.current.visible=opacity>.005;opacityOf(structure.current,opacity);}
    if(stars.current){const opacity=THREE.MathUtils.smoothstep(time,.18,.38)*(1-THREE.MathUtils.smoothstep(time,.48,.64));stars.current.visible=opacity>.005;opacityOf(stars.current,opacity);}
    if(radiation.current){const opacity=THREE.MathUtils.smoothstep(time,.67,.78);radiation.current.visible=opacity>.005;opacityOf(radiation.current,opacity);radiation.current.scale.setScalar(1+Math.max(0,time-.83)*6);}
  });
  return <>
    <group ref={structure}><CosmicWeb low={low} time={time}/></group>
    <group ref={stars}><ParticleCloud data={firstStars} size={1.2}/><Nebula position={[1,0,-2]}/></group>
    <group ref={radiation}><ObservableSphere low={low} time={Math.max(0,(time-.75)*4)}/></group>
  </>;
}

export default function LargeScale(props:Props) {
  const {runtime,scale,low,labels,mode,time,onSelect,selectedId}=props;
  if(mode==='beyond')return <Beyond low={low} labels={labels}/>;
  if(mode==='time')return <CosmicHistory time={time} low={low}/>;
  if(['proxima-centauri','sirius','trappist-1'].includes(selectedId)&&scale>5.5&&scale<6.5)return <>
    <Planet key={selectedId} id={selectedId} radius={1.35} runtime={runtime} onSelect={onSelect}/>
    {labels&&<SpaceLabel name={nearby.find(s=>s.id===selectedId)?.name??selectedId} position={[0,-1.7,0]}/>}
    {selectedId==='trappist-1'&&<><Planet id="trappist-1e" radius={.1} position={[2.7,0,.2]} runtime={runtime} onSelect={onSelect}/>{labels&&<SpaceLabel name="TRAPPIST-1 e · reconstructed" position={[2.7,-.3,.2]} onClick={()=>onSelect('trappist-1e')}/>}</>}
  </>;
  if(['andromeda','triangulum'].includes(selectedId)&&scale>7.5&&scale<8.5)return <group rotation={[.7,-.6,-.3]}><Galaxy count={low?5500:16000} seed={selectedId==='andromeda'?128:200} radius={selectedId==='andromeda'?3.8:2.8}/>{labels&&<SpaceLabel name={selectedId==='andromeda'?'Andromeda · M31':'Triangulum · M33'} position={[0,-1,2]}/>}</group>;
  if(selectedId==='pleiades'&&scale>5&&scale<7)return <OpenCluster low={low} labels={labels}/>;
  if(selectedId==='sagittarius-a'&&scale>6&&scale<8)return <BlackHole runtime={runtime} labels={labels}/>;
  if(selectedId==='orion-nebula'&&scale>5&&scale<7)return <group scale={2.5}><Nebula/><Nebula position={[-.5,.2,-.5]} seed={481}/><Nearby labels={false} onSelect={onSelect}/></group>;
  return <>
    {scale>4.8&&scale<7.1&&<Stage runtime={runtime} start={4.9} end={7.15} zoom><Nearby labels={labels&&scale<6.7} onSelect={onSelect}/></Stage>}
    {scale>5.9&&scale<8.1&&<Stage runtime={runtime} start={6.0} end={8.15} zoom><MilkyWay runtime={runtime} low={low} labels={labels&&scale>6.6&&scale<7.6} onSelect={onSelect}/></Stage>}
    {scale>7&&scale<9.2&&<Stage runtime={runtime} start={7.1} end={9.2} zoom><LocalGroup low={low} labels={labels&&scale>7.65&&scale<8.7} onSelect={onSelect}/></Stage>}
    {scale>8.1&&scale<10.1&&<Stage runtime={runtime} start={8.2} end={10.15} zoom><GalaxyCluster low={low}/></Stage>}
    {scale>9&&scale<11.2&&<Stage runtime={runtime} start={9.1} end={11.2} zoom><CosmicWeb low={low} time={mode==='time'?time:0}/></Stage>}
    {scale>10.1&&<Stage runtime={runtime} start={10.2} end={12}><ObservableSphere low={low} time={mode==='time'?time:0}/></Stage>}
  </>;
}

