import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, signInWithGoogle, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Loader2, Mail } from 'lucide-react';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const planParam = searchParams.get('plan');
    if (planParam && ['insight-early', 'strategy-early'].includes(planParam)) {
      setPlan(planParam);
    }
  }, [location]);

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (!user) throw new Error('Google sign-in failed');

      // Check if user document already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        const userData = {
          email: user.email,
          createdAt: new Date().toISOString(),
          isEarlyAccess: !!plan,
          plan: plan || 'free',
          earlyAccessCreatedAt: plan ? new Date().toISOString() : null,
        };

        try {
          await setDoc(doc(db, 'users', user.uid), userData);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'users/' + user.uid);
        }
      }

      navigate('/constraint-atlas');
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || 'Google signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        email: user.email,
        createdAt: new Date().toISOString(),
        isEarlyAccess: !!plan,
        plan: plan || 'free',
        earlyAccessCreatedAt: plan ? new Date().toISOString() : null,
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userData);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'users/' + user.uid);
      }

      // Notify admin and user
      if (userData.isEarlyAccess) {
        console.log('Early access signup:', user.email);
      }

      navigate('/constraint-atlas');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled. Please enable it in the Firebase Console under Authentication > Sign-in method.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a2633] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0f1a24] p-8 border border-white/10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          {plan ? (
            <p className="text-slate-300 text-sm bg-[#1a2633] p-4 border border-white/10">
              You’re joining The Physical Layer as an early-access member. You’ll receive 90 days of free access when the full site launches.
            </p>
          ) : (
            <p className="text-slate-300 text-sm">Join The Physical Layer to access infrastructure intelligence.</p>
          )}
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full py-4 mb-6 border border-white/20/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1a2633] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Mail size={16} />
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20/20"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0f1a24] px-2 text-slate-300">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1a2633] border border-white/20/20 focus:border-white/20 focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-[#1a2633] border border-white/20/20 focus:border-white/20 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
            <p className="text-[10px] text-slate-300 mt-1">Must be at least 8 characters.</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <label className="block text-xs font-bold uppercase tracking-widest text-white mb-4">Account Details</label>
            <p className="text-xs text-slate-300">
              {plan ? `You are signing up for the ${plan} plan.` : 'You are signing up for a free account.'}
            </p>
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
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-300">
          <p>Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Log in</Link></p>
          <p className="mt-4 text-[10px]">For Enterprise access, please <a href="mailto:Research@aiphysicallayer.com" className="underline hover:text-white">contact us</a>.</p>
        </div>
      </div>
    </div>
  );
};
