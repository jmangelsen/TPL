
export function MidwestAICampusPage() {
  return (
    <main className="min-h-screen bg-[#1a2633] text-slate-200">
      {/* Top nav can reuse the main site header */}

      {/* Back link */}
      <section className="border-b border-white/5 bg-[#0f1a24] py-6">
        <div className="mx-auto max-w-4xl px-4">
          <a
            href="/constraint-atlas"
            className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 hover:text-white"
          >
            ← Back to constraint atlas
          </a>

          <h1 className="mt-3 text-[26px] font-semibold text-white">
            Midwest AI Campuses — Blocked Build
          </h1>
          <p className="mt-2 text-[13px] text-slate-400">
            Overview of multi‑billion AI data center campuses in the Midwest that stalled under power and permitting constraints, synthesized into a single failure scenario.
          </p>
        </div>
      </section>

      {/* Midwest AI Campus case – primary focus for now */}
      <section className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <article id="midwest-ai-campus-blocked" className="rounded-xl border border-white/5 bg-[#0f1a24] p-5">
          <header className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-white">
                Midwest AI Campuses — Blocked Build
              </h2>
              <p className="text-[12px] text-slate-400">
                Midwest AI Corridor · Planned capex band: ~$5–10B · Status: Blocked
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-[#5f1f1f] bg-[#3a1414] px-2 py-0.5 text-[11px] font-semibold text-[#f5b0b0]">
              Failure mode
            </span>
          </header>

          {/* Summary narrative */}
          <p className="mt-3 text-[13px] text-slate-300">
            This stylized case represents a set of multi‑billion AI data center campuses in the U.S.
            Midwest that progressed through land acquisition, incentive agreements, and
            early site work, but stalled when power interconnection, water concerns, and
            local opposition converged. It anchors the default failure mode on the
            Constraint Atlas for the Midwest AI Corridor.
          </p>

          {/* Key constraints + what went wrong */}
          <div className="mt-4 grid gap-4 md:grid-cols-2 text-[12px] text-slate-400">
            <div>
              <h3 className="mb-1 text-[12px] font-semibold text-white">
                Key constraints
              </h3>
              <ul className="space-y-1">
                <li>Power infrastructure and long interconnection queues.</li>
                <li>Permitting & policy risk driven by local resistance.</li>
                <li>Water and environmental impact concerns.</li>
                <li>Supply chain lead times for critical electrical and mechanical gear.</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-1 text-[12px] font-semibold text-white">
                What went wrong
              </h3>
              <ul className="space-y-1">
                <li>Capital committed to buildings and equipment before power and permits were secured.</li>
                <li>Under‑investment in grid studies, political groundwork, and local engagement.</li>
                <li>Exposure to long‑lead equipment orders with uncertain project viability.</li>
              </ul>
            </div>
          </div>

          {/* Constraint vs capital table (placeholder numbers) */}
          <div className="mt-5 grid gap-4 md:grid-cols-2 text-[11px] text-slate-400">
            <div>
              <h3 className="mb-1 font-semibold text-white text-[12px]">
                Constraint profile (0–10)
              </h3>
              <ul className="space-y-1">
                <li>Power Infrastructure: 9.5</li>
                <li>Cooling & Thermal: 7.0</li>
                <li>Water & Effluent: 7.5</li>
                <li>Labor & Trades: 6.0</li>
                <li>Supply Chain & Equipment: 8.0</li>
                <li>Permitting & Policy: 9.0</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-white text-[12px]">
                Capital deployment scores (0–10)
              </h3>
              <ul className="space-y-1">
                <li>Power Infrastructure: 6.5</li>
                <li>Cooling & Thermal: 7.5</li>
                <li>Water & Effluent: 5.5</li>
                <li>Labor & Trades: 7.0</li>
                <li>Supply Chain & Equipment: 8.5</li>
                <li>Permitting & Policy: 4.5</li>
              </ul>
            </div>
          </div>

          {/* Real-world basis */}
          <section className="mt-8 border-t border-white/5 pt-5 text-[13px] text-slate-400 space-y-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Real‑world basis
            </h3>

            <p>
              The Midwest AI Campus is a stylized case, but it is grounded in real AI data center
              projects across the Midwest that have run into political and infrastructure limits.
              Two examples are particularly informative:
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="text-[12px] font-semibold text-white">
                  Microsoft — Caledonia, Wisconsin (Project Nova)
                </h4>
                <p className="text-[13px] text-slate-400">
                  In 2025, Microsoft proposed a 244‑acre AI data center in Caledonia, Wisconsin, but
                  withdrew the plan after intense community pushback over noise, wetlands, wildlife,
                  electricity usage, and limited local benefits. Local reporting and national coverage
                  detail how residents, petitions, and hearings turned against the project, leading
                  Microsoft to cancel the site while pursuing other locations in the region.
                </p>
                <ul className="mt-1 list-disc pl-5 text-[12px] text-slate-500 space-y-1">
                  <li>
                    National coverage of rural Wisconsin blocking an AI data center rezoning request.
                  </li>
                  <li>
                    Local reports on Microsoft pulling the plug on the 244‑acre Caledonia plan after
                    hundreds of residents opposed rezoning and more than 2,000 people signed a petition.
                  </li>
                </ul>
                <p className="mt-1 text-[12px]">
                  Sources: See coverage from{' '}
                  <a href="https://www.cnbc.com/2025/11/25/microsoft-ai-data-center-rejection-vs-support.html" target="_blank" rel="noreferrer" className="underline">
                    CNBC
                  </a>{' '}
                  and local reporting on the Caledonia hearings for details.
                </p>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold text-white">
                  Oracle / OpenAI — Saline Township, Michigan
                </h4>
                <p className="text-[13px] text-slate-400">
                  In late 2025, Blue Owl Capital walked away from talks to finance a planned
                  $10&nbsp;billion, 1‑gigawatt data center in Saline Township, Michigan, intended to
                  support OpenAI workloads. Reporting highlighted investor concerns over Oracle’s
                  rising debt load, tighter lending conditions, and the risk of construction delays,
                  as well as local political dynamics that could slow approvals. The financing exit
                  left the project’s future uncertain and demonstrated how capital can evaporate when
                  constraints are misjudged.
                </p>
                <ul className="mt-1 list-disc pl-5 text-[12px] text-slate-500 space-y-1">
                  <li>
                    Coverage of Blue Owl Capital withdrawing from a $10&nbsp;billion Michigan data
                    center financing deal.
                  </li>
                  <li>
                    Analysis of investor concerns about debt, lending conditions, and political risk
                    around large AI infrastructure projects.
                  </li>
                </ul>
                <p className="mt-1 text-[12px]">
                  Sources: See coverage from{' '}
                  <a href="https://www.cnbc.com/2025/12/17/oracle-stock-blue-owl-michigan-data-center.html" target="_blank" rel="noreferrer" className="underline">
                    CNBC
                  </a>{' '}
                  on Blue Owl’s decision and Oracle’s response.
                </p>
              </div>
            </div>

            <p className="mt-3 text-[12px] text-slate-500">
              The Midwest AI Campus combines these patterns: aggressive capital plans, long‑lead
              equipment orders, and political or grid constraints that ultimately stall or derail
              construction.
            </p>
          </section>

          {/* Link back to Map default */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">
              This case powers the default failure scenario on the Constraint Atlas for the
              Midwest AI Corridor.
            </p>
            <a
              href="/constraint-atlas"
              className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#2563eb] transition-colors"
            >
              View this scenario on the atlas
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
