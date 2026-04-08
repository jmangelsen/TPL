export type RequiredTier = 'free' | 'essentials' | 'pro';

export const PAGE_METADATA = [
  { path: '/', name: 'Home', description: 'Landing page', isPaid: false, requiredTier: 'free' as RequiredTier },
  { path: '/about', name: 'About', description: 'About TPL', isPaid: false, requiredTier: 'free' as RequiredTier },
  { path: '/get-access', name: 'Get Access', description: 'Pricing and plans', isPaid: false, requiredTier: 'free' as RequiredTier },
  { path: '/enterprise-request', name: 'Enterprise Request', description: 'Enterprise consultation form', isPaid: false, requiredTier: 'free' as RequiredTier },
  { path: '/signup', name: 'Signup', description: 'User registration', isPaid: false, requiredTier: 'free' as RequiredTier },
  { path: '/login', name: 'Login', description: 'User login', isPaid: false, requiredTier: 'free' as RequiredTier },
  { path: '/article', name: 'Flagship Article', description: 'Main research article', isPaid: true, requiredTier: 'essentials' as RequiredTier },
  { path: '/reports', name: 'Operator Reports', description: 'List of reports', isPaid: false, requiredTier: 'free' as RequiredTier },
  { path: '/monitor', name: 'Constraint Monitor', description: 'Monitor overview', isPaid: true, requiredTier: 'essentials' as RequiredTier },
  { path: '/monitor/methodology', name: 'Monitor Methodology', description: 'Methodology details', isPaid: false, requiredTier: 'free' as RequiredTier },
  { path: '/monitor/report', name: 'Monitor Report', description: 'Full quarterly report', isPaid: true, requiredTier: 'pro' as RequiredTier },
  { path: '/intelligence', name: 'Intelligence Archive', description: 'Archive of past reports', isPaid: true, requiredTier: 'pro' as RequiredTier },
];
