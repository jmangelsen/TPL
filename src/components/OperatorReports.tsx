import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  FileSearch, 
  Map, 
  ArrowRight,
  Construction,
  Scale
} from 'lucide-react';
import { ReportRequestForm } from './ReportRequestForm';

const ReportCard = ({ title, description }: { title: string, description: string, key?: number | string }) => (
  <div className="p-6 bg-[#0f1a24]/50 border border-white/5 hover:border-[#3b82f6]/30 transition-all group">
    <h4 className="text-[#3b82f6] font-bold text-sm uppercase tracking-wider mb-2">{title}</h4>
    <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
  </div>
);

const AudienceSection = ({ 
  icon: Icon, 
  title, 
  stakes, 
  reports,
  onRequest
}: { 
  icon: any, 
  title: string, 
  stakes: string, 
  reports: { title: string, description: string }[],
  onRequest: (persona: string) => void
}) => (
  <section className="py-16 border-t border-white/5">
    <div className="flex flex-col md:flex-row gap-12">
      <div className="md:w-1/3 space-y-6">
        <div className="w-12 h-12 bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
          <Icon size={24} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white uppercase">{title}</h2>
        <p className="text-slate-400 text-sm leading-relaxed italic border-l border-[#3b82f6]/30 pl-4">
          {stakes}
        </p>
        <button 
          onClick={() => onRequest(title)}
          className="px-6 py-3 bg-[#3b82f6] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#2563eb] transition-colors flex items-center gap-2 w-fit"
        >
          Request Report
          <ArrowRight size={14} />
        </button>
      </div>
      <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, idx) => (
          <ReportCard key={idx} title={report.title} description={report.description} />
        ))}
      </div>
    </div>
  </section>
);

export const OperatorReports: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = React.useState<string | null>(null);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPersona]);

  if (selectedPersona) {
    return (
      <div className="min-h-screen bg-[#1a2633]">
        <ReportRequestForm 
          persona={selectedPersona} 
          onBack={() => setSelectedPersona(null)} 
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#1a2633] text-slate-200 font-sans selection:bg-[#3b82f6] selection:text-white"
    >
      {/* Hero Section */}
      <header className="relative h-[60vh] flex items-center overflow-hidden border-b border-white/5 bg-[#0f1a24]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-2xl opacity-20 pointer-events-none">
          <img 
            src="/tpl-seal.png" 
            alt="TPL Seal" 
            className="w-full h-auto object-contain invert drop-shadow-2xl"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2633] via-[#1a2633]/60 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="inline-block px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border border-[#3b82f6]/20">
            Intelligence Services
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[0.9] tracking-tighter uppercase max-w-4xl">
            Infrastructure Intelligence Reports
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-serif italic">
            Custom intelligence on physical bottlenecks, vendor leverage, and project risks.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* Section 1: Core Operators */}
        <AudienceSection 
          icon={Settings}
          title="Core Operators"
          stakes="You run physical infrastructure. We track constraints that shape your next move."
          onRequest={setSelectedPersona}
          reports={[
            { 
              title: "Watershed Risk Dossiers", 
              description: "Site-level water stress and permitting analysis" 
            },
            { 
              title: "Cooling Vendor Scorecards", 
              description: "Performance vs cost vs deployment benchmarks" 
            },
            { 
              title: "Project Timeline Trackers", 
              description: "Permitting delays and interconnection status" 
            }
          ]}
        />

        {/* Section 2: Commercial Partners */}
        <AudienceSection 
          icon={ShieldCheck}
          title="Commercial Partners"
          stakes="You need buyer access. We map procurement signals and decision-makers."
          onRequest={setSelectedPersona}
          reports={[
            { 
              title: "Developer Procurement Maps", 
              description: "Active RFPs and project pipelines" 
            },
            { 
              title: "Category Leverage Briefings", 
              description: "Position your solution against current bottlenecks" 
            },
            { 
              title: "Trust Accelerator Reports", 
              description: "Operator credibility and RFP positioning" 
            }
          ]}
        />

        {/* Section 3: Institutional Interpreters */}
        <AudienceSection 
          icon={BarChart3}
          title="Institutional Interpreters"
          stakes="You forecast markets. We surface physical constraints others miss."
          onRequest={setSelectedPersona}
          reports={[
            { 
              title: "Regional Bottleneck Forecasts", 
              description: "Power/land/water capacity by MSA" 
            },
            { 
              title: "Governance Risk Maps", 
              description: "Local permitting failure modes and backlash" 
            },
            { 
              title: "Constraint Priority Brief", 
              description: "What operators face this quarter" 
            }
          ]}
        />

        {/* Section 4: Strategic Stakeholders */}
        <AudienceSection 
          icon={Scale}
          title="Strategic Stakeholders"
          stakes="You advise executives. We deliver constraint intel they need now."
          onRequest={setSelectedPersona}
          reports={[
            { 
              title: "Operating Takeaways Brief", 
              description: "Weekly physical constraint executive summary" 
            },
            { 
              title: "Vendor Landscape Maps", 
              description: "Cooling/power solution competitive positioning" 
            },
            { 
              title: "Strategic Introduction Tracker", 
              description: "Key relationships forming now" 
            }
          ]}
        />

        {/* Footer CTA */}
        <section className="py-20 border-t border-white/5 text-center">
          <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Institutional Advisory</h3>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 font-serif italic">
            For bespoke intelligence requirements or multi-region constraint analysis, contact our institutional advisory team.
          </p>
          <a 
            href="mailto:advisory@aiphysicallayer.com"
            className="inline-block px-8 py-4 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-[#1a2633] transition-all"
          >
            Contact Advisory
          </a>
        </section>
      </main>
    </motion.div>
  );
};
