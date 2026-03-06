'use client';

import { useState } from 'react';

export function SyncButton() {
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    setLoading(true);
    try {
      const res = await fetch('/api/sync-billing', { method: 'POST' });
      if (res.ok) {
        window.location.reload();
      } else {
        const json = await res.json().catch(() => ({}));
        alert(json.error ?? 'Sync failed');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={loading}
      className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-50 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? 'Syncing…' : 'Sync current month'}
    </button>
  );
}
