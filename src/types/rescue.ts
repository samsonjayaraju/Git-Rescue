export type SafetyLevel = 'safe' | 'caution' | 'dangerous';

export type ScenarioCategory =
  | 'commits'
  | 'staging'
  | 'files'
  | 'branches'
  | 'merges'
  | 'rebase'
  | 'cherry-pick'
  | 'pushes'
  | 'reset'
  | 'security'
  | 'emergency';

export interface RescueCommand {
  id: string;
  command: string;
  label: string;
  description: string;
  safety: SafetyLevel;
  warning?: string;
}

export interface RescueEffect {
  label: string;
  value: string;
  tone?: 'positive' | 'neutral' | 'warning';
}

export interface RescueOption {
  id: string;
  label: string;
  description?: string;
  nextStepId: string;
}

export interface RescueQuestionStep {
  id: string;
  kind: 'question';
  eyebrow?: string;
  question: string;
  helpText?: string;
  options: RescueOption[];
}

export interface RescueResultStep {
  id: string;
  kind: 'result';
  title: string;
  summary: string;
  rationale: string;
  commands: RescueCommand[];
  effects: RescueEffect[];
  beforeYouStart?: string[];
  notes?: string[];
}

export type RescueStep = RescueQuestionStep | RescueResultStep;

export interface RescueScenario {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ScenarioCategory;
  keywords: string[];
  popular?: boolean;
  emergency?: boolean;
  startStepId: string;
  steps: Record<string, RescueStep>;
}

export interface RescueSession {
  flowId: string;
  stepId: string;
  history: string[];
}
