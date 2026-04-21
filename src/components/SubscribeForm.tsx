import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

interface SubscribeFormProps {
  variant?: 'minimal' | 'full';
  onSuccess?: () => void;
  source?: string;
  tag?: string;
  region?: string;
}

export const SubscribeForm: React.FC<SubscribeFormProps> = ({ variant = 'full', onSuccess, source, tag, region }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const isGroundTruth = source === 'ground-truth';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      // This will be connected to Firebase once setup is complete
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, tag, region }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        onSuccess?.();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center justify-center gap-3 py-4 ${isGroundTruth ? 'text-[var(--gt-monitored)]' : 'text-tpl-accent'}`}
      >
        <CheckCircle2 size={20} />
        <span className="font-bold uppercase tracking-widest text-xs">Subscription Confirmed</span>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${variant === 'full' ? 'w-full max-w-md' : 'w-full'}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'loading'}
            className={`w-full px-4 py-3 border focus:outline-none transition-all text-sm disabled:opacity-50 ${
              isGroundTruth 
                ? 'bg-[var(--gt-surface)] border-[var(--gt-border)] focus:border-[var(--gt-accent)] text-[var(--gt-text)]' 
                : 'bg-[#0f1a24] border-white/10 focus:border-tpl-accent'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`px-6 py-3 font-bold uppercase tracking-[0.2em] text-[10px] transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px] ${
            isGroundTruth
              ? 'bg-transparent border border-[var(--gt-accent)] text-[var(--gt-accent)] hover:bg-[var(--gt-accent)] hover:text-[var(--gt-bg)]'
              : 'bg-tpl-ink text-tpl-bg hover:bg-tpl-accent'
          }`}
        >
          {status === 'loading' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              <span>{isGroundTruth ? 'Get Notified' : 'Join Layer'}</span>
              <Send size={14} />
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className={`absolute -bottom-6 left-0 text-[10px] font-bold uppercase tracking-wider ${isGroundTruth ? 'text-[var(--gt-critical)]' : 'text-red-500'}`}>
          Connection error. Please try again.
        </p>
      )}
    </form>
  );
};
