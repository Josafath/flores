'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createRoseScene } from './roseScene';
import styles from './Rose3D.module.css';

// Rosa en 3D con three.js. Si el dispositivo no soporta WebGL, muestra `fallback`.
export default function Rose3D({ fallback }) {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1;
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 1.7, 8.8);

    // Arrastrar para girar; sin zoom ni desplazamiento
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, -0.5, 0);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.6;
    controls.minPolarAngle = Math.PI / 2 - 0.6;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.update();

    const { scene, update, dispose } = createRoseScene(renderer, { reducedMotion });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const timer = new THREE.Timer();
    let frame;
    const loop = (time) => {
      frame = requestAnimationFrame(loop);
      timer.update(time);
      update(timer.getElapsed(), Math.min(timer.getDelta(), 0.1));
      controls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  if (failed) return fallback;

  return (
    <div className={styles.wrap}>
      <div
        ref={mountRef}
        className={styles.scene}
        role="img"
        aria-label="Una rosa roja y un botón dentro de un vaso de cristal"
      />
      <p className={styles.hint}>Desliza para girarla</p>
    </div>
  );
}
