import { MathUtils } from 'three';

export const SOLAR_HANDOFF = 1.85;
export const PLANETS = [
  {id:'mercury',orbit:.8,radius:.065,angle:2.1},
  {id:'venus',orbit:1.2,radius:.09,angle:3.9},
  {id:'earth',orbit:1.64,radius:.11,angle:.8},
  {id:'mars',orbit:2.1,radius:.085,angle:5.4},
  {id:'jupiter',orbit:2.94,radius:.245,angle:2.9},
  {id:'saturn',orbit:3.82,radius:.205,angle:5.9},
  {id:'uranus',orbit:4.68,radius:.14,angle:4.3},
  {id:'neptune',orbit:5.35,radius:.137,angle:1.4},
];

export const solarScale = (scale:number) => Math.pow(.59,scale-2.5)*.84;
export const solarBody = (id:string) => id==='sun'
  ? {id:'sun',orbit:0,radius:.33,angle:0}
  : PLANETS.find(planet=>planet.id===id);

/** Move the close-up body into its solar orbit before switching scene ownership. */
export function localTransform(scale:number,id:string) {
  const target=solarBody(id);
  const blend=target?MathUtils.smoothstep(scale,1.1,SOLAR_HANDOFF):0;
  const systemScale=solarScale(scale);
  const localRadius=id==='saturn'?.74:1;
  return {
    scale:MathUtils.lerp(Math.pow(.55,scale)*1.48,target?target.radius*systemScale/localRadius:0,blend),
    position:[target?Math.cos(target.angle)*target.orbit*systemScale:0,0,target?Math.sin(target.angle)*target.orbit*systemScale:0] as [number,number,number],
    visible:!target||scale<SOLAR_HANDOFF,
  };
}

export const solarBodyVisible = (scale:number,id:string,focusedId:string) => id!==focusedId||scale>=SOLAR_HANDOFF;

/** Follow the body's true location up close, then reveal the Sun-centered overview. */
export function localCameraTarget(scale:number,id:string) {
  const weight=1-MathUtils.smoothstep(scale,1.1,SOLAR_HANDOFF);
  return localTransform(scale,id).position.map(value=>value*weight) as [number,number,number];
}
