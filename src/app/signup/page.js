'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';

const TCS_BUSINESS_GROUPS = [
  'BFSI (Banking, Financial Services & Insurance)',
  'LSHCERU (Life Sciences, Healthcare, Energy, Resources & Utilities)',
  'Manufacturing',
  'Retail & Consumer Business',
  'Communications, Media & Technology',
  'Hi-Tech',
  'Travel & Logistics',
  'Public Services & Government',
  'iON (Small & Medium Business)',
  'TCS Interactive',
  'Quartz (Blockchain & Crypto)',
  'Ignio (AI/ML Division)',
  'Other',
];

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    employeeId: '',
    businessGroup: '',
    account: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = formData.email.trim();
    if (!cleanEmail.toLowerCase().endsWith('@tcs.com')) {
      setError('Please use your official TCS enterprise email address (@tcs.com)');
      return;
    }

    if (!formData.fullName.trim()) {
      setError('Full Name is required');
      return;
    }

    if (!/^[A-Z0-9]{4,15}$/i.test(formData.employeeId.trim())) {
      setError('Employee ID must be 4–15 alphanumeric characters (e.g. 2861698)');
      return;
    }

    if (!formData.businessGroup) {
      setError('Please select your TCS Business Group');
      return;
    }

    if (!formData.account.trim()) {
      setError('Account or Project Name is required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const res = await signup(cleanEmail, formData.password, {
      fullName: formData.fullName.trim(),
      name: formData.fullName.trim(),
      employeeId: formData.employeeId.trim(),
      businessGroup: formData.businessGroup,
      account: formData.account.trim(),
    });

    if (res && res.success === false) {
      setError(res.message || 'Error creating account');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '65vh' }}>
        <div className="spinner-border" role="status" style={{ color: '#6366f1' }}>
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="auth-page-signup">
      {/* Ambient Indigo/Cyan Theme Mesh */}
      <div className="auth-mesh-signup" />

      <div className="auth-split-container">
        {/* Left Visual Showcase Panel — 3D Dual-Framework AI Architecture */}
        <div className="auth-showcase-panel">
          <img
            src="/signup_illustration.png"
            alt="TCS MaturityIQ Dual-Framework AI Architecture"
            className="auth-showcase-bg-img auth-showcase-signup-img"
          />
          <div className="auth-showcase-overlay-signup" />

          <div className="auth-showcase-content">
            {/* Top Brand Tag */}
            <div>
              <div className="auth-feature-pill" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', background: 'rgba(10, 15, 30, 0.75)', backdropFilter: 'blur(10px)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 10px #818cf8' }} />
                <span style={{ color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', fontWeight: 700 }}>
                  Enterprise Onboarding
                </span>
              </div>
            </div>

            {/* Bottom Glass Caption Card */}
            <div style={{
              background: 'rgba(10, 16, 26, 0.75)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(99, 102, 241, 0.28)',
              borderRadius: '16px',
              padding: '16px 20px',
              marginTop: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="material-icons" style={{ color: '#818cf8', fontSize: '1.15rem' }}>memory</span>
                <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.92rem', letterSpacing: '-0.01em' }}>
                  Dual-Framework AI Evaluation
                </span>
              </div>
              <p style={{ color: 'rgba(224, 242, 254, 0.85)', fontSize: '0.8rem', margin: 0, lineHeight: 1.55 }}>
                Unified intelligence interconnecting SDLC engineering &amp; AMS operational workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Panel — 6 Registration Fields */}
        <div className="auth-form-panel">
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <img src="/tcs_logo_white.png" alt="TCS Logo" style={{ height: '34px', width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f0f6fc', letterSpacing: '-0.02em' }}>
                MaturityIQ
              </span>
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
              Create Your Account
            </h1>
            <p style={{ color: '#8b949e', fontSize: '0.84rem', margin: 0 }}>
              Register with your TCS enterprise credentials
            </p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert" style={{ fontSize: '0.84rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
              <span className="material-icons" style={{ fontSize: '1.15rem' }}>error_outline</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              {/* Field 1: Full Name */}
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="signup-name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="signup-name"
                  name="fullName"
                  className="form-control"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              {/* Field 2: TCS Employee ID */}
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="signup-empid" className="form-label">Employee ID</label>
                <input
                  type="text"
                  id="signup-empid"
                  name="employeeId"
                  className="form-control"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Field 3: TCS Email Address */}
              <div className="col-12 mb-2">
                <label htmlFor="signup-email" className="form-label">TCS Email Address</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
                <div style={{ fontSize: '0.72rem', color: '#6e7681', marginTop: '3px' }}>
                  Must be your official enterprise <strong>@tcs.com</strong> address
                </div>
              </div>

              {/* Field 4: Business Group */}
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="signup-bg" className="form-label">Business Group</label>
                <select
                  id="signup-bg"
                  name="businessGroup"
                  className="form-select"
                  value={formData.businessGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Group…</option>
                  {TCS_BUSINESS_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* Field 5: Account / Project */}
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="signup-account" className="form-label">Account / Project</label>
                <input
                  type="text"
                  id="signup-account"
                  name="account"
                  className="form-control"
                  value={formData.account}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Field 6: Password */}
              <div className="col-12 col-md-6 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label htmlFor="signup-password" className="form-label" style={{ margin: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.74rem', cursor: 'pointer', padding: 0 }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="signup-password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm Password */}
              <div className="col-12 col-md-6 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label htmlFor="signup-confirm-password" className="form-label" style={{ margin: 0 }}>Confirm Password</label>
                  {passwordsMatch && (
                    <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <span className="material-icons" style={{ fontSize: '0.85rem' }}>check_circle</span> Match
                    </span>
                  )}
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="signup-confirm-password"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-btn-gradient w-100 mt-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Creating Account…
                </>
              ) : (
                <>
                  <span className="material-icons" style={{ fontSize: '1.15rem' }}>person_add</span>
                  Complete Registration
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch to Login */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.84rem', color: '#8b949e', margin: 0 }}>
              Already registered?{' '}
              <Link href="/login" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none' }}>
                Sign in here →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
