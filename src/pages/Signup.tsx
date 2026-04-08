import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc } from 'firebase/firestore/lite';
import { Loader2 } from 'lucide-react';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tier, setTier] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tierParam = searchParams.get('tier');
    if (tierParam && ['free', 'essentials', 'pro'].includes(tierParam)) {
      setTier(tierParam);
    }
  }, [location]);

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

      // Create user document in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          tier: tier,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'users/' + user.uid);
      }

      // Redirect based on tier
      if (tier === 'essentials' || tier === 'pro') {
        navigate('/monitor');
      } else {
        navigate('/'); // Or a welcome page
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tpl-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 border border-tpl-ink/10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-tpl-slate text-sm">Join The Physical Layer to access infrastructure intelligence.</p>
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
              minLength={8}
              className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none transition-colors"
              placeholder="••••••••"
            />
            <p className="text-[10px] text-tpl-slate mt-1">Must be at least 8 characters.</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-tpl-ink/10">
            <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-4">Select Plan</label>
            
            <label className={`flex items-start p-4 border cursor-pointer transition-colors ${tier === 'free' ? 'border-tpl-ink bg-tpl-ink/5' : 'border-tpl-ink/20 hover:border-tpl-ink/50'}`}>
              <input type="radio" name="tier" value="free" checked={tier === 'free'} onChange={() => setTier('free')} className="mt-1 mr-3" />
              <div>
                <div className="font-bold">Free</div>
                <div className="text-xs text-tpl-slate mt-1">Basic access and occasional updates.</div>
              </div>
            </label>

            <label className={`flex items-start p-4 border cursor-pointer transition-colors ${tier === 'essentials' ? 'border-tpl-ink bg-tpl-ink/5' : 'border-tpl-ink/20 hover:border-tpl-ink/50'}`}>
              <input type="radio" name="tier" value="essentials" checked={tier === 'essentials'} onChange={() => setTier('essentials')} className="mt-1 mr-3" />
              <div>
                <div className="font-bold flex justify-between w-full">
                  <span>Essentials</span>
                  <span>$10.99/mo</span>
                </div>
                <div className="text-xs text-tpl-slate mt-1">Current-cycle access for focused readers.</div>
              </div>
            </label>

            <label className={`flex items-start p-4 border cursor-pointer transition-colors ${tier === 'pro' ? 'border-tpl-ink bg-tpl-ink/5' : 'border-tpl-ink/20 hover:border-tpl-ink/50'}`}>
              <input type="radio" name="tier" value="pro" checked={tier === 'pro'} onChange={() => setTier('pro')} className="mt-1 mr-3" />
              <div>
                <div className="font-bold flex justify-between w-full">
                  <span>Pro</span>
                  <span>$29.99/mo</span>
                </div>
                <div className="text-xs text-tpl-slate mt-1">Full-cycle visibility for active operators.</div>
              </div>
            </label>
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

        <div className="mt-8 text-center text-sm text-tpl-slate">
          <p>Already have an account? <Link to="/login" className="text-tpl-ink font-bold hover:underline">Log in</Link></p>
          <p className="mt-4 text-[10px]">For Enterprise access, please <a href="mailto:Research@aiphysicallayer.com" className="underline hover:text-tpl-ink">contact us</a>.</p>
        </div>
      </div>
    </div>
  );
};
