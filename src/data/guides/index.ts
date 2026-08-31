import { rescueScenarios, scenarioCategories } from '@/data/rescue-flows';
import type { GitGuide, GuideCategoryMeta, GuideSearchItem } from '@/types/guides';
import type { RescueResultStep, SafetyLevel } from '@/types/rescue';
import { submoduleGuides, worktreeGuides } from './git/advanced';
import { basicGuides } from './git/basics';
import { branchGuides } from './git/branches';
import { commitGuides } from './git/commits';
import { configurationGuides, gitignoreGuides, tagGuides } from './git/config-ignore-tags';
import { troubleshootingGuides } from './git/errors';
import { mergeGuides, rebaseGuides } from './git/merge-rebase';
import { remoteGuides } from './git/remotes';
import { fileGuides, stagingGuides } from './git/staging-files';
import { stashGuides } from './git/stash';
import { undoRecoveryGuides } from './git/undo-recovery';
import { githubActionsGuides, githubCliGuides, githubReleaseGuides, githubSecurityGuides } from './github/automation';
import { githubAuthenticationGuides } from './github/authentication';
import { githubIssueGuides, githubPullRequestGuides } from './github/collaboration';
import { githubRepositoryGuides } from './github/repositories';

export const guideCategories: readonly GuideCategoryMeta[] = [
  { id: 'basics', label: 'Git basics', domain: 'git', description: 'Initialize, clone, inspect, and understand repositories.' },
  { id: 'commits', label: 'Commits', domain: 'git', description: 'Create, inspect, amend, combine, and move commits.' },
  { id: 'staging', label: 'Staging', domain: 'git', description: 'Choose exactly what goes into the next commit.' },
  { id: 'files', label: 'Files', domain: 'git', description: 'Restore, move, remove, and stop tracking files.' },
  { id: 'branches', label: 'Branches', domain: 'git', description: 'Create, switch, compare, publish, and remove branches.' },
  { id: 'merge', label: 'Merge', domain: 'git', description: 'Combine branches and resolve or reverse merges.' },
  { id: 'rebase', label: 'Rebase', domain: 'git', description: 'Replay and edit local history deliberately.' },
  { id: 'stash', label: 'Stash', domain: 'git', description: 'Temporarily set working changes aside.' },
  { id: 'undo-recovery', label: 'Undo & recovery', domain: 'git', description: 'Use restore, reset, revert, and reflog safely.' },
  { id: 'remotes', label: 'Remotes', domain: 'git', description: 'Connect, fetch, pull, push, and synchronize repositories.' },
  { id: 'configuration', label: 'Configuration', domain: 'git', description: 'Configure identity, editors, branches, and defaults.' },
  { id: 'gitignore', label: '.gitignore', domain: 'git', description: 'Ignore files and diagnose rules that do not behave as expected.' },
  { id: 'tags', label: 'Tags', domain: 'git', description: 'Create and publish version and release markers.' },
  { id: 'worktrees', label: 'Worktrees', domain: 'git', description: 'Work on multiple branches in separate directories.' },
  { id: 'submodules', label: 'Submodules', domain: 'git', description: 'Manage repositories nested at recorded commits.' },
  { id: 'troubleshooting', label: 'Errors & troubleshooting', domain: 'git', description: 'Decode common fatal messages and blocked operations.' },
  { id: 'github-repositories', label: 'GitHub repositories', domain: 'github', description: 'Create, clone, fork, archive, and manage hosted repositories.' },
  { id: 'github-authentication', label: 'GitHub authentication', domain: 'github', description: 'Log in, check credentials, and choose SSH or HTTPS.' },
  { id: 'github-pull-requests', label: 'Pull requests', domain: 'github', description: 'Open, review, inspect, and merge pull requests.' },
  { id: 'github-issues', label: 'Issues', domain: 'github', description: 'Create, inspect, develop, and close issues.' },
  { id: 'github-cli', label: 'GitHub CLI', domain: 'github', description: 'Use gh shortcuts, browsing, aliases, and API access.' },
  { id: 'github-actions', label: 'GitHub Actions', domain: 'github', description: 'Run workflows and diagnose automation failures.' },
  { id: 'github-releases', label: 'GitHub releases', domain: 'github', description: 'Publish and download tagged releases and assets.' },
  { id: 'github-security', label: 'GitHub secrets', domain: 'github', description: 'Manage Actions secrets and variables without exposing values.' },
];

