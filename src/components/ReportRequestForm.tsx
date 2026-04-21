import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

interface ReportRequestFormProps {
  persona: string;
  onBack: () => void;
}

export const ReportRequestForm: React.FC<ReportRequestFormProps> = ({ persona, onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    instructions: '',
  });

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reports/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('There was an error submitting your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
      >
        <div className="w-16 h-16 bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 rounded-full">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-4">Request Received</h2>
        <p className="text-slate-400 max-w-md font-serif italic mb-8">
          Our analysts are reviewing your requirements for the {persona} custom report. 
          We will contact you shortly at {formData.email}.
        </p>
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-[#0f1a24] text-[#1a2633] text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
        >
          Return to Reports
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 py-24"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-12 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Reports
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12">
        <header className="relative h-[300px] lg:h-auto rounded-xl overflow-hidden border border-white/5 bg-[#0f1a24] flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>
          <div className="w-1/2 max-w-sm relative z-10 opacity-20 pointer-events-none">
            <img 
              src="/tpl-seal.png" 
              alt="TPL Seal" 
              className="w-full h-auto object-contain invert drop-shadow-2xl"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2633] via-[#1a2633]/60 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 border border-blue-500/20 w-fit">
              Custom Intelligence Request
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight uppercase tracking-tighter mb-4">
              {persona} Report Inquiry
            </h1>
            <p className="text-slate-400 font-serif italic text-base">
              Provide specific parameters for your custom infrastructure intelligence report.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f1a24]/50 p-8 border border-white/5 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Name</label>
              <input 
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1a2633] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Professional Email</label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1a2633] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all"
                placeholder="john@organization.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Organization</label>
            <input 
              required
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full bg-[#1a2633] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all"
              placeholder="Infrastructure Partners LLC"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Further Instructions / Scope of Interest</label>
            <textarea 
              required
              rows={6}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full bg-[#1a2633] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all resize-none"
              placeholder="Please specify physical constraints, regional focus, or specific vendor categories you wish to analyze..."
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded"
            >
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">
                {error}
              </p>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-[#3b82f6] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2563eb] transition-all flex items-center justify-center gap-3 group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Submit Request'}
            {!loading && <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          </button>
          
          <p className="text-[9px] text-slate-500 uppercase tracking-wider text-center">
            All inquiries are treated with institutional confidentiality.
          </p>
        </form>
      </div>
    </motion.div>
  );
};
