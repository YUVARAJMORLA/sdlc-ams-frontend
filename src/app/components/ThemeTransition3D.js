'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../ThemeContext';

export default function ThemeTransition3D() {
  const { transitionAnimation } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!transitionAnimation) return;

    const container = canvasRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (_) {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 50;

    let reqId;
    const startTime = performance.now();

    // ── METEOR SHOWER ANIMATION (Light -> Dark) ──
    if (transitionAnimation === 'meteor') {
      const meteorCount = 75;
      const meteors = [];

      for (let i = 0; i < meteorCount; i++) {
        const length = 8 + Math.random() * 12;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
          0, 0, 0,
          length * 0.7, length * 1.0, length * 0.3,
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const colors = [0x34d399, 0x38bdf8, 0xa7f3d0, 0xffffff];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const material = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.85,
        });

        const line = new THREE.Line(geometry, material);
        line.position.set(
          (Math.random() - 0.2) * 90,
          Math.random() * 60 + 10,
          (Math.random() - 0.5) * 40
        );

        const headGeom = new THREE.SphereGeometry(0.35 + Math.random() * 0.35, 12, 12);
        const headMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.95,
        });
        const head = new THREE.Mesh(headGeom, headMat);
        line.add(head);

        meteors.push({
          mesh: line,
          speed: 1.8 + Math.random() * 2.2,
          resetY: 50 + Math.random() * 30,
        });
        scene.add(line);
      }

      const starCount = 200;
      const starGeom = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 120;
        starPos[i + 1] = (Math.random() - 0.5) * 80;
        starPos[i + 2] = (Math.random() - 0.5) * 60;
      }
      starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.6,
        transparent: true,
        opacity: 0.7,
      });
      const starField = new THREE.Points(starGeom, starMat);
      scene.add(starField);

      const animate = (now) => {
        meteors.forEach((m) => {
          m.mesh.position.x -= m.speed * 0.9;
          m.mesh.position.y -= m.speed * 1.2;
          m.mesh.position.z -= m.speed * 0.3;

          if (m.mesh.position.y < -40 || m.mesh.position.x < -60) {
            m.mesh.position.set(
              (Math.random() - 0.2) * 90 + 20,
              m.resetY,
              (Math.random() - 0.5) * 40
            );
          }
        });

        renderer.render(scene, camera);
        reqId = requestAnimationFrame(animate);
      };
      reqId = requestAnimationFrame(animate);
    }

    // ── SUNLIGHT / SOLAR RAY BURST ANIMATION (Dark -> Light) ──
    if (transitionAnimation === 'sunlight') {
      const sunGroup = new THREE.Group();
      scene.add(sunGroup);

      const sunGeom = new THREE.SphereGeometry(6, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.95,
      });
      const sun = new THREE.Mesh(sunGeom, sunMat);
      sun.position.set(0, 18, 0);
      sunGroup.add(sun);

      const haloGeom = new THREE.RingGeometry(6.5, 14, 48);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const halo = new THREE.Mesh(haloGeom, haloMat);
      halo.position.set(0, 18, -1);
      sunGroup.add(halo);

      const rayCount = 28;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        const length = 40 + Math.random() * 25;
        const rayGeom = new THREE.ConeGeometry(1.6 + Math.random() * 1.5, length, 16);
        const rayMat = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xfffbeb : 0xfde047,
          transparent: true,
          opacity: 0.35 + Math.random() * 0.25,
        });
        const ray = new THREE.Mesh(rayGeom, rayMat);
        ray.position.set(0, 18, 0);
        ray.rotation.z = angle;
        ray.translateY(length / 2 + 5);
        sunGroup.add(ray);
      }

      const animate = (now) => {
        const elapsed = (now - startTime) / 1000;
        sunGroup.rotation.z = elapsed * 0.15;
        sun.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.08);
        renderer.render(scene, camera);
        reqId = requestAnimationFrame(animate);
      };
      reqId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(reqId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [transitionAnimation]);

  if (!transitionAnimation) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        overflow: 'hidden',
        animation: 'themeTransitionFade 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      }}
    >
      <div ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />

      {transitionAnimation === 'meteor' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 80% 20%, rgba(15, 23, 42, 0.88) 0%, rgba(10, 14, 23, 0.96) 100%)',
          }}
        />
      )}

      {transitionAnimation === 'sunlight' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 25%, rgba(254, 240, 138, 0.75) 0%, rgba(255, 251, 235, 0.9) 50%, rgba(255, 255, 255, 0.95) 100%)',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: transitionAnimation === 'meteor'
            ? 'rgba(15, 23, 42, 0.92)'
            : 'rgba(255, 255, 255, 0.94)',
          border: transitionAnimation === 'meteor'
            ? '1px solid rgba(52, 211, 153, 0.4)'
            : '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: transitionAnimation === 'meteor'
            ? '0 8px 32px rgba(16, 185, 129, 0.35)'
            : '0 8px 32px rgba(245, 158, 11, 0.35)',
          borderRadius: '100px',
          padding: '8px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: transitionAnimation === 'meteor' ? '#34d399' : '#b45309',
          fontWeight: 800,
          fontSize: '0.86rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        <span className="material-icons" style={{ fontSize: '1.2rem' }}>
          {transitionAnimation === 'meteor' ? 'nights_stay' : 'wb_sunny'}
        </span>
        <span>
          {transitionAnimation === 'meteor'
            ? 'Celestial Dark Mode · Meteor Shower'
            : 'Solar Daylight Mode · Dawn Rays'}
        </span>
      </div>

      <style jsx>{`
        @keyframes themeTransitionFade {
          0% { opacity: 0; }
          15% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