const rawGuides: readonly GitGuide[] = [
  ...basicGuides, ...commitGuides, ...stagingGuides, ...fileGuides, ...branchGuides,
  ...mergeGuides, ...rebaseGuides, ...stashGuides, ...undoRecoveryGuides, ...remoteGuides,
  ...configurationGuides, ...gitignoreGuides, ...tagGuides, ...worktreeGuides, ...submoduleGuides,
  ...troubleshootingGuides, ...githubRepositoryGuides, ...githubAuthenticationGuides,
  ...githubPullRequestGuides, ...githubIssueGuides, ...githubCliGuides, ...githubActionsGuides,
  ...githubReleaseGuides, ...githubSecurityGuides,
];

function withRelatedGuides(guide: GitGuide): GitGuide {
  if (guide.related.length > 0) return guide;
  const peers = rawGuides.filter((candidate) => candidate.category === guide.category && candidate.id !== guide.id);
  const currentIndex = rawGuides.findIndex((candidate) => candidate.id === guide.id);
  const ordered = [...peers].sort((left, right) => {
    const leftDistance = (rawGuides.findIndex((candidate) => candidate.id === left.id) - currentIndex + rawGuides.length) % rawGuides.length;
    const rightDistance = (rawGuides.findIndex((candidate) => candidate.id === right.id) - currentIndex + rawGuides.length) % rawGuides.length;
    return leftDistance - rightDistance;
  });
  return { ...guide, related: ordered.slice(0, 3).map((candidate) => candidate.id) };
}

export const knowledgeGuides: readonly GitGuide[] = rawGuides.map(withRelatedGuides);

const guideByDomainAndId = new Map(knowledgeGuides.map((guide) => [`${guide.domain}:${guide.id}`, guide]));
const guideById = new Map(knowledgeGuides.map((guide) => [guide.id, guide]));
const categoryById = new Map(guideCategories.map((category) => [category.id, category]));
const rescueCategoryById = new Map(scenarioCategories.map((category) => [category.id, category.label]));

export function getGuide(domain: 'git' | 'github', id: string): GitGuide | undefined {
  return guideByDomainAndId.get(`${domain}:${id}`);
}

export function getGuideById(id: string): GitGuide | undefined {
  return guideById.get(id);
}

export function getGuideHref(guide: GitGuide): string {
  return `/${guide.domain}/${guide.id}`;
}

const safetyWeight: Record<SafetyLevel, number> = { safe: 0, caution: 1, dangerous: 2 };

function highestSafety(levels: readonly SafetyLevel[]): SafetyLevel {
  return levels.reduce<SafetyLevel>((highest, level) => safetyWeight[level] > safetyWeight[highest] ? level : highest, 'safe');
}

const guideItems: GuideSearchItem[] = knowledgeGuides.map((guide) => ({
  key: `guide:${guide.domain}:${guide.id}`,
  source: 'guide',
  sourceId: guide.id,
  title: guide.title,
  description: guide.description,
  href: getGuideHref(guide),
  domain: guide.domain,
  category: guide.category,
  categoryLabel: categoryById.get(guide.category)?.label ?? guide.category,
  aliases: guide.aliases,
  keywords: guide.keywords,
  commands: guide.commands.map((command) => command.command),
  safety: guide.safety,
  popular: guide.popular ?? false,
}));

const rescueItems: GuideSearchItem[] = rescueScenarios.map((scenario) => {
  const resultSteps = Object.values(scenario.steps).filter((step): step is RescueResultStep => step.kind === 'result');
  const commands = resultSteps.flatMap((step) => step.commands);
  return {
    key: `rescue:${scenario.id}`,
    source: 'rescue',
    sourceId: scenario.id,
    title: scenario.title,
    description: scenario.description,
    href: `/rescue/${scenario.id}`,
    domain: 'recovery',
    category: scenario.category,
    categoryLabel: rescueCategoryById.get(scenario.category) ?? scenario.category,
    aliases: [scenario.shortTitle, ...scenario.keywords],
    keywords: [...scenario.keywords, 'guided recovery', 'rescue'],
    commands: commands.map((command) => command.command),
    safety: highestSafety(commands.map((command) => command.safety)),
    popular: scenario.popular ?? false,
  };
});

export const guideSearchItems: readonly GuideSearchItem[] = [...guideItems, ...rescueItems];
export const popularGuideItems: readonly GuideSearchItem[] = guideSearchItems.filter((item) => item.popular);
