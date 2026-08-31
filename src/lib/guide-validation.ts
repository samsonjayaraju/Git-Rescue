import type { GitGuide } from '@/types/guides';
import type { SafetyLevel } from '@/types/rescue';

const safetyLevels = new Set<SafetyLevel>(['safe', 'caution', 'dangerous']);
const routePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateGuides(guides: readonly GitGuide[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const knownIds = new Set(guides.map((guide) => guide.id));

  for (const guide of guides) {
    if (ids.has(guide.id)) errors.push(`Duplicate guide ID: ${guide.id}`);
    ids.add(guide.id);
    if (!routePattern.test(guide.id)) errors.push(`Invalid route ID: ${guide.id}`);
    if (!guide.title.trim()) errors.push(`${guide.id}: missing title`);
    if (!guide.description.trim()) errors.push(`${guide.id}: missing description`);
    if (guide.aliases.length === 0) errors.push(`${guide.id}: missing aliases`);
    if (!safetyLevels.has(guide.safety)) errors.push(`${guide.id}: invalid safety`);
    if (guide.commands.length === 0) errors.push(`${guide.id}: missing commands`);
    if (new Set(guide.aliases.map((alias) => alias.toLowerCase())).size !== guide.aliases.length) {
      errors.push(`${guide.id}: duplicate aliases`);
    }
    for (const command of guide.commands) {
      if (!command.command.trim()) errors.push(`${guide.id}: empty command`);
      if (!safetyLevels.has(command.safety)) errors.push(`${guide.id}: invalid command safety`);
      if (command.safety === 'dangerous' && !command.warning) errors.push(`${guide.id}: dangerous command missing warning`);
    }
    for (const relatedId of guide.related) {
      if (!knownIds.has(relatedId)) errors.push(`${guide.id}: unknown related guide ${relatedId}`);
      if (relatedId === guide.id) errors.push(`${guide.id}: relates to itself`);
    }
  }
  return errors;
}
