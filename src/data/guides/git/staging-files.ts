import { defineGuides } from '../helpers';

export const stagingGuides = defineGuides('git', 'staging', [
  {
    id: 'stage-one-file', title: 'Stage one file', description: 'Add one exact file path to the next commit snapshot.',
    aliases: ['git add file', 'stage file', 'add one file', 'prepare file for commit'], commands: ['git add <file>', 'git diff --staged -- <file>'],
    keywords: ['index', 'commit'], popular: true,
  },
  {
    id: 'stage-directory', title: 'Stage a directory', description: 'Stage changes beneath one directory without staging unrelated areas.',
    aliases: ['git add folder', 'stage folder', 'add directory to git'], commands: ['git add <directory>/', 'git diff --staged -- <directory>/'], keywords: ['path', 'folder'],
  },
  {
    id: 'stage-everything', title: 'Stage all current changes', description: 'Stage new, modified, and deleted paths beneath the current directory.',
    aliases: ['git add dot', 'git add all', 'stage everything', 'add all changes'], commands: ['git status --short', 'git add .', 'git diff --staged'],
    keywords: ['all files', 'index'], notes: ['From a subdirectory, git add . only covers that directory and its descendants.'],
  },
  {
    id: 'stage-tracked-files', title: 'Stage changes to tracked files', description: 'Stage modifications and deletions without adding new untracked files.',
    aliases: ['git add tracked only', 'stage modified files', 'git add update'], commands: ['git add -u', 'git diff --staged'], keywords: ['tracked', 'update'],
  },
  {
    id: 'interactive-staging', title: 'Stage parts of a file interactively', description: 'Review each patch hunk and choose which pieces belong in the next commit.',
    aliases: ['git add patch', 'stage hunks', 'partial staging', 'commit part of file'], commands: ['git add -p', 'git diff --staged'], keywords: ['patch', 'hunk'],
  },
  {
    id: 'unstage-one-file', title: 'Unstage one file', description: 'Remove a file from the next commit while preserving its working changes.',
    aliases: ['git unstage file', 'remove file from staging', 'undo git add file'], commands: ['git restore --staged <file>'], keywords: ['index', 'keep changes'], popular: true,
  },
  {
    id: 'unstage-all-files', title: 'Unstage all files', description: 'Clear the staging area while keeping every change in the working tree.',
    aliases: ['unstage everything', 'undo git add all', 'clear staging area'], commands: ['git restore --staged :/'], keywords: ['index', 'keep changes'],
  },
  {
    id: 'review-staged-snapshot', title: 'Review the staged snapshot', description: 'Inspect the exact patch that will be stored by the next commit.',
    aliases: ['view staged diff', 'check staged changes', 'git diff staged'], commands: ['git diff --staged', 'git diff --staged --stat'], keywords: ['index', 'review'],
  },
]);

export const fileGuides = defineGuides('git', 'files', [
  {
    id: 'discard-file-changes', title: 'Discard unstaged changes in a file', description: 'Review and remove local edits to one tracked file.',
    aliases: ['restore modified file', 'undo changes in file', 'revert file to last commit'],
    commands: ['git diff -- <file>', { command: 'git restore <file>', safety: 'dangerous', description: 'Replace the working file with its staged version.', warning: 'Uncommitted edits in this file will be permanently removed.' }],
    keywords: ['working tree', 'restore'],
  },
  {
    id: 'restore-deleted-file', title: 'Restore a deleted tracked file', description: 'Bring back a file deleted from the working tree using the current commit.',
    aliases: ['undelete git file', 'recover deleted file', 'git restore deleted file'], commands: ['git status --short', 'git restore <file>'], keywords: ['missing file', 'HEAD'], popular: true,
  },
  {
    id: 'restore-file-from-commit', title: 'Restore a file from an older commit', description: 'Copy one path from a known-good commit into the current working tree.',
    aliases: ['old version of file', 'checkout file from commit', 'recover previous file'], commands: ['git log --oneline -- <file>', { command: 'git restore --source=<commit-hash> -- <file>', safety: 'caution', description: 'Replace the working copy with the selected committed version.' }], keywords: ['history', 'source'],
  },
  {
    id: 'restore-staged-and-working-file', title: 'Reset a file in both staging and working tree', description: 'Make one file match HEAD in both the index and working tree.',
    aliases: ['fully reset one file', 'discard staged file changes', 'restore file to head'],
    commands: ['git diff HEAD -- <file>', { command: 'git restore --source=HEAD --staged --worktree <file>', safety: 'dangerous', description: 'Replace both staged and unstaged versions.', warning: 'All uncommitted changes to this file will be permanently removed.' }], keywords: ['HEAD', 'index'],
  },
  {
    id: 'stop-tracking-file', title: 'Stop tracking a file but keep it locally', description: 'Remove a path from Git’s index while leaving the local copy on disk.',
    aliases: ['git rm cached', 'untrack file keep local', 'remove file from git only'], commands: ['git rm --cached <file>', 'git status'], keywords: ['gitignore', 'index'],
    notes: ['Add the path to .gitignore before committing if it should stay untracked.'],
  },
  {
    id: 'rename-or-move-file', title: 'Rename or move a tracked file', description: 'Move a tracked path and stage the rename for the next commit.',
    aliases: ['git mv', 'rename git file', 'move file in repository'], commands: ['git mv <old-path> <new-path>', 'git status --short'], keywords: ['rename', 'path'],
  },
  {
    id: 'preview-untracked-cleanup', title: 'Preview removable untracked files', description: 'See which untracked files and directories a cleanup would remove without deleting them.',
    aliases: ['git clean preview', 'list untracked files to delete', 'dry run git clean'], commands: ['git clean -nd', 'git clean -ndX'], keywords: ['dry run', 'ignored files'],
  },
  {
    id: 'remove-untracked-files', title: 'Remove untracked files and directories', description: 'Delete untracked content after reviewing a dry run.',
    aliases: ['git clean', 'delete untracked files', 'clean working directory'],
    commands: ['git clean -nd', { command: 'git clean -fd', safety: 'dangerous', description: 'Delete untracked files and directories.', warning: 'Git cannot recover untracked files removed by git clean.' }],
    keywords: ['cleanup', 'untracked'], warnings: ['Back up anything important and inspect the dry-run output first.'],
  },
]);
