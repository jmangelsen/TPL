/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplets, 
  Zap, 
  Wind, 
  Map as MapIcon, 
  FileText, 
  HardHat, 
  ArrowRight, 
  Linkedin, 
  Mail,
  Menu,
  X,
  ChevronRight,
  BookOpen,
  Globe,
  ChevronDown,
  Sparkles,
  LogIn,
  LogOut,
  User as UserIcon,
  Activity,
  Shield
} from 'lucide-react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Glossary } from './components/Glossary';
import { LandingPage } from './components/LandingPage';
import { FlagshipArticle } from './components/FlagshipArticle';
import { OperatorReports } from './components/OperatorReports';
import { SubscribeForm } from './components/SubscribeForm';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminDashboard } from './components/AdminDashboard';
import { ResearchAssistant } from './components/ResearchAssistant';
import { IntelligenceArchive } from './components/IntelligenceArchive';
import { ConstraintMonitor } from './components/ConstraintMonitor';
import { MonitorMethodology } from './pages/MonitorMethodology';
import { MonitorReport } from './pages/MonitorReport';
import { Paywall } from './components/Paywall';
import { auth, db, signInWithGoogle } from './firebase';
import { doc, getDoc } from 'firebase/firestore/lite';
import { signOut } from 'firebase/auth';
import { PlanCard } from './components/pricing/PlanCard';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { EnterpriseRequest } from './pages/EnterpriseRequest';
import { ViewModeProvider } from './context/ViewModeContext';
import { ViewModeToggle } from './components/admin/ViewModeToggle';
import { useEffectiveTier } from './hooks/useEffectiveTier';
import { Navigator } from './pages/admin/Navigator';
import { isAdminEmail } from './lib/adminUtils';

import { EnterpriseLayout } from './components/enterprise/EnterpriseLayout';
import { EnterpriseGuard } from './components/enterprise/EnterpriseGuard';
import { Q2Report } from './pages/enterprise/Q2Report';
import { MarketTrackerHub } from './pages/tracker/MarketTrackerHub';
import { CompanyDetail } from './pages/tracker/CompanyDetail';
import { ForecastIndex } from './pages/forecast/ForecastIndex';
import { CategoryForecast } from './pages/forecast/CategoryForecast';

import { Sitemap } from './pages/Sitemap';

