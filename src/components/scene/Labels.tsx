'use client';
import { createContext, useContext, useEffect, useId, useRef, type CSSProperties } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export type LabelEntry = { id:string; name:string; accent:boolean; onClick?:()=>void; element:HTMLElement|null };
export type LabelRegistry = { entries:Map<string,LabelEntry>; changed:()=>void };
export const LabelContext=createContext<LabelRegistry|null>(null);

/** Labels have a single React DOM owner. Three only updates their projected positions. */
export function ScreenLabel({name,position,onClick,accent=false}:{name:string;position:[number,number,number];onClick?:()=>void;accent?:boolean}) {
  const registry=useContext(LabelContext),id=useId();
  const action=useRef(onClick);action.current=onClick;
  const anchor=useRef<THREE.Group>(null);
  const point=useRef(new THREE.Vector3());
  const {camera,size}=useThree();
  useEffect(()=>{
    if(!registry)return;
    const entry:LabelEntry={id,name,accent,onClick:action.current?()=>action.current?.():undefined,element:null};
    registry.entries.set(id,entry);registry.changed();
    return ()=>{registry.entries.delete(id);registry.changed();};
  },[registry,id,name,accent]);
  useFrame(()=>{
    const entry=registry?.entries.get(id),node=anchor.current;
    if(!entry?.element||!node)return;
    let visible=true;let parent:THREE.Object3D|null=node;
    while(parent){if(!parent.visible){visible=false;break;}parent=parent.parent;}
    node.getWorldPosition(point.current).project(camera);
    visible=visible&&point.current.z>=-1&&point.current.z<=1&&Math.abs(point.current.x)<1.1&&Math.abs(point.current.y)<1.1;
    entry.element.style.visibility=visible?'visible':'hidden';
    entry.element.style.transform=`translate(-50%,-50%) translate(${(point.current.x*.5+.5)*size.width}px,${(-point.current.y*.5+.5)*size.height}px)`;
  });
  return <group ref={anchor} position={position}/>;
}

const labelStyle:CSSProperties={position:'absolute',top:0,left:0,pointerEvents:'auto',padding:'9px 12px',background:'none',border:0,fontFamily:'monospace',fontSize:9,letterSpacing:'.11em',textTransform:'uppercase',whiteSpace:'nowrap',textShadow:'0 2px 6px #030508',visibility:'hidden'};
export function LabelOverlay({entries}:{entries:LabelEntry[]}) {
  return <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden'}}>{entries.map(entry=>entry.onClick?<button key={entry.id} ref={node=>{entry.element=node;}} style={{...labelStyle,color:entry.accent?'#f2c879':'#a3b4c9',cursor:'pointer'}} onClick={entry.onClick} aria-label={`Visit ${entry.name}`}>{entry.name}</button>:<span key={entry.id} ref={node=>{entry.element=node;}} style={{...labelStyle,color:entry.accent?'#f2c879':'#a3b4c9',pointerEvents:'none'}}>{entry.name}</span>)}</div>;
}
