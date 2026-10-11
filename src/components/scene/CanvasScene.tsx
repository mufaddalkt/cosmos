'use client';

import { Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Planet } from './Planets';
import { PLANETS, SOLAR_HANDOFF, localCameraTarget, localTransform, solarBody, solarBodyVisible, solarScale } from './solar-layout';
import { DustBelt, Starfield, type Runtime } from './Particles';
import { Stage } from './Stage';
import { LabelContext, LabelOverlay, ScreenLabel, type LabelEntry, type LabelRegistry } from './Labels';

const LargeScale=lazy(()=>import('./LargeScale'));

export interface CanvasSceneProps {
  scale:number;
  selectedId:string;
  navigationRevision:number;
  mode:'explore'|'journey'|'time'|'beyond';
  time:number;
  quality:'auto'|'high'|'low';
  rotate:boolean;
  labels:boolean;
  reducedMotion:boolean;
  onSelect:(id:string)=>void;
  onScale:(scale:number)=>void;
  onReady:()=>void;
  onPerformance:(fps:number)=>void;
}

const FOCUS_IDS=new Set(['sun','mercury','venus','earth','moon','mars','jupiter','saturn','uranus','neptune','pluto','ceres','eris','haumea','makemake','phobos','deimos','io','europa','ganymede','callisto','titan','enceladus','triton','charon','trappist-1e','vesta','halley']);
const MOONS:Record<string,Array<{id:string;radius:number;distance:number;angle:number}>>={
  earth:[{id:'moon',radius:.27,distance:3.25,angle:.5}],
  mars:[{id:'phobos',radius:.09,distance:2.05,angle:.5},{id:'deimos',radius:.06,distance:2.7,angle:3.7}],
  jupiter:[{id:'io',radius:.09,distance:2.2,angle:.4},{id:'europa',radius:.08,distance:2.8,angle:3.9},{id:'ganymede',radius:.14,distance:3.6,angle:2.2},{id:'callisto',radius:.13,distance:4.3,angle:5.2}],
  saturn:[{id:'titan',radius:.13,distance:3.7,angle:.4},{id:'enceladus',radius:.06,distance:2.8,angle:3.1}],
  neptune:[{id:'triton',radius:.11,distance:2.7,angle:.5}],
  pluto:[{id:'charon',radius:.5,distance:3,angle:.7}],
};

function Label({name,position,selected=false,onClick}:{name:string;position:[number,number,number];selected?:boolean;onClick:()=>void}) {
  return <ScreenLabel name={name} position={position} accent={selected} onClick={onClick}/>;
}

