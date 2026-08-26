import type { SafetyLevel } from '@/types/rescue';

export interface GitReference {
  command: string;
  description: string;
  when: string;
  safety: SafetyLevel;
  example: string;
}

export const gitReference: readonly GitReference[] = [
  { command: 'git status', description: 'Shows the branch, staged changes, working changes, and in-progress operations.', when: 'Always start here when the repository feels wrong.', safety: 'safe', example: 'git status --short' },
  { command: 'git add', description: 'Copies selected working changes into the staging area.', when: 'When you are ready to include exact changes in the next commit.', safety: 'safe', example: 'git add src/app.ts' },
  { command: 'git restore', description: 'Restores working files or removes paths from the staging area.', when: 'To unstage safely, or discard a known set of file changes.', safety: 'caution', example: 'git restore --staged src/app.ts' },
  { command: 'git reset', description: 'Moves a branch pointer and optionally changes the index and working tree.', when: 'For local history repair when you understand the selected mode.', safety: 'caution', example: 'git reset --soft HEAD~1' },
  { command: 'git revert', description: 'Creates a new commit that reverses an earlier commit.', when: 'To undo work already shared with other people.', safety: 'safe', example: 'git revert abc123' },
  { command: 'git reflog', description: 'Lists recent movements of HEAD and other local references.', when: 'When a commit or branch seems lost after reset, rebase, or deletion.', safety: 'safe', example: 'git reflog --date=local' },
  { command: 'git switch', description: 'Moves between branches or creates a branch at a chosen commit.', when: 'For branch navigation without the overloaded checkout syntax.', safety: 'safe', example: 'git switch -c recovered-work abc123' },
  { command: 'git checkout', description: 'Older multi-purpose command for switching branches and restoring paths.', when: 'In older documentation or environments; prefer switch and restore for clarity.', safety: 'caution', example: 'git checkout main' },
  { command: 'git branch', description: 'Creates, lists, renames, or removes branch pointers.', when: 'To preserve a commit before risky recovery work.', safety: 'safe', example: 'git branch rescue-backup' },
  { command: 'git merge', description: 'Combines another branch and preserves the point where histories joined.', when: 'When shared context and explicit integration history matter.', safety: 'caution', example: 'git merge feature-branch' },
  { command: 'git rebase', description: 'Replays commits onto a new base, producing new commit IDs.', when: 'To clean private history before it is shared.', safety: 'caution', example: 'git rebase main' },
  { command: 'git cherry-pick', description: 'Copies one selected commit onto the current branch.', when: 'To move an isolated fix without merging the whole source branch.', safety: 'caution', example: 'git cherry-pick abc123' },
];

export interface CommandComparison {
  id: string;
  title: string;
  left: { name: string; detail: string; use: string };
  right: { name: string; detail: string; use: string };
  rule: string;
}

export const commandComparisons: readonly CommandComparison[] = [
  {
    id: 'reset-revert', title: 'Reset vs revert',
    left: { name: 'git reset', detail: 'Moves local branch history.', use: 'Use on private, unpushed commits.' },
    right: { name: 'git revert', detail: 'Adds a commit that reverses another.', use: 'Use after changes are shared.' },
    rule: 'If someone else might have pulled the commit, choose revert.',
  },
  {
    id: 'restore-checkout', title: 'Restore vs checkout',
    left: { name: 'git restore', detail: 'Explicitly restores files or unstages them.', use: 'Prefer for file recovery.' },
    right: { name: 'git checkout', detail: 'Older command that handles files and branches.', use: 'Expect it in older guides.' },
    rule: 'Use restore for files and switch for branches; intent stays obvious.',
  },
  {
    id: 'reset-modes', title: 'Soft vs mixed vs hard',
    left: { name: '--soft / --mixed', detail: 'Both keep file contents; mixed also unstages.', use: 'Edit and recommit local work.' },
    right: { name: '--hard', detail: 'Resets history, index, and tracked files.', use: 'Only when loss is intentional and backed up.' },
    rule: 'Start with soft or mixed. Hard is a destructive last resort.',
  },
  {
    id: 'merge-rebase', title: 'Merge vs rebase',
    left: { name: 'git merge', detail: 'Preserves branch history and adds an integration point.', use: 'Shared, collaborative branches.' },
    right: { name: 'git rebase', detail: 'Replays commits and changes their IDs.', use: 'Clean up private work before sharing.' },
    rule: 'Never casually rebase commits other people already use.',
  },
  {
    id: 'force-lease', title: 'Force vs force-with-lease',
    left: { name: '--force', detail: 'Overwrites the remote without checking for new work.', use: 'Avoid.' },
    right: { name: '--force-with-lease', detail: 'Refuses if the remote changed unexpectedly.', use: 'Coordinated private-branch rewrites.' },
    rule: 'A lease is safer, but both rewrite remote history.',
  },
];
