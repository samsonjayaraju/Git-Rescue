import { AlertTriangle, Check, ShieldAlert } from 'lucide-react';
import type { SafetyLevel } from '@/types/rescue';

export function SafetyBadge({ level }: { level: SafetyLevel }) {
  const Icon = level === 'safe' ? Check : level === 'caution' ? AlertTriangle : ShieldAlert;
  return <span className={`safety-badge ${level}`}><Icon size={12} aria-hidden="true" />{level}</span>;
}
