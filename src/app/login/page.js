'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin' || user.email === 'admin@sdlc.com') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Auto-complete TCS domain if omitted by user
    const fullEmail = email.includes('@') ? email.trim() : `${email.trim()}@tcs.com`;

    const res = await login(fullEmail, password);
    if (res && res.success === false) {
      setError(res.message || 'Invalid email or password');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '65vh' }}>
        <div className="spinner-border" role="status" style={{ color: '#10b981' }}>
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-login">
      {/* Ambient Emerald Theme Mesh */}
      <div className="auth-mesh-login" />

      <div className="auth-split-container">
        {/* Left Visual Showcase Panel — Emerald Cyber Theme */}
        <div className="auth-showcase-panel">
          <img
            src="/login_illustration.jpg"
            alt="TCS MaturityIQ AI SDLC Dashboard"
            className="auth-showcase-bg-img"
          />
          <div className="auth-showcase-overlay-emerald" />

          <div className="auth-showcase-content">
            {/* Top Brand Tag */}
            <div>
              <div className="auth-feature-pill" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.15)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                <span style={{ color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem' }}>
                  Enterprise AI Platform
                </span>
              </div>
            </div>

            {/* Middle Feature Highlights */}
            <div style={{ margin: 'auto 0' }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                Benchmark Your Engineering &amp; Operations
              </h2>
              <p style={{ color: '#a7f3d0', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '440px', margin: 0, opacity: 0.92 }}>
                Audit AI maturity across SDLC practices and AMS operational workflows with generative intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Panel — Clean Emerald Auth Vault */}
        <div className="auth-form-panel">
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <img src="/tcs_logo_white.png" alt="TCS Logo" style={{ height: '34px', width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f0f6fc', letterSpacing: '-0.02em' }}>
                MaturityIQ
              </span>
            </div>

            <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Sign In to Your Vault
            </h1>
            <p style={{ color: '#8b949e', fontSize: '0.86rem', margin: 0 }}>
              Enter your credentials to access your assessment console
            </p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert" style={{ fontSize: '0.85rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
              <span className="material-icons" style={{ fontSize: '1.15rem' }}>error_outline</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label">
                TCS Email Address
              </label>
              <input
                type="text"
                id="login-email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <div style={{ fontSize: '0.74rem', color: '#6e7681', marginTop: '4px' }}>
                Enter your TCS email (@tcs.com)
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label htmlFor="login-password" className="form-label" style={{ margin: 0 }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.78rem', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-btn-emerald w-100"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Authenticating…
                </>
              ) : (
                <>
                  <span className="material-icons" style={{ fontSize: '1.15rem' }}>login</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch to Signup */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.86rem', color: '#8b949e', margin: 0 }}>
              New to TCS MaturityIQ?{' '}
              <Link href="/signup" style={{ color: '#34d399', fontWeight: 700, textDecoration: 'none' }}>
                Create an account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
