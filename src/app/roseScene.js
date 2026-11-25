import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Ángulo dorado: reparte los pétalos alrededor como en una flor real
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

const GREEN = { base: '#0b4d10', mid: '#2e8b35', edge: '#6cc070' };

// Capas de la flor, del centro hacia afuera.
// n: pétalos, s: tamaño, r: distancia al centro, open: inclinación final (radianes),
// cup: qué tanto se curvan los lados hacia el centro, curl: qué tanto se enrolla la punta
const FLOWER_LAYERS = [
  { n: 3, s: 0.42, r: 0.03, open: 0.04, cup: 1.6, curl: 0 },
  { n: 4, s: 0.52, r: 0.05, open: 0.1, cup: 1.4, curl: 0.06 },
  { n: 5, s: 0.64, r: 0.07, open: 0.2, cup: 1.15, curl: 0.15 },
  { n: 6, s: 0.76, r: 0.09, open: 0.45, cup: 0.95, curl: 0.28 },
  { n: 7, s: 0.86, r: 0.11, open: 0.78, cup: 0.8, curl: 0.4 },
];

// El botón (el bebé) solo tiene las capas de adentro, casi cerradas
const BUD_LAYERS = [
  { n: 3, s: 0.26, r: 0.005, open: 0, cup: 1.6, curl: 0 },
  { n: 4, s: 0.31, r: 0.015, open: 0.04, cup: 1.4, curl: 0 },
];

const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
const ease = (x) => 1 - Math.pow(1 - clamp01(x), 3);

// Pétalo: un plano deformado. La base queda en el origen, crece hacia +Y
// y su cara exterior mira hacia +Z (hacia afuera de la flor).
function petalGeometry({ width, height, cup, curl, palette }) {
  const geo = new THREE.PlaneGeometry(1, 1, 14, 18);
  const pos = geo.attributes.position;
  const base = new THREE.Color(palette.base);
  const mid = new THREE.Color(palette.mid);
  const edge = new THREE.Color(palette.edge);
  const c = new THREE.Color();
  const colors = [];

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) * 2; // -1..1 a lo ancho
    const v = pos.getY(i) + 0.5; // 0..1 a lo alto

    // Angosto en la base, ancho arriba y con el borde de arriba redondo
    const w = Math.sin(Math.min(v * 1.25, 1) * Math.PI * 0.5);
    const flatX = u * 0.5 * width * w;
    let y = v * height * (1 - 0.3 * u * u * v * v);

    // El pétalo se enrolla sobre un cilindro alrededor del centro de la flor;
    // con más "cup" el cilindro es más angosto y el pétalo abraza más
    const wrap = (0.12 + v * height * 0.5) / cup;
    const angle = flatX / wrap;
    const x = wrap * Math.sin(angle);
    let z = wrap * (Math.cos(angle) - 1);

    // El borde de arriba se enrolla hacia afuera, y las orillas también un poco
    const t = Math.max(0, v - 0.6) / 0.4;
    z += curl * t * t * height * 0.8;
    z += curl * 0.25 * height * Math.pow(Math.abs(u), 3) * v * v;
    y -= curl * t * t * t * height * 0.25;
    // Panza: el pétalo se abomba hacia afuera para que la flor se vea redonda
    z += 0.18 * height * Math.sin(v * Math.PI * 0.9);

    pos.setXYZ(i, x, y, z);

    // Oscuro en la base y más claro en el borde, donde le pega la luz
    c.copy(base).lerp(mid, Math.min(1, v * 1.6));
    const rim = Math.max(0, v * (0.6 + 0.4 * u * u) - 0.75) / 0.25;
    c.lerp(edge, rim * 0.7);
    colors.push(c.r, c.g, c.b);
  }

  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

// Hojita: plano que sale hacia +Z, doblado en la nervadura y caído en la punta
function leafletGeometry(length, width) {
  const geo = new THREE.PlaneGeometry(1, 1, 8, 14);
  const pos = geo.attributes.position;
  const dark = new THREE.Color('#0f5c14');
  const light = new THREE.Color('#4caf50');
  const vein = new THREE.Color('#8bd48e');
  const c = new THREE.Color();
  const colors = [];

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) * 2;
    const v = pos.getY(i) + 0.5;
    const w = Math.pow(Math.sin(Math.PI * v), 0.7) * (1 - 0.3 * v);

    const x = u * 0.5 * width * w;
    const z = v * length;
    const y = Math.abs(u) * w * width * 0.18 + length * (0.25 * v - 0.35 * v * v);
    pos.setXYZ(i, x, y, z);

    c.copy(dark).lerp(light, (1 - Math.abs(u)) * 0.6 + v * 0.2);
    if (Math.abs(u) < 0.13) c.lerp(vein, 0.5);
    colors.push(c.r, c.g, c.b);
  }

  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

