import * as THREE from 'three';

export const planetVertex = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const earthFragment = /* glsl */`
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform vec3 uLight;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 light = normalize(uLight);
    float incidence = dot(normal, light);
    float day = smoothstep(-0.13, 0.28, incidence);
    vec3 surface = texture2D(uDay, vUv).rgb;
    vec3 nights = texture2D(uNight, vUv).rgb;
    vec3 eye = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(eye, normal), 0.0), 3.5);
    vec3 illumination = surface * (0.035 + 1.25 * max(incidence, 0.0));
    vec3 color = illumination + nights * (1.0 - day) * 1.75;
    color += vec3(0.12, 0.42, 0.75) * fresnel * day * 0.7;
    gl_FragColor = vec4(color, uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const atmosphereFragment = /* glsl */`
  uniform vec3 uLight;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 eye = normalize(cameraPosition - vWorldPosition);
    float rim = pow(1.0 - abs(dot(eye, normal)), 3.4);
    float sunlight = smoothstep(-0.45, 0.65, dot(normal, normalize(uLight)));
    gl_FragColor = vec4(uColor, rim * sunlight * 0.65 * uOpacity);
  }
`;

export const sunFragment = /* glsl */`
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uTint;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  void main() {
    vec3 p = normalize(vNormal) * 24.0;
    float granules = noise(p + vec3(uTime*.07))*.6 + noise(p*3.0 - uTime*.025)*.3 + noise(p*7.0)*.1;
    vec3 solar = mix(vec3(0.8,0.16,0.015),vec3(2.1,1.5,.65),granules);
    vec3 stellar = uTint * (.65 + granules * 1.25);
    vec3 color = mix(stellar,solar,step(.999,min(uTint.r,min(uTint.g,uTint.b))));
    float rim = pow(max(dot(normalize(cameraPosition-vWorldPosition),normalize(vNormal)),0.0),.4);
    gl_FragColor = vec4(color * (.6+.4*rim),uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const pointVertex = /* glsl */`
  attribute vec3 aColor;
  attribute float aSize;
  varying vec3 vColor;
  uniform float uSize;
  uniform float uPixelRatio;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position,1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aSize * uSize * uPixelRatio * 30.0 / max(1.0,-mv.z), 0.7, 34.0);
  }
`;

export const pointFragment = /* glsl */`
  varying vec3 vColor;
  uniform float uOpacity;
  uniform float uHeat;
  void main() {
    vec2 p = gl_PointCoord - .5;
    float r = length(p);
    float light = exp(-r*r*24.0);
    float core = exp(-r*r*150.0);
    float rays = pow(max(0.0,1.0-abs(p.x)*70.0),3.0)*exp(-abs(p.y)*13.0) + pow(max(0.0,1.0-abs(p.y)*70.0),3.0)*exp(-abs(p.x)*13.0);
    vec3 color = mix(vColor,vec3(1.0,.35,.07),uHeat);
    float alpha = (light*.62+core*.4+rays*.12)*uOpacity;
    if(alpha<.015) discard;
    gl_FragColor = vec4(color,alpha);
  }
`;

const cachedFallbacks = new Map<string, THREE.DataTexture>();

/** Deterministic local fallback, used while high-resolution image maps stream in. */
export function fallbackTexture(kind: string): THREE.DataTexture {
  const existing = cachedFallbacks.get(kind);
  if (existing) return existing;
  const width = 256, height = 128;
  const data = new Uint8Array(width * height * 4);
  const palettes: Record<string, [number, number, number]> = {
    mercury:[.45,.42,.38], venus:[.72,.59,.37], earth:[.025,.15,.25], mars:[.62,.25,.11],
    jupiter:[.72,.56,.4],saturn:[.73,.63,.43],uranus:[.35,.7,.73],neptune:[.1,.28,.69],moon:[.46,.45,.43],
  };
  const base = palettes[kind] || palettes.moon;
  for (let y=0;y<height;y++) for(let x=0;x<width;x++) {
    const u=x/width, v=y/height;
    const n=(Math.sin(u*51+Math.cos(v*37)*2)+Math.sin(u*117-v*67)+Math.cos(u*23+v*54)) / 3;
    const band = Math.sin(v*110 + Math.sin(u*18)*.5)*.12 + Math.sin(v*31)*.13;
    let [r,g,b] = base;
    if(kind==='earth') {
      const land=Math.sin(u*22+Math.sin(v*14)*2)+Math.cos(v*17-u*3)+Math.sin(u*37+v*19)*.45;
      if(land>.66) { r=.16+n*.03;g=.27+n*.05;b=.17+n*.03; }
      if(Math.abs(v-.5)>.43) { r=.72;g=.8;b=.82; }
    } else if(kind==='earth-clouds') {
      r=g=b=Math.max(0, n*.8+.15); 
    } else if(kind==='earth-night') {
      const city = n>.72 && Math.sin(u*131)*Math.cos(v*119)>.6 ? .6 : .001;
      r=city;g=city*.65;b=city*.3;
    } else if(['jupiter','saturn','venus','uranus','neptune'].includes(kind)) {
      r+=band;g+=band*.7;b+=band*.5;
      if(kind==='jupiter' && ((u-.3)**2/.008 + (v-.61)**2/.001)<1) {r=.62;g=.23;b=.09;}
    } else {r+=n*.12;g+=n*.12;b+=n*.12;}
    const i=(y*width+x)*4;
    data[i]=THREE.MathUtils.clamp(r*255,0,255);data[i+1]=THREE.MathUtils.clamp(g*255,0,255);data[i+2]=THREE.MathUtils.clamp(b*255,0,255);data[i+3]=255;
  }
  const texture = new THREE.DataTexture(data,width,height,THREE.RGBAFormat);
  texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=THREE.RepeatWrapping;texture.needsUpdate=true;
  cachedFallbacks.set(kind,texture);
  return texture;
}

export function opacityOf(group: THREE.Object3D, opacity: number) {
  group.traverse(object => {
    const mesh = object as THREE.Mesh;
    const materials = mesh.material ? (Array.isArray(mesh.material)?mesh.material:[mesh.material]) : [];
    materials.forEach(material => {
      const shader = material as THREE.ShaderMaterial;
      if(shader.uniforms?.uOpacity) shader.uniforms.uOpacity.value = opacity * (material.userData.baseOpacity ?? 1);
      else material.opacity = opacity * (material.userData.baseOpacity ?? 1);
    });
  });
}

export function seededRandom(seed: number) {
  return () => { seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296; };
}
