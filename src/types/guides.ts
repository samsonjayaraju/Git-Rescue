import type { RescueCommand, SafetyLevel } from './rescue';

export type GuideDomain = 'git' | 'github';

export type GuideCategory =
  | 'basics'
  | 'commits'
  | 'staging'
  | 'files'
  | 'branches'
  | 'merge'
  | 'rebase'
  | 'stash'
  | 'undo-recovery'
  | 'remotes'
  | 'configuration'
  | 'gitignore'
  | 'tags'
  | 'worktrees'
  | 'submodules'
  | 'troubleshooting'
  | 'github-repositories'
  | 'github-authentication'
  | 'github-pull-requests'
  | 'github-issues'
  | 'github-cli'
  | 'github-actions'
  | 'github-releases'
  | 'github-security';

export interface GuideStep {
  title: string;
  description: string;
  commandIds?: string[];
}

export interface GitGuide {
  id: string;
  title: string;
  description: string;
  domain: GuideDomain;
  category: GuideCategory;
  subcategory?: string;
  aliases: string[];
  keywords: string[];
  commands: RescueCommand[];
  explanation: string;
  whenToUse?: string;
  prerequisites?: string[];
  steps?: GuideStep[];
  example?: string;
  notes?: string[];
  warnings?: string[];
  related: string[];
  safety: SafetyLevel;
  popular?: boolean;
}

export interface GuideCategoryMeta {
  id: GuideCategory;
  label: string;
  domain: GuideDomain;
  description: string;
}

export interface GuideSearchItem {
  key: string;
  source: 'guide' | 'rescue';
  sourceId: string;
  title: string;
  description: string;
  href: string;
  domain: GuideDomain | 'recovery';
  category: string;
  categoryLabel: string;
  aliases: string[];
  keywords: string[];
  commands: string[];
  safety: SafetyLevel;
  popular: boolean;
}

export interface GuideSearchResult {
  item: GuideSearchItem;
  score: number;
}
