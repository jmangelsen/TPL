import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, signInWithGoogle } from '../firebase';
import { Loader2, Mail } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('Failed to log in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Google login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-tpl-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 border border-tpl-ink/10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Log In</h1>
          <p className="text-tpl-slate text-sm">Welcome back to The Physical Layer.</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-4 mb-6 border border-tpl-ink/20 text-tpl-ink text-xs font-bold uppercase tracking-widest hover:bg-tpl-bg transition-colors flex items-center justify-center gap-2"
        >
          <Mail size={16} />
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-tpl-ink/20"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-tpl-slate">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-tpl-ink text-tpl-bg text-xs font-bold uppercase tracking-widest hover:bg-tpl-slate transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-tpl-slate">
          <p>Don't have an account? <Link to="/signup" className="text-tpl-ink font-bold hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};
