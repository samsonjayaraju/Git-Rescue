import catalog from '@/data/git-command-catalog.json';
import { getGuideHref, knowledgeGuides } from '@/data/guides';
import type { RescueCommand } from '@/types/rescue';

export const commandCategories = [
  { id: 'setup', label: 'Setup & configuration' },
  { id: 'files', label: 'Files & staging' },
  { id: 'history', label: 'History & inspection' },
  { id: 'branches', label: 'Branches & merging' },
  { id: 'remotes', label: 'Remotes & sharing' },
  { id: 'recovery', label: 'Undo & recovery' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'email', label: 'Patches & email' },
  { id: 'integrations', label: 'Tools & integrations' },
  { id: 'internals', label: 'Internals & helpers' },
] as const;

export type CommandEntry = typeof catalog[number] & {
  examples: RescueCommand[];
  guides: { title: string; href: string }[];
  keywords: string;
};

// Retain each example's context and warning rather than assigning a risk to
// an entire command family (reset --soft and reset --hard differ greatly).
export const commandCatalog: CommandEntry[] = catalog.map((entry) => {
  const guides = knowledgeGuides.filter((guide) => guide.domain === 'git' && guide.commands.some(
    (example) => example.command.split(/\s+/).slice(0, 2).join(' ') === `git ${entry.name}`,
  ));
  const examples = new Map<string, RescueCommand>();
  for (const guide of guides) {
    for (const example of guide.commands) {
      if (!example.command.startsWith(`git ${entry.name} `) && example.command !== `git ${entry.name}`) continue;
      const previous = examples.get(example.command);
      const weight = { safe: 0, caution: 1, dangerous: 2 };
      if (!previous || weight[example.safety] > weight[previous.safety]) {
        examples.set(example.command, { ...example, label: guide.title, description: guide.description });
      }
    }
  }
  return {
    ...entry,
    examples: [...examples.values()],
    guides: guides.map((guide) => ({ title: guide.title, href: getGuideHref(guide) })),
    keywords: guides.flatMap((guide) => [guide.title, ...guide.aliases, ...guide.keywords]).join(' '),
  };
});

export function filterCommands(query: string, category = 'all', scope = 'all') {
  const tokens = query.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  return commandCatalog.filter((entry) => {
    if (category !== 'all' && entry.category !== category) return false;
    if (scope === 'everyday' && entry.advanced) return false;
    if (scope === 'advanced' && !entry.advanced) return false;
    const haystack = `git ${entry.name} ${entry.description} ${entry.syntax} ${entry.keywords}`.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
    const words = new Set(haystack.split(/\s+/));
    return tokens.every((token) => words.has(token));
  });
}