const Navbar = ({ isAdmin, user }: { isAdmin: boolean, user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    setIsAccountOpen(false);
    navigate('/');
  };

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const navLinks = [
    { name: 'Research', path: '/article' },
    { name: 'Monitor', path: '/monitor' },
    { name: 'Tracker', path: '/market-tracker' },
    { name: 'Reports', path: '/reports' },
    { name: 'About', path: '/about' },
  ];

  const isDarkNavPage = true;

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] backdrop-blur-2xl border-b transition-colors duration-300 bg-black/98 border-white/10">
      {/* Topography Overlay for Header */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[4]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        {/* Left Side: Brand/Logo */}
        <Link 
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <span className="font-condensed font-bold text-xl tracking-tight uppercase leading-none text-white">The Physical Layer</span>
        </Link>

        {/* Center Navigation: Desktop */}
        <div className="hidden md:flex items-center gap-14">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              className={`text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-300 relative group ${
                currentPath === link.path 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-full h-px transition-transform duration-300 origin-left ${
                currentPath === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              } bg-white`} />
            </Link>
          ))}
        </div>

        {/* Right Side: Account & CTA */}
        <div className="hidden md:flex items-center gap-10">
          <ViewModeToggle userEmail={user?.email} isDarkNavPage={isDarkNavPage} />
          <div className="relative">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] transition-all group text-white/70 hover:text-white"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all bg-white/10 border border-white/20 group-hover:bg-white/20 group-hover:border-white/30">
                    <UserIcon size={12} className="text-white/70 group-hover:text-white" />
                  </div>
                  <span>Account</span>
                  <ChevronDown size={12} className={`transition-transform duration-500 ease-in-out ${isAccountOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isAccountOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-[1010]" 
                        onClick={() => setIsAccountOpen(false)} 
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 12, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.99 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 mt-5 w-64 bg-white border border-tpl-ink/10 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.25)] z-[1020] overflow-hidden rounded-sm"
                      >
                        <div className="px-6 py-5 bg-tpl-bg/40 border-b border-tpl-ink/5">
                          <p className="text-[9px] font-bold text-tpl-steel uppercase tracking-[0.25em] mb-1.5 opacity-60">Verified Identity</p>
                          <p className="text-[11px] font-bold text-tpl-ink truncate tracking-tight">{user.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link 
                            to="/intelligence"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-4 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] text-tpl-steel hover:bg-tpl-bg hover:text-tpl-ink transition-colors group/item"
                          >
                            <Activity size={14} className="opacity-40 group-hover/item:opacity-100 transition-opacity" />
                            My Intelligence
                          </Link>
                          {isAdmin && (
                            <Link 
                              to="/admin"
                              onClick={() => setIsAccountOpen(false)}
                              className="flex items-center gap-4 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] text-tpl-steel hover:bg-tpl-bg hover:text-tpl-ink transition-colors group/item"
                            >
                              <Shield size={14} className="opacity-40 group-hover/item:opacity-100 transition-opacity" />
                              Admin Console
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-tpl-ink/5 py-2 bg-tpl-bg/10">
                          <button 
                            onClick={handleSignOut}
                            className="w-full text-left px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-4 group/item"
                          >
                            <LogOut size={14} className="opacity-60 group-hover/item:opacity-100 transition-opacity" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={handleSignIn}
                className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] transition-all group text-white/70 hover:text-white"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all bg-white/10 border border-white/20 group-hover:bg-white/20 group-hover:border-white/30">
                  <LogIn size={12} className="text-white/70 group-hover:text-white" />
                </div>
                <span>Sign In</span>
              </button>
            )}
          </div>
          
          <Link 
            to="/get-access"
            className="px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:shadow-xl active:scale-[0.97] rounded-sm bg-white text-black hover:bg-white/90"
          >
            Get Access
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-white/10 text-white"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/10 px-6 py-8 flex flex-col gap-6 shadow-xl overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)} 
                className={`text-sm font-bold uppercase tracking-[0.2em] py-2 border-b border-white/10 ${
                  currentPath === link.path ? 'text-white' : 'text-white/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex flex-col gap-4 pt-4">
              <div className="md:hidden mb-4">
                <ViewModeToggle userEmail={user?.email} />
              </div>
              {user ? (
                <>
                  <Link 
                    to="/intelligence"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-bold uppercase tracking-[0.2em] text-white/70"
                  >
                    My Intelligence
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-bold uppercase tracking-[0.2em] text-white/70"
                    >
                      Admin Console
                    </Link>
                  )}
                  <button 
                    onClick={handleSignOut}
                    className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 text-left"
                >
                  Sign In
                </button>
              )}
              <Link 
                to="/get-access"
                onClick={() => setIsOpen(false)} 
                className="w-full py-4 bg-white text-black text-center text-xs font-bold uppercase tracking-[0.2em]"
              >
                Get Access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const TopicCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="group p-6 md:p-8 border border-tpl-ink/10 hover:border-tpl-ink/30 transition-all duration-300 bg-white/50">
    <div className="mb-4 md:mb-6 text-tpl-slate group-hover:text-tpl-accent transition-colors">
      <Icon size={28} md:size={32} strokeWidth={1.5} />
    </div>
    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{title}</h3>
    <p className="text-tpl-slate text-xs md:text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

