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
import { TopoTile } from './components/ui/TopoTile';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Glossary } from './components/Glossary';
import { LandingPage } from './components/LandingPage';
import { FlagshipArticle } from './components/FlagshipArticle';
import { OperatorReports } from './components/OperatorReports';
import { SubscribePage } from './pages/SubscribePage';
import { SubscribeForm } from './components/SubscribeForm';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminMapProjects } from './pages/admin/MapProjects';
import { IntelligenceArchive } from './components/IntelligenceArchive';
import { ConstraintMonitor } from './components/ConstraintMonitor';
import { MonitorMethodology } from './pages/MonitorMethodology';
import { MonitorReport } from './pages/MonitorReport';
import { auth, db, signInWithGoogle } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { EnterpriseRequest } from './pages/EnterpriseRequest';
import { ViewModeProvider } from './context/ViewModeContext';
import { ViewModeToggle } from './components/admin/ViewModeToggle';
import { useEffectiveTier } from './hooks/useEffectiveTier';
import { Navigator } from './pages/admin/Navigator';
import { SiteErrors } from './pages/admin/SiteErrors';
import { isAdminEmail } from './lib/adminUtils';

import { EnterpriseLayout } from './components/enterprise/EnterpriseLayout';
import { EnterpriseGuard } from './components/enterprise/EnterpriseGuard';
import { Q2Report } from './pages/enterprise/Q2Report';
import { MarketTrackerHub } from './pages/tracker/MarketTrackerHub';
import { BuildoutTrackerHub } from './pages/tracker/BuildoutTrackerHub';
import { EvidenceSectorPage } from './pages/tracker/EvidenceSectorPage';
import { CompanyDetail } from './pages/tracker/CompanyDetail';
import { ForecastIndex } from './pages/forecast/ForecastIndex';
import { CategoryForecast } from './pages/forecast/CategoryForecast';
import { ConstraintMap } from './pages/ConstraintMap';
import { GroundTruth } from './pages/GroundTruth';
import { InfrastructureMap } from './components/map/InfrastructureMap';
import { MapLayoutShell } from './components/map/MapLayoutShell';
import { GroundTruthChildPage } from './pages/GroundTruthChildPage';
import { MarketDossier } from './pages/MarketDossier';
import { InteractiveConstraintMap } from './pages/InteractiveConstraintMap';
import { FailureCaseStudies } from './pages/FailureCaseStudies';
import { MidwestAICampusPage } from './pages/failures/MidwestAICampusPage';
import { MarketConstraintOutlook } from './pages/MarketConstraintOutlook';

import { PowerOutlook } from './pages/outlook/PowerOutlook';
import { CoolingOutlook } from './pages/outlook/CoolingOutlook';
import { WaterOutlook } from './pages/outlook/WaterOutlook';
import { PermittingOutlook } from './pages/outlook/PermittingOutlook';
import { SupplyChainOutlook } from './pages/outlook/SupplyChainOutlook';
import { LaborOutlook } from './pages/outlook/LaborOutlook';
import { ConstraintDetail } from './pages/constraints/ConstraintDetail';
import { ConstraintMonitorChild } from './pages/constraints/ConstraintMonitorChild';

import { LiveIntelligencePanel } from './components/LiveIntelligencePanel';
import { Sitemap } from './pages/Sitemap';

