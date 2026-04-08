import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Bookmark, Clock, Calendar } from 'lucide-react';
import { SubscribeForm } from './SubscribeForm';
import { DeepAnalysis } from './DeepAnalysis';

interface FlagshipArticleProps {
  isSubscribed: boolean;
  user: any;
}

export const FlagshipArticle: React.FC<FlagshipArticleProps> = ({ isSubscribed, user }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-tpl-bg text-tpl-ink font-sans selection:bg-tpl-accent selection:text-white"
    >
      <article className="pt-12 md:pt-16 pb-20 md:pb-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <header className="mb-12 md:mb-16">
            <div className="flex flex-wrap items-center gap-4 mb-6 md:mb-8">
              <span className="px-3 py-1 bg-tpl-ink text-tpl-bg text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">
                Flagship Research
              </span>
              <div className="flex items-center gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-tpl-steel">
                <span className="flex items-center gap-1.5"><Calendar size={12} /> March 2026</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> 8 Min Read</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold mb-6 md:mb-8 leading-[0.9] tracking-tight">
              AI Has a Watershed Problem
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
              <p className="text-xl md:text-3xl font-serif italic text-tpl-slate leading-snug max-w-2xl">
                The physical layer of the AI revolution is being decided by cooling loops, electric load, and municipal approvals.
              </p>
              <div className="shrink-0">
                <DeepAnalysis 
                  title="AI Watershed Problem" 
                  content="This article discusses the massive water consumption of AI data centers, reaching up to 5 million gallons per day. It explores the tension between digital ambition and local resource constraints, the engineering challenges of high-density cooling, and the political/governance dynamics like the Dillon Rule."
                  isSubscribed={isSubscribed}
                  user={user}
                />
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-video md:aspect-[21/9] bg-black mb-12 md:mb-16 overflow-hidden relative flex items-center justify-center">
            {/* Background topo image – full coverage */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center bg-no-repeat blur-sm opacity-70" />
              {/* Dark overlay so the seal pops */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
            </div>

            {/* Foreground seal logo */}
            <div className="w-1/2 max-w-lg relative z-10 opacity-100 flex justify-center">
              <img 
                src="/tpl-seal.png" 
                alt="The Physical Layer seal" 
                className="w-40 md:w-56 lg:w-64 h-auto object-contain invert drop-shadow-[0_0_30px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-16">
            <div className="prose prose-lg prose-tpl max-w-none">
              <p className="text-xl leading-relaxed mb-8 font-medium text-tpl-ink">
                Artificial intelligence is often described as a software revolution, but its expansion is being decided by something far less virtual: whether real communities can supply enough water, power, and political tolerance to support the infrastructure behind it.
              </p>

              <p className="mb-6">
                The market talks about models, chips, and valuation. The physical world talks about cooling loops, electric load, municipal approvals, and whether a town can absorb millions of gallons of daily water demand without deciding the bargain no longer works.
              </p>

              <p className="mb-6">
                That is why water is not a side issue in the AI build-out. It is becoming one of the clearest mechanisms through which digital ambition turns into local economic stress, public opposition, and, in some cases, outright project failure.
              </p>

              <figure className="my-16">
                <div className="aspect-video bg-tpl-ink/5 overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  </div>
                  <div className="w-1/3 max-w-sm relative z-10 opacity-20">
                    <img 
                      src="/tpl-seal.png" 
                      alt="TPL Seal" 
                      className="w-full h-auto object-contain drop-shadow-xl"
                    />
                  </div>
                </div>
              </figure>

              <div className="my-10 md:my-12 p-6 md:p-8 border-l-4 border-tpl-accent bg-tpl-accent/5">
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-tpl-accent mb-2 block">Critical Metric</span>
                <p className="text-2xl md:text-3xl font-bold tracking-tight mb-2">5 Million Gallons</p>
                <p className="text-xs md:text-sm text-tpl-slate uppercase tracking-wider font-bold">Daily consumption per large data center</p>
              </div>

              <p className="mb-6">
                Early numbers already show the scale of the burden. Large data centers can consume up to 5 million gallons of water per day, and recent analysis notes a 63% increase in water use in Northern Virginia tied to the sector footprint.
              </p>

              <p className="mb-6">
                Those are not just alarming environmental statistics. They are the opening terms of a financial and political negotiation that many developers still underestimate.
              </p>

              <p className="mb-6">
                A town may welcome a data center when the pitch centers on tax base expansion, infrastructure investment, and future-facing economic growth. That pitch weakens when residents and local officials begin translating "AI infrastructure" into a simpler question: how much drinking water is this facility going to evaporate, divert, or otherwise bind up every day, and what do we actually get in return?
              </p>

              <blockquote className="my-10 md:my-12 border-y border-tpl-ink/10 py-8 md:py-10">
                <p className="text-xl md:text-3xl font-serif italic text-tpl-ink leading-tight text-center px-4 md:px-8">
                  "When an article says community resistance is rising but does not carry the 5 million gallon figure into that economic argument, it leaves the most important causal link unfinished. In reality, that number is the argument."
                </p>
              </blockquote>

              <p className="mb-6">
                The fiscal math becomes even harder in places where the physical burden is high and the upside is uncertain. Research shows that roughly two-thirds of data centers are being built in water-stressed areas, while separate findings indicate that local fiscal benefits are highly variable.
              </p>

              <p className="mb-6">
                Put directly, a municipality facing water stress is not evaluating an abstract technology investment. It is evaluating whether variable tax benefits are enough to justify locking in long-term infrastructure strain in a place that may already have limited hydrological slack.
              </p>

              <p className="mb-6">
                That is why local pushback in places like Franklin Township or around the PW Digital Gateway should not be treated as vague anti-growth sentiment. Once millions of gallons per day become legible as a local burden, promised tax receipts stop sounding like upside and start sounding like insufficient compensation.
              </p>

              <p className="mb-6">
                At that point, opposition is no longer merely emotional or symbolic. It becomes an economically rational response to a project whose physical costs are now visible enough to price.
              </p>

              <h2 className="text-3xl font-bold mt-16 mb-8 tracking-tight">The Thermal Bridge</h2>

              <p className="mb-6">
                The industry often responds by implying that cooling is simply a technical detail to be optimized later. That framing is too soft. Cooling sits at the center of the problem because the newest AI workloads are driving unprecedented thermal density, which means the market demand for more compute is directly creating the engineering conditions that intensify water use and infrastructure strain.
              </p>

              <p className="mb-6 font-bold text-tpl-ink">
                You have to introduce heat before you introduce cooling, because heat is the bridge between demand and physical burden.
              </p>

              <p className="mb-6">
                As next-generation AI processors run hotter to satisfy market demand, developers are pushed into increasingly high-stakes cooling decisions between air-based systems, liquid cooling, and more advanced configurations.
              </p>

              <p className="mb-6">
                Once that causal chain is clear, the cooling discussion no longer feels like an engineering detour. It becomes the physical expression of the economic race for AI capacity.
              </p>

              <p className="mb-6">
                This is where technical language has to carry business meaning. Open-loop cooling, for example, should not appear as a sterile engineering label; it should be understood as a design approach that can mean evaporating enormous volumes of potable water to keep servers within operating range.
              </p>

              <p className="mb-6">
                Thermal throttling should not remain an insider phrase either. It is the moment servers reduce performance or shut themselves down to avoid overheating, which translates directly into degraded service and lost revenue for the operator.
              </p>

              <h2 className="text-3xl font-bold mt-16 mb-8 tracking-tight">The Dillon Rule and Power Dynamics</h2>

              <p className="mb-6">
                The same principle applies to governance language. A Dillon Rule jurisdiction is not just a legal classification; in practice, it can mean local governments have limited authority to negotiate aggressively with multibillion-dollar developers, which changes the balance of power long before any public hearing begins.
              </p>

              <p className="mb-6">
                Once those terms are translated in stride, the piece stops feeling like a technical memo written only for insiders and starts functioning as what it should be: an operator-grade explanation of how physical infrastructure, legal structure, and political leverage interact.
              </p>

              <p className="mb-6">
                Seen this way, water is not merely one environmental concern among many. It is the constraint that can expose whether the entire AI infrastructure proposition is locally financeable, politically durable, and operationally sustainable.
              </p>

              <p className="mb-12">
                A project can clear underwriting, attract capital, and still fail if its cooling design turns into a municipal liability and its water burden becomes easier for residents to understand than the economic case used to justify it.
              </p>

              <p className="text-xl font-medium text-tpl-ink leading-relaxed">
                If water continues to outpace local benefits, then water will not just constrain individual projects. It will constrain the terms under which the next phase of AI infrastructure can be built at all.
              </p>
            </div>

            {/* Sidebar / Meta info */}
            <aside className="border-t border-tpl-ink/10 pt-12 lg:border-t-0 lg:pt-0">
              <div className="sticky top-32 space-y-12">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel mb-4 block">Author</span>
                  <p className="font-bold">The Physical Layer Editorial Team</p>
                  <p className="text-sm text-tpl-slate">Infrastructure & Resource Analysis</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel mb-4 block">Topics</span>
                  <div className="flex flex-wrap gap-2">
                    {['Water Stress', 'Cooling Systems', 'AI Infrastructure', 'Municipal Governance'].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-tpl-ink/5 text-[10px] font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-tpl-ink/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tpl-steel mb-4 block">Share Research</span>
                  <div className="flex gap-4">
                    <button className="w-10 h-10 rounded-full border border-tpl-ink/10 flex items-center justify-center hover:bg-tpl-ink hover:text-tpl-bg transition-all">
                      <Share2 size={16} />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-tpl-ink/10 flex items-center justify-center hover:bg-tpl-ink hover:text-tpl-bg transition-all">
                      <Bookmark size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Newsletter Footer */}
      <section className="bg-tpl-ink/5 py-24 px-6 border-t border-tpl-ink/5">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 tracking-tight uppercase">Get the full report</h2>
          <p className="text-tpl-slate mb-8 font-serif italic">Be among the first to receive our weekly deep-dives into the physical foundation of the AI era.</p>
          <div className="flex justify-center">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </motion.div>
  );
};
