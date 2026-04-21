import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SubscribeForm } from '../components/SubscribeForm';

export const SubscribePage = () => {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const region = searchParams.get('region') || undefined;

  return (
    <div className="ground-truth-page min-h-screen p-12 md:p-24">
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--gt-font-display)' }}>Get Notified</h1>
        <p className="text-[var(--gt-text-muted)]">
          Stay informed about proposed data centers, community water impact, grid pressure, and early warning signals in your area.
        </p>
        <SubscribeForm source={source} tag={tag} region={region} onSuccess={() => {
            // Optional: add success message or redirect
        }} />
      </div>
    </div>
  );
};