const WhySection = ({ title, description, role }: { title: string, description: string, role: string }) => (
  <div className="flex flex-col gap-4">
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-tpl-steel">{role}</span>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-tpl-slate text-sm leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <LandingPage />
      
      {/* TOPICS SECTION */}
      <section id="topics" className="py-12 md:py-24 px-6 border-y border-tpl-ink/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-10">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-tpl-steel mb-3 md:mb-4 block">Core Research Areas</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Constraints of Scale</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-tpl-ink/10 border border-tpl-ink/10">
            <TopicCard 
              icon={Droplets}
              title="Hydrological Load"
              description="Analyzing the 5 million gallon daily evaporation rate of hyperscale cooling loops."
            />
            <TopicCard 
              icon={Zap}
              title="Grid Resilience"
              description="The transition from passive consumers to active grid participants and micro-nuclear integration."
            />
            <TopicCard 
              icon={Globe}
              title="Land Governance"
              description="How the Dillon Rule and local zoning are becoming the ultimate bottlenecks for AI expansion."
            />
            <TopicCard 
              icon={Droplets}
              title="Water"
              description="Analysis of evaporative cooling requirements and the mounting pressure on local municipal water systems."
            />
            <TopicCard 
              icon={Zap}
              title="Power"
              description="Tracking grid interconnection queues, baseload requirements, and the shift toward behind-the-meter generation."
            />
            <TopicCard 
              icon={Wind}
              title="Cooling"
              description="Technical deep-dives into liquid-to-chip transitions and the thermal management of high-density compute."
            />
            <TopicCard 
              icon={MapIcon}
              title="Land"
              description="The geography of compute: identifying viable parcels with the rare combination of fiber, power, and zoning."
            />
            <TopicCard 
              icon={FileText}
              title="Permitting"
              description="Navigating the complex landscape of environmental impact reports and local zoning board approvals."
            />
            <TopicCard 
              icon={HardHat}
              title="Construction Risk"
              description="Supply chain bottlenecks for long-lead items like transformers, switchgear, and specialized labor."
            />
          </div>
        </div>
      </section>

      {/* FLAGSHIP ARTICLE SECTION */}
      <section id="flagship" className="py-12 md:py-24 px-6 bg-tpl-ink text-tpl-bg relative overflow-hidden">
        {/* Topography Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[4] blur-sm" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <span className="inline-block px-3 py-1 bg-white/10 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-6">
              Flagship Research
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight tracking-tight">
              AI Has a Watershed Problem
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-6 md:mb-8 leading-relaxed max-w-lg">
              As data centers transition to high-density AI clusters, their thirst for water is reaching a breaking point. We examine why water is becoming the ultimate constraint on growth.
            </p>
            <Link 
              to="/article"
              className="w-full md:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-tpl-ink font-bold hover:bg-tpl-bg transition-colors flex items-center justify-center md:justify-start gap-3 group"
            >
              Read full article
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="order-1 lg:order-2 aspect-[4/5] bg-tpl-ink relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            </div>
            <div className="w-3/4 max-w-md relative z-10 opacity-50">
              <img 
                src="/tpl-seal.png" 
                alt="TPL Seal" 
                className="w-full h-auto object-contain invert drop-shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-tpl-ink via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS SECTION */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            <WhySection 
              role="For Operators"
              title="Project Viability"
              description="Understand the physical bottlenecks that can stall a project for years, from grid queues to local water moratoriums."
            />
            <WhySection 
              role="For Investors"
              title="Hidden Risk"
              description="Infrastructure burdens create tail risks that aren't visible in software-centric valuation models."
            />
            <WhySection 
              role="For Communities"
              title="Local Impact"
              description="Analysis of how large-scale industrial compute reshapes local economies, resources, and governance."
            />
          </div>
        </div>
      </section>
    </>
  );
};

