// Simple mailer utility
export const sendEmail = async ({ to, subject, text }: { to: string; subject: string; text: string }) => {
  console.log(`Sending email to ${to}:`, { subject, text });
  // In a real app, this would call an API like SendGrid, Resend, or SES.
  // For now, we log it.
};
