'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL not supported, skipping 3D background');
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    // Main 3D Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ── 1. Central Radar Polyhedron (Icosahedron Wireframe) ──
    const icosaGeom = new THREE.IcosahedronGeometry(5.2, 1);
    const wireframeGeom = new THREE.WireframeGeometry(icosaGeom);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const radarCore = new THREE.LineSegments(wireframeGeom, lineMaterial);
    mainGroup.add(radarCore);

    // Inner geometric diamond core
    const innerDiamondGeom = new THREE.OctahedronGeometry(2.4, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const innerDiamond = new THREE.Mesh(innerDiamondGeom, innerMaterial);
    mainGroup.add(innerDiamond);

    // ── 2. Concentric Floating Radar Rings (Diagnostic Scanners) ──
    const rings = [];
    const ringRadii = [6.8, 8.4, 10.2];
    const ringColors = [0x10b981, 0x6366f1, 0x38bdf8];

    ringRadii.forEach((radius, i) => {
      const ringGeom = new THREE.RingGeometry(radius, radius + 0.05, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[i % ringColors.length],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22 - i * 0.04,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + (i * 0.25);
      ringMesh.rotation.y = (i * 0.3);
      mainGroup.add(ringMesh);
      rings.push({ mesh: ringMesh, speed: (i % 2 === 0 ? 0.003 : -0.0025) * (i + 1) });
    });

    // ── 3. 10 Domain Constellation Nodes (5 SDLC + 5 AMS) ──
    const nodesGroup = new THREE.Group();
    mainGroup.add(nodesGroup);

    const nodeCount = 10;
    const nodeSpheres = [];
    const nodeColors = [
      0x10b981, 0x10b981, 0x10b981, 0x10b981, 0x10b981, // SDLC Emerald
      0x6366f1, 0x6366f1, 0x6366f1, 0x6366f1, 0x6366f1  // AMS Cyber Indigo
    ];

    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 2;
      const radius = 6.2 + Math.sin(i * 1.5) * 0.8;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * (radius * 0.65);
      const z = (Math.sin(i * 2.2)) * 3;

      const sphereGeom = new THREE.SphereGeometry(0.22, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: nodeColors[i],
        transparent: true,
        opacity: 0.85,
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.set(x, y, z);
      nodesGroup.add(sphere);
      nodeSpheres.push({ mesh: sphere, initialY: y, theta, radius });
    }

    // Connect constellation nodes with dynamic glowing lattice lines
    const linePositions = [];
    for (let i = 0; i < nodeCount; i++) {
      const p1 = nodeSpheres[i].mesh.position;
      const p2 = nodeSpheres[(i + 1) % nodeCount].mesh.position;
      linePositions.push(p1.x, p1.y, p1.z);
      linePositions.push(p2.x, p2.y, p2.z);

      if (i % 2 === 0) {
        const pOpposite = nodeSpheres[(i + 5) % nodeCount].mesh.position;
        linePositions.push(p1.x, p1.y, p1.z);
        linePositions.push(pOpposite.x, pOpposite.y, pOpposite.z);
      }
    }

    const constLineGeom = new THREE.BufferGeometry();
    constLineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const constLineMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.22,
    });
    const constellationLines = new THREE.LineSegments(constLineGeom, constLineMat);
    nodesGroup.add(constellationLines);

    // ── 4. Floating Ambient Particles (AI Telemetry Cloud) ──
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 32;
      particlePositions[i + 1] = (Math.random() - 0.5) * 22;
      particlePositions[i + 2] = (Math.random() - 0.5) * 18;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xa7f3d0,
      size: 0.14,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    mainGroup.add(particles);

    // ── 5. Mouse Interaction & Scroll Tracking ──
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let scrollOffset = 0;

    const handleMouseMove = (event) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) / windowHalfX;
      mouseY = (event.clientY - windowHalfY) / windowHalfY;
    };

    const handleScroll = () => {
      scrollOffset = window.scrollY || window.pageYOffset || 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 550;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // ── 6. Animation Loop (60 FPS Smooth Interpolation) ──
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp towards mouse & scroll position
      targetRotationY = (mouseX * 0.45) + (scrollOffset * 0.0008);
      targetRotationX = (mouseY * 0.35) + (scrollOffset * 0.0004);

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.04;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.04;

      // Polyhedron & core dynamic rotation
      radarCore.rotation.y = elapsedTime * 0.12;
      radarCore.rotation.z = Math.sin(elapsedTime * 0.2) * 0.15;

      innerDiamond.rotation.x = -elapsedTime * 0.2;
      innerDiamond.rotation.y = elapsedTime * 0.25;

      // Pulse rings
      rings.forEach((ring, idx) => {
        ring.mesh.rotation.z += ring.speed;
        const scalePulse = 1 + Math.sin(elapsedTime * 1.5 + idx) * 0.04;
        ring.mesh.scale.set(scalePulse, scalePulse, 1);
      });

      // Subtle breathing motion on constellation nodes
      nodeSpheres.forEach((node, idx) => {
        const floatDelta = Math.sin(elapsedTime * 1.8 + idx) * 0.25;
        node.mesh.position.y = node.initialY + floatDelta;
      });

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      icosaGeom.dispose();
      wireframeGeom.dispose();
      lineMaterial.dispose();
      innerDiamondGeom.dispose();
      innerMaterial.dispose();
      constLineGeom.dispose();
      constLineMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        opacity: 0.88,
      }}
      aria-hidden="true"
    />
  );
}
