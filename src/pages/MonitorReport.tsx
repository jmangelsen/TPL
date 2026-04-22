import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { signInWithGoogle } from '../firebase';

export const MonitorReport = ({ user, isSubscribed }: { user: any, isSubscribed: boolean }) => {
  const isGated = !user;

  return (
    <div className="min-h-screen bg-[#1a2633] text-slate-200 font-sans selection:bg-[#3b82f6] selection:text-white pb-24 relative">
      {/* Background Seal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none w-[800px] h-[800px] z-0">
        <img 
          src="/tpl-seal.png" 
          alt="" 
          className="w-full h-full object-contain invert"
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#1a2633]/95 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-[800px] mx-auto px-6 h-20 flex items-center">
          <Link to="/monitor" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to Monitor</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-20 relative z-10">
        <div className="mb-16">
          <span className="inline-block px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border border-[#3b82f6]/20">
            Quarterly Report
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight uppercase">
            Q2 2026 Constraint Monitor Report
          </h1>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Published: April 2026</span>
            <span>•</span>
            <span>12 Systems Tracked</span>
          </div>
        </div>

        <div className="prose prose-invert prose-slate max-w-none">
          <p className="text-xl text-slate-300 font-serif italic leading-relaxed mb-12">
            The Constraint Monitor is TPL’s quarterly index of physical constraints shaping AI data center build‑out in the United States. It tracks a fixed set of bottlenecks across major markets and expresses them as normalized states (Constrained, Elevated, Under Pressure, Tightening, Capacity Limited). The purpose is narrow: to show where physical systems—power, equipment, water, land, permitting, and labor—are now gating projects that are otherwise commercially viable.
          </p>
          
          <div className="relative">
            <div className="space-y-12">
              <section className="space-y-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">1. Power & Grid</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The first cluster is power and grid. Interconnection Queue and Grid Queue capture how long it takes large loads to secure and energize capacity, while Utility Capacity, Substation Capacity, and the Power Availability Window describe whether the grid can absorb new AI data center demand at all. As of Q2 2026, U.S. interconnection queues exceed roughly 2,600 GW of generation and storage, with median waits around five years and some large‑load projects facing proposed timelines of up to 10–12 years before energization. Historical data show that only a minority of queued projects reach commercial operation, and recent analysis concludes that AI‑driven load growth is emerging as a primary driver of new congestion. In parallel, grid operators and vendors are warning that a stressed U.S. grid is already pushing a portion of new data center capacity toward on‑site generation and hybrid grid/off‑grid strategies. Together, these conditions justify Q2 2026 states of Elevated for grid and interconnection metrics and Constrained or Tightening for power‑availability windows in the most active AI corridors.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">2. Supply Chain</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The second cluster is supply chain. Transformer Lead Time, Switchgear Backlog, and the aggregate Supply Backlog indicator track availability of critical electrical hardware. Industry reporting in early 2026 shows large power transformer lead times that moved from 7–14 months before the pandemic to a new normal of 24 months or more, with some North American deliveries for specialized units extending into the 36–60‑month range. Manufacturers describe multi‑year order books and persistent constraints in key materials such as electrical steel. In that environment, a project that has secured a power agreement and interconnection approval can still face two to three extra years of delay waiting for transformers and switchgear. For Q2 2026, the Monitor therefore keeps Transformer Lead Time and Supply Backlog in a Constrained state and Switchgear Backlog in a Tightening state at roughly the 118‑week and 72‑week levels displayed in the index.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">3. Water & Cooling</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The third cluster is water and cooling. Water Risk measures pressure on municipal and regional water systems that support data center cooling, while Cooling Pressure tracks the supply and deployment of higher‑efficiency, lower‑water‑use cooling architectures. Recent work suggests that U.S. data centers already consume tens of billions of gallons of water annually for cooling, with plausible AI‑driven growth trajectories taking that figure into the low hundreds of billions of gallons without material changes in design. A March 2026 analysis from UC Riverside estimates that required water‑infrastructure upgrades could cost on the order of tens of billions of dollars and emphasizes that local water availability and rate structures are now material factors in siting decisions, particularly in regions such as Northern Virginia and the Desert Southwest. Against that backdrop, the Monitor holds Water Risk at an Under Pressure state with an index reading around 7.4 in Q2 2026, and Cooling Pressure in an Under Pressure state where reliance on evaporative systems intersects with tightening municipal policy and supply‑chain friction around advanced cooling equipment.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">4. Land, Permitting & Local Politics</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The fourth cluster covers land, permitting, and local politics. Site Control Friction and Land Entitlement Friction capture the difficulty of securing power‑ready land and moving it through entitlements, while Permit Cycle tracks changes in approval timelines, formal moratoriums, and regulatory headwinds. By early 2026, multiple counties and municipalities have introduced or extended data center moratoriums, including high‑profile cases in Maryland and Northern Virginia, with stated motivations that explicitly combine concerns about power availability, local environmental impacts, and land use. Tracking of state and local proposals shows more than a dozen moratorium or restriction bills introduced across roughly eleven states, and notes that even where state‑level bills stall, local zoning actions and temporary bans are slowing or redirecting projects. Those conditions support Q2 2026 readings that keep Permit Cycle and Land Entitlement Friction in Constrained or Elevated states in the main U.S. AI markets and push Site Control Friction into a Constrained state where power‑ready sites are scarce or contested.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">5. Labor</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The fifth cluster is labor. Labor Tightness focuses on the availability of specialized construction and electrical trades required to build and energize AI data centers. Reporting in Q1 and Q2 2026 describes a pronounced shortage of electricians and high‑voltage specialists, noting that electrical work accounts for roughly 45–70% of data center construction cost and citing estimates that the U.S. construction sector needs on the order of 350,000 additional workers in 2026 to meet baseline demand. Large technology companies publicly identify electrical labor shortages as a limiting factor in data center expansion, and recruiting firms focused on the sector report project delays and wage inflation in key hubs tied directly to high‑voltage labor scarcity. For Q2 2026, the Monitor therefore holds Labor Tightness at a Capacity Limited state around the –12% level shown in the index, indicating a meaningful gap between required and available specialized labor in core markets.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">Conclusion</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Across all of these domains, the Monitor treats signals as an interacting stack rather than as separate checklists. Grid Queue, Supply Backlog, Water Risk, Permit Cycle, Interconnection Queue, Transformer Lead Time, Switchgear Backlog, Utility Capacity, Cooling Pressure, Labor Tightness, Site Control Friction, Substation Capacity, Land Entitlement Friction, and the Power Availability Window are tracked as components of a coupled system that determines whether new AI infrastructure can be built, financed, and energized on schedule. Q2 2026 evidence across interconnection backlogs, equipment lead times, water‑stress costs, local moratoriums, and specialized labor shortages all point to the same conclusion: physical constraints have moved from secondary considerations to primary determinants of where and how AI data center capacity can actually materialize over the next several build cycles.
                </p>
              </section>

              <hr className="border-white/5 my-12" />

              <section className="space-y-8">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">Sources</h2>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-300">Power & Grid:</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400 leading-relaxed">
                      <li>EnkiAI Research. "Grid Interconnection Delays 2026: A Threat to US Energy." January 27, 2026. <a href="https://enkiai.com/ai-market-intelligence/grid-interconnection-delays-2026-a-threat-to-us-energy/" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://enkiai.com/ai-market-intelligence/grid-interconnection-delays-2026-a-threat-to-us-energy/</a></li>
                      <li>PV Magazine USA. "Interconnection queues cut across new renewable and fossil source timelines." March 11, 2026. <a href="https://pv-magazine-usa.com/2026/03/12/interconnection-queues-cut-across-new-renewable-and-fossil-source-timelines/" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://pv-magazine-usa.com/2026/03/12/interconnection-queues-cut-across-new-renewable-and-fossil-source-timelines/</a></li>
                      <li>Enverus. "Enverus releases 2026 Interconnection Queue Outlook." February 23, 2026. <a href="https://www.enverus.com/newsroom/enverus-releases2026-interconnection-queue-outlook/" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://www.enverus.com/newsroom/enverus-releases2026-interconnection-queue-outlook/</a></li>
                      <li>U.S. Department of Energy. "Transmission Interconnection Roadmap." April 2024. <a href="https://www.energy.gov/sites/default/files/2024-04/i2X%20Transmission%20Interconnection%20Roadmap.pdf" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://www.energy.gov/sites/default/files/2024-04/i2X%20Transmission%20Interconnection%20Roadmap.pdf</a></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-300">Supply Chain:</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400 leading-relaxed">
                      <li>ELSCO Transformers. "Average Lead Times of Padmount Transformers in 2026." January 12, 2026. <a href="https://elscotransformers.com/blog/average-lead-times-of-padmount-transformers/" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://elscotransformers.com/blog/average-lead-times-of-padmount-transformers/</a></li>
                      <li>CWIEME Events. "24+ Month Lead Times: New Normal for Transformer Suppliers." March 16, 2026. <a href="https://berlin.cwiemeevents.com/articles/new-normal-component-suppliers" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://berlin.cwiemeevents.com/articles/new-normal-component-suppliers</a></li>
                      <li>Smartland Energy. "Transformer Supply in 2026: Grid Development Constraints." January 6, 2026. <a href="https://smartlandenergy.com/transformer-supply-in-2026-a-constraint-thats-reshaping-grid-development/" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://smartlandenergy.com/transformer-supply-in-2026-a-constraint-thats-reshaping-grid-development/</a></li>
                      <li>LinkedIn Post. "Power Transformer Lead Times Surge to 3-4 Years." February 10, 2026. <a href="https://www.linkedin.com/posts/aidan-potts-337a9636_key-takeaway-from-dtech-26-the-power-transformer-activity-742729871523059302..." target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://www.linkedin.com/posts/aidan-potts-337a9636_key-takeaway-from-dtech-26-the-power-transformer-activity-742729871523059302...</a></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-300">Water & Cooling:</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400 leading-relaxed">
                      <li>EESI. "Data Centers and Water Consumption." June 24, 2025. <a href="https://www.eesi.org/articles/view/data-centers-and-water-consumption" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://www.eesi.org/articles/view/data-centers-and-water-consumption</a></li>
                      <li>The Conversation. "Data centers consume massive amounts of water - Companies rarely tell the public exactly how much." March 21, 2025. <a href="https://theconversation.com/data-centers-consume-massive-amounts-of-water-companies-rarely-tell-the-public-exactly-how-much-2629..." target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://theconversation.com/data-centers-consume-massive-amounts-of-water-companies-rarely-tell-the-public-exactly-how-much-2629...</a></li>
                      <li>WHYY. "How much water do data centers use?" February 9, 2026. <a href="https://whyy.org/articles/data-centers-water-usage/" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://whyy.org/articles/data-centers-water-usage/</a></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-300">Land, Permitting & Local Politics:</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400 leading-relaxed">
                      <li>Maryland General Assembly. "House Bill 120: Moratorium on Construction of New Data Centers - Co-Location and Generation Contingency." Fiscal and Policy Note. February 1, 2026. <a href="https://mgaleg.maryland.gov/2026RS/fnotes/bil_0000/hb0120.pdf" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://mgaleg.maryland.gov/2026RS/fnotes/bil_0000/hb0120.pdf</a></li>
                      <li>Loudoun County, Virginia. "Eliminates By-Right Data Center Development." HK Law Insights Publication. April 3, 2025. <a href="https://www.hklaw.com/en/insights/publications/2025/04/loudoun-county-virginia-eliminates-by-right-data-center-development" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://www.hklaw.com/en/insights/publications/2025/04/loudoun-county-virginia-eliminates-by-right-data-center-development</a></li>
                      <li>Loudoun County Board of Supervisors. "Board Approves Amendments to Loudoun's Comprehensive Plan." Civic Alert. January 22, 2026. <a href="https://www.loudoun.gov/CivicAlerts.asp?AID=10374" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://www.loudoun.gov/CivicAlerts.asp?AID=10374</a></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-300">Labor:</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400 leading-relaxed">
                      <li>Associated Builders and Contractors. "Construction's new worker demand drops to 350,000 in 2026: report." January 27, 2026. <a href="https://www.constructiondive.com/news/labor-demand-ghrinks-abc-construction-staff/810681/" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://www.constructiondive.com/news/labor-demand-ghrinks-abc-construction-staff/810681/</a></li>
                      <li>Construct Elements. "What Does It Cost to Build a Modern Data Center in 2026?" February 19, 2026. <a href="https://constructelements.com/post/cost-to-build-modern-data-center-2026" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://constructelements.com/post/cost-to-build-modern-data-center-2026</a></li>
                      <li>TrueLook. "Data Center Construction Costs Explained." December 16, 2025. <a href="https://www.truelook.com/blog/data-center-construction-costs" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://www.truelook.com/blog/data-center-construction-costs</a></li>
                      <li>Leanrs. "Inside the $11 Billion Data Center: The Real Cost of Powering AI." March 4, 2026. <a href="https://www.leanrs.com/insights/data-center-equipment-growth" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-all">https://www.leanrs.com/insights/data-center-equipment-growth</a></li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};
