import { defineGuides } from '../helpers';

export const mergeGuides = defineGuides('git', 'merge', [
  {
    id: 'merge-branch', title: 'Merge one branch into another', description: 'Integrate a source branch into the checked-out destination branch.',
    aliases: ['how to merge', 'git merge', 'merge branches', 'merge feature branch'], commands: ['git switch <destination-branch>', 'git merge <source-branch>'], keywords: ['integration'], popular: true,
  },
  {
    id: 'fast-forward-only-merge', title: 'Allow only a fast-forward merge', description: 'Update the destination only when no merge commit or divergence is required.',
    aliases: ['git merge ff only', 'fast forward merge', 'reject merge commit'], commands: [{ command: 'git merge --ff-only <branch>', safety: 'caution', description: 'Stop instead of creating a merge commit when histories diverge.' }], keywords: ['linear history'],
  },
  {
    id: 'create-merge-commit', title: 'Create a merge commit explicitly', description: 'Record the integration point even when Git could fast-forward.',
    aliases: ['git merge no ff', 'always merge commit', 'preserve branch merge'], commands: [{ command: 'git merge --no-ff <branch>', safety: 'caution', description: 'Merge and create an explicit merge commit.' }], keywords: ['no fast forward'],
  },
  {
    id: 'list-merge-conflicts', title: 'List files with merge conflicts', description: 'Show only paths that remain unresolved during a merge.',
    aliases: ['show conflicting files', 'which files have conflicts', 'git unmerged paths'], commands: ['git status', 'git diff --name-only --diff-filter=U'], keywords: ['unmerged'], popular: true,
  },
  {
    id: 'resolve-merge-conflicts', title: 'Resolve and finish a merge', description: 'Edit conflicted files, stage the resolved versions, and create the merge commit.',
    aliases: ['fix merge conflict', 'continue merge after conflicts', 'complete conflicted merge'], commands: ['git status', 'git add <resolved-files>', 'git commit'], keywords: ['conflict markers'], popular: true,
    notes: ['Remove the <<<<<<<, =======, and >>>>>>> marker lines after choosing the final content.'],
  },
  {
    id: 'abort-merge', title: 'Abort an in-progress merge', description: 'Return to the state from before the current merge began.',
    aliases: ['cancel merge', 'git merge abort', 'undo merge in progress'], commands: [{ command: 'git merge --abort', safety: 'caution', description: 'Reconstruct the pre-merge state.' }], keywords: ['conflict'], popular: true,
  },
  {
    id: 'revert-merge-commit', title: 'Revert a merge commit', description: 'Create a new commit that reverses a completed merge without rewriting shared history.',
    aliases: ['undo merged branch', 'git revert merge', 'reverse merge commit'], commands: ['git show --no-patch --pretty=%P <merge-hash>', { command: 'git revert -m 1 <merge-hash>', safety: 'caution', description: 'Revert using parent 1 as the mainline after verifying it.' }], keywords: ['mainline', 'shared history'],
    warnings: ['Confirm the correct mainline parent before running the revert.'],
  },
  {
    id: 'find-merge-base', title: 'Find the common ancestor of two branches', description: 'Print the best shared ancestor used when comparing or merging two histories.',
    aliases: ['git merge base', 'common branch ancestor', 'where branches split'], commands: ['git merge-base <branch-one> <branch-two>'], keywords: ['ancestor', 'divergence'],
  },
]);

