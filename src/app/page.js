'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import Hero3DBackground from './components/Hero3DBackground';
import StageNexus3D, { STAGE_PAIRS } from './components/StageNexus3D';

const SDLC_AREAS = [
  { stage: '01', name: 'Requirements', color: '#da3633', icon: 'checklist', amsPartner: 'Service Management', synergyBadge: 'User SLA Feedback', desc: 'AI-powered idea exploration, backlog refinement, impact analysis, and bidirectional traceability.' },
  { stage: '02', name: 'Architecture', color: '#1f6feb', icon: 'account_tree', amsPartner: 'Problem Management', synergyBadge: 'RCA & Drift Resilience', desc: 'Architecture synthesisers, diagram generation, PR drift detection, compliance analysis, and FinOps.' },
  { stage: '03', name: 'Development', color: 'rgb(26, 127, 55)', icon: 'code', amsPartner: 'Change Management', synergyBadge: 'Blast-Radius CAB', desc: 'AI coding assistants, agentic pull requests, custom MCP scripts, and dependency mapping.' },
  { stage: '04', name: 'Testing', color: '#d29922', icon: 'science', amsPartner: 'Incident Management', synergyBadge: 'Synthetic Runbooks', desc: 'E2E workflow automation, synthetic data creation, defect classification, and test generation.' },
  { stage: '05', name: 'Deployment', color: '#8957e5', icon: 'rocket_launch', amsPartner: 'Release Management', synergyBadge: 'Canary Quality Gates', desc: 'Automated release notes, capacity prediction, self-healing systems, and CI/CD quality gates.' },
];

const AMS_AREAS = [
  { stage: '01', name: 'Service Management', color: '#0ea5e9', icon: 'support_agent', sdlcPartner: 'Requirements', synergyBadge: 'Backlog Feedback Loop', desc: 'AI-driven SLA monitoring, self-service request fulfilment, and proactive service catalogue governance.' },
  { stage: '02', name: 'Incident Management', color: '#f43f5e', icon: 'warning_amber', sdlcPartner: 'Testing', synergyBadge: 'Defect Telemetry', desc: 'Automated incident triage, runbook execution, self-healing remediation, and escalation intelligence.' },
  { stage: '03', name: 'Change Management', color: '#f97316', icon: 'published_with_changes', sdlcPartner: 'Development', synergyBadge: 'Agentic PR Risk Score', desc: 'AI change risk scoring, conflict detection, blast radius prediction, and approval automation.' },
  { stage: '04', name: 'Problem Management', color: '#a855f7', icon: 'manage_search', sdlcPartner: 'Architecture', synergyBadge: 'RCA Architecture Modernization', desc: 'Automated root cause analysis, predictive anomaly detection, and structured problem resolution.' },
  { stage: '05', name: 'Release Management', color: '#10b981', icon: 'rocket_launch', sdlcPartner: 'Deployment', synergyBadge: 'Automated Go/No-Go', desc: 'AI-powered release gate assessment, pipeline orchestration, and go/no-go recommendation engine.' },
];

const LEVELS = [
  { label: 'L0', title: 'Traditional', color: '#484f58', sdlc: 'Manual coding, manual code reviews, zero AI integration.', ams: 'Manual ticketing, reactive incident triage, static runbooks.', desc: 'Entirely manual processes. No AI tools integrated into workflows.' },
  { label: 'L1', title: 'Assisted / Tool', color: '#1f6feb', sdlc: 'Inline autocomplete, chat assistants, ad-hoc helper scripts.', ams: 'Knowledge-base search bots, ad-hoc diagnostic CLI scripts.', desc: 'Basic inline autocomplete, chat assistants, and ad-hoc AI scripts.' },
  { label: 'L2', title: 'Delegated / Assistant', color: '#8957e5', sdlc: 'Copilots draft tests, review PRs, and synthesize specs.', ams: 'AI drafts ticket responses, classifies incidents under supervision.', desc: 'AI acts as copilot — opening tickets, drafting analyses under supervision.' },
  { label: 'L3', title: 'Supervised Agent', color: '#d29922', sdlc: 'Agents execute multi-step refactoring with human approval gates.', ams: 'Agents execute automated runbooks with operator confirmation.', desc: 'AI agents orchestrate multi-step tasks with human approval gates.' },
  { label: 'L4', title: 'Autonomous Workforce', color: '#2ea043', sdlc: 'Automated safety nets, continuous eval harnesses, autonomous PRs.', ams: 'Automated incident self-healing, predictive capacity scaling.', desc: 'Automated safety nets, autonomous task execution, structured evals.' },
  { label: 'L5', title: 'Agentic Enterprise', color: '#3fb950', sdlc: 'Self-healing code, automatic architectural drift remediation.', ams: 'Autonomous zero-downtime operations, closed-loop resilience.', desc: 'Self-healing production, automatic drift remediation, fully autonomous workflows.' },
];

