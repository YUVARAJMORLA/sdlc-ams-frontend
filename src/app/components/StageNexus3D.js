'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const STAGE_PAIRS = [
  {
    id: 0,
    sdlc: { name: 'Requirements', color: '#da3633', icon: 'checklist' },
    ams: { name: 'Service Management', color: '#0ea5e9', icon: 'support_agent' },
    connection: 'User SLA Feedback Loop',
    desc: 'Service tickets and customer demand metrics dynamically feed backlog refinement and AI requirement synthesis.',
  },
  {
    id: 1,
    sdlc: { name: 'Architecture', color: '#1f6feb', icon: 'account_tree' },
    ams: { name: 'Problem Management', color: '#a855f7', icon: 'manage_search' },
    connection: 'RCA & Technical Debt Resilience',
    desc: 'Deep root-cause analyses from production issues automatically inform architectural refactoring and compliance drift checks.',
  },
  {
    id: 2,
    sdlc: { name: 'Development', color: '#10b981', icon: 'code' },
    ams: { name: 'Change Management', color: '#f97316', icon: 'published_with_changes' },
    connection: 'Blast-Radius & Automated CAB',
    desc: 'AI coding agent pull requests receive instant blast-radius scoring and automated change validation for zero-delay approvals.',
  },
  {
    id: 3,
    sdlc: { name: 'Testing', color: '#d29922', icon: 'science' },
    ams: { name: 'Incident Management', color: '#f43f5e', icon: 'warning_amber' },
    connection: 'Synthetic Verification & Auto-Healing',
    desc: 'Synthetic E2E test suites validate auto-triage runbooks, enabling production self-healing without regressions.',
  },
  {
    id: 4,
    sdlc: { name: 'Deployment', color: '#8957e5', icon: 'rocket_launch' },
    ams: { name: 'Release Management', color: '#10b981', icon: 'rocket_launch' },
    connection: 'Autonomous Quality Gates',
    desc: 'Canary telemetry and AI go/no-go recommendations orchestrate zero-downtime progressive rollouts and instant rollbacks.',
  },
];

