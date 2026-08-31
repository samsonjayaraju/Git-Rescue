import { defineGuides } from '../helpers';

export const stashGuides = defineGuides('git', 'stash', [
  {
    id: 'stash-changes', title: 'Stash working changes', description: 'Temporarily save tracked changes and return to a cleaner working tree.',
    aliases: ['git stash', 'temporarily save changes', 'put work aside'], commands: ['git status --short', 'git stash push'], keywords: ['temporary', 'working tree'], popular: true,
  },
  {
    id: 'stash-with-message', title: 'Stash changes with a message', description: 'Save tracked changes with a label that explains the paused work.',
    aliases: ['named git stash', 'stash description', 'git stash message'], commands: ['git stash push -m "Describe the paused work"'], keywords: ['label'],
  },
  {
    id: 'stash-untracked-files', title: 'Stash untracked files too', description: 'Include untracked files together with tracked changes in a stash.',
    aliases: ['stash new files', 'git stash include untracked', 'stash all files'], commands: ['git stash push --include-untracked -m "Describe the paused work"'], keywords: ['-u', 'new files'],
    notes: ['Ignored files are not included by --include-untracked.'],
  },
  {
    id: 'list-stashes', title: 'List saved stashes', description: 'Show stash references and their messages from newest to oldest.',
    aliases: ['git stash list', 'show stashes', 'find saved stash'], commands: ['git stash list'], keywords: ['stash reference'],
  },
  {
    id: 'inspect-stash', title: 'Inspect a stash', description: 'Review the files and patch saved in a stash before applying it.',
    aliases: ['git stash show', 'view stash contents', 'what is in stash'], commands: ['git stash show --stat stash@{0}', 'git stash show --patch stash@{0}'], keywords: ['diff', 'reference'],
  },
  {
    id: 'apply-stash', title: 'Apply a stash without deleting it', description: 'Restore stashed changes while keeping the stash entry as a backup.',
    aliases: ['git stash apply', 'restore stash keep it', 'apply latest stash'], commands: [{ command: 'git stash apply', safety: 'caution', description: 'Apply the newest stash and retain it in the stash list.' }], keywords: ['restore'],
  },
  {
    id: 'pop-stash', title: 'Pop the latest stash', description: 'Apply the newest stash and remove it when the application succeeds.',
    aliases: ['git stash pop', 'restore and delete stash', 'unstash changes'], commands: [{ command: 'git stash pop', safety: 'caution', description: 'Apply and then drop the latest stash when successful.' }], keywords: ['apply'],
  },
  {
    id: 'apply-specific-stash', title: 'Apply a specific stash', description: 'Restore one named stash entry rather than always choosing the newest.',
    aliases: ['apply older stash', 'choose stash', 'git stash apply reference'], commands: ['git stash list', { command: 'git stash apply stash@{<number>}', safety: 'caution', description: 'Apply the selected stash and retain it.' }], keywords: ['reference'],
  },
  {
    id: 'drop-stash', title: 'Delete one stash', description: 'Remove a specific stash entry after confirming it is no longer needed.',
    aliases: ['git stash drop', 'remove saved stash', 'delete stash'], commands: ['git stash show --patch stash@{<number>}', { command: 'git stash drop stash@{<number>}', safety: 'dangerous', description: 'Delete the selected stash reference.', warning: 'The stashed changes may become difficult to recover after the stash is dropped.' }], keywords: ['cleanup'],
  },
  {
    id: 'clear-all-stashes', title: 'Delete every stash', description: 'Remove all stash entries after reviewing the list.',
    aliases: ['git stash clear', 'remove all stashes', 'empty stash list'], commands: ['git stash list', { command: 'git stash clear', safety: 'dangerous', description: 'Delete every stash reference.', warning: 'All saved stashes will be removed and may not be recoverable.' }], keywords: ['cleanup'],
  },
  {
    id: 'create-branch-from-stash', title: 'Create a branch from a stash', description: 'Create a branch at the stash’s original base and apply the saved work there.',
    aliases: ['git stash branch', 'restore stash to new branch', 'branch from stashed work'], commands: [{ command: 'git stash branch <new-branch> stash@{<number>}', safety: 'caution', description: 'Create the branch, apply the stash, and drop it if successful.' }], keywords: ['conflict recovery'],
  },
  {
    id: 'recover-dropped-stash', title: 'Try to recover a dropped stash', description: 'Search unreachable objects for a recently dropped stash commit, then preserve a verified candidate.',
    aliases: ['recover deleted stash', 'undo git stash drop', 'lost stash', 'restore cleared stash'], commands: ['git fsck --unreachable --no-reflogs', 'git show --stat <candidate-hash>', { command: 'git branch recovered-stash <candidate-hash>', safety: 'caution', description: 'Preserve a verified stash commit under a branch name.' }], keywords: ['dangling commit', 'fsck'],
    warnings: ['Recovery is not guaranteed. Avoid repository cleanup commands until you finish searching for the object.'],
  },
]);
