// LoginPage.tsx — CONTROLSAI Authentication Screen
// UI shell — wire Firebase/Supabase credentials to the stub handlers below.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string }) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode]       = useState<AuthMode>('login');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [name, setName]       = useState('');
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // ── Stub: replace with Firebase / Supabase auth ─────────────────────────
  async function handleEmailAuth(e: React.FormEvent) {
    if (e.preventDefault) e.preventDefault();
    setError('');
    
    if (!email || (!password && mode !== 'forgot')) return;
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        onLogin({ name: result.user.displayName || email.split('@')[0], email: result.user.email! });
      } else if (mode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(result.user, { displayName: name });
        onLogin({ name: name || email.split('@')[0], email: result.user.email! });
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setMode('login');
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') setError('Invalid email or access key.');
      else if (err.code === 'auth/email-already-in-use') setError('Email already registered.');
      else setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin({ name: result.user.displayName || 'Engineer', email: result.user.email! });
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Sign-In failed.');
      }
    } finally {
      setLoading(false);
    }
  }

  const titles: Record<AuthMode, string> = {
    login   : 'Welcome back, Engineer.',
    register: 'Create your Terminal.',
    forgot  : 'Reset your access key.',
  };

  return (
    <div className="min-h-screen bg-[#001540] flex items-center justify-center px-4 relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Moving grid */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-moving opacity-50" />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#0050C0] opacity-5 blur-[120px] pointer-events-none" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-industrial mb-1">CONTROLSAI</h1>
          <p className="text-[#999999] text-xs uppercase tracking-[0.25em]">Terminal 01-A · Precision Architect</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8">

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={mode}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-headline font-bold text-white mb-6"
            >
              {titles[mode]}
            </motion.h2>
          </AnimatePresence>

          {/* Google */}
          {mode !== 'forgot' && (
            <motion.button
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white/8 border border-white/15 text-white py-3 px-4 mb-6 transition-colors"
            >
              {/* Google logo SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>
          )}

          {mode !== 'forgot' && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-[#999999] uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#999999] mb-1.5">Full Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Engineer"
                  className="w-full bg-white/5 border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#0050C0] transition-colors placeholder-[#555555]"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#999999] mb-1.5">Corporate Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full bg-white/5 border border-white/15 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#0050C0] transition-colors placeholder-[#555555]"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#999999] mb-1.5">Access Key (Password)</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
                  <input
                    type={show ? 'text' : 'password'}
                    value={password} onChange={(e) => setPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/15 text-white pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-[#0050C0] transition-colors placeholder-[#555555]"
                    required
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] hover:text-white transition-colors">
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#003080' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#0050C0] text-white py-3 font-industrial uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-2 transition-colors disabled:opacity-60"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Processing...</>
                : mode === 'login'   ? 'Access Terminal'
                : mode === 'register' ? 'Initialize Account'
                : 'Send Reset Link'
              }
            </motion.button>
          </form>

          {/* Mode switcher */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'login' && (
              <>
                <button onClick={() => setMode('forgot')} className="block text-[11px] text-[#999999] hover:text-white transition-colors mx-auto">Forgot access key?</button>
                <p className="text-[11px] text-[#999999]">
                  New engineer?{' '}
                  <button onClick={() => setMode('register')} className="text-[#0050C0] hover:underline">Create terminal</button>
                </p>
              </>
            )}
            {mode === 'register' && (
              <p className="text-[11px] text-[#999999]">
                Already registered?{' '}
                <button onClick={() => setMode('login')} className="text-[#0050C0] hover:underline">Sign in</button>
              </p>
            )}
            {mode === 'forgot' && (
              <button onClick={() => setMode('login')} className="text-[11px] text-[#999999] hover:text-white transition-colors">← Back to sign in</button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-[#555555] mt-6 uppercase tracking-wider">
          © 2026 CONTROLSAI Industrial Systems — All logic stays local.
        </p>
      </motion.div>
    </div>
  );
}