export default function StageNexus3D({ activePairIndex, onSelectPair }) {
  const mountRef = useRef(null);
  const [hoveredPair, setHoveredPair] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      return;
    }

    const width = container.clientWidth || 800;
    const height = 360;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 22;

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ── 3D Geometry Layout: Dual Arcs (SDLC on Left, AMS on Right) ──
    const pairCount = 5;
    const sdlcNodes = [];
    const amsNodes = [];
    const beams = [];
    const pulseBeams = [];

    // Colors
    const sdlcColor = new THREE.Color(0x10b981); // Emerald
    const amsColor = new THREE.Color(0x6366f1);  // Cyber Indigo

    for (let i = 0; i < pairCount; i++) {
      const y = (2 - i) * 2.6; // Spacing along Y-axis

      // Left SDLC Node
      const sdlcGeom = new THREE.SphereGeometry(0.55, 24, 24);
      const sdlcMat = new THREE.MeshBasicMaterial({
        color: sdlcColor,
        transparent: true,
        opacity: 0.9,
      });
      const sdlcMesh = new THREE.Mesh(sdlcGeom, sdlcMat);
      sdlcMesh.position.set(-7.5, y, 0);
      mainGroup.add(sdlcMesh);
      sdlcNodes.push(sdlcMesh);

      // Left Node Halo
      const haloGeom = new THREE.RingGeometry(0.7, 0.85, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: sdlcColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const halo = new THREE.Mesh(haloGeom, haloMat);
      halo.position.set(-7.5, y, 0);
      mainGroup.add(halo);

      // Right AMS Node
      const amsGeom = new THREE.SphereGeometry(0.55, 24, 24);
      const amsMat = new THREE.MeshBasicMaterial({
        color: amsColor,
        transparent: true,
        opacity: 0.9,
      });
      const amsMesh = new THREE.Mesh(amsGeom, amsMat);
      amsMesh.position.set(7.5, y, 0);
      mainGroup.add(amsMesh);
      amsNodes.push(amsMesh);

      // Right Node Halo
      const amsHaloMat = new THREE.MeshBasicMaterial({
        color: amsColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const amsHalo = new THREE.Mesh(haloGeom, amsHaloMat);
      amsHalo.position.set(7.5, y, 0);
      mainGroup.add(amsHalo);

      // Connecting Beam Curve (Quadratic Bezier Curve with gentle arch in Z)
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-7.5, y, 0),
        new THREE.Vector3(0, y + (i % 2 === 0 ? 0.8 : -0.8), 2.2),
        new THREE.Vector3(7.5, y, 0)
      );

      const points = curve.getPoints(40);
      const beamGeom = new THREE.BufferGeometry().setFromPoints(points);
      const beamMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x34d399 : 0x818cf8,
        transparent: true,
        opacity: 0.32,
      });
      const beamLine = new THREE.Line(beamGeom, beamMat);
      mainGroup.add(beamLine);
      beams.push({ line: beamLine, mat: beamMat, curve, index: i });

      // Energy Pulse traveling along the curve
      const pulseGeom = new THREE.SphereGeometry(0.2, 16, 16);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
      });
      const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
      mainGroup.add(pulseMesh);
      pulseBeams.push({ mesh: pulseMesh, curve, progress: i * 0.2 });
    }

    // Central Floating Nexus Ring
    const nexusRingGeom = new THREE.TorusGeometry(3.2, 0.08, 16, 64);
    const nexusRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const nexusRing = new THREE.Mesh(nexusRingGeom, nexusRingMat);
    mainGroup.add(nexusRing);

    // Mouse / Cursor interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      mouseX = x;
      mouseY = y;
    };

    container.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 800;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', onResize);

    // ── Animation Loop ──
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera tilt towards mouse
      targetRotY = mouseX * 0.25;
      targetRotX = -mouseY * 0.15;
      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;

      // Central ring rotation
      nexusRing.rotation.z = elapsed * 0.15;
      nexusRing.rotation.y = elapsed * 0.2;

      // Animate pulses along curves
      pulseBeams.forEach((pulse) => {
        pulse.progress = (pulse.progress + 0.006) % 1;
        const pos = pulse.curve.getPointAt(pulse.progress);
        pulse.mesh.position.copy(pos);
      });

      // Highlight active or hovered pair
      const activeIdx = hoveredPair !== null ? hoveredPair : (activePairIndex ?? 2);
      beams.forEach((beam, idx) => {
        if (idx === activeIdx) {
          beam.mat.opacity = 0.85;
          beam.line.scale.set(1.03, 1.03, 1.03);
          sdlcNodes[idx].scale.set(1.25, 1.25, 1.25);
          amsNodes[idx].scale.set(1.25, 1.25, 1.25);
        } else {
          beam.mat.opacity = 0.25;
          beam.line.scale.set(1, 1, 1);
          sdlcNodes[idx].scale.set(1, 1, 1);
          amsNodes[idx].scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [hoveredPair, activePairIndex]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '360px',
          cursor: 'grab',
          background: 'linear-gradient(135deg, rgba(26,127,55,0.04) 0%, rgba(99,102,241,0.04) 100%)',
          borderRadius: '16px',
        }}
      />

      {/* Floating Interactive Stage Label Cards Over 3D Scene */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(26, 127, 55, 0.3)',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--green-primary)',
          pointerEvents: 'none',
        }}
      >
        <span className="material-icons" style={{ fontSize: '1rem' }}>developer_mode</span>
        SDLC Engineering Stages
      </div>

      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#6366f1',
          pointerEvents: 'none',
        }}
      >
        <span className="material-icons" style={{ fontSize: '1rem' }}>support_agent</span>
        AMS Operations Stages
      </div>

      {/* Interactive Pair Clickers / Selector Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          padding: '16px',
          background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {STAGE_PAIRS.map((pair, idx) => {
          const isSelected = (hoveredPair !== null ? hoveredPair : (activePairIndex ?? 2)) === idx;
          return (
            <button
              key={pair.id}
              type="button"
              onMouseEnter={() => setHoveredPair(idx)}
              onMouseLeave={() => setHoveredPair(null)}
              onClick={() => onSelectPair && onSelectPair(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: isSelected ? '1.5px solid var(--green-primary)' : '1px solid var(--border)',
                background: isSelected ? 'rgba(26,127,55,0.08)' : 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: isSelected ? '0 4px 14px rgba(26,127,55,0.18)' : 'none',
              }}
            >
              <span style={{ fontWeight: 700, color: 'rgb(26, 127, 55)' }}>{pair.sdlc.name}</span>
              <span className="material-icons" style={{ fontSize: '0.88rem', color: '#8b949e' }}>sync_alt</span>
              <span style={{ fontWeight: 700, color: '#6366f1' }}>{pair.ams.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export { STAGE_PAIRS };