const About = () => (
  <section className="py-16 md:py-40 px-6 bg-white min-h-[80vh] relative overflow-hidden">
    {/* Institutional Seal Watermark */}
    <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.05] pointer-events-none w-[400px] h-[400px] md:w-[700px] md:h-[700px]">
      <img 
        src="/tpl-seal.png" 
        alt="" 
        className="w-full h-full object-contain" 
      />
    </div>

    <div className="max-w-4xl mx-auto relative z-10">
      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-tpl-accent mb-6 md:mb-8 block">About TPL</span>
      <h1 className="text-4xl md:text-7xl font-bold mb-10 md:mb-16 tracking-tighter leading-none">The Physical Layer</h1>
      
      <div className="mb-12 md:mb-20 aspect-video bg-black relative overflow-hidden flex items-center justify-center">
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
            alt="TPL Seal" 
            className="w-40 md:w-56 lg:w-64 h-auto object-contain invert drop-shadow-[0_0_30px_rgba(0,0,0,0.6)]"
          />
        </div>

        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20">
          <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">System Audit // 001</p>
          <p className="text-base md:text-xl font-bold text-white">High-Density Compute & Thermal Management</p>
        </div>
      </div>
      
      <div className="max-w-3xl">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-tpl-steel mb-8 border-b border-tpl-ink/10 pb-4">
          Independent analysis of the infrastructure behind AI
        </h2>
        
        <div className="space-y-8 text-lg md:text-2xl text-tpl-slate leading-relaxed font-serif">
          <p>
            TPL is an independent publication and research platform covering the physical layer of AI. We focus on the energy, land, water, power, fiber, labor, and policy systems that determine where AI infrastructure can be built, how fast it can scale, and who bears the costs.
          </p>
          <p>
            As AI shifts from a software story to an industrial buildout, its limiting factors are increasingly physical. TPL tracks the bottlenecks, tradeoffs, and local constraints that shape data centers and supporting infrastructure, translating complex systems into clear analysis for operators, investors, policymakers, and anyone trying to understand where digital ambition meets real-world limits.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-16 md:py-24 px-6 bg-tpl-bg min-h-[80vh] flex items-center">
    <div className="max-w-xl mx-auto text-center w-full">
      <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
      <p className="text-tpl-slate mb-8 leading-relaxed">
        Need enterprise access or data integrations? Contact us to discuss an organization-wide plan.
      </p>
      <div className="mt-8 flex items-center justify-center gap-6 text-tpl-steel">
        <a href="mailto:Research@aiphysicallayer.com" className="flex items-center gap-2 text-sm hover:text-tpl-ink transition-colors">
          <Mail size={16} />
          Research@aiphysicallayer.com
        </a>
      </div>
    </div>
  </section>
);

const GetAccess = () => (
  <section id="get-access" className="py-16 md:py-24 px-6 bg-tpl-bg min-h-[80vh]">
    <div className="max-w-4xl mx-auto w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose your access level</h2>
        <p className="text-tpl-slate text-lg leading-relaxed max-w-2xl mx-auto">
          Stay ahead of physical constraints shaping AI infrastructure with flexible subscription options.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-24">
        <PlanCard
          name="Essentials"
          price="$10.99"
          priceUnit="/month"
          description="Current-cycle access for focused readers."
          features={[
            "All current-quarter research reports",
            "Current-quarter Constraint Monitor overview",
            "Email alerts when new briefs and reports publish",
            "Light archive access (recent 1–2 quarters of select reports)"
          ]}
          ctaLabel="Get Essentials"
          tier="essentials"
        />
        <PlanCard
          name="Pro"
          price="$29.99"
          priceUnit="/month"
          description="Full-cycle visibility for active operators."
          features={[
            "Everything in Essentials",
            "Full archive of past quarterly reports (as available)",
            "Full Constraint Monitor history and methodology notes",
            "Quarterly change log: what moved and why",
            "Priority response on research and clarification requests"
          ]}
          ctaLabel="Get Pro"
          tier="pro"
          highlight
        />
      </div>

      <div className="max-w-xl mx-auto text-center border-t border-tpl-ink/10 pt-16">
        <h3 className="text-xl font-bold mb-3">Just want to stay in the loop?</h3>
        <p className="text-tpl-slate text-sm mb-8 leading-relaxed">
          Join the free list for occasional updates on new research, reports, and product launches.
        </p>
        <div className="flex justify-center mb-12">
          <SubscribeForm />
        </div>
        
        <p className="text-xs text-tpl-slate">
          Need organization-wide access or direct data integrations? Enterprise plans are available via consultation. <Link to="/enterprise-request" className="underline hover:text-tpl-ink">Talk to us</Link>.
        </p>
      </div>
    </div>
  </section>
);

