import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

interface SubscribeFormProps {
  variant?: 'minimal' | 'full';
  onSuccess?: () => void;
}

export const SubscribeForm: React.FC<SubscribeFormProps> = ({ variant = 'full', onSuccess }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      // This will be connected to Firebase once setup is complete
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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
        className="flex items-center justify-center gap-3 py-4 text-tpl-accent"
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
            className="w-full px-4 py-3 bg-white border border-tpl-ink/10 focus:outline-none focus:border-tpl-accent transition-all text-sm disabled:opacity-50"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-tpl-accent uppercase tracking-widest bg-tpl-bg px-1.5 py-0.5 border border-tpl-accent/20">
            50/250
          </div>
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-tpl-ink text-tpl-bg font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-tpl-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
        >
          {status === 'loading' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              <span>Join Layer</span>
              <Send size={14} />
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="absolute -bottom-6 left-0 text-[10px] text-red-500 font-bold uppercase tracking-wider">
          Connection error. Please try again.
        </p>
      )}
    </form>
  );
};
