import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Loader2, Copy } from 'lucide-react';

interface GroundTruthSubscribeFormProps {
  source?: string;
  tag?: string;
  region?: string;
}

export const GroundTruthSubscribeForm: React.FC<GroundTruthSubscribeFormProps> = ({ source = 'ground-truth', tag = 'community-alert', region = 'unspecified' }) => {
  const [formData, setFormData] = useState({ firstName: '', email: '', county: '', promotionalConsent: false });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;

    setStatus('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          firstName: formData.firstName,
          county: formData.county,
          promotional_consent: formData.promotionalConsent,
          source, 
          tag, 
          region 
        }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('https://' + window.location.hostname + '/ground-truth');
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2500);
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-[var(--gt-text)]"
      >
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--gt-font-display)' }}>You're on the list.</h2>
        <p className="text-[var(--gt-text-muted)]">
          We'll notify you when data center activity is identified near {formData.county || 'your area'}.
          <br /><br />
          Ground Truth is a public resource — share it with your neighbors, local officials, and community groups.
        </p>
        <button
          onClick={handleCopy}
          className={`px-6 py-3 font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 border ${
            copyStatus === 'copied' 
              ? 'border-[var(--gt-monitored)] text-[var(--gt-monitored)]' 
              : 'border-[var(--gt-accent)] text-[var(--gt-accent)] hover:bg-[var(--gt-accent)] hover:text-[var(--gt-bg)]'
          }`}
        >
          {copyStatus === 'copied' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
          <span>{copyStatus === 'copied' ? 'LINK COPIED' : 'SHARE GROUND TRUTH'}</span>
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--gt-text-muted)]">First Name</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          placeholder="Your first name"
          required
          className="w-full px-4 py-3 bg-[var(--gt-surface)] border border-[var(--gt-border)] focus:border-[var(--gt-accent)] text-[var(--gt-text)] focus:outline-none transition-all text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--gt-text-muted)]">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 bg-[var(--gt-surface)] border border-[var(--gt-border)] focus:border-[var(--gt-accent)] text-[var(--gt-text)] focus:outline-none transition-all text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--gt-text-muted)]">Your County & State</label>
        <input
          type="text"
          value={formData.county}
          onChange={(e) => setFormData({...formData, county: e.target.value})}
          placeholder="e.g. Linn County, Iowa"
          className="w-full px-4 py-3 bg-[var(--gt-surface)] border border-[var(--gt-border)] focus:border-[var(--gt-accent)] text-[var(--gt-text)] focus:outline-none transition-all text-sm"
        />
        <p className="text-[10px] text-[var(--gt-text-faint)]">Optional, but helps us notify you about activity near you specifically.</p>
      </div>
      
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={formData.promotionalConsent}
          onChange={(e) => setFormData({...formData, promotionalConsent: e.target.checked})}
          className="mt-1 accent-[var(--gt-accent)]"
        />
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--gt-text)]">I'd also like to receive TPL's weekly Infrastructure Intelligence Report</label>
          <p className="text-[10px] text-[var(--gt-text-faint)]">Covers AI infrastructure spending, constraint data, and physical bottlenecks. Separate from community alerts. You can unsubscribe from either independently.</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 bg-transparent border border-[var(--gt-accent)] text-[var(--gt-accent)] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[var(--gt-accent)] hover:text-[var(--gt-bg)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <><span>NOTIFY ME</span><Send size={14} /></>}
      </button>
      
      {status === 'error' && (
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gt-critical)]">
          Something went wrong. Please try again or email us directly at [contact email].
        </p>
      )}
    </form>
  );
};
