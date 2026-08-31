import { defineGuides } from '../helpers';

export const basicGuides = defineGuides('git', 'basics', [
  {
    id: 'check-git-version', title: 'Check the installed Git version',
    description: 'Confirm that Git is installed and see the version available on your machine.',
    aliases: ['git version', 'is git installed', 'check git installation', 'install or check git'],
    commands: ['git --version'], keywords: ['setup', 'installation'], popular: true,
  },
  {
    id: 'initialize-repository', title: 'Initialize a Git repository',
    description: 'Turn the current project folder into a local Git repository.',
    aliases: ['git init', 'start git repository', 'make folder a git repo', 'initialize repo'],
    commands: ['git init', 'git status'], keywords: ['new repository', 'first repository'], popular: true,
    notes: ['Run git init once at the root of the project you want Git to track.'],
  },
  {
    id: 'clone-repository', title: 'Clone a Git repository',
    description: 'Download a repository, its branches, and its commit history into a new folder.',
    aliases: ['git clone', 'download repository', 'copy git repository', 'clone repo'],
    commands: ['git clone <repository-url>', 'cd <repository-folder>'], keywords: ['remote', 'download'], popular: true,
    example: 'git clone https://github.com/octo-org/example.git',
  },
  {
    id: 'check-repository-status', title: 'Check repository status',
    description: 'See the current branch, staged changes, unstaged changes, and untracked files.',
    aliases: ['git status', 'what changed', 'check git changes', 'repository state'],
    commands: ['git status', 'git status --short'], keywords: ['working tree', 'index'], popular: true,
  },
  {
    id: 'see-unstaged-changes', title: 'See unstaged changes',
    description: 'Review tracked file edits that have not been added to the staging area.',
    aliases: ['git diff', 'view working changes', 'show modified lines', 'diff unstaged'],
    commands: ['git diff', 'git diff -- <file>'], keywords: ['difference', 'working tree'],
  },
  {
    id: 'see-staged-changes', title: 'See staged changes',
    description: 'Review exactly what the next commit will contain.',
    aliases: ['git diff staged', 'git diff cached', 'view staged files', 'what will i commit'],
    commands: ['git diff --staged', 'git diff --cached'], keywords: ['index', 'next commit'], popular: true,
  },
  {
    id: 'list-tracked-files', title: 'List files tracked by Git',
    description: 'Print every path currently stored in the repository index.',
    aliases: ['show tracked files', 'git ls files', 'which files are tracked'],
    commands: ['git ls-files'], keywords: ['index', 'files'],
  },
  {
    id: 'find-repository-root', title: 'Find the repository root',
    description: 'Print the top-level directory of the current Git repository.',
    aliases: ['where is git root', 'repository root folder', 'git top level'],
    commands: ['git rev-parse --show-toplevel'], keywords: ['path', 'folder'],
  },
  {
    id: 'open-git-help', title: 'Open help for a Git command',
    description: 'Read the installed manual or a concise option summary for any Git command.',
    aliases: ['git help', 'git command manual', 'show git options'],
    commands: ['git help <command>', 'git <command> -h'], keywords: ['manual', 'documentation'],
  },
  {
    id: 'inspect-git-object', title: 'Identify a Git object',
    description: 'Check whether a hash names a commit, tree, tag, or blob before using it.',
    aliases: ['what is this git hash', 'identify object type', 'git cat file type'],
    commands: ['git cat-file -t <object-hash>', 'git cat-file -p <object-hash>'], keywords: ['sha', 'object database'],
  },
]);
