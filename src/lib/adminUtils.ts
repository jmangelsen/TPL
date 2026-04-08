export const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  const lower = email.toLowerCase();
  return lower === 'mangelsenj@gmail.com' || 
         lower === 'research@aiphysicallayer.com' ||
         lower === 'isabella.britson20@gmail.com';
};
