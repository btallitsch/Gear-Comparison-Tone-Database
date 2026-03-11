import { useState, FormEvent } from 'react';
import { Guitar, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import styles from './AuthForm.module.css';

type AuthMode = 'login' | 'register' | 'reset';

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const {
    authError,
    authLoading,
    clearError,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
    handleResetPassword,
  } = useAuth();

  const switchMode = (next: AuthMode) => {
    setMode(next);
    clearError();
    setResetSent(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await handleLogin(email, password);
    } else if (mode === 'register') {
      await handleRegister(email, password, displayName);
    } else {
      const ok = await handleResetPassword(email);
      if (ok) setResetSent(true);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Guitar size={28} />
        </div>
        <h1 className={styles.title}>Gear DB</h1>
        <p className={styles.sub}>Tone Documentation & Comparison</p>
      </div>

      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.active : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${mode === 'register' ? styles.active : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        {mode === 'reset' ? (
          <div className={styles.form}>
            <p className={styles.resetText}>
              Enter your email address and we'll send you a password reset link.
            </p>
            {resetSent ? (
              <div className={styles.successBox}>
                ✓ Reset email sent. Check your inbox.
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className={styles.fields}>
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={15} />}
                    placeholder="your@email.com"
                    required
                  />
                  {authError && (
                    <div className={styles.errorBox}>
                      <AlertCircle size={14} />
                      {authError}
                    </div>
                  )}
                  <Button type="submit" loading={authLoading} fullWidth>
                    Send Reset Link
                  </Button>
                </div>
              </form>
            )}
            <button className={styles.link} onClick={() => switchMode('login')}>
              ← Back to sign in
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.fields}>
              {mode === 'register' && (
                <Input
                  label="Display Name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  icon={<User size={15} />}
                  placeholder="Your name or alias"
                  required
                />
              )}
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={15} />}
                placeholder="your@email.com"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={15} />}
                placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                required
              />

              {authError && (
                <div className={styles.errorBox}>
                  <AlertCircle size={14} />
                  {authError}
                </div>
              )}

              <Button type="submit" loading={authLoading} fullWidth size="lg">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </div>

            <div className={styles.divider}><span>or</span></div>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleGoogleLogin}
              disabled={authLoading}
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            {mode === 'login' && (
              <button
                type="button"
                className={styles.link}
                onClick={() => switchMode('reset')}
              >
                Forgot password?
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
