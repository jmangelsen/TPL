import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, ArrowRight } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

interface PaywallProps {
  user: any;
}

export const Paywall: React.FC<PaywallProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!user) return;
    // Replace the URL below with your actual GoDaddy Pay Link
    const godaddyPayLink = "https://pay.godaddy.com/your-link-here"; 
    window.open(godaddyPayLink, '_blank');
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-tpl-ink text-tpl-bg py-24 px-6 flex items-center justify-center font-sans selection:bg-tpl-accent selection:text-white relative overflow-hidden">
      {/* Background Seal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none">
        <img src="/tpl-seal.png" alt="" className="w-full h-full object-contain invert" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full border border-white/10 p-8 md:p-16 relative overflow-hidden bg-tpl-ink/80 backdrop-blur-sm"
      >
        <div className="relative z-10">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
                The Physical Layer Intelligence
              </h1>
              <h2 className="text-lg md:text-xl font-serif italic text-white/70 leading-snug">
                Decision-grade research on the physical constraints of AI scale.
              </h2>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 opacity-50">
              <img src="/tpl-seal.png" alt="TPL Seal" className="w-full h-full object-contain invert" />
            </div>
          </div>

          <p className="text-sm md:text-base text-white/80 leading-relaxed mb-12 max-w-2xl">
            The Physical Layer Intelligence is a subscription research platform for industry players who need to understand the infrastructure reality behind AI growth. We cover the physical constraints that actually shape deployment—water, power, land, cooling, permitting, and construction risk—through focused briefings, report-driven analysis, and ongoing monitoring built for serious decision-makers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-16 border-t border-white/10 pt-12">
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 bg-tpl-accent mt-2 shrink-0" />
              <p className="text-sm text-white/80 leading-relaxed">
                Identify emerging bottlenecks across power generation, grid interconnection, and municipal water systems before they impact capital allocation.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 bg-tpl-accent mt-2 shrink-0" />
              <p className="text-sm text-white/80 leading-relaxed">
                Track the shifting regulatory landscape, from local zoning friction to environmental permitting delays.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 bg-tpl-accent mt-2 shrink-0" />
              <p className="text-sm text-white/80 leading-relaxed">
                Monitor supply chain constraints and construction risks for critical, long-lead infrastructure components.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 bg-tpl-accent mt-2 shrink-0" />
              <p className="text-sm text-white/80 leading-relaxed">
                Gain earlier pattern recognition on where capital is moving and where physical friction is rising.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-6 border-t border-white/10 pt-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Built exclusively for operators, investors, utilities, and enterprise decision-makers navigating the industrial buildout of AI.
            </p>

            {!user ? (
              <button 
                onClick={handleLogin}
                className="px-8 py-4 bg-white text-tpl-ink text-xs font-bold uppercase tracking-widest hover:bg-tpl-bg transition-colors flex items-center justify-center gap-3 group"
              >
                Authenticate to Continue
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="w-full max-w-md">
                <button 
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full px-8 py-4 bg-white text-tpl-ink text-xs font-bold uppercase tracking-widest hover:bg-tpl-bg transition-colors disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      Access Intelligence
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <div className="mt-4 flex items-center justify-between text-[10px] text-white/50 uppercase tracking-widest">
                  <span>$10.99 / Month. Cancel anytime.</span>
                  <span className="text-tpl-accent">Intelligence restricted to active subscribers.</span>
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