export default function Home() {
  const { user } = useAuth();
  const [activeFramework, setActiveFramework] = useState('SDLC'); // 'SDLC' | 'AMS' | 'SYNERGY'
  const [activePairIndex, setActivePairIndex] = useState(2);
  const [sdlcCount, setSdlcCount] = useState(120);
  const [amsCount, setAmsCount] = useState(10);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [r1, r2] = await Promise.all([
          fetch('/api/questions?framework=SDLC', { cache: 'no-store' }),
          fetch('/api/questions?framework=AMS', { cache: 'no-store' }),
        ]);
        if (r1.ok) { const d = await r1.json(); setSdlcCount(d.questions?.length || 120); }
        if (r2.ok) { const d = await r2.json(); setAmsCount(d.questions?.length || 10); }
      } catch (_) { }
    }
    fetchCounts();
  }, []);

  const handle3dCardTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6.5;
    const rotateY = ((x - centerX) / centerX) * 6.5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px) scale3d(1.015, 1.015, 1.015)`;
  };

  const handle3dCardReset = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
    card.style.boxShadow = 'none';
  };

  const dashboardLink = user
    ? (user.role === 'admin' || user.email === 'admin@sdlc.com' ? '/admin' : '/dashboard')
    : null;

  const areas = activeFramework === 'SDLC' ? SDLC_AREAS : AMS_AREAS;

  return (
    <div className="landing-container">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-section text-center" style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '80px 40px',
        position: 'relative', overflow: 'hidden', marginBottom: '40px',
      }}>
        {/* Interactive 3D WebGL Radar Polyhedron & Telemetry Cloud */}
        <Hero3DBackground />

        <div style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '320px',
          background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.09) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)', fontWeight: 800,
            fontFamily: 'var(--font-sans)', letterSpacing: '-0.04em',
            lineHeight: 1.15, marginBottom: '20px', color: 'var(--text-primary)',
          }}>
            Measure. Benchmark.<br />
            <span style={{ background: 'linear-gradient(135deg, rgb(26, 127, 55) 0%, #1f6feb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Elevate Your AI Maturity
            </span>
          </h1>

          <p style={{ maxWidth: '700px', margin: '0 auto 32px', color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.75 }}>
            Two precision assessment frameworks —{' '}
            <strong style={{ color: 'rgb(26, 127, 55)' }}>SDLC Intelligence</strong> and{' '}
            <strong style={{ color: '#6366f1' }}>AMS Intelligence</strong> — to audit your engineering and operations teams across every AI maturity dimension.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {user ? (
              <Link href={dashboardLink} className="btn-primary-action">Go to Dashboard →</Link>
            ) : (
              <>
                <Link href="/signup" className="btn-primary-action">Get Started Free →</Link>
                <Link href="/login" className="btn-secondary-action">Sign In</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Two Framework Cards ──────────────────────────────────────────── */}
      <section style={{ marginBottom: '48px' }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="divider flex-grow-1" />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Two Assessment Frameworks</span>
          <div className="divider flex-grow-1" />
        </div>

        <div className="row g-4 mb-4">
          {/* SDLC Card */}
          <div className="col-md-6">
            <div style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: '18px', overflow: 'hidden', height: '100%',
              borderTop: '3px solid rgb(26, 127, 55)',
              transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
              display: 'flex', flexDirection: 'column',
              transformStyle: 'preserve-3d',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(16,185,129,0.18)'; }}
              onMouseMove={handle3dCardTilt}
              onMouseLeave={handle3dCardReset}
            >
              {/* Image & Header Overlay */}
              <div style={{ width: '100%', height: '170px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                <img src="/sdlc_card.jpg" alt="SDLC pipeline illustration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: '14px', left: '16px',
                  background: 'rgba(15,23,42,0.78)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(26,127,55,0.4)', borderRadius: '100px',
                  padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgb(26, 127, 55)' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Framework 01 · Delivery</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-icons" style={{ color: 'rgb(26, 127, 55)', fontSize: '1.3rem' }}>developer_mode</span>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>SDLC Intelligence</h2>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Software Engineering &amp; Delivery Lifecycle</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '18px', flexGrow: 1 }}>
                  Audit your engineering team&apos;s AI maturity across the full delivery pipeline — from autonomous requirements synthesis and architecture modeling to coding copilots, synthetic QA, and canary release gates.
                </p>

                {/* 5-Stage Progression Sequence */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    Sequential Delivery Stages:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                    {SDLC_AREAS.map((a, i) => (
                      <React.Fragment key={a.name}>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, color: a.color,
                          background: `${a.color}14`, border: `1px solid ${a.color}35`,
                          borderRadius: '6px', padding: '3px 8px',
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                        }}>
                          <span style={{ opacity: 0.6, fontSize: '0.62rem' }}>{a.stage}</span>
                          {a.name}
                        </span>
                        {i < SDLC_AREAS.length - 1 && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'rgb(26, 127, 55)', fontSize: '1.1rem', fontWeight: 800 }}>{sdlcCount}</strong> practices · 5 domains
                  </div>
                  <Link href="/sdlc" className="btn-primary-action" style={{ fontSize: '0.82rem', padding: '7px 18px', textDecoration: 'none' }}>
                    Start SDLC Audit →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* AMS Card */}
          <div className="col-md-6">
            <div style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: '18px', overflow: 'hidden', height: '100%',
              borderTop: '3px solid #6366f1',
              transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
              display: 'flex', flexDirection: 'column',
              transformStyle: 'preserve-3d',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.18)'; }}
              onMouseMove={handle3dCardTilt}
              onMouseLeave={handle3dCardReset}
            >
              {/* Image & Header Overlay */}
              <div style={{ width: '100%', height: '170px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                <img src="/ams_card.jpg" alt="AMS operations dashboard illustration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: '14px', left: '16px',
                  background: 'rgba(15,23,42,0.78)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(99,102,241,0.4)', borderRadius: '100px',
                  padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366f1' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Framework 02 · Operations</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(99,102,241,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-icons" style={{ color: '#6366f1', fontSize: '1.3rem' }}>support_agent</span>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>AMS Intelligence</h2>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Application Management &amp; Operational Excellence</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '18px', flexGrow: 1 }}>
                  Evaluate your operational teams across application sustainment — from AI service catalog automation and predictive incident triage to change-risk blast radius, automated RCA, and release orchestration.
                </p>

                {/* 5-Stage Progression Sequence */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    Sequential Operational Stages:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                    {AMS_AREAS.map((a, i) => (
                      <React.Fragment key={a.name}>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, color: a.color,
                          background: `${a.color}14`, border: `1px solid ${a.color}35`,
                          borderRadius: '6px', padding: '3px 8px',
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                        }}>
                          <span style={{ opacity: 0.6, fontSize: '0.62rem' }}>{a.stage}</span>
                          {a.name}
                        </span>
                        {i < AMS_AREAS.length - 1 && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: '#6366f1', fontSize: '1.1rem', fontWeight: 800 }}>{amsCount}</strong> workflows · 5 domains
                  </div>
                  <Link href="/ams" className="btn-secondary-action" style={{ fontSize: '0.82rem', padding: '7px 18px', textDecoration: 'none' }}>
                    Start AMS Audit →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Closed-Loop Enterprise AI Synergy Bridge ──────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(26,127,55,0.06) 0%, rgba(99,102,241,0.07) 100%)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: '16px', padding: '24px 28px',
          display: 'flex', flexDirection: 'column', gap: '16px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, rgb(26,127,55) 0%, #38bdf8 50%, #6366f1 100%)',
          }} />

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(26,127,55,0.2) 0%, rgba(99,102,241,0.2) 100%)',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span className="material-icons" style={{ color: '#38bdf8', fontSize: '1.35rem' }}>hub</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cross-Framework Synergy</span>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', borderRadius: '4px', padding: '2px 6px', fontWeight: 700 }}>Continuous Telemetry Loop</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  Closed-Loop Feedback: How SDLC Engineering Feeds AMS Operations
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveFramework('SYNERGY');
                document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(26,127,55,0.85) 0%, rgba(99,102,241,0.85) 100%)',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '8px 18px', fontSize: '0.82rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 4px 14px rgba(99,102,241,0.25)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Explore 3D Stage Nexus ⇄
            </button>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0, maxWidth: '960px' }}>
            True AI maturity is achieved when engineering and operational workflows interconnect autonomously. Production incidents in AMS directly generate synthetic test regressions and architectural fixes in SDLC, while developer coding assistants and automated pull requests continuously evaluate operational blast-radius before entering change management.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '6px' }}>
            {STAGE_PAIRS.map((pair, idx) => (
              <button
                key={pair.id}
                onClick={() => {
                  setActiveFramework('SYNERGY');
                  setActivePairIndex(idx);
                  document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: '100px', padding: '4px 12px', fontSize: '0.74rem',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = pair.sdlc.color;
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span style={{ color: pair.sdlc.color, fontWeight: 700 }}>{pair.sdlc.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>⇄</span>
                <span style={{ color: pair.ams.color, fontWeight: 700 }}>{pair.ams.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Domain Explorer (tabbed) with 3D Stage Nexus ────────────────────── */}
      <section id="domains" style={{ marginBottom: '48px' }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="divider flex-grow-1" />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Assessment Domains</span>
          <div className="divider flex-grow-1" />
        </div>

        {/* Tab toggle with 3 options: SDLC, AMS, and 3D Synergy Nexus */}
        <div style={{
          display: 'flex', gap: '6px', marginBottom: '24px',
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '4px', width: 'fit-content', flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setActiveFramework('SDLC')}
            style={{
              padding: '8px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.84rem', transition: 'all 0.2s ease',
              background: activeFramework === 'SDLC' ? 'rgb(26, 127, 55)' : 'transparent',
              color: activeFramework === 'SDLC' ? '#fff' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <span className="material-icons" style={{ fontSize: '1rem' }}>developer_mode</span>
            SDLC Intelligence (5 Stages)
          </button>

          <button
            onClick={() => setActiveFramework('AMS')}
            style={{
              padding: '8px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.84rem', transition: 'all 0.2s ease',
              background: activeFramework === 'AMS' ? '#6366f1' : 'transparent',
              color: activeFramework === 'AMS' ? '#fff' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <span className="material-icons" style={{ fontSize: '1rem' }}>support_agent</span>
            AMS Intelligence (5 Stages)
          </button>

          <button
            onClick={() => setActiveFramework('SYNERGY')}
            style={{
              padding: '8px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.84rem', transition: 'all 0.2s ease',
              background: activeFramework === 'SYNERGY' ? 'linear-gradient(135deg, rgb(26, 127, 55) 0%, #6366f1 100%)' : 'transparent',
              color: activeFramework === 'SYNERGY' ? '#fff' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <span className="material-icons" style={{ fontSize: '1.05rem', color: activeFramework === 'SYNERGY' ? '#fff' : '#38bdf8' }}>insights</span>
            SDLC ⇄ AMS Stage Synergy (3D Nexus)
          </button>
        </div>

        {/* ── Subview 1 & 2: SDLC or AMS Cards ── */}
        {activeFramework !== 'SYNERGY' && (
          <div className="row g-3">
            {areas.map((area, idx) => (
              <div className="col-lg col-md-4 col-sm-6 col-12" key={idx}>
                <div style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: '14px', overflow: 'hidden', height: '100%',
                  display: 'flex', flexDirection: 'column', borderTop: `3px solid ${area.color}`,
                  transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
                  transformStyle: 'preserve-3d',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 14px 32px ${area.color}25`; }}
                  onMouseMove={handle3dCardTilt}
                  onMouseLeave={handle3dCardReset}
                >
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header Pill & Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ width: '38px', height: '38px', background: `${area.color}18`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-icons" style={{ color: area.color, fontSize: '1.25rem' }}>{area.icon}</span>
                      </div>
                      <span style={{
                        fontSize: '0.66rem', fontWeight: 800, color: area.color,
                        background: `${area.color}14`, border: `1px solid ${area.color}35`,
                        borderRadius: '100px', padding: '2px 8px',
                      }}>
                        STAGE {area.stage}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>{area.name}</h3>
                    <p style={{ fontSize: '0.81rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 16px', flexGrow: 1 }}>{area.desc}</p>

                    {/* Operational Cross-Connection Banner */}
                    <div
                      onClick={() => {
                        setActiveFramework('SYNERGY');
                        setActivePairIndex(idx);
                      }}
                      style={{
                        padding: '10px', borderRadius: '8px',
                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                        cursor: 'pointer', transition: 'border-color 0.15s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = area.color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {activeFramework === 'SDLC' ? '⇄ Feeds Into AMS' : '⇄ Connected SDLC'}
                        </span>
                        <span className="material-icons" style={{ fontSize: '0.85rem', color: area.color }}>arrow_forward</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {activeFramework === 'SDLC' ? area.amsPartner : area.sdlcPartner}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: area.color, fontWeight: 600, marginTop: '2px' }}>
                        {area.synergyBadge}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Subview 3: Interactive 3D Stage Nexus & Bi-Directional Spotlight ── */}
        {activeFramework === 'SYNERGY' && (
          <div style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '32px', overflow: 'hidden',
          }}>
            {/* Header info */}
            <div style={{ maxWidth: '780px', margin: '0 auto 24px', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)',
                borderRadius: '100px', padding: '4px 14px', marginBottom: '10px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Interactive 3D WebGL Neural Mesh
                </span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Bi-Directional Stage Telemetry: SDLC ⇄ AMS
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                Explore the deep operational feedback loop between software engineering and IT operations. Click any stage pair below or interact directly with the 3D connection lines to inspect the synergy mechanics.
              </p>
            </div>

            {/* 3D Canvas Viewport */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <StageNexus3D activePairIndex={activePairIndex} onSelectPair={setActivePairIndex} />
            </div>

            {/* Stage Pair Navigation Chips */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              justifyContent: 'center', marginBottom: '24px',
            }}>
              {STAGE_PAIRS.map((pair, idx) => {
                const isSelected = activePairIndex === idx;
                return (
                  <button
                    key={pair.id}
                    onClick={() => setActivePairIndex(idx)}
                    style={{
                      background: isSelected ? 'var(--bg-surface)' : 'transparent',
                      border: isSelected ? `2px solid ${pair.sdlc.color}` : '1px solid var(--border)',
                      borderRadius: '10px', padding: '8px 14px',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 4px 16px ${pair.sdlc.color}30` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                      <span style={{ color: pair.sdlc.color }}>{pair.sdlc.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>⇄</span>
                      <span style={{ color: pair.ams.color }}>{pair.ams.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Deep-Dive 3D Spotlight Card for the Selected Pair */}
            {STAGE_PAIRS[activePairIndex] && (() => {
              const pair = STAGE_PAIRS[activePairIndex];
              const metrics = [
                { value: '-65% Latency', label: 'Triage & Backlog Cycle Time' },
                { value: '99.4%', label: 'Automated CAB Approval Confidence' },
                { value: 'Zero-Defect', label: 'Synthetic Regression Coverage' },
              ];
              const metric = metrics[activePairIndex % metrics.length];

              return (
                <div style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '28px',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.12)',
                  position: 'relative', overflow: 'hidden',
                  borderTop: `3px solid ${pair.sdlc.color}`,
                }}
                  onMouseMove={handle3dCardTilt}
                  onMouseLeave={handle3dCardReset}
                >
                  <div className="row g-4 align-items-center">
                    {/* Left: SDLC Stage */}
                    <div className="col-lg-4 col-md-5">
                      <div style={{
                        background: 'var(--bg-elevated)', border: `1px solid ${pair.sdlc.color}40`,
                        borderRadius: '12px', padding: '20px',
                      }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: pair.sdlc.color, textTransform: 'uppercase' }}>
                            SDLC Stage {String(activePairIndex + 1).padStart(2, '0')}
                          </span>
                          <span className="material-icons" style={{ color: pair.sdlc.color, fontSize: '1.1rem' }}>{pair.sdlc.icon}</span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                          {pair.sdlc.name}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                          Autonomous engineering intelligence generating verified artifacts, testing harnesses, and pull-request safety envelopes.
                        </p>
                      </div>
                    </div>

                    {/* Center: Neural Connection Bridge */}
                    <div className="col-lg-4 col-md-2 text-center">
                      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '46px', height: '46px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(26,127,55,0.2) 0%, rgba(99,102,241,0.2) 100%)',
                          border: '2px solid rgba(56,189,248,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 0 20px rgba(56,189,248,0.3)',
                        }}>
                          <span className="material-icons" style={{ color: '#38bdf8', fontSize: '1.4rem' }}>sync_alt</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>{pair.connection}</div>
                          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>Bi-Directional Telemetry</span>
                        </div>
                        <div style={{
                          background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)',
                          borderRadius: '100px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8',
                        }}>
                          {metric.value} · {metric.label}
                        </div>
                      </div>
                    </div>

                    {/* Right: AMS Stage */}
                    <div className="col-lg-4 col-md-5">
                      <div style={{
                        background: 'var(--bg-elevated)', border: `1px solid ${pair.ams.color}40`,
                        borderRadius: '12px', padding: '20px',
                      }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: pair.ams.color, textTransform: 'uppercase' }}>
                            AMS Stage {String(activePairIndex + 1).padStart(2, '0')}
                          </span>
                          <span className="material-icons" style={{ color: pair.ams.color, fontSize: '1.1rem' }}>{pair.ams.icon}</span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                          {pair.ams.name}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                          Automated operational resilience monitoring runtime SLAs, triaging anomalous signals, and executing verified runbooks.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connection Mechanic Deep-Dive */}
                  <div style={{
                    marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)',
                    fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7,
                  }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Enterprise Multiplier Synergy: </strong>
                    {pair.desc}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* ── AI Maturity Scale — Applies to Both Frameworks ────────────────── */}
      <section id="maturity" style={{ marginBottom: '48px' }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="divider flex-grow-1" />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
            AI Maturity Scale — Applies to Both Frameworks
          </span>
          <div className="divider flex-grow-1" />
        </div>

        <div className="row g-3">
          {LEVELS.map((lvl, idx) => {
            const automationLabels = ['0% AI', '15–25% AI', '40–50% AI', '65–75% AI', '85–95% AI', '100% Autonomous'];
            return (
              <div className="col-lg-4 col-md-6 col-12" key={idx}>
                <div style={{
                  borderLeft: `4px solid ${lvl.color}`, padding: '20px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderLeftColor: lvl.color,
                  borderRadius: '12px', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
                  transformStyle: 'preserve-3d',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 28px ${lvl.color}1e`; }}
                  onMouseMove={handle3dCardTilt}
                  onMouseLeave={handle3dCardReset}
                >
                  {/* Level Pill, Title & Automation Tag */}
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 800,
                        color: lvl.color, background: `${lvl.color}18`, border: `1px solid ${lvl.color}35`,
                        borderRadius: '6px', padding: '2px 8px',
                      }}>
                        {lvl.label}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                        {lvl.title}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)',
                      background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px',
                      border: '1px solid var(--border)',
                    }}>
                      {automationLabels[idx]}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 14px', lineHeight: 1.6, flexGrow: 1 }}>
                    {lvl.desc}
                  </p>

                  {/* Dual-Framework Impact Breakdown */}
                  <div style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: '8px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px',
                  }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 700, color: 'rgb(26, 127, 55)', flexShrink: 0 }}>SDLC:</span>
                      <span>{lvl.sdlc}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 700, color: '#6366f1', flexShrink: 0 }}>AMS:</span>
                      <span>{lvl.ams}</span>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div style={{ marginTop: '12px', width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${((idx + 1) / 6) * 100}%`, height: '100%', background: lvl.color, borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Platform Capabilities ─────────────────────────────────────────── */}
      <section id="about" style={{ marginBottom: '40px' }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="divider flex-grow-1" />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
            Platform Capabilities
          </span>
          <div className="divider flex-grow-1" />
        </div>

        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '36px' }}>
          <div className="row g-4">
            {[
              {
                icon: 'bar_chart',
                color: 'rgb(26, 127, 55)',
                tag: 'DUAL BENCHMARK · 10 DOMAINS',
                title: 'Dual-Framework Evaluation',
                desc: 'Assess AI maturity across both SDLC engineering and AMS operational disciplines on one unified platform — synchronizing developer velocity with operational stability.',
                bullets: [
                  { icon: 'check_circle', text: '120+ SDLC engineering checkpoints across 5 stages' },
                  { icon: 'check_circle', text: '10 AMS operational & SRE workflows across 5 stages' },
                  { icon: 'check_circle', text: 'Closed-loop telemetry feedback correlation' },
                  { icon: 'check_circle', text: 'Role-calibrated assessment profiles' },
                ],
              },
              {
                icon: 'trending_up',
                color: '#6366f1',
                tag: 'RADAR CHARTS · L0 → L5',
                title: 'L0 → L5 Maturity Mapping & Radar',
                desc: 'Benchmark your team against 6 standardized maturity levels, visualised across all 10 stages using multi-axis radar diagnostics and peer benchmark baselines.',
                bullets: [
                  { icon: 'check_circle', text: 'Pentagon radar diagnostics plotted on 0–5 scale' },
                  { icon: 'check_circle', text: 'Per-domain maturity variance and gap detection' },
                  { icon: 'check_circle', text: 'Stage-by-stage progression milestones' },
                  { icon: 'check_circle', text: 'Enterprise baseline and trend analysis' },
                ],
              },
              {
                icon: 'track_changes',
                color: '#f59e0b',
                tag: 'GENAI POWERED · ROADMAPS',
                title: 'Actionable Executive Reports & Roadmaps',
                desc: 'Generate audit-ready executive reports instantly upon completing an assessment, complete with domain scores, maturity levels, and actionable GenAI roadmaps.',
                bullets: [
                  { icon: 'check_circle', text: 'Instant PDF-ready printable executive briefing' },
                  { icon: 'check_circle', text: 'Prioritized remediation backlog & 30-60-90 day plan' },
                  { icon: 'check_circle', text: 'Targeted AI toolchain recommendations (MCP, Copilots)' },
                  { icon: 'check_circle', text: 'Executive ROI and automation potential analysis' },
                ],
              },
            ].map((f, i) => (
              <div className="col-md-4" key={i}>
                <div style={{
                  display: 'flex', flexDirection: 'column', height: '100%',
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '28px 24px',
                  borderTop: `3px solid ${f.color}`,
                  transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
                  transformStyle: 'preserve-3d',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 18px 40px ${f.color}20`; }}
                  onMouseMove={handle3dCardTilt}
                  onMouseLeave={handle3dCardReset}
                >
                  {/* Tag Pill & Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div style={{ width: '46px', height: '46px', background: `${f.color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-icons" style={{ fontSize: '1.6rem', color: f.color }}>{f.icon}</span>
                    </div>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800, color: f.color,
                      background: `${f.color}14`, border: `1px solid ${f.color}35`,
                      borderRadius: '100px', padding: '3px 9px', letterSpacing: '0.04em',
                    }}>
                      {f.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{f.title}</h4>

                  {/* Description */}
                  <p style={{ fontSize: '0.855rem', color: 'var(--text-secondary)', lineHeight: 1.72, margin: '0 0 20px', flexGrow: 1 }}>{f.desc}</p>

                  {/* Divider */}
                  <div style={{ height: '1px', background: 'var(--border)', marginBottom: '16px' }} />

                  {/* Bullets */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {f.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        <span className="material-icons" style={{ fontSize: '0.95rem', color: f.color, flexShrink: 0, marginTop: '2px' }}>{b.icon}</span>
                        <span>{b.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
