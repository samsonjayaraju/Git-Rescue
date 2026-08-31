import type { GitGuide, GuideCategory, GuideDomain, GuideStep } from '@/types/guides';
import type { RescueCommand, SafetyLevel } from '@/types/rescue';

export type GuideCommandSeed = string | {
  command: string;
  label?: string;
  description?: string;
  safety?: SafetyLevel;
  warning?: string;
};

export interface GuideSeed {
  id: string;
  title: string;
  description: string;
  aliases: string[];
  commands: GuideCommandSeed[];
  keywords?: string[];
  explanation?: string;
  whenToUse?: string;
  prerequisites?: string[];
  steps?: GuideStep[];
  example?: string;
  notes?: string[];
  warnings?: string[];
  related?: string[];
  safety?: SafetyLevel;
  popular?: boolean;
  subcategory?: string;
}

const safetyWeight: Record<SafetyLevel, number> = { safe: 0, caution: 1, dangerous: 2 };

function commandLabel(value: string): string {
  const simplified = value.replace(/^git\s+/, '').replace(/^gh\s+/, '').split(/\s+/).slice(0, 2).join(' ');
  return `Run ${simplified || 'the command'}`;
}

function createCommand(seed: GuideCommandSeed, index: number): RescueCommand {
  if (typeof seed === 'string') {
    return {
      id: `command-${index + 1}`,
      command: seed,
      label: commandLabel(seed),
      description: 'Run this command from the relevant repository unless noted otherwise.',
      safety: 'safe',
    };
  }
  return {
    id: `command-${index + 1}`,
    command: seed.command,
    label: seed.label ?? commandLabel(seed.command),
    description: seed.description ?? 'Run this command from the relevant repository unless noted otherwise.',
    safety: seed.safety ?? 'safe',
    warning: seed.warning,
  };
}

function inferSafety(commands: readonly RescueCommand[]): SafetyLevel {
  return commands.reduce<SafetyLevel>(
    (highest, item) => safetyWeight[item.safety] > safetyWeight[highest] ? item.safety : highest,
    'safe',
  );
}

export function defineGuides(
  domain: GuideDomain,
  category: GuideCategory,
  seeds: readonly GuideSeed[],
): GitGuide[] {
  return seeds.map((seed) => {
    const commands = seed.commands.map(createCommand);
    return {
      id: seed.id,
      title: seed.title,
      description: seed.description,
      domain,
      category,
      subcategory: seed.subcategory,
      aliases: seed.aliases,
      keywords: seed.keywords ?? [],
      commands,
      explanation: seed.explanation ?? seed.description,
      whenToUse: seed.whenToUse,
      prerequisites: seed.prerequisites,
      steps: seed.steps,
      example: seed.example,
      notes: seed.notes,
      warnings: seed.warnings,
      related: seed.related ?? [],
      safety: seed.safety ?? inferSafety(commands),
      popular: seed.popular,
    };
  });
}
