import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Droplets, 
  Zap, 
  Wind, 
  Map as MapIcon, 
  FileText, 
  HardHat,
  Globe,
  ChevronRight
} from 'lucide-react';
import { SubscribeForm } from './SubscribeForm';

interface LandingPageProps {
  onEnterArticle?: () => void; // Kept for backwards compatibility if needed, but not used
}

const FeatureIcon = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex flex-col items-center gap-3 group">
    <div className="w-12 h-12 rounded-full border border-tpl-ink/10 flex items-center justify-center group-hover:bg-tpl-ink group-hover:text-tpl-bg transition-all duration-500">
      <Icon size={20} strokeWidth={1.5} />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-tpl-steel group-hover:text-tpl-ink transition-colors">{label}</span>
  </div>
);

const Logo = () => (
  <div className="flex flex-col items-center gap-8 w-full">
    <div className="w-full max-w-5xl aspect-[21/9] bg-tpl-ink relative overflow-hidden shadow-2xl flex items-center justify-center">
      <img 
        src="https://picsum.photos/seed/infrastructure/1920/1080" 
        alt="Large scale data center infrastructure" 
        className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 hover:opacity-60 transition-opacity duration-1000"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tpl-bg via-transparent to-transparent opacity-60" />
      
      {/* Wordmark Overlay */}
      <div className="relative z-10 w-3/4 max-w-2xl px-8 mix-blend-screen opacity-90">
        <img 
          src="/tpl-logo.png" 
          alt="The Physical Layer" 
          className="w-full h-auto object-contain drop-shadow-2xl invert"
        />
      </div>
    </div>
    
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center gap-4">
        <div className="h-px w-12 bg-tpl-ink/20" />
        <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-tpl-steel">Infrastructure Research // Intelligence Platform</p>
        <div className="h-px w-12 bg-tpl-ink/20" />
      </div>
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <div className="min-h-screen bg-tpl-bg overflow-hidden relative flex flex-col font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="topo" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
            <path d="M0,100 Q100,80 200,120 T400,100" stroke="black" fill="none" strokeWidth="0.5" />
            <path d="M0,200 Q100,180 200,220 T400,200" stroke="black" fill="none" strokeWidth="0.5" />
            <path d="M0,300 Q100,280 200,320 T400,300" stroke="black" fill="none" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl w-full space-y-12 md:space-y-16 py-8 md:py-12"
        >
          <Logo />

          <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center border-t border-tpl-ink/10 pt-12">
            <p className="text-lg md:text-2xl font-serif italic leading-snug text-tpl-slate mb-8">
              Mapping the collision between digital ambition and physical reality. 
              An evidence-driven analysis of water stress, power load, and land availability.
            </p>
            <Link 
              to="/article"
              className="group flex items-center justify-center gap-6 bg-tpl-ink text-tpl-bg px-8 md:px-10 py-4 md:py-5 rounded-none hover:bg-tpl-accent transition-all duration-500 shadow-xl w-full md:w-auto"
            >
              <span className="font-display font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">Read Flagship Article</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
            </Link>
          </div>

          {/* Subscribe Funnel */}
          <div id="contact-funnel" className="bg-tpl-ink p-8 md:p-16 text-tpl-bg text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-tpl-accent z-20" />
            
            {/* Topography Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
              <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[4] blur-sm" />
            </div>

            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-2xl md:text-5xl font-bold tracking-tight leading-none uppercase">
                The Infrastructure <br className="hidden md:block"/> Intelligence Report
              </h2>
              <p className="text-white/60 font-serif italic text-base md:text-lg leading-relaxed">
                Operators, developers, and decision-makers: get the first-mover briefings on physical constraints, vendor positioning, and project bottlenecks before they hit mainstream coverage. Early access only.
              </p>
              <div className="pt-2">
                <SubscribeForm />
              </div>
              <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-tpl-accent">
                Subscriber-Only Intelligence // Delivered Weekly
              </p>
            </div>
            
            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