// Flor completa: pétalos acomodados por capas. Cada pétalo guarda cuándo abre.
function buildFlower(layers, material, timing) {
  const group = new THREE.Group();
  const petals = [];
  const innerMid = new THREE.Color('#5c0b21');
  const outerMid = new THREE.Color('#b0173f');
  let k = 0;

  layers.forEach((layer, li) => {
    const mid = innerMid.clone().lerp(outerMid, li / Math.max(1, layers.length - 1));
    const geo = petalGeometry({
      width: layer.s * 1.1,
      height: layer.s,
      cup: layer.cup,
      curl: layer.curl,
      palette: { base: '#2e0511', mid: `#${mid.getHexString()}`, edge: '#e0466e' },
    });

    for (let i = 0; i < layer.n; i++) {
      const pivot = new THREE.Group();
      pivot.rotation.y = k++ * GOLDEN + li * 0.3;
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.z = layer.r;
      mesh.rotation.x = 0.02;
      pivot.add(mesh);
      group.add(pivot);
      // Las capas de afuera abren primero
      petals.push({
        mesh,
        open: layer.open,
        delay: timing.start + (layers.length - 1 - li) * timing.step + i * 0.05,
      });
    }
  });

  return { group, petals };
}

// Sépalos: hojitas verdes debajo de la flor
function buildSepals(count, length, tilt, material) {
  const group = new THREE.Group();
  const geo = petalGeometry({ width: length * 0.32, height: length, cup: 0.4, curl: 0.1, palette: GREEN });
  for (let i = 0; i < count; i++) {
    const pivot = new THREE.Group();
    pivot.rotation.y = (i / count) * Math.PI * 2;
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.z = 0.03;
    mesh.rotation.x = tilt;
    pivot.add(mesh);
    group.add(pivot);
  }
  return group;
}

// Rama con tres hojitas: una en la punta y dos a los lados
function buildLeafCluster(stemMaterial, leafMaterial) {
  const group = new THREE.Group();
  const petiole = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.015, 0.5, 6), stemMaterial);
  petiole.rotation.x = Math.PI / 2;
  petiole.position.z = 0.25;
  group.add(petiole);

  const tip = new THREE.Mesh(leafletGeometry(0.45, 0.26), leafMaterial);
  tip.position.z = 0.48;
  group.add(tip);

  const sideGeo = leafletGeometry(0.36, 0.22);
  [-1, 1].forEach((side) => {
    const leaf = new THREE.Mesh(sideGeo, leafMaterial);
    leaf.position.z = 0.26;
    leaf.rotation.y = side * 1.0;
    group.add(leaf);
  });
  return group;
}

function addThorns(group, curve, material, spots) {
  const geo = new THREE.ConeGeometry(0.018, 0.075, 6);
  const up = new THREE.Vector3(0, 1, 0);
  spots.forEach(([t, angle]) => {
    const thorn = new THREE.Mesh(geo, material);
    const dir = new THREE.Vector3(Math.cos(angle), 0.55, Math.sin(angle)).normalize();
    thorn.quaternion.setFromUnitVectors(up, dir);
    thorn.position.copy(curve.getPointAt(t)).addScaledVector(dir, 0.045);
    group.add(thorn);
  });
}

