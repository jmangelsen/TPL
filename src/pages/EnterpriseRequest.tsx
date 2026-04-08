import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export const EnterpriseRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    region: '',
    orgType: '',
    orgTypeOther: '',
    seats: '',
    interests: [] as string[],
    interestOther: '',
    useCase: '',
    accessTypes: [] as string[],
    tools: '',
    timeline: '',
    consultationWindow: '',
    urgency: '',
    budget: '',
    decisionProcess: '',
    notes: '',
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'interests' | 'accessTypes') => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentList = prev[field];
      if (checked) {
        return { ...prev, [field]: [...currentList, value] };
      } else {
        return { ...prev, [field]: currentList.filter((item) => item !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, this would be a POST to /api/enterprise-request
      // For now, we simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Enterprise Request Submitted:', formData);
      setIsSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('An error occurred while submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] bg-tpl-bg flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white p-12 border border-tpl-ink/10 shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Request Received</h2>
          <p className="text-tpl-slate text-lg leading-relaxed mb-8">
            Thank you. We’ve received your request and will follow up to schedule your first enterprise consultation within 2 business days.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-tpl-ink text-tpl-bg text-xs font-bold uppercase tracking-widest hover:bg-tpl-slate transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tpl-bg py-16 md:py-24 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Enterprise Access & Data Partnerships</h1>
          <p className="text-tpl-slate text-lg leading-relaxed max-w-2xl mx-auto">
            For governments, infrastructure investors, hyperscalers, and operators who need organization‑wide access or custom data integrations.
          </p>
          <p className="text-tpl-slate text-lg leading-relaxed max-w-2xl mx-auto mt-2">
            Share a few details and we’ll follow up to schedule your first consultation.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 border border-tpl-ink/10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* 1. Contact Information */}
            <section>
              <h3 className="text-lg font-bold mb-6 border-b border-tpl-ink/10 pb-2">1. Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Full Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Work Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Company / Organization *</label>
                  <input type="text" name="company" required value={formData.company} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Job Title / Role *</label>
                  <input type="text" name="role" required value={formData.role} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Country / Region</label>
                  <input type="text" name="region" value={formData.region} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none" />
                </div>
              </div>
            </section>

            {/* 2. Organization Type */}
            <section>
              <h3 className="text-lg font-bold mb-6 border-b border-tpl-ink/10 pb-2">2. Organization Type *</h3>
              <div className="space-y-3">
                {['Government / Public sector', 'Private investor / asset manager', 'Data center operator / developer', 'Hyperscaler / large tech', 'Utility / grid operator', 'Vendor / OEM', 'Other'].map((type) => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input type="radio" name="orgType" value={type} required onChange={handleInputChange} className="mr-3" />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
                {formData.orgType === 'Other' && (
                  <input type="text" name="orgTypeOther" placeholder="Please specify" value={formData.orgTypeOther} onChange={handleInputChange} className="w-full mt-2 px-4 py-2 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none text-sm" />
                )}
              </div>
            </section>

            {/* 3. Scope & Use Case */}
            <section>
              <h3 className="text-lg font-bold mb-6 border-b border-tpl-ink/10 pb-2">3. Scope & Use Case *</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Approximate number of users/seats *</label>
                  <select name="seats" required value={formData.seats} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none">
                    <option value="">Select...</option>
                    <option value="1-5">1–5</option>
                    <option value="6-20">6–20</option>
                    <option value="21-100">21–100</option>
                    <option value="100+">100+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-3">Primary interests (select all that apply)</label>
                  <div className="space-y-2">
                    {['Interconnection & grid constraints', 'Equipment / supply chain (transformers, switchgear, etc.)', 'Water & cooling risk', 'Land, permitting & local politics', 'Labor & construction capacity', 'Custom / other'].map((interest) => (
                      <label key={interest} className="flex items-center cursor-pointer">
                        <input type="checkbox" value={interest} checked={formData.interests.includes(interest)} onChange={(e) => handleCheckboxChange(e, 'interests')} className="mr-3" />
                        <span className="text-sm">{interest}</span>
                      </label>
                    ))}
                    {formData.interests.includes('Custom / other') && (
                      <input type="text" name="interestOther" placeholder="Please specify" value={formData.interestOther} onChange={handleInputChange} className="w-full mt-2 px-4 py-2 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none text-sm" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">How do you intend to use TPL data and reporting? *</label>
                  <textarea name="useCase" required rows={4} value={formData.useCase} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none resize-y" />
                </div>
              </div>
            </section>

            {/* 4. Data & Integration Needs */}
            <section>
              <h3 className="text-lg font-bold mb-6 border-b border-tpl-ink/10 pb-2">4. Data & Integration Needs</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-3">Preferred access type</label>
                  <div className="space-y-2">
                    {['Web portal / dashboards', 'API access for internal tools', 'CSV / bulk data exports', 'Custom briefings / workshops'].map((type) => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input type="checkbox" value={type} checked={formData.accessTypes.includes(type)} onChange={(e) => handleCheckboxChange(e, 'accessTypes')} className="mr-3" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Existing tools you’d like to integrate with (e.g., GIS, internal dashboards, CRM)</label>
                  <input type="text" name="tools" value={formData.tools} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none" />
                </div>
              </div>
            </section>

            {/* 5. Timeline & Urgency */}
            <section>
              <h3 className="text-lg font-bold mb-6 border-b border-tpl-ink/10 pb-2">5. Timeline & Urgency *</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Desired start timeline *</label>
                  <select name="timeline" required value={formData.timeline} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none">
                    <option value="">Select...</option>
                    <option value="ASAP (this quarter)">ASAP (this quarter)</option>
                    <option value="Within 3–6 months">Within 3–6 months</option>
                    <option value="6–12 months">6–12 months</option>
                    <option value="Exploratory / no fixed date">Exploratory / no fixed date</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Requested consultation window</label>
                  <input type="text" name="consultationWindow" placeholder="e.g. Prefer mornings US Mountain Time" value={formData.consultationWindow} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-3">Urgency level *</label>
                  <div className="flex gap-6">
                    {['Low', 'Medium', 'High – project already in motion'].map((level) => (
                      <label key={level} className="flex items-center cursor-pointer">
                        <input type="radio" name="urgency" value={level} required onChange={handleInputChange} className="mr-2" />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Budget & Decision Process */}
            <section>
              <h3 className="text-lg font-bold mb-6 border-b border-tpl-ink/10 pb-2">6. Budget & Decision Process</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Approximate annual budget range</label>
                  <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none">
                    <option value="">Select...</option>
                    <option value="Undisclosed">Undisclosed</option>
                    <option value="< $25k">&lt; $25k</option>
                    <option value="$25k–$100k">$25k–$100k</option>
                    <option value="$100k+">$100k+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Decision-making structure (Who is involved?)</label>
                  <input type="text" name="decisionProcess" value={formData.decisionProcess} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none" />
                </div>
              </div>
            </section>

            {/* 7. Additional Context */}
            <section>
              <h3 className="text-lg font-bold mb-6 border-b border-tpl-ink/10 pb-2">7. Additional Context</h3>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-tpl-ink mb-2">Anything else we should know before the first call?</label>
                <textarea name="notes" rows={3} value={formData.notes} onChange={handleInputChange} className="w-full px-4 py-3 bg-tpl-bg border border-tpl-ink/20 focus:border-tpl-ink focus:outline-none resize-y" />
              </div>
            </section>

            {/* 8. Consent */}
            <section className="pt-4">
              <label className="flex items-start cursor-pointer">
                <input type="checkbox" name="consent" required checked={formData.consent} onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))} className="mt-1 mr-3" />
                <span className="text-sm text-tpl-slate">I agree to be contacted by The Physical Layer regarding enterprise access and related services. *</span>
              </label>
            </section>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !formData.consent}
              className="w-full py-5 bg-tpl-ink text-tpl-bg text-sm font-bold uppercase tracking-widest hover:bg-tpl-slate transition-colors disabled:opacity-50 flex items-center justify-center mt-8"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
