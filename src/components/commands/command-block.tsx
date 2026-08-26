'use client';

import { Check, Copy, ShieldAlert, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { RescueCommand } from '@/types/rescue';
import { SafetyBadge } from './safety-badge';

export function CommandBlock({ item, order }: { item: RescueCommand; order: number }) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    if (item.safety === 'dangerous' && !confirmed) return;
    await navigator.clipboard.writeText(item.command);
    setCopied(true);
  }

  return (
    <article className={`command-card command-${item.safety}`}>
      <div className="command-heading">
        <div><span className="command-order">{String(order).padStart(2, '0')}</span><div><h3>{item.label}</h3><p>{item.description}</p></div></div>
        <SafetyBadge level={item.safety} />
      </div>
      <div className="code-shell">
        <div className="code-label"><span><Terminal size={13} aria-hidden="true" /> Terminal</span></div>
        <div className="code-row"><code><span>$</span> {item.command}</code><button type="button" onClick={copy} disabled={item.safety === 'dangerous' && !confirmed} aria-label={`Copy ${item.command}`}><span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>{copied ? <Check size={14} /> : <Copy size={14} />}</button></div>
      </div>
      {item.safety === 'dangerous' && (
        <div className="danger-confirmation">
          <ShieldAlert size={18} aria-hidden="true" />
          <div><strong>Read this before copying</strong><p>{item.warning ?? 'This command can permanently remove work or rewrite history.'}</p>
            <label><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> I understand what this command may remove.</label>
          </div>
        </div>
      )}
    </article>
  );
}