const Navbar = ({ isAdmin, user }: { isAdmin: boolean, user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
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
    { name: 'Tracker', path: '/buildout-tracker' },
    { name: 'Map', path: '/map' },
    { name: 'Constraint Atlas', path: '/constraint-atlas' },
    { name: 'Ground Truth', path: '/ground-truth' },
    { 
      name: 'Info', 
      dropdown: [
        { name: 'Monitor', path: '/monitor' },
        { name: 'Reports', path: '/reports' },
        { name: 'About', path: '/about' },
      ]
    },
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
          <div className="flex flex-col font-condensed font-bold text-[13px] leading-[0.9] tracking-tight uppercase text-white">
            <span>The</span>
            <span>Physical</span>
            <span>Layer</span>
          </div>
        </Link>

        {/* Center Navigation: Desktop */}
        <div className="hidden md:flex items-center gap-14">
          {navLinks.map((link) => (
            link.dropdown ? (
              <div key={link.name} className="relative">
                <button
                  onClick={() => setIsInfoOpen(!isInfoOpen)}
                  className={`text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-300 relative group flex items-center gap-1 ${
                    link.dropdown.some(d => currentPath === d.path)
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.name}
                  <ChevronDown size={10} className={`transition-transform duration-300 ${isInfoOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isInfoOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-32 bg-black/90 border border-white/10 rounded-sm py-2"
                    >
                      {link.dropdown.map(d => (
                        <Link
                          key={d.name}
                          to={d.path}
                          onClick={() => setIsInfoOpen(false)}
                          className={`block px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                            currentPath === d.path ? 'text-white' : 'text-white/70 hover:text-white'
                          }`}
                        >
                          {d.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
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
            )
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
              link.dropdown ? (
                <div key={link.name} className="flex flex-col gap-2">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/50 py-2 border-b border-white/10">
                    {link.name}
                  </span>
                  {link.dropdown.map(d => (
                    <Link
                      key={d.name}
                      to={d.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm font-bold uppercase tracking-[0.2em] py-2 pl-4 ${
                        currentPath === d.path ? 'text-white' : 'text-white/70'
                      }`}
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              ) : (
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
              )
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

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <LandingPage />
      
      <LiveIntelligencePanel embedReady={false} />
      
      {/* MAP TEASER */}
      <section className="py-16 md:py-24 px-6 bg-[#0F0C08] border-b border-tpl-ink/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[16/10] bg-tpl-ink border border-tpl-ink/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #C49A52 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>
            <span className="text-tpl-steel text-[10px] uppercase tracking-widest">Map Preview</span>
          </div>
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--gt-accent)]">INFRASTRUCTURE MAP</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">The grid, the data centers, and the gaps between them.</h2>
            <p className="text-white/70 leading-relaxed">Every transmission line, substation, power plant, and proposed AI campus — mapped against TPL's constraint intelligence. Built on public grid data from EIA and HIFLD.</p>
            <Link to="/map" className="inline-block px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-colors">
              OPEN MAP →
            </Link>
          </div>
        </div>
      </section>
      
      {/* TOPICS SECTION */}
      <section id="topics" className="py-12 md:py-24 px-6 border-y border-tpl-ink/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-10">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-tpl-steel mb-3 md:mb-4 block">Core Research Areas</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Constraints of Scale</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-tpl-ink/10 border border-tpl-ink/10 relative overflow-hidden">
            <TopoTile 
              index={0}
              total={9}
              icon={Droplets}
              title="Hydrological Load"
              description="Analyzing the 5 million gallon daily evaporation rate of hyperscale cooling loops."
            />
            <TopoTile 
              index={1}
              total={9}
              icon={Zap}
              title="Grid Resilience"
              description="The transition from passive consumers to active grid participants and micro-nuclear integration."
            />
            <TopoTile 
              index={2}
              total={9}
              icon={Globe}
              title="Land Governance"
              description="How the Dillon Rule and local zoning are becoming the ultimate bottlenecks for AI expansion."
            />
            <TopoTile 
              index={3}
              total={9}
              icon={Droplets}
              title="Water"
              description="Analysis of evaporative cooling requirements and the mounting pressure on local municipal water systems."
            />
            <TopoTile 
              index={4}
              total={9}
              icon={Zap}
              title="Power"
              description="Tracking grid interconnection queues, baseload requirements, and the shift toward behind-the-meter generation."
            />
            <TopoTile 
              index={5}
              total={9}
              icon={Wind}
              title="Cooling"
              description="Technical deep-dives into liquid-to-chip transitions and the thermal management of high-density compute."
            />
            <TopoTile 
              index={6}
              total={9}
              icon={MapIcon}
              title="Land"
              description="The geography of compute: identifying viable parcels with the rare combination of fiber, power, and zoning."
            />
            <TopoTile 
              index={7}
              total={9}
              icon={FileText}
              title="Permitting"
              description="Navigating the complex landscape of environmental impact reports and local zoning board approvals."
            />
            <TopoTile 
              index={8}
              total={9}
              icon={HardHat}
              title="Construction Risk"
              description="Supply chain bottlenecks for long-lead items like transformers, switchgear, and specialized labor."
            />
          </div>
        </div>
      </section>

      {/* EDITORIAL / MISSION */}
      <section className="py-16 md:py-24 px-6 bg-tpl-bg border-y border-tpl-ink/10">
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative overflow-hidden">
            <TopoTile 
              index={0}
              total={3}
              eyebrow="For Operators"
              title="Project Viability"
              description="Understand the physical bottlenecks that can stall a project for years, from grid queues to local water moratoriums."
            />
            <TopoTile 
              index={1}
              total={3}
              eyebrow="For Investors"
              title="Hidden Risk"
              description="Infrastructure burdens create tail risks that aren't visible in software-centric valuation models."
            />
            <TopoTile 
              index={2}
              total={3}
              eyebrow="Ground Truth"
              title="What's Happening in Your Community"
              description="Proposed data centers, community water impact, grid pressure, and early warning signals — mapped for the people who live there. EXPLORE GROUND TRUTH →"
              href="/ground-truth"
            />
          </div>
        </div>
      </section>

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
        <div className="p-8 border border-tpl-ink/10 bg-tpl-bg">
          <h3 className="text-xl font-bold mb-4">Insight Access</h3>
          <p className="text-tpl-slate mb-6">Current-cycle access for focused readers.</p>
          <ul className="space-y-3 text-sm text-tpl-slate mb-8">
            <li>All current-quarter research reports</li>
            <li>Current-quarter Constraint Monitor overview</li>
            <li>Email alerts when new briefs and reports publish</li>
            <li>Light archive access</li>
          </ul>
        </div>
        <div className="p-8 border border-tpl-accent bg-tpl-bg">
          <h3 className="text-xl font-bold mb-4">Strategy Access</h3>
          <p className="text-tpl-slate mb-6">Full-cycle visibility for active operators.</p>
          <ul className="space-y-3 text-sm text-tpl-slate mb-8">
            <li>Everything in Essentials</li>
            <li>Full archive of past quarterly reports</li>
            <li>Full Constraint Monitor history</li>
            <li>Quarterly change log</li>
            <li>Priority response on research requests</li>
          </ul>
        </div>
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
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        // Check if user is admin in Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role === 'admin') {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } else if (isAdminEmail(u.email)) {
            // Default admin check
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (e) {
          // Fallback to email check if Firestore fails (e.g. rules)
          if (isAdminEmail(u.email)) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
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

  const effectiveIsAdmin = isAdmin;

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
        <Route path="/map" element={<MapLayoutShell />} />
        <Route path="*" element={
          <div className="min-h-screen selection:bg-tpl-accent selection:text-white">
            <Navbar 
              isAdmin={effectiveIsAdmin}
              user={user}
            />
            <Glossary isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />

            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/article" element={<FlagshipArticle user={user} isSubscribed={isSubscribed} />} />
                <Route path="/reports" element={<OperatorReports />} />
                <Route path="/monitor" element={<ConstraintMonitor user={user} isSubscribed={isSubscribed} />} />
                <Route path="/monitor/methodology" element={<MonitorMethodology />} />
                <Route path="/monitor/report" element={<MonitorReport user={user} isSubscribed={isSubscribed} />} />
                <Route path="/buildout-tracker" element={<BuildoutTrackerHub />} />
                <Route path="/evidence/:sectorSlug" element={<EvidenceSectorPage />} />
                <Route path="/market-tracker" element={effectiveIsAdmin ? <MarketTrackerHub /> : <Navigate to="/" replace />} />
                <Route path="/market-tracker/:slug" element={<CompanyDetail />} />
                <Route path="/forecast" element={<ForecastIndex />} />
                <Route path="/constraints/national/power" element={<PowerOutlook user={user} isSubscribed={isSubscribed} />} />
                <Route path="/constraints/national/cooling" element={<CoolingOutlook user={user} isSubscribed={isSubscribed} />} />
                <Route path="/constraints/national/water" element={<WaterOutlook user={user} isSubscribed={isSubscribed} />} />
                <Route path="/constraints/national/permitting" element={<PermittingOutlook user={user} isSubscribed={isSubscribed} />} />
                <Route path="/constraints/national/supply-chain" element={<SupplyChainOutlook user={user} isSubscribed={isSubscribed} />} />
                <Route path="/constraints/national/labor" element={<LaborOutlook user={user} isSubscribed={isSubscribed} />} />
                <Route path="/constraint-atlas" element={<ConstraintMap isAdmin={effectiveIsAdmin} />} />
                <Route path="/ground-truth" element={<GroundTruth />} />
                <Route path="/ground-truth/:slug" element={<GroundTruthChildPage />} />
                <Route path="/constraint-atlas/interactive" element={<InteractiveConstraintMap />} />
                <Route path="/constraint-map" element={<Navigate to="/constraint-atlas" replace />} />
                <Route path="/constraint-map/interactive" element={<Navigate to="/constraint-atlas/interactive" replace />} />
                <Route path="/failures" element={<FailureCaseStudies />} />
                <Route path="/failures/midwest-ai-campus" element={<MidwestAICampusPage />} />
                <Route path="/markets/:slug" element={<MarketDossier />} />
                <Route path="/markets/northern-va" element={<MarketConstraintOutlook market="northern-va" />} />
                <Route path="/markets/phoenix" element={<MarketConstraintOutlook market="phoenix" />} />
                <Route path="/markets/texas" element={<MarketConstraintOutlook market="texas" />} />
                <Route path="/constraint-atlas/northern-virginia/:categorySlug" element={<Navigate to="/markets/northern-va" replace />} />
                <Route path="/constraint-atlas/phoenix/:categorySlug" element={<Navigate to="/markets/phoenix" replace />} />
                <Route path="/constraint-atlas/texas/:categorySlug" element={<Navigate to="/markets/texas" replace />} />
                <Route path="/constraint-map/northern-virginia/:categorySlug" element={<Navigate to="/markets/northern-va" replace />} />
                <Route path="/constraint-map/phoenix/:categorySlug" element={<Navigate to="/markets/phoenix" replace />} />
                <Route path="/constraint-map/texas/:categorySlug" element={<Navigate to="/markets/texas" replace />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/subscribe" element={<SubscribePage />} />
                <Route path="/get-access" element={<GetAccess />} />
                <Route path="/enterprise-request" element={<EnterpriseRequest />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/intelligence" element={<IntelligenceArchive />} />
                <Route path="/sitemap" element={<Sitemap user={user} isAdmin={effectiveIsAdmin} isSubscribed={isSubscribed} />} />
                <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Home />} />
                <Route path="/admin/navigator" element={isAdmin ? <Navigator /> : <Home />} />
                <Route path="/admin/map-projects" element={isAdmin ? <AdminMapProjects /> : <Home />} />
                <Route path="/admin/errors" element={isAdmin ? <SiteErrors /> : <Home />} />

                {/* Dynamic Constraint Pages */}
                <Route path="/power" element={<ConstraintDetail constraintId="power" />} />
                <Route path="/power/grid-monitor" element={<ConstraintMonitorChild constraintId="power" />} />
                <Route path="/power/:marketSlug" element={<ConstraintDetail constraintId="power" />} />
                <Route path="/supply-chain" element={<ConstraintDetail constraintId="supply-chain" />} />
                <Route path="/supply-chain/infrastructure-monitor" element={<ConstraintMonitorChild constraintId="supply-chain" />} />
                <Route path="/supply-chain/:marketSlug" element={<ConstraintDetail constraintId="supply-chain" />} />
                <Route path="/water" element={<ConstraintDetail constraintId="water" />} />
                <Route path="/water/resource-monitor" element={<ConstraintMonitorChild constraintId="water" />} />
                <Route path="/water/:marketSlug" element={<ConstraintDetail constraintId="water" />} />
                <Route path="/cooling" element={<ConstraintDetail constraintId="cooling" />} />
                <Route path="/cooling/system-monitor" element={<ConstraintMonitorChild constraintId="cooling" />} />
                <Route path="/cooling/:marketSlug" element={<ConstraintDetail constraintId="cooling" />} />
                <Route path="/land" element={<ConstraintDetail constraintId="land" />} />
                <Route path="/land/:marketSlug" element={<ConstraintDetail constraintId="land" />} />
                <Route path="/permitting" element={<ConstraintDetail constraintId="permitting" />} />
                <Route path="/permitting/process-monitor" element={<ConstraintMonitorChild constraintId="permitting" />} />
                <Route path="/permitting/:marketSlug" element={<ConstraintDetail constraintId="permitting" />} />
                <Route path="/labor" element={<ConstraintDetail constraintId="labor" />} />
                <Route path="/labor/workforce-monitor" element={<ConstraintMonitorChild constraintId="labor" />} />
                <Route path="/labor/:marketSlug" element={<ConstraintDetail constraintId="labor" />} />
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
                  <div className="flex flex-col font-condensed font-bold text-[13px] leading-[0.9] tracking-tight uppercase text-white">
                    <span>The</span>
                    <span>Physical</span>
                    <span>Layer</span>
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
                  <Link 
                    to="/constraint-atlas"
                    className="transition-colors cursor-pointer hover:text-white"
                  >
                    Constraint Atlas
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
