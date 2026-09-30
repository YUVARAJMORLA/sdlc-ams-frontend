import './globals.css';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import Navbar from './components/Navbar';
import ThemeTransition3D from './components/ThemeTransition3D';

export const metadata = {
  title: 'TCS MaturityIQ — AI Maturity Assessment Platform',
  description: 'Benchmark your organisation\'s AI maturity across SDLC and AMS with TCS MaturityIQ — the enterprise assessment platform for engineering and operations teams.',
  icons: {
    icon: '/tcs_symbol.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/tcs_symbol.png" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <ThemeTransition3D />
          <AuthProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flexGrow: 1, padding: '24px 0 48px' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                  {children}
                </div>
              </main>
              <footer style={{
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                padding: '20px 0',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                textAlign: 'center',
              }}>
                <div className="container d-flex flex-wrap align-items-center justify-content-center gap-3">
                  <div style={{
                    height: '28px',
                    background: '#101b21',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}>
                    <img src="/tcs_logo.png" alt="TCS Logo" style={{ height: '18px', width: 'auto' }} />
                  </div>
                  <span>
                    © 2026 TCS MaturityIQ &nbsp;·&nbsp; AI Maturity Assessment Platform for SDLC &amp; AMS
                  </span>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
