import assert from 'node:assert/strict';
import test from 'node:test';
import { PLANETS, SOLAR_HANDOFF, localCameraTarget, localTransform, solarBody, solarBodyVisible, solarScale } from '../src/components/scene/solar-layout';

test('the selected planet has exactly one visible representation throughout zoom in and out',()=>{
  for(const id of ['sun',...PLANETS.map(planet=>planet.id)]) {
    for(const scale of [0,1,1.15,1.3,1.65,SOLAR_HANDOFF-.0001,SOLAR_HANDOFF,SOLAR_HANDOFF+.0001,2,3]) {
      assert.equal(Number(localTransform(scale,id).visible)+Number(solarBodyVisible(scale,id,id)),1,`${id} at ${scale}`);
    }
  }
});

test('the close-up meets the solar body at the same position and radius',()=>{
  for(const id of ['sun',...PLANETS.map(planet=>planet.id)]) {
    const body=solarBody(id)!;
    const transform=localTransform(SOLAR_HANDOFF,id);
    const factor=solarScale(SOLAR_HANDOFF);
    assert.ok(Math.abs(transform.position[0]-Math.cos(body.angle)*body.orbit*factor)<1e-12);
    assert.ok(Math.abs(transform.position[2]-Math.sin(body.angle)*body.orbit*factor)<1e-12);
    assert.ok(Math.abs(transform.scale*(id==='saturn'?.74:1)-body.radius*factor)<1e-12);
  }
});

test('Earth leaves the center as the Sun appears, while the lunar view stays unchanged',()=>{
  assert.deepEqual(localCameraTarget(1,'earth'),localTransform(1,'earth').position);
  assert.ok(localTransform(1.5,'earth').position[0]>0);
  assert.equal(solarBodyVisible(1.5,'sun','earth'),true);
  assert.deepEqual(localTransform(1.5,'moon').position,[0,0,0]);
});

test('every planet is viewed from its orbital location before pulling back to the Sun',()=>{
  for(const {id} of PLANETS) {
    assert.deepEqual(localCameraTarget(0,id),localTransform(0,id).position);
    assert.deepEqual(localCameraTarget(1.1,id),localTransform(1.1,id).position);
    assert.ok(localCameraTarget(1.5,id).every((value,i)=>Math.abs(value)<Math.abs(localTransform(1.5,id).position[i])||value===0));
    assert.ok(localCameraTarget(2,id).every(value=>value===0));
  }
});
