import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { clampScale, scaleIndex, physicalSpan, scales, epochs, epochAt } from '../src/lib/scales';
import { objects, getObject } from '../src/data/catalog';
import { stageOpacity } from '../src/components/scene/Stage';
import { particleData } from '../src/components/scene/Particles';
import { useUniverse } from '../src/lib/store';

beforeEach(()=>useUniverse.setState({scale:0,selectedId:'earth',mode:'explore',time:0,bookmarks:[],compare:[],info:false,hidden:false}));
test('scale navigation clamps invalid values, preserves close inspection, and never indexes outside the hierarchy',()=>{
  assert.equal(clampScale(-100),-.65);assert.equal(clampScale(200),11);assert.equal(clampScale(NaN),0);
  for(const value of [-Infinity,-100,-.65,0,.7,6.7,11,100,NaN])assert.ok(scales[scaleIndex(value)]);
});
test('physical spans are positive, continuous logarithmic references across every transition',()=>{
  for(let i=0;i<scales.length;i++){assert.ok(Math.abs(physicalSpan(i)/scales[i].meters-1)<1e-10);if(i<11){assert.ok(Math.abs(physicalSpan(i+.5)/Math.sqrt(scales[i].meters*scales[i+1].meters)-1)<1e-10);}}
  for(let i=1;i<=110;i++)assert.ok(physicalSpan(i/10)>physicalSpan((i-1)/10));
});
test('every stage boundary overlaps another visible representation',()=>{
  const bands=[[0,2.1],[1.15,5.3],[3.8,6.3],[4.9,7.15],[6,8.15],[7.1,9.2],[8.2,10.15],[9.1,11.2],[10.2,12]];
  for(let scale=0;scale<=11;scale+=.05)assert.ok(bands.some(([a,b])=>stageOpacity(scale,a,b)>.02),`No scene at scale ${scale}`);
});
test('catalog IDs, relational links, source URLs and optional measurements are valid',()=>{
  assert.equal(new Set(objects.map(o=>o.id)).size,objects.length);
  for(const object of objects){
    assert.ok(object.name&&object.description&&object.facts.length&&object.sources.length,object.id);
    assert.ok(object.scale>=0&&object.scale<=11,object.id);
    if(object.parent)assert.ok(getObject(object.parent),`${object.id} parent`);
    for(const moon of object.moons??[])assert.ok(getObject(moon),`${object.id} moon ${moon}`);
    for(const source of object.sources)assert.equal(new URL(source.url).protocol,'https:');
    for(const key of ['radiusKm','massKg','distanceAU','distanceLy','orbitalDays','rotationHours','gravity'] as const){const value=object[key];if(value!==undefined)assert.ok(Number.isFinite(value)&&value>0,`${object.id} ${key}`);}
    if(object.texture)assert.ok(existsSync(resolve('public',object.texture.replace(/^\//,''))),`Missing ${object.texture}`);
  }
});
test('all principal planets, dwarf planets and specified moons have navigable catalog entries',()=>{
  for(const id of ['sun','mercury','venus','earth','mars','jupiter','saturn','uranus','neptune','pluto','ceres','eris','haumea','makemake','moon','phobos','deimos','io','europa','ganymede','callisto','titan','enceladus','triton'])assert.ok(getObject(id),id);
});
test('visiting an object exits the narrative, focuses it, and opens its information',()=>{
  useUniverse.getState().setMode('journey');useUniverse.getState().visit('saturn');
  assert.equal(useUniverse.getState().mode,'explore');assert.equal(useUniverse.getState().scale,0);assert.equal(useUniverse.getState().selectedId,'saturn');assert.equal(useUniverse.getState().info,true);
});
test('cosmic time and speculation start at the horizon; Home restores Earth and the interface',()=>{
  const initialRevision=useUniverse.getState().navigationRevision;
  for(const mode of ['time','beyond'] as const){useUniverse.getState().setMode(mode);assert.equal(useUniverse.getState().scale,11);}
  useUniverse.setState({hidden:true,info:true});useUniverse.getState().home();
  assert.equal(useUniverse.getState().selectedId,'earth');assert.equal(useUniverse.getState().mode,'explore');assert.equal(useUniverse.getState().scale,0);assert.equal(useUniverse.getState().hidden,false);assert.equal(useUniverse.getState().info,false);
  assert.ok(useUniverse.getState().navigationRevision>initialRevision,'Home must reset camera orientation even when Earth is already selected');
});
test('bookmarks toggle without duplicates; comparison retains at most three distinct objects',()=>{
  const s=useUniverse.getState();s.bookmark('earth');s.bookmark('earth');assert.deepEqual(useUniverse.getState().bookmarks,[]);
  s.bookmark('saturn');assert.deepEqual(useUniverse.getState().bookmarks,['saturn']);
  for(const id of ['earth','mars','jupiter','saturn'])s.toggleCompare(id);
  assert.deepEqual(useUniverse.getState().compare,['mars','jupiter','saturn']);s.toggleCompare('jupiter');assert.deepEqual(useUniverse.getState().compare,['mars','saturn']);
});
test('cosmic history endpoints and all supplied epoch markers are reachable',()=>{
  assert.equal(epochAt(0).title,'The universe today');assert.equal(epochAt(1).title,'The limit of our knowledge');
  for(const epoch of epochs)assert.equal(epochAt(epoch.at).title,epoch.title);
});
test('procedural particle buffers stay finite and deterministic',()=>{
  const create=(_:number,random:()=>number)=>({p:[random(),random(),random()],c:[random(),.5,1],s:random()});
  const a=particleData(100,42,create),b=particleData(100,42,create);
  assert.deepEqual(a.positions,b.positions);assert.equal(a.positions.length,300);assert.equal(a.sizes.length,100);
  for(const value of [...a.positions,...a.colors,...a.sizes])assert.ok(Number.isFinite(value));
});