export default function App() {
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isDarkNavPage = true;

  useEffect(() => {
    // Check URL parameters for Stripe success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
      setIsSubscribed(true);
      navigate('/intelligence');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        // Check if user is admin or subscribed in Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role === 'admin') {
              setIsAdmin(true);
              setIsSubscribed(true); // Admins get access to research tools
            } else {
              setIsAdmin(false);
              setIsSubscribed(!!data.isSubscribed);
            }
          } else if (isAdminEmail(u.email)) {
            // Default admin check
            setIsAdmin(true);
            setIsSubscribed(true);
          } else {
            setIsAdmin(false);
            setIsSubscribed(false);
          }
        } catch (e) {
          // Fallback to email check if Firestore fails (e.g. rules)
          if (isAdminEmail(u.email)) {
            setIsAdmin(true);
            setIsSubscribed(true);
          } else {
            setIsAdmin(false);
            setIsSubscribed(false);
          }
        }
      } else {
        setIsAdmin(false);
        setIsSubscribed(false);
        if (location.pathname === '/admin') navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const handleAdminLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const effectiveTier = useEffectiveTier(isSubscribed ? 'pro' : 'free', user?.email || undefined);
  const effectiveIsSubscribed = effectiveTier === 'essentials' || effectiveTier === 'pro' || effectiveTier === 'admin';
  const effectiveIsAdmin = effectiveTier === 'admin';

  return (
    <ErrorBoundary>
      <Routes>
        {/* Enterprise Routes - Completely Isolated */}
        <Route path="/enterprise" element={
          <EnterpriseGuard>
            <EnterpriseLayout />
          </EnterpriseGuard>
        }>
          <Route path="q2-2026" element={<Q2Report />} />
          <Route index element={<Navigate to="q2-2026" replace />} />
        </Route>

        {/* Main Site Routes */}
        <Route path="*" element={
          <div className="min-h-screen selection:bg-tpl-accent selection:text-white">
            <Navbar 
              isAdmin={effectiveIsAdmin}
              user={user}
            />
            <Glossary isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
            <ResearchAssistant isSubscribed={effectiveIsSubscribed} />

            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/article" element={<FlagshipArticle isSubscribed={effectiveIsSubscribed} user={user} />} />
                <Route path="/reports" element={<OperatorReports />} />
                <Route path="/monitor" element={<ConstraintMonitor user={user} isSubscribed={effectiveIsSubscribed} />} />
                <Route path="/monitor/methodology" element={<MonitorMethodology />} />
                <Route path="/monitor/report" element={<MonitorReport user={user} isSubscribed={effectiveIsSubscribed} />} />
                <Route path="/market-tracker" element={<MarketTrackerHub />} />
                <Route path="/market-tracker/:slug" element={<CompanyDetail />} />
                <Route path="/forecast" element={<ForecastIndex />} />
                <Route path="/forecast/:categorySlug" element={<CategoryForecast user={user} isSubscribed={effectiveIsSubscribed} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/get-access" element={<GetAccess />} />
                <Route path="/enterprise-request" element={<EnterpriseRequest />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/intelligence" element={effectiveIsSubscribed ? <IntelligenceArchive /> : <Paywall user={user} />} />
                <Route path="/sitemap" element={<Sitemap user={user} isSubscribed={effectiveIsSubscribed} isAdmin={effectiveIsAdmin} />} />
                <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Home />} />
                <Route path="/admin/navigator" element={isAdmin ? <Navigator /> : <Home />} />
              </Routes>
            </main>

            {/* Live Stats Ticker */}
            <div className="bg-tpl-ink text-tpl-bg py-4 overflow-hidden border-t border-white/10 relative z-20">
              {/* Topography Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[4]" />
              </div>
              <div className="flex whitespace-nowrap animate-marquee w-max relative z-10">
                {[1, 2].map((group) => (
                  <div key={group} className="flex items-center">
                    <div className="flex items-center gap-12 px-12 border-r border-white/10">
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Permitting Delay: 14.2 Months</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-tpl-accent">Interconnection Queue: 5.8 Years</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Transformer Lead Time: 118 Weeks</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Water Risk: Elevated</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-tpl-accent">Utility Capacity: Constrained</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Cooling Pressure: Rising</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Site Control Friction: High</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-tpl-accent">Labor Tightness: -12%</span>
                    </div>
                    <div className="flex items-center gap-12 px-12 border-r border-white/10">
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Permitting Delay: 14.2 Months</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-tpl-accent">Interconnection Queue: 5.8 Years</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Transformer Lead Time: 118 Weeks</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Water Risk: Elevated</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-tpl-accent">Utility Capacity: Constrained</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Cooling Pressure: Rising</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Site Control Friction: High</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-tpl-accent">Labor Tightness: -12%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <footer className="py-12 px-6 border-t relative transition-colors duration-300 bg-black border-white/10">
              {/* Topography Overlay for Footer */}
              <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/Topo.Microchip.png')] bg-cover bg-center mix-blend-screen scale-[4]" />
              </div>

              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 relative flex items-center justify-center overflow-hidden">
                    <img 
                      src="/tpl-seal.png" 
                      alt="TPL Seal" 
                      className="w-full h-full object-contain invert" 
                      onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=TPL&background=1a2633&color=fff'; }} 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-condensed font-bold text-xl tracking-tight uppercase leading-none text-white">The Physical Layer</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-white/70">
                  <Link 
                    to="/about"
                    className="transition-colors cursor-pointer hover:text-white"
                  >
                    About
                  </Link>
                  <Link 
                    to="/article"
                    className="transition-colors cursor-pointer hover:text-white"
                  >
                    Articles
                  </Link>
                  <Link 
                    to="/reports"
                    className="transition-colors cursor-pointer hover:text-white"
                  >
                    Reports
                  </Link>
                  <button 
                    onClick={() => setIsGlossaryOpen(true)} 
                    className="transition-colors cursor-pointer hover:text-white"
                  >
                    Glossary
                  </button>
                  <Link 
                    to="/contact"
                    className="transition-colors cursor-pointer flex items-center gap-2 hover:text-white"
                  >
                    Contact
                  </Link>
                  <Link 
                    to="/sitemap"
                    className="transition-colors cursor-pointer hover:text-white"
                  >
                    Sitemap
                  </Link>
                  <a 
                    href="https://www.linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="transition-colors hover:text-white"
                  >
                    LinkedIn
                  </a>
                  {!user ? (
                    <button 
                      onClick={handleAdminLogin}
                      className="transition-colors cursor-pointer hover:text-white"
                    >
                      Admin Login
                    </button>
                  ) : isAdmin && location.pathname !== '/admin' ? (
                    <Link 
                      to="/admin"
                      className="transition-colors cursor-pointer hover:text-white"
                    >
                      Dashboard
                    </Link>
                  ) : null}
                </div>

                <div className="text-[10px] uppercase tracking-widest text-white/50">
                  © {new Date().getFullYear()} The Physical Layer. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        } />
      </Routes>
    </ErrorBoundary>
  );
}
