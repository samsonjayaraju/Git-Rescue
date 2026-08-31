import { defineGuides } from '../helpers';

export const branchGuides = defineGuides('git', 'branches', [
  {
    id: 'show-current-branch', title: 'Show the current branch', description: 'Print the name of the branch currently checked out.',
    aliases: ['what branch am i on', 'current git branch', 'check branch name'], commands: ['git branch --show-current', 'git status --short --branch'], keywords: ['HEAD'], popular: true,
  },
  {
    id: 'list-local-branches', title: 'List local branches', description: 'Show branch names stored in the current repository.',
    aliases: ['git branch list', 'show branches', 'list git branches'], commands: ['git branch', 'git branch -vv'], keywords: ['local', 'upstream'],
  },
  {
    id: 'list-remote-branches', title: 'List remote branches', description: 'Show remote-tracking branch names known to this clone.',
    aliases: ['show remote branches', 'git branch remote', 'branches on origin'], commands: ['git fetch --prune', 'git branch --remotes'], keywords: ['origin', 'tracking'],
  },
  {
    id: 'create-branch', title: 'Create a branch', description: 'Create a new branch pointer at the current commit without switching to it.',
    aliases: ['git branch create', 'make new branch', 'new git branch'], commands: ['git branch <new-branch>'], keywords: ['branch pointer'], popular: true,
  },
  {
    id: 'create-and-switch-branch', title: 'Create and switch to a branch', description: 'Create a branch at the current commit and make it the active branch.',
    aliases: ['git switch c', 'new branch and checkout', 'create branch and move to it'], commands: ['git switch -c <new-branch>'], keywords: ['checkout -b'], popular: true,
  },
  {
    id: 'switch-branch', title: 'Switch branches', description: 'Change the working tree to another existing local branch.',
    aliases: ['git switch', 'checkout branch', 'move to branch', 'change branch'], commands: ['git switch <branch>'], keywords: ['checkout'], popular: true,
    prerequisites: ['Commit or stash conflicting working changes before switching.'],
  },
  {
    id: 'rename-current-branch', title: 'Rename the current branch', description: 'Change the local branch name without changing any commits.',
    aliases: ['git branch rename', 'change branch name', 'rename git branch'], commands: ['git branch -m <new-name>'], keywords: ['branch label'],
  },
  {
    id: 'delete-local-branch', title: 'Delete a merged local branch', description: 'Remove a local branch only when Git confirms its commits are already merged.',
    aliases: ['git delete branch', 'remove local branch', 'git branch d'], commands: [{ command: 'git branch -d <branch>', safety: 'caution', description: 'Delete the branch if Git considers it fully merged.' }], keywords: ['cleanup', 'merged'], popular: true,
  },
  {
    id: 'force-delete-local-branch', title: 'Force-delete a local branch', description: 'Remove a local branch even when it contains unmerged commits.',
    aliases: ['git branch capital d', 'delete unmerged branch', 'force remove branch'],
    commands: ['git log --oneline <branch> --not --all', { command: 'git branch -D <branch>', safety: 'dangerous', description: 'Delete the branch without the merged-work check.', warning: 'Unmerged commits may become difficult to find and can eventually be pruned.' }],
    keywords: ['unmerged', 'destructive'],
  },
  {
    id: 'delete-remote-branch', title: 'Delete a remote branch', description: 'Ask the remote server to remove one branch reference.',
    aliases: ['remove origin branch', 'delete github branch command', 'git push delete'], commands: [{ command: 'git push origin --delete <branch>', safety: 'caution', description: 'Remove the named branch from origin.' }], keywords: ['remote', 'origin'],
  },
  {
    id: 'push-new-branch', title: 'Push a new branch', description: 'Publish the current branch and configure its default upstream.',
    aliases: ['publish branch', 'push branch first time', 'git push set upstream'], commands: ['git push -u origin HEAD'], keywords: ['upstream', 'origin'], popular: true,
  },
  {
    id: 'set-branch-upstream', title: 'Set a branch upstream', description: 'Connect the current local branch to an existing remote-tracking branch.',
    aliases: ['set tracking branch', 'branch has no upstream', 'git branch set upstream'], commands: ['git branch --set-upstream-to=origin/<branch>'], keywords: ['tracking', 'remote'],
  },
  {
    id: 'track-remote-branch', title: 'Create a local branch from a remote branch', description: 'Create and switch to a local branch that tracks a remote branch.',
    aliases: ['checkout remote branch', 'track origin branch', 'local branch from remote'], commands: ['git fetch origin', 'git switch --track origin/<branch>'], keywords: ['upstream', 'tracking'],
  },
  {
    id: 'compare-branches', title: 'Compare two branches', description: 'Review file differences and commits unique to each branch.',
    aliases: ['git diff branches', 'difference between branches', 'compare branch commits'], commands: ['git diff <branch-one>...<branch-two>', 'git log --left-right --oneline <branch-one>...<branch-two>'], keywords: ['diff', 'diverged'],
  },
  {
    id: 'merge-branch-into-current', title: 'Merge a branch into the current branch', description: 'Combine another branch into the branch that is currently checked out.',
    aliases: ['git merge branch', 'combine branches', 'merge feature into main'], commands: ['git switch <destination-branch>', 'git merge <source-branch>'], keywords: ['integration', 'source destination'], popular: true,
    notes: ['The branch you switch to first is the branch that receives the changes.'],
  },
]);