// Textura de brillo suave (un degradado circular)
function glowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255, 140, 175, 0.9)');
  g.addColorStop(0.4, 'rgba(255, 90, 140, 0.25)');
  g.addColorStop(1, 'rgba(255, 90, 140, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Arma toda la escena y regresa una función para animarla cuadro por cuadro
export function createRoseScene(renderer, { reducedMotion }) {
  const scene = new THREE.Scene();

  // Ambiente para reflejos suaves en el cristal y los pétalos
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.35;

  // Luces: general, principal cálida, relleno frío y una rosa por detrás
  scene.add(new THREE.HemisphereLight('#ffe4ec', '#0a1622', 0.8));
  const key = new THREE.DirectionalLight('#fff1e6', 1.7);
  key.position.set(3, 4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight('#8fb4ff', 0.5);
  fill.position.set(-4, 1, 2);
  scene.add(fill);
  const rim = new THREE.PointLight('#ff6b95', 6, 6, 2);
  rim.position.set(0, 0.4, -1.6);
  scene.add(rim);

  // Materiales
  const petalMaterial = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.55,
    sheen: 0.7,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color('#ff4f7e'),
  });
  const stemMaterial = new THREE.MeshStandardMaterial({ color: '#2e7d32', roughness: 0.6 });
  const leafMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.5,
  });
  const sepalMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.6,
  });
  const thornMaterial = new THREE.MeshStandardMaterial({ color: '#6b3a2a', roughness: 0.5 });

  const rose = new THREE.Group();
  scene.add(rose);

  // ============ ROSA PRINCIPAL ============
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -2.4, 0),
    new THREE.Vector3(0.03, -1.6, 0.02),
    new THREE.Vector3(-0.03, -0.8, 0),
    new THREE.Vector3(0, -0.06, 0),
  ]);
  const stemGeo = new THREE.TubeGeometry(stemCurve, 64, 0.035, 8, false);
  const stem = new THREE.Mesh(stemGeo, stemMaterial);
  rose.add(stem);
  addThorns(rose, stemCurve, thornMaterial, [[0.25, 0.5], [0.42, 3.4], [0.6, 1.9], [0.78, 4.6]]);

  const leaves = [
    { t: 0.38, angle: 0.4 },
    { t: 0.58, angle: Math.PI + 0.6 },
    { t: 0.22, angle: Math.PI - 0.5 },
  ].map(({ t, angle }, i) => {
    const cluster = buildLeafCluster(stemMaterial, leafMaterial);
    cluster.position.copy(stemCurve.getPointAt(t));
    cluster.rotation.set(-0.35, angle, 0, 'YXZ');
    cluster.scale.setScalar(0);
    rose.add(cluster);
    return { cluster, delay: 0.8 + i * 0.25, size: 1.3 };
  });

  const head = new THREE.Group();
  const flower = buildFlower(FLOWER_LAYERS, petalMaterial, { start: 1.4, step: 0.45 });
  head.add(flower.group);
  head.add(buildSepals(5, 0.32, 1.9, sepalMaterial));
  const hip = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), stemMaterial);
  hip.scale.y = 1.2;
  hip.position.y = -0.05;
  head.add(hip);
  head.scale.setScalar(0);
  rose.add(head);

  // ============ BOTÓN (EL BEBÉ) ============
  const budCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.02, -2.4, 0),
    new THREE.Vector3(0.15, -1.85, 0.05),
    new THREE.Vector3(0.45, -1.4, 0.12),
    new THREE.Vector3(0.56, -0.98, 0.15),
  ]);
  const budStemGeo = new THREE.TubeGeometry(budCurve, 48, 0.025, 8, false);
  rose.add(new THREE.Mesh(budStemGeo, stemMaterial));
  addThorns(rose, budCurve, thornMaterial, [[0.45, 0.2]]);

  const bud = new THREE.Group();
  const budFlower = buildFlower(BUD_LAYERS, petalMaterial, { start: 0, step: 0 });
  bud.add(budFlower.group);
  bud.add(buildSepals(5, 0.24, 0.4, sepalMaterial));
  const budHip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), stemMaterial);
  budHip.position.y = -0.03;
  bud.add(budHip);
  bud.position.copy(budCurve.getPointAt(1));
  bud.rotation.z = -0.3;
  bud.scale.setScalar(0);
  rose.add(bud);
  budFlower.petals.forEach(({ mesh, open }) => { mesh.rotation.x = open; });

  // ============ VASO Y BASE ============
  const R = 1.25;
  const domeProfile = [new THREE.Vector2(R, -2.4), new THREE.Vector2(R, 0.6)];
  for (let i = 1; i <= 16; i++) {
    const a = (i / 16) * (Math.PI / 2);
    domeProfile.push(new THREE.Vector2(Math.cos(a) * R, 0.6 + Math.sin(a) * R));
  }
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.06,
    roughness: 0.03,
    metalness: 0,
    envMapIntensity: 1.6,
    side: THREE.FrontSide,
    depthWrite: false,
  });
  const dome = new THREE.Mesh(new THREE.LatheGeometry(domeProfile, 64), glassMaterial);
  dome.renderOrder = 2;
  scene.add(dome);

  const gold = new THREE.MeshStandardMaterial({ color: '#d4a373', metalness: 0.85, roughness: 0.3 });
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), gold);
  knob.position.y = 0.6 + R + 0.06;
  scene.add(knob);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.01, 0.03, 10, 64), gold);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -2.4;
  scene.add(ring);

  const wood = new THREE.MeshStandardMaterial({ color: '#7a2a1c', roughness: 0.45, metalness: 0.1 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.62, 0.3, 64), wood);
  base.position.y = -2.56;
  scene.add(base);

  // ============ BRILLO, PÉTALOS QUE CAEN Y DESTELLOS ============
  const glowMap = glowTexture();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowMap,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0,
  }));
  glow.scale.setScalar(3);
  glow.position.set(0, 0.35, -0.3);
  scene.add(glow);

  const fallingGeo = petalGeometry({
    width: 0.2, height: 0.22, cup: 0.6, curl: 0.2,
    palette: { base: '#6e0d26', mid: '#c41c48', edge: '#f06a8c' },
  });
  const falling = [0, 1, 2].map((i) => {
    const material = petalMaterial.clone();
    material.transparent = true;
    material.opacity = 0;
    const mesh = new THREE.Mesh(fallingGeo, material);
    scene.add(mesh);
    return { mesh, phase: i * 2.8, x: [-0.45, 0.4, -0.15][i], z: [0.2, -0.1, 0.35][i] };
  });

  const SPARKS = 40;
  const sparkPositions = new Float32Array(SPARKS * 3);
  const sparkSpeed = [];
  for (let i = 0; i < SPARKS; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 1.0;
    sparkPositions.set([Math.cos(a) * r, -2.3 + Math.random() * 3, Math.sin(a) * r], i * 3);
    sparkSpeed.push(0.12 + Math.random() * 0.2);
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({
    map: glowMap,
    size: 0.09,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  scene.add(sparks);

  // ============ ANIMACIÓN ============
  const stemIndexCount = stemGeo.index.count;

  function update(elapsed, dt) {
    // Con movimiento reducido todo aparece ya abierto y quieto
    const t = reducedMotion ? 100 : elapsed;

    // El tallo crece de abajo hacia arriba
    stemGeo.setDrawRange(0, Math.floor(stemIndexCount * ease(t / 1.2) / 6) * 6);

    leaves.forEach(({ cluster, delay, size }) => cluster.scale.setScalar(size * ease((t - delay) / 0.9)));

    head.scale.setScalar(1.3 * ease((t - 1.0) / 1.2));
    flower.petals.forEach(({ mesh, open, delay }) => {
      mesh.rotation.x = 0.02 + (open - 0.02) * ease((t - delay) / 1.6);
    });

    // El botón aparece y luego "respira" despacio
    const breathe = reducedMotion ? 1 : 1 + 0.05 * Math.sin(elapsed * 1.6);
    bud.scale.setScalar(ease((t - 2.4) / 1.2) * breathe);

    if (!reducedMotion) {
      rose.rotation.z = Math.sin(elapsed * 0.6) * 0.015;
    }

    glow.material.opacity = ease((t - 2.5) / 2) * (0.55 + 0.2 * Math.sin(elapsed * 2));
    sparks.material.opacity = ease((t - 3) / 2) * 0.9;

    if (reducedMotion) return;

    // Pétalos que caen girando, se quedan en la base y desaparecen
    falling.forEach((p) => {
      const cycle = 8.4;
      const local = elapsed - 5 - p.phase;
      if (local < 0) return;
      const k = (local % cycle) / cycle;
      const fall = ease(k / 0.7);
      p.mesh.position.set(
        p.x + Math.sin(local * 1.7) * 0.12 * (1 - fall),
        0.1 - fall * 2.48,
        p.z,
      );
      p.mesh.rotation.set(fall * 4, fall * 3, Math.sin(local) * 0.5);
      p.mesh.material.opacity = k < 0.05 ? k / 0.05 : k > 0.8 ? (1 - k) / 0.2 : 1;
    });

    // Destellos que suben dentro del vaso
    const pos = sparkGeo.attributes.position;
    for (let i = 0; i < SPARKS; i++) {
      let y = pos.getY(i) + sparkSpeed[i] * dt;
      if (y > 1.4) y = -2.3;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  }

  function dispose() {
    scene.traverse((obj) => {
      obj.geometry?.dispose();
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      materials.forEach((m) => m?.dispose());
    });
    glowMap.dispose();
    envTexture.dispose();
    pmrem.dispose();
  }

  return { scene, update, dispose };
}