function Orbit({radius,opacity=.16,color='#7f9ab2'}:{radius:number;opacity?:number;color?:string}) {
  const geometry=useMemo(()=>{
    const points=Array.from({length:161},(_,i)=>new THREE.Vector3(Math.cos(i/160*Math.PI*2)*radius,0,Math.sin(i/160*Math.PI*2)*radius));
    return new THREE.BufferGeometry().setFromPoints(points);
  },[radius]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <lineLoop geometry={geometry}><lineBasicMaterial color={color} transparent opacity={opacity} userData={{baseOpacity:opacity}} depthWrite={false}/></lineLoop>;
}

function LocalSystem({runtime,selectedId,scale,labels,onSelect,onFocus}:{runtime:Runtime;selectedId:string;scale:number;labels:boolean;onSelect:(id:string)=>void;onFocus:(id:string)=>void}) {
  const group=useRef<THREE.Group>(null);
  const id=FOCUS_IDS.has(selectedId)?selectedId:'earth';
  const moons=MOONS[id]??[];
  useFrame(()=>{
    if(!group.current)return;
    const transform=localTransform(runtime.scale,id);
    group.current.scale.setScalar(transform.scale);
    group.current.position.set(...transform.position);
    group.current.visible=transform.visible;
  });
  return <Stage runtime={runtime} start={0} end={solarBody(id)?12:SOLAR_HANDOFF}><group ref={group}>
    <Planet id={id} radius={id==='saturn'?.74:1} runtime={runtime} onSelect={onSelect} onFocus={onFocus}/>
    {scale>.35&&moons.map(moon=>{
      const p:[number,number,number]=[Math.cos(moon.angle)*moon.distance,0,Math.sin(moon.angle)*moon.distance];
      return <group key={moon.id}>
        <Orbit radius={moon.distance} opacity={scale>.7?.17:.045}/>
        <Planet id={moon.id} radius={moon.radius} position={p} runtime={runtime} onSelect={onSelect} onFocus={onFocus}/>
        {labels&&scale>.6&&<Label name={moon.id} position={[p[0],p[1]-.35,p[2]]} onClick={()=>onSelect(moon.id)}/>}
      </group>;
    })}
  </group></Stage>;
}

function SolarPlanet({focusedId,...props}:Parameters<typeof Planet>[0]&{focusedId:string}) {
  const group=useRef<THREE.Group>(null);
  useFrame(()=>{if(group.current)group.current.visible=solarBodyVisible(props.runtime.scale,props.id,focusedId);});
  return <group ref={group}><Planet {...props}/></group>;
}

function SolarSystem({runtime,scale,low,selectedId,labels,onSelect,onFocus}:{runtime:Runtime;scale:number;low:boolean;selectedId:string;labels:boolean;onSelect:(id:string)=>void;onFocus:(id:string)=>void}) {
  const group=useRef<THREE.Group>(null);
  const focusedId=FOCUS_IDS.has(selectedId)?selectedId:'earth';
  useFrame(()=>{if(group.current)group.current.scale.setScalar(solarScale(runtime.scale));});
  return <Stage runtime={runtime} start={1.15} end={5.3}><group ref={group}>
    <SolarPlanet focusedId={focusedId} id="sun" radius={.33} runtime={runtime} onSelect={onSelect} onFocus={onFocus}/>
    {PLANETS.map(planet=>{
      const p:[number,number,number]=[Math.cos(planet.angle)*planet.orbit,0,Math.sin(planet.angle)*planet.orbit];
      return <group key={planet.id}>
        <Orbit radius={planet.orbit} opacity={planet.id===selectedId?.29:.12} color={planet.id===selectedId?'#c0ac7c':'#53677b'}/>
        <SolarPlanet focusedId={focusedId} id={planet.id} radius={planet.radius} position={p} runtime={runtime} onSelect={onSelect} onFocus={onFocus}/>
        {labels&&scale>1.8&&scale<4.5&&<Label name={planet.id} position={[p[0],-planet.radius-.15,p[2]]} selected={selectedId===planet.id} onClick={()=>onSelect(planet.id)}/>}
      </group>;
    })}
    <DustBelt inner={2.36} outer={2.56} count={low?450:1300}/>
    <DustBelt inner={5.9} outer={7.1} count={low?800:2000} thickness={.18}/>
    {scale>3.2&&<Planet id="pluto" radius={.065} position={[-5.9,.3,2]} runtime={runtime} onSelect={onSelect} onFocus={onFocus}/>}
    {labels&&scale>3.5&&scale<4.6&&<Label name="Kuiper belt" position={[5.7,.2,2.2]} onClick={()=>onSelect('pluto')}/>}
  </group></Stage>;
}

function OortCloud({runtime,low,labels,scale,onSelect}:{runtime:Runtime;low:boolean;labels:boolean;scale:number;onSelect:(id:string)=>void}) {
  return <Stage runtime={runtime} start={3.8} end={6.3} zoom>
    <DustBelt inner={2.5} outer={4.5} count={low?1500:4300} seed={591} spherical/>
    <mesh><sphereGeometry args={[.04,16,12]}/><meshBasicMaterial color="#ffe0a1" transparent/></mesh>
    <Orbit radius={.3} opacity={.12}/>
    {labels&&scale>4.6&&scale<5.7&&<Label name="Our solar system" position={[0,-.25,0]} selected onClick={()=>onSelect('sun')}/>}
  </Stage>;
}

/** The only camera writer. Input changes a scale target; this frame loop owns interpolation. */
function Navigation({props,runtime}:{props:CanvasSceneProps;runtime:Runtime}) {
  const {camera,gl,size,setDpr}=useThree();
  const callbacks=useRef(props);callbacks.current=props;
  const aim=useRef({yaw:0,pitch:0,vx:0,vy:0});
  const scaleTarget=useRef(props.scale);
  const desiredPosition=useRef(new THREE.Vector3());
  const cameraTarget=useRef(new THREE.Vector3());
  const sample=useRef({frames:0,elapsed:0,ready:false});
  useEffect(()=>{scaleTarget.current=props.scale;},[props.scale]);
  useEffect(()=>{
    const element=gl.domElement;
    const pointers=new Map<number,{x:number;y:number}>();
    let pinchDistance=0;
    const changeScale=(delta:number)=>{
      scaleTarget.current=THREE.MathUtils.clamp(scaleTarget.current+delta,-.65,11);
      callbacks.current.onScale(scaleTarget.current);
    };
  const onWheel=(event:WheelEvent)=>{if(callbacks.current.mode!=='explore')return;event.preventDefault();const pixels=event.deltaY*(event.deltaMode===1?32:event.deltaMode===2?window.innerHeight:1);changeScale(THREE.MathUtils.clamp(pixels,-140,140)*.0027);};
    const onDown=(event:PointerEvent)=>{
      if(event.pointerType==='touch'&&callbacks.current.mode==='journey')return;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      element.setPointerCapture(event.pointerId);aim.current.vx=aim.current.vy=0;
      if(pointers.size===2){const p=[...pointers.values()];pinchDistance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
    };
    const onMove=(event:PointerEvent)=>{
      const previous=pointers.get(event.pointerId);if(!previous)return;
      const dx=event.clientX-previous.x,dy=event.clientY-previous.y;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(pointers.size===2){
        const p=[...pointers.values()],distance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
        if(pinchDistance>0&&callbacks.current.mode==='explore')changeScale((pinchDistance-distance)*.009);
        pinchDistance=distance;
      }else{
        aim.current.yaw-=dx*.005;aim.current.pitch=THREE.MathUtils.clamp(aim.current.pitch+dy*.005,-1.15,1.15);
        aim.current.vx=-dx*.00016;aim.current.vy=dy*.00016;
      }
    };
    const onUp=(event:PointerEvent)=>{pointers.delete(event.pointerId);if(element.hasPointerCapture(event.pointerId))element.releasePointerCapture(event.pointerId);pinchDistance=0;};
    element.addEventListener('wheel',onWheel,{passive:false});element.addEventListener('pointerdown',onDown);element.addEventListener('pointermove',onMove);element.addEventListener('pointerup',onUp);element.addEventListener('pointercancel',onUp);
    return ()=>{element.removeEventListener('wheel',onWheel);element.removeEventListener('pointerdown',onDown);element.removeEventListener('pointermove',onMove);element.removeEventListener('pointerup',onUp);element.removeEventListener('pointercancel',onUp);document.body.style.cursor='';};
  },[gl]);
  useEffect(()=>{gl.domElement.style.touchAction=props.mode==='journey'?'pan-y':'none';},[gl,props.mode]);
  useEffect(()=>{aim.current={yaw:0,pitch:0,vx:0,vy:0};},[props.selectedId,props.navigationRevision]);
  useEffect(()=>{
    setDpr(props.quality==='low'?1:Math.min(window.devicePixelRatio,props.quality==='high'?2:1.6));
  },[props.quality,setDpr]);
  useFrame((state,dt)=>{
    const delta=Math.min(dt,.06),p=callbacks.current;
    runtime.scale=THREE.MathUtils.damp(runtime.scale,p.scale,p.reducedMotion?24:5.5,delta);
    runtime.elapsed+=p.reducedMotion?0:delta;
    runtime.time=p.time;runtime.reducedMotion=p.reducedMotion;runtime.rotate=p.rotate;
    const nav=aim.current;
    if(!p.reducedMotion){nav.yaw+=nav.vx;nav.pitch=THREE.MathUtils.clamp(nav.pitch+nav.vy,-1.15,1.15);}
    nav.vx*=Math.exp(-delta*6);nav.vy*=Math.exp(-delta*6);
    const solarTilt=.56*THREE.MathUtils.smoothstep(runtime.scale,.4,2.1)*(1-THREE.MathUtils.smoothstep(runtime.scale,4.6,6.2));
    const pitch=THREE.MathUtils.clamp(.05+solarTilt+nav.pitch,-1.35,1.35);
    const systemFrame=THREE.MathUtils.smoothstep(runtime.scale,1.2,2.3)*(1-THREE.MathUtils.smoothstep(runtime.scale,4.5,6));
    const distance=(size.width<650?10.6:7.15)*(1+systemFrame*(size.width<650?.5:.45));
    const focusedId=FOCUS_IDS.has(p.selectedId)?p.selectedId:'earth';
    const target=p.mode==='explore'||p.mode==='journey'?localCameraTarget(runtime.scale,focusedId):[0,0,0];
    camera.position.sub(cameraTarget.current);
    cameraTarget.current.set(target[0],target[1],target[2]);
    // Translate camera and aim together so tracking never exposes a second center body.
    camera.position.add(cameraTarget.current);
    const desired=desiredPosition.current.set(Math.sin(nav.yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(nav.yaw)*Math.cos(pitch)*distance).add(cameraTarget.current);
    camera.position.lerp(desired,1-Math.exp(-delta*8));camera.lookAt(cameraTarget.current);
    const perspective=camera as THREE.PerspectiveCamera;
    const nearView=1-THREE.MathUtils.smoothstep(runtime.scale,.15,1.6);
    const offset=size.width>850||size.width/size.height>1.6?-.16*nearView:0;
    const verticalOffset=size.width<650?-.13*nearView:0;
    perspective.setViewOffset(size.width,size.height,size.width*offset,size.height*verticalOffset,size.width,size.height);
    if(!sample.current.ready&&state.clock.elapsedTime>.12){sample.current.ready=true;p.onReady();}
    sample.current.frames++;sample.current.elapsed+=dt;
    if(sample.current.elapsed>2.5){
      const fps=Math.round(sample.current.frames/sample.current.elapsed);p.onPerformance(fps);
      gl.domElement.dataset.fps=String(fps);
      gl.domElement.dataset.geometries=String(gl.info.memory.geometries);
      gl.domElement.dataset.textures=String(gl.info.memory.textures);
      gl.domElement.dataset.drawCalls=String(gl.info.render.calls);
      if(p.quality==='auto'&&fps<34&&gl.getPixelRatio()>1.1)setDpr(Math.max(1,gl.getPixelRatio()-.2));
      sample.current.frames=0;sample.current.elapsed=0;
    }
  });
  return null;
}

function SceneContents({props}:{props:CanvasSceneProps}) {
  const [runtime]=useState<Runtime>(()=>({scale:props.scale,time:props.time,elapsed:0,reducedMotion:props.reducedMotion,rotate:props.rotate})); // one stable shared frame state
  const [visibleScale,setVisibleScale]=useState(props.scale);
  const scaleBand=useRef(Math.floor(props.scale*10));
  useFrame(()=>{const band=Math.floor(runtime.scale*10);if(band!==scaleBand.current){scaleBand.current=band;setVisibleScale(runtime.scale);}});
  const low=props.quality==='low'||(props.quality==='auto'&&typeof window!=='undefined'&&window.innerWidth<760);
  const {onSelect,onScale}=props;
  const focus=useCallback((id:string)=>{onSelect(id);onScale(0);},[onSelect,onScale]);
  const common={runtime,scale:visibleScale,labels:props.labels,selectedId:props.selectedId,onSelect:props.onSelect,onFocus:focus};
  return <>
    <color attach="background" args={['#030508']}/>
    <ambientLight intensity={.15} color="#a4bddd"/>
    <directionalLight position={[-3.4,2.3,3.3]} intensity={2.2} color="#fff3dd" castShadow={!low} shadow-mapSize={[1024,1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-normalBias={.015}/>
    <Navigation props={props} runtime={runtime}/>
    <Starfield low={low} runtime={runtime} hidden={props.mode==='time'&&props.time>.4}/>
    {props.mode!=='beyond'&&props.mode!=='time'&&<>
      {visibleScale<2.15&&<LocalSystem {...common}/>}
      {visibleScale>1.1&&visibleScale<5.35&&<SolarSystem {...common} low={low}/>}
      {visibleScale>3.75&&visibleScale<6.35&&<OortCloud runtime={runtime} low={low} labels={props.labels} scale={visibleScale} onSelect={props.onSelect}/>}
    </>}
    {(visibleScale>4.75||props.mode==='beyond'||props.mode==='time')&&<Suspense fallback={null}><LargeScale {...common} low={low} mode={props.mode} time={props.time}/></Suspense>}
  </>;
}

function Fallback({onRetry,message}:{onRetry:()=>void;message?:string}) {
  return <div role="status" style={{position:'absolute',inset:0,display:'grid',placeContent:'center',textAlign:'center',padding:24,background:'#030508',color:'#b6c8db'}}>
    <p style={{fontSize:22,fontFamily:'serif',marginBottom:12}}>The universe is still here.</p>
    <p style={{maxWidth:330,fontSize:13,lineHeight:1.7,color:'#8894a8'}}>{message??'This browser could not start the 3D view. You can still explore the object library and read the science.'}</p>
    <button type="button" onClick={onRetry} style={{justifySelf:'center',padding:'10px 18px',marginTop:16,color:'#d8e3ed',background:'#111722',border:'1px solid #354355',cursor:'pointer'}}>Retry 3D view</button>
  </div>;
}

function ContextLifecycle({onLost,onRestored}:{onLost:()=>void;onRestored:()=>void}) {
  const {gl}=useThree();
  useEffect(()=>{
    const element=gl.domElement;
    const lost=(event:Event)=>{event.preventDefault();onLost();};
    element.addEventListener('webglcontextlost',lost);
    element.addEventListener('webglcontextrestored',onRestored);
    return ()=>{element.removeEventListener('webglcontextlost',lost);element.removeEventListener('webglcontextrestored',onRestored);};
  },[gl,onLost,onRestored]);
  return null;
}

class SceneBoundary extends Component<{children:ReactNode;onRetry:()=>void;onFailure:()=>void},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?<Fallback onRetry={this.props.onRetry}/>:this.props.children;}
}

export default function CanvasScene(props:CanvasSceneProps) {
  const [generation,setGeneration]=useState(0),[contextLost,setContextLost]=useState(false),[supported,setSupported]=useState(true);
  const [labelEntries,setLabelEntries]=useState<LabelEntry[]>([]);
  const [labelRegistry]=useState<LabelRegistry>(()=>{const entries=new Map<string,LabelEntry>();return {entries,changed:()=>setLabelEntries([...entries.values()])};});
  const retry=useCallback(()=>{setContextLost(false);setSupported(true);setGeneration(value=>value+1);},[]);
  const lost=useCallback(()=>setContextLost(true),[]);
  const restored=useCallback(()=>{setContextLost(false);setGeneration(value=>value+1);},[]);
  const onReadyRef=useRef(props.onReady);
  useEffect(()=>{onReadyRef.current=props.onReady;},[props.onReady]);
  useEffect(()=>{
    const canvas=document.createElement('canvas');
    const context=canvas.getContext('webgl2');
    if(!context){setSupported(false);onReadyRef.current();}
    else context.getExtension('WEBGL_lose_context')?.loseContext();
  },[]);
  return <div className="cosmos-canvas" style={{position:'absolute',inset:0,touchAction:props.mode==='journey'?'pan-y':'none'}} aria-label="Interactive three-dimensional universe. Drag to orbit; scroll or pinch to change scale. Use the object library for keyboard navigation.">
    {!supported?<Fallback onRetry={retry}/>:<SceneBoundary key={generation} onRetry={retry} onFailure={props.onReady}>
      <Canvas shadows camera={{position:[0,.35,7.15],fov:40,near:.025,far:180}} dpr={[1,1.6]} gl={{antialias:true,alpha:false,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.1}}>
        <LabelContext.Provider value={labelRegistry}><ContextLifecycle onLost={lost} onRestored={restored}/><SceneContents props={props}/></LabelContext.Provider>
      </Canvas>
    </SceneBoundary>}
    {props.labels&&!contextLost&&<LabelOverlay entries={labelEntries}/>}
    {contextLost&&<Fallback message="The graphics context was interrupted. Restore the 3D view to continue your journey." onRetry={retry}/>}
  </div>;
}
