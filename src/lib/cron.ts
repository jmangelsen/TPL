import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { sendEmail } from './mailer';

export const runEarlyAccessSummaryReport = async (isAdmin: boolean) => {
  if (!isAdmin) return;

  const lastRun = localStorage.getItem('tpl_last_summary_report');
  const now = Date.now();
  const fiveHours = 5 * 60 * 60 * 1000;

  if (lastRun && now - parseInt(lastRun) < fiveHours) {
    return;
  }

  const fiveHoursAgo = new Date(now - fiveHours).toISOString();
  
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('isEarlyAccess', '==', true), where('createdAt', '>=', fiveHoursAgo));
  
  const querySnapshot = await getDocs(q);
  const newUsers = querySnapshot.docs.map(doc => doc.data());
  
  if (newUsers.length === 0) {
    // Optionally send "0 new signups" email
    return;
  }

  const breakout: Record<string, number> = {};
  newUsers.forEach(user => {
    breakout[user.plan] = (breakout[user.plan] || 0) + 1;
  });

  let emailBody = `Total new signups in last 5 hours: ${newUsers.length}\n\nBreakout by plan:\n`;
  Object.entries(breakout).forEach(([plan, count]) => {
    emailBody += `${plan}: ${count}\n`;
  });
  emailBody += `\nList:\n`;
  newUsers.forEach(user => {
    emailBody += `${user.email} - ${user.createdAt}\n`;
  });

  await sendEmail({
    to: 'Mangelsenj@gmail.com',
    subject: 'TPL early-access signups — last 5 hours',
    text: emailBody,
  });

  localStorage.setItem('tpl_last_summary_report', now.toString());
};