export const rebaseGuides = defineGuides('git', 'rebase', [
  {
    id: 'rebase-branch', title: 'Rebase a branch onto another branch', description: 'Replay private branch commits on top of a newer base.',
    aliases: ['git rebase', 'update feature branch with main', 'replay commits'], commands: ['git switch <feature-branch>', { command: 'git rebase <base-branch>', safety: 'caution', description: 'Replay the feature commits onto the base branch.' }], keywords: ['linear history'], popular: true,
    warnings: ['Rebase changes commit IDs. Avoid rebasing commits collaborators already use.'],
  },
  {
    id: 'interactive-rebase', title: 'Start an interactive rebase', description: 'Review and edit the sequence of recent private commits.',
    aliases: ['git rebase i', 'edit commit history', 'interactive history cleanup'], commands: [{ command: 'git rebase -i HEAD~<count>', safety: 'caution', description: 'Open the rebase plan for the selected number of commits.' }], keywords: ['squash', 'reword', 'drop'],
  },
  {
    id: 'squash-with-rebase', title: 'Squash commits during rebase', description: 'Combine related private commits into one clearer commit.',
    aliases: ['rebase squash', 'combine commits interactive', 'fixup commits'], commands: [{ command: 'git rebase -i HEAD~<count>', safety: 'caution', description: 'Keep the first commit as pick and mark later ones squash or fixup.' }], keywords: ['history rewrite'],
  },
  {
    id: 'reword-commit-with-rebase', title: 'Change an older commit message', description: 'Pause an interactive rebase to rewrite the message of an earlier private commit.',
    aliases: ['reword old commit', 'change older commit message', 'edit historical message'], commands: [{ command: 'git rebase -i <base-commit>', safety: 'caution', description: 'Change pick to reword for the target commit.' }], keywords: ['interactive', 'history'],
  },
  {
    id: 'edit-commit-with-rebase', title: 'Edit an older commit', description: 'Pause a rebase at an earlier commit, amend it, then continue replaying history.',
    aliases: ['modify old commit', 'change files in earlier commit', 'rebase edit'], commands: [{ command: 'git rebase -i <base-commit>', safety: 'caution', description: 'Mark the target commit as edit.' }, 'git add <updated-files>', { command: 'git commit --amend', safety: 'caution', description: 'Replace the paused commit.' }, { command: 'git rebase --continue', safety: 'caution', description: 'Resume replaying later commits.' }], keywords: ['interactive'],
  },
  {
    id: 'drop-commit-with-rebase', title: 'Drop a commit during rebase', description: 'Remove one private commit from a rewritten sequence after reviewing its patch.',
    aliases: ['delete old commit', 'rebase drop commit', 'remove commit from history'], commands: ['git show <commit-hash>', { command: 'git rebase -i <base-commit>', safety: 'dangerous', description: 'Mark the target as drop in the plan.', warning: 'The dropped commit and its changes will no longer be part of the rewritten branch.' }], keywords: ['history rewrite'],
  },
  {
    id: 'continue-rebase', title: 'Continue a paused rebase', description: 'Stage conflict resolutions and resume replaying commits.',
    aliases: ['git rebase continue', 'resume rebase', 'continue after rebase conflict'], commands: ['git status', 'git add <resolved-files>', { command: 'git rebase --continue', safety: 'caution', description: 'Continue with the next commit.' }], keywords: ['conflict'],
  },
  {
    id: 'abort-rebase', title: 'Abort an in-progress rebase', description: 'Stop the rebase and restore the original branch tip.',
    aliases: ['cancel rebase', 'git rebase abort', 'undo rebase in progress'], commands: [{ command: 'git rebase --abort', safety: 'caution', description: 'Return to the pre-rebase branch state.' }], keywords: ['recovery'], popular: true,
  },
  {
    id: 'skip-rebase-commit', title: 'Skip the current rebase commit', description: 'Omit the patch currently causing a rebase conflict.',
    aliases: ['git rebase skip', 'ignore conflicting commit', 'drop current rebase patch'], commands: ['git rebase --show-current-patch', { command: 'git rebase --skip', safety: 'dangerous', description: 'Discard the current patch and continue.', warning: 'The skipped commit’s changes will not appear in the rebased branch.' }], keywords: ['conflict'],
  },
  {
    id: 'rebase-onto', title: 'Move a branch with rebase --onto', description: 'Replay a selected commit range onto a different base branch.',
    aliases: ['git rebase onto', 'change branch parent', 'transplant commits'], commands: [{ command: 'git rebase --onto <new-base> <old-base> <branch>', safety: 'caution', description: 'Replay commits after old-base onto new-base.' }], keywords: ['advanced rebase'],
    warnings: ['Verify the commit range with git log before running this history rewrite.'],
  },
]);
