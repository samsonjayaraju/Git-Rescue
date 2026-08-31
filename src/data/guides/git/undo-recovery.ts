import { defineGuides } from '../helpers';

export const undoRecoveryGuides = defineGuides('git', 'undo-recovery', [
  {
    id: 'reset-soft-explained', title: 'Understand git reset --soft', description: 'Move the current branch while keeping file changes staged.',
    aliases: ['git reset soft', 'undo commit keep staged', 'soft reset explained'], commands: [{ command: 'git reset --soft HEAD~1', safety: 'caution', description: 'Move back one commit and leave its changes staged.' }], keywords: ['HEAD', 'index'], popular: true,
    notes: ['Use only on local history unless collaborators have coordinated a rewrite.'],
  },
  {
    id: 'reset-mixed-explained', title: 'Understand git reset --mixed', description: 'Move the current branch while keeping file changes unstaged in the working tree.',
    aliases: ['git reset mixed', 'undo commit unstage changes', 'default reset explained'], commands: [{ command: 'git reset HEAD~1', safety: 'caution', description: 'Move back one commit, preserve files, and reset the index.' }], keywords: ['working tree', 'index'],
  },
  {
    id: 'reset-hard-explained', title: 'Understand git reset --hard', description: 'Reset the branch, staging area, and tracked working files to one commit.',
    aliases: ['git reset hard', 'reset --hard', 'discard commit and changes', 'hard reset explained'],
    commands: ['git status', 'git branch rescue-backup', { command: 'git reset --hard <commit>', safety: 'dangerous', description: 'Make HEAD, index, and tracked files match the selected commit.', warning: 'Uncommitted tracked changes will be permanently deleted.' }], keywords: ['destructive', 'HEAD'], popular: true,
  },
  {
    id: 'restore-command-explained', title: 'Understand git restore', description: 'Restore working files or remove changes from the staging area without moving branch history.',
    aliases: ['git restore explained', 'restore vs reset', 'undo file changes'], commands: ['git restore --staged <file>', 'git restore --source=<commit> -- <file>'], keywords: ['files', 'index'],
  },
  {
    id: 'revert-command-explained', title: 'Understand git revert', description: 'Create a new commit that reverses an earlier commit while preserving shared history.',
    aliases: ['git revert explained', 'safe undo commit', 'reverse pushed commit'], commands: ['git revert <commit-hash>'], keywords: ['shared history', 'inverse commit'], popular: true,
  },
  {
    id: 'view-reflog', title: 'View the reflog', description: 'List recent local movements of HEAD and branch references.',
    aliases: ['git reflog', 'show recent git actions', 'head history'], commands: ['git reflog --date=local'], keywords: ['recovery', 'local log'], popular: true,
  },
  {
    id: 'recover-lost-commit', title: 'Recover a lost commit', description: 'Find a no-longer-visible commit in reflog and preserve it on a new branch.',
    aliases: ['deleted commit', 'commit disappeared', 'restore lost work', 'find orphan commit'], commands: ['git reflog --date=local', 'git show --stat <commit-hash>', { command: 'git switch -c recovered-work <commit-hash>', safety: 'caution', description: 'Create a branch at the recovered commit.' }], keywords: ['reflog'], popular: true,
  },
  {
    id: 'recover-deleted-branch', title: 'Recover a deleted branch', description: 'Locate the former branch tip and create a new branch at that commit.',
    aliases: ['accidentally deleted my branch', 'restore removed branch', 'undelete git branch'], commands: ['git reflog --all --date=local', 'git show --stat <commit-hash>', { command: 'git switch -c recovered-branch <commit-hash>', safety: 'caution', description: 'Recreate a branch pointer at the verified commit.' }], keywords: ['reflog'], popular: true,
  },
  {
    id: 'recover-after-hard-reset', title: 'Recover after git reset --hard', description: 'Recover committed work from reflog after a hard reset when the commit is still reachable.',
    aliases: ['undo reset hard', 'reset hard lost commits', 'recover hard reset'], commands: ['git reflog --date=local', { command: 'git switch -c recovered-after-reset <commit-hash>', safety: 'caution', description: 'Preserve the pre-reset commit on a branch.' }], keywords: ['reflog'],
    warnings: ['Git cannot reliably recover uncommitted working-tree changes erased by reset --hard.'],
  },
  {
    id: 'recover-after-rebase', title: 'Recover history from before a rebase', description: 'Find the pre-rebase branch tip in reflog and preserve it separately.',
    aliases: ['undo completed rebase', 'bad rebase recovery', 'restore before rebase'], commands: ['git reflog --date=local', { command: 'git branch before-rebase <commit-hash>', safety: 'caution', description: 'Name the verified pre-rebase commit without moving the current branch.' }], keywords: ['reflog'],
  },
  {
    id: 'preserve-current-state', title: 'Create a safety branch before recovery', description: 'Give the current commit a durable name before trying history-changing commands.',
    aliases: ['backup branch', 'git rescue branch', 'save state before reset'], commands: ['git branch rescue-backup', 'git show --stat rescue-backup'], keywords: ['backup', 'safety'], popular: true,
  },
]);
