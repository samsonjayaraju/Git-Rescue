import type {
  RescueCommand,
  RescueEffect,
  RescueResultStep,
  RescueScenario,
  SafetyLevel,
  ScenarioCategory,
} from '@/types/rescue';

type DirectScenario = Omit<RescueScenario, 'startStepId' | 'steps'> & {
  result: Omit<RescueResultStep, 'id' | 'kind'>;
};

const standardEffects: RescueEffect[] = [
  { label: 'Remote affected', value: 'No', tone: 'positive' },
  { label: 'Recovery available', value: 'Yes', tone: 'positive' },
];

function command(
  id: string,
  value: string,
  label: string,
  description: string,
  safety: SafetyLevel = 'safe',
  warning?: string,
): RescueCommand {
  return { id, command: value, label, description, safety, warning };
}

function direct(config: DirectScenario): RescueScenario {
  const { result, ...scenario } = config;
  return {
    ...scenario,
    startStepId: 'solution',
    steps: { solution: { id: 'solution', kind: 'result', ...result } },
  };
}

const undoLastCommit: RescueScenario = {
  id: 'undo-last-commit',
  title: 'Undo my last commit',
  shortTitle: 'Undo last commit',
  description: 'Remove your most recent commit while choosing exactly what happens to its changes.',
  category: 'commits',
  keywords: ['undo commit', 'last commit', 'reset head', 'uncommit'],
  popular: true,
  startStepId: 'pushed',
  steps: {
    pushed: {
      id: 'pushed', kind: 'question', eyebrow: 'Step 1 of 2',
      question: 'Have you already pushed this commit?',
      helpText: 'If teammates may have pulled it, treat it as pushed.',
      options: [
        { id: 'pushed', label: 'Yes, it is pushed', description: 'Preserve shared history', nextStepId: 'revert' },
        { id: 'not-pushed', label: 'No, it is only local', description: 'You can safely move local history', nextStepId: 'keep' },
        { id: 'unsure', label: 'I’m not sure', description: 'Use the safer shared-history option', nextStepId: 'revert' },
      ],
    },
    keep: {
      id: 'keep', kind: 'question', eyebrow: 'Step 2 of 2',
      question: 'What should happen to the commit’s changes?',
      options: [
        { id: 'keep-staged', label: 'Keep them staged', description: 'Ready to recommit immediately', nextStepId: 'soft' },
        { id: 'keep-unstaged', label: 'Keep them, but unstage them', description: 'Review and edit first', nextStepId: 'mixed' },
        { id: 'discard', label: 'Discard them completely', description: 'Permanent if no backup exists', nextStepId: 'hard' },
      ],
    },
    revert: {
      id: 'revert', kind: 'result', title: 'Reverse it without rewriting history',
      summary: 'Create a new commit that safely reverses the last commit.',
      rationale: 'Because the commit may be shared, revert keeps everyone’s history consistent.',
      commands: [command('revert', 'git revert HEAD', 'Create the reversing commit', 'Git opens your editor to confirm the revert commit message.')],
      effects: [
        { label: 'Original commit', value: 'Preserved' },
        { label: 'Changes reversed', value: 'Yes', tone: 'positive' },
        { label: 'History rewritten', value: 'No', tone: 'positive' },
        { label: 'Push required', value: 'Yes' },
      ],
      notes: ['Review the generated diff, then push the new revert commit normally.'],
    },
    soft: {
      id: 'soft', kind: 'result', title: 'Remove the commit and keep changes staged',
      summary: 'Move HEAD back one commit without touching the index or your files.',
      rationale: 'This is ideal when you want to adjust and recommit the same work.',
      commands: [command('soft', 'git reset --soft HEAD~1', 'Move the branch back one commit', 'Your changes remain staged and ready to commit.', 'caution')],
      effects: [
        { label: 'Commit removed', value: 'Yes' }, { label: 'Changes preserved', value: 'Yes', tone: 'positive' },
        { label: 'Changes staged', value: 'Yes' }, { label: 'Remote affected', value: 'No', tone: 'positive' },
      ],
    },
    mixed: {
      id: 'mixed', kind: 'result', title: 'Remove the commit and unstage its changes',
      summary: 'Move HEAD back one commit and return the changes to your working tree.',
      rationale: 'A mixed reset lets you review, split, or edit the work before recommitting.',
      commands: [command('mixed', 'git reset HEAD~1', 'Move the branch back and unstage', 'This is the default mixed reset.', 'caution')],
      effects: [
        { label: 'Commit removed', value: 'Yes' }, { label: 'Changes preserved', value: 'Yes', tone: 'positive' },
        { label: 'Changes staged', value: 'No' }, { label: 'Remote affected', value: 'No', tone: 'positive' },
      ],
    },
    hard: {
      id: 'hard', kind: 'result', title: 'Discard the commit and its changes',
      summary: 'Create a rescue pointer first, then reset the branch and working tree.',
      rationale: 'The backup branch keeps the commit reachable, but uncommitted work can still be lost.',
      beforeYouStart: ['Run git status and save any unrelated uncommitted work.', 'Copy the backup command before the destructive command.'],
      commands: [
        command('backup', 'git branch rescue-backup', 'Create a safety branch', 'Keeps the current commit reachable before the reset.'),
        command('hard', 'git reset --hard HEAD~1', 'Discard the last commit and changes', 'Resets tracked files to the previous commit.', 'dangerous', 'Tracked, uncommitted changes may be permanently deleted.'),
      ],
      effects: [
        { label: 'Commit removed', value: 'Yes' }, { label: 'Committed changes', value: 'Discarded', tone: 'warning' },
        { label: 'Uncommitted changes', value: 'May be lost', tone: 'warning' }, { label: 'Backup branch', value: 'Created', tone: 'positive' },
      ],
    },
  },
};

const wrongBranch: RescueScenario = {
  id: 'wrong-branch', title: 'I committed to the wrong branch', shortTitle: 'Wrong branch commit',
  description: 'Move the latest commit to the right branch and clean up the original branch.',
  category: 'branches', keywords: ['wrong branch', 'move commit', 'committed on main'], popular: true,
  startStepId: 'pushed',
  steps: {
    pushed: {
      id: 'pushed', kind: 'question', question: 'Did you push the commit from the wrong branch?',
      helpText: 'Use the pushed path if anyone else could have fetched it.',
      options: [
        { id: 'no', label: 'No, it is local', nextStepId: 'local' },
        { id: 'yes', label: 'Yes, it is shared', nextStepId: 'shared' },
        { id: 'unsure', label: 'I’m not sure', nextStepId: 'shared' },
      ],
    },
    local: {
      id: 'local', kind: 'result', title: 'Carry the commit onto a new branch',
      summary: 'Create the intended branch at the commit, then move the original branch back.',
      rationale: 'A branch pointer preserves the commit before the local reset.',
      commands: [
        command('create', 'git switch -c correct-branch', 'Create the correct branch', 'The new branch includes your latest commit.'),
        command('switch', 'git switch original-branch', 'Return to the original branch', 'Replace original-branch with its real name.'),
        command('reset', 'git reset --hard HEAD~1', 'Remove the commit from the original branch', 'The commit remains safe on correct-branch.', 'dangerous', 'Any unrelated uncommitted tracked changes on the original branch will be lost.'),
      ],
      effects: [
        { label: 'Commit preserved', value: 'Yes', tone: 'positive' }, { label: 'Correct branch', value: 'Created' },
        { label: 'Original branch', value: 'Moved back' }, { label: 'Remote affected', value: 'No', tone: 'positive' },
      ],
      beforeYouStart: ['Make sure git status shows a clean working tree.', 'Replace the example branch names before running the commands.'],
    },
    shared: {
      id: 'shared', kind: 'result', title: 'Copy the commit, then revert the shared one',
      summary: 'Cherry-pick the commit onto the correct branch and revert it on the original branch.',
      rationale: 'This avoids rewriting a branch other people may already use.',
      commands: [
        command('sha', 'git log -1 --oneline', 'Note the commit hash', 'Copy the short hash shown on the left.'),
        command('target', 'git switch correct-branch', 'Switch to the correct branch', 'Replace the example branch name.'),
        command('pick', 'git cherry-pick <commit-hash>', 'Copy the commit here', 'Paste the hash from the first command.', 'caution'),
        command('original', 'git switch original-branch', 'Return to the wrong branch', 'Replace the example branch name.'),
        command('revert', 'git revert <commit-hash>', 'Reverse it safely', 'Creates a new commit without rewriting shared history.'),
      ],
      effects: [
        { label: 'Correct branch', value: 'Gets commit', tone: 'positive' }, { label: 'Shared history', value: 'Preserved', tone: 'positive' },
        { label: 'Force push', value: 'Not needed', tone: 'positive' }, { label: 'Push required', value: 'Both branches' },
      ],
    },
  },
};

const emergency: RescueScenario = {
  id: 'emergency', title: 'I don’t know what I did', shortTitle: 'Emergency mode',
  description: 'Inspect the repository safely before making any more changes.', category: 'emergency',
  keywords: ['help', 'broken', 'panic', 'unknown', 'last action'], popular: true, emergency: true,
  startStepId: 'diagnose',
  steps: {
    diagnose: {
      id: 'diagnose', kind: 'question', eyebrow: 'No destructive commands',
      question: 'What best describes what you can still see?',
      helpText: 'If none match, choose “I’m still not sure” to gather a complete snapshot.',
      options: [
        { id: 'missing', label: 'A commit or branch disappeared', nextStepId: 'reflog' },
        { id: 'operation', label: 'Git says a merge or rebase is in progress', nextStepId: 'status' },
        { id: 'files', label: 'My files changed or disappeared', nextStepId: 'files' },
        { id: 'unsure', label: 'I’m still not sure', nextStepId: 'snapshot' },
      ],
    },
    status: {
      id: 'status', kind: 'result', title: 'Let Git identify the operation',
      summary: 'Read the status message before choosing abort, continue, or resolve.',
      rationale: 'Git status names the in-progress operation and gives context-specific next steps.',
      commands: [command('status', 'git status', 'Inspect the repository', 'This never modifies files or history.')],
      effects: standardEffects,
      notes: ['Search Git Rescue for the operation Git reports: merge, rebase, or cherry-pick.'],
    },
    files: {
      id: 'files', kind: 'result', title: 'Inspect changes without restoring anything yet',
      summary: 'See which tracked files differ and whether changes are staged.',
      rationale: 'Diff commands are read-only, so you can understand the damage before recovery.',
      commands: [
        command('status', 'git status --short', 'List changed files', 'Two columns distinguish staged and working-tree changes.'),
        command('diff', 'git diff', 'Inspect unstaged changes', 'Shows content changes without modifying them.'),
        command('cached', 'git diff --cached', 'Inspect staged changes', 'Shows what the next commit would contain.'),
      ],
      effects: standardEffects,
    },
    reflog: {
      id: 'reflog', kind: 'result', title: 'Find the missing pointer in the reflog',
      summary: 'Locate the last known-good commit and preserve it on a new branch.',
      rationale: 'Reflog records recent local HEAD movements even when a branch or commit seems gone.',
      commands: [
        command('reflog', 'git reflog --date=local', 'Review recent Git actions', 'Find the entry just before the mistake.'),
        command('recover', 'git switch -c recovered-work <commit-hash>', 'Preserve the recovered commit', 'Replace the placeholder with the hash you found.', 'caution'),
      ],
      effects: [{ label: 'Current branch', value: 'Untouched', tone: 'positive' }, { label: 'Recovered work', value: 'New branch' }],
    },
    snapshot: {
      id: 'snapshot', kind: 'result', title: 'Take a safe repository snapshot',
      summary: 'Gather status, recent history, and local pointer movements.',
      rationale: 'These read-only commands reveal most Git mistakes without changing anything.',
      commands: [
        command('status', 'git status', 'Check current state', 'Shows branch, staged files, conflicts, and operations.'),
        command('log', 'git log --oneline --decorate -10', 'Review recent commits', 'Shows ten commits and branch labels.'),
        command('reflog', 'git reflog -10', 'Review recent Git actions', 'Shows resets, checkouts, commits, rebases, and more.'),
      ],
      effects: standardEffects,
      notes: ['Do not run reset, clean, or force-push commands until you identify the last known-good state.'],
    },
  },
};

const scenarios: RescueScenario[] = [
  undoLastCommit,
  direct({
    id: 'modify-last-commit', title: 'Modify my last commit', shortTitle: 'Modify last commit',
    description: 'Change files in the latest local commit without creating a second commit.', category: 'commits',
    keywords: ['amend commit', 'edit last commit'], result: {
      title: 'Amend the latest local commit', summary: 'Stage the corrections, then replace the latest commit.',
      rationale: 'Amend creates a new commit ID, so use it only when the original commit has not been shared.',
      commands: [command('status', 'git status', 'Confirm the commit is local', 'If it was pushed, prefer a new fix commit.'), command('add', 'git add <files>', 'Stage your corrections', 'Replace the placeholder with the files to include.'), command('amend', 'git commit --amend --no-edit', 'Replace the commit', 'Keeps the existing message.', 'caution')],
      effects: [{ label: 'Commit content', value: 'Updated' }, { label: 'Commit ID', value: 'Changes', tone: 'warning' }, { label: 'Working changes', value: 'Included when staged' }, { label: 'Remote safe', value: 'Only if unpushed' }],
      beforeYouStart: ['If the commit is already shared, make a normal follow-up commit instead.'],
    },
  }),
  direct({
    id: 'amend-commit-message', title: 'Change my last commit message', shortTitle: 'Amend commit message',
    description: 'Correct the most recent local commit message.', category: 'commits', keywords: ['commit typo', 'message', 'rename commit'],
    result: { title: 'Rewrite the latest message', summary: 'Open the commit editor and replace only the message.', rationale: 'Amend changes the commit ID even when its files stay the same.',
      commands: [command('amend-message', 'git commit --amend', 'Edit the message', 'Save and close the editor when finished.', 'caution')],
      effects: [{ label: 'Files changed', value: 'No', tone: 'positive' }, { label: 'Commit ID', value: 'Changes', tone: 'warning' }, { label: 'Remote affected', value: 'No' }], beforeYouStart: ['Use this only for an unpushed commit. For a shared commit, leave the message as-is.'] },
  }),
  direct({
    id: 'forgot-files', title: 'I forgot files in my last commit', shortTitle: 'Add forgotten files',
    description: 'Add omitted files to the latest local commit.', category: 'commits', keywords: ['forgot file', 'add to last commit', 'amend'],
    result: { title: 'Stage the files and amend', summary: 'Add the missing files without changing the message.', rationale: 'The amended commit replaces the old local commit with the complete version.',
      commands: [command('add', 'git add <forgotten-files>', 'Stage the missing files', 'Use exact paths rather than git add . when possible.'), command('amend', 'git commit --amend --no-edit', 'Include them in the commit', 'Preserves the commit message.', 'caution')],
      effects: [{ label: 'Forgotten files', value: 'Included', tone: 'positive' }, { label: 'Commit ID', value: 'Changes' }, { label: 'Remote safe', value: 'Only if unpushed' }], beforeYouStart: ['If the commit was pushed, create a new commit instead of amending shared history.'] },
  }),
  wrongBranch,
  direct({
    id: 'undo-older-commit', title: 'Undo an older commit', shortTitle: 'Undo older commit', description: 'Reverse an earlier commit without removing later work.',
    category: 'commits', keywords: ['old commit', 'revert sha', 'undo earlier'], result: { title: 'Revert the specific commit', summary: 'Create a new commit that applies the inverse of the selected commit.', rationale: 'Revert preserves everything that came after it and is safe for shared branches.',
      commands: [command('log', 'git log --oneline', 'Find the commit hash', 'Identify the exact commit to reverse.'), command('revert', 'git revert <commit-hash>', 'Reverse that commit', 'Resolve conflicts if later changes overlap it.', 'caution')], effects: [{ label: 'Later commits', value: 'Preserved', tone: 'positive' }, { label: 'History rewritten', value: 'No', tone: 'positive' }, { label: 'New commit', value: 'Created' }] },
  }),
  direct({
    id: 'revert-pushed-commit', title: 'Revert a pushed commit', shortTitle: 'Revert pushed commit', description: 'Safely reverse a commit already on a shared remote.',
    category: 'pushes', keywords: ['pushed commit', 'shared commit', 'undo remote'], popular: true, result: { title: 'Create and push a revert commit', summary: 'Reverse the change while preserving shared history.', rationale: 'A normal revert keeps teammates’ clones compatible and needs no force push.',
      commands: [command('revert', 'git revert <commit-hash>', 'Create the revert', 'Review and save the generated commit message.'), command('push', 'git push', 'Share the revert', 'Push the new commit normally.')], effects: [{ label: 'Shared history', value: 'Preserved', tone: 'positive' }, { label: 'Force push', value: 'Not needed', tone: 'positive' }, { label: 'Original commit', value: 'Still visible' }] },
  }),

  direct({ id: 'unstage-one-file', title: 'Unstage one file', shortTitle: 'Unstage one file', description: 'Remove one file from the next commit while keeping its edits.', category: 'staging', keywords: ['unstage file', 'staged wrong file', 'restore staged'], popular: true, result: {
    title: 'Move the file out of the staging area', summary: 'Keep the file’s contents but exclude it from the next commit.', rationale: 'git restore --staged changes only the index, not your working copy.', commands: [command('unstage', 'git restore --staged <file>', 'Unstage the file', 'Replace the placeholder with the exact path.')], effects: [{ label: 'File edits', value: 'Preserved', tone: 'positive' }, { label: 'File staged', value: 'No' }, { label: 'History changed', value: 'No', tone: 'positive' }] }, }),
  direct({ id: 'unstage-everything', title: 'Unstage everything', shortTitle: 'Unstage all files', description: 'Clear the staging area without losing working changes.', category: 'staging', keywords: ['unstage all', 'reset index', 'staged everything'], result: {
    title: 'Clear the staging area', summary: 'Return every staged change to the working tree.', rationale: 'The two-dot pathspec targets all paths while leaving file contents untouched.', commands: [command('unstage-all', 'git restore --staged :/', 'Unstage all tracked paths', 'Run from anywhere inside the repository.')], effects: [{ label: 'Working changes', value: 'Preserved', tone: 'positive' }, { label: 'Staging area', value: 'Cleared' }, { label: 'History changed', value: 'No', tone: 'positive' }] }, }),
  direct({ id: 'restore-staged-version', title: 'Restore a file to its staged version', shortTitle: 'Restore staged version', description: 'Discard unstaged edits while keeping what is already staged.', category: 'staging', keywords: ['restore index version', 'discard unstaged'], result: {
    title: 'Restore from the index', summary: 'Replace the working copy with the version currently staged.', rationale: 'Without --staged, git restore uses the index as the source by default.', commands: [command('diff', 'git diff -- <file>', 'Review what will be lost', 'This preview is read-only.'), command('restore', 'git restore <file>', 'Discard only unstaged edits', 'The staged version remains in the index.', 'dangerous', 'Unstaged edits to this file will be permanently removed.')], effects: [{ label: 'Staged changes', value: 'Preserved', tone: 'positive' }, { label: 'Unstaged changes', value: 'Discarded', tone: 'warning' }] }, }),
  direct({ id: 'remove-accidentally-staged-file', title: 'Remove an accidentally staged file', shortTitle: 'Remove staged file', description: 'Unstage a file you did not mean to include.', category: 'staging', keywords: ['wrong file staged', 'remove from index'], result: {
    title: 'Unstage it without deleting it', summary: 'The file stays exactly where it is in your working tree.', rationale: 'Only the index entry is reset to HEAD.', commands: [command('unstage', 'git restore --staged <file>', 'Remove it from the next commit', 'Use the exact path shown by git status.')], effects: [{ label: 'Local file', value: 'Kept', tone: 'positive' }, { label: 'Next commit', value: 'Excluded' }, { label: 'History changed', value: 'No', tone: 'positive' }] }, }),

  direct({ id: 'restore-deleted-file', title: 'Restore a deleted file', shortTitle: 'Restore deleted file', description: 'Bring back a tracked file deleted from the working tree.', category: 'files', keywords: ['deleted file', 'restore file', 'missing file'], popular: true, result: {
    title: 'Restore the file from HEAD', summary: 'Recreate the tracked file from your current commit.', rationale: 'The committed copy is still available unless the deletion was committed.', commands: [command('status', 'git status --short', 'Confirm the deletion', 'Look for a D beside the path.'), command('restore', 'git restore <file>', 'Restore the file', 'Replace the placeholder with the deleted path.')], effects: [{ label: 'Deleted file', value: 'Restored', tone: 'positive' }, { label: 'Other files', value: 'Untouched', tone: 'positive' }, { label: 'History changed', value: 'No' }] }, }),
  direct({ id: 'restore-modified-file', title: 'Restore a modified file', shortTitle: 'Discard file changes', description: 'Return one tracked file to its committed state.', category: 'files', keywords: ['discard file changes', 'restore modified'], result: {
    title: 'Review, then restore the file', summary: 'Discard only this file’s unstaged edits.', rationale: 'The diff lets you verify the loss before restoring from the index.', commands: [command('diff', 'git diff -- <file>', 'Review the edits', 'This does not change the file.'), command('restore', 'git restore <file>', 'Restore the file', 'Replaces unstaged contents.', 'dangerous', 'Uncommitted edits in this file will be permanently deleted.')], effects: [{ label: 'Selected file', value: 'Restored' }, { label: 'Unstaged edits', value: 'Deleted', tone: 'warning' }, { label: 'Other files', value: 'Untouched', tone: 'positive' }] }, }),
  direct({ id: 'recover-file-from-commit', title: 'Recover a file from a previous commit', shortTitle: 'Recover old file version', description: 'Restore one path from an earlier known-good commit.', category: 'files', keywords: ['old file', 'previous version', 'checkout file'], result: {
    title: 'Restore the path from a chosen commit', summary: 'Copy an older version into your working tree and review it before committing.', rationale: 'The modern git restore syntax makes the source commit explicit.', commands: [command('history', 'git log --oneline -- <file>', 'Find a good commit', 'Shows only commits that touched the file.'), command('restore', 'git restore --source=<commit-hash> -- <file>', 'Restore that version', 'The recovered file remains uncommitted.', 'caution')], effects: [{ label: 'Current branch', value: 'Untouched', tone: 'positive' }, { label: 'File content', value: 'Recovered' }, { label: 'Commit created', value: 'No' }] }, }),
  direct({ id: 'untrack-keep-local', title: 'Remove a file from Git but keep it locally', shortTitle: 'Untrack a local file', description: 'Stop tracking a generated or private file without deleting your local copy.', category: 'files', keywords: ['rm cached', 'keep local', 'gitignore'], result: {
    title: 'Ignore it, then remove only the index copy', summary: 'Keep the file on disk and prevent it being staged again.', rationale: 'git rm --cached removes the tracked entry but leaves the working file.', commands: [command('ignore', 'printf "<file>\\n" >> .gitignore', 'Add the path to .gitignore', 'Edit .gitignore manually if you prefer.'), command('untrack', 'git rm --cached <file>', 'Remove it from Git’s index', 'The local file stays on disk.', 'caution'), command('commit', 'git commit -m "Stop tracking <file>"', 'Record the change', 'Commit both .gitignore and the index removal.')], effects: [{ label: 'Local file', value: 'Kept', tone: 'positive' }, { label: 'Git tracking', value: 'Stopped' }, { label: 'History copy', value: 'Still exists', tone: 'warning' }] }, }),

  direct({ id: 'recover-deleted-branch', title: 'Recover a deleted branch', shortTitle: 'Recover deleted branch', description: 'Find the branch tip in reflog and recreate the branch pointer.', category: 'branches', keywords: ['deleted branch', 'branch gone', 'reflog branch'], popular: true, result: {
    title: 'Find the tip and recreate the branch', summary: 'Use reflog to locate the commit, then create a new branch there.', rationale: 'Deleting a branch removes a label, not usually the commits it pointed to.', commands: [command('reflog', 'git reflog --all --date=local', 'Find the branch tip', 'Look for the latest commit that belonged to the deleted branch.'), command('recover', 'git switch -c recovered-branch <commit-hash>', 'Recreate the branch', 'Use a new name until you verify the contents.', 'caution')], effects: [{ label: 'Existing branches', value: 'Untouched', tone: 'positive' }, { label: 'Recovered commit', value: 'New branch' }, { label: 'Remote affected', value: 'No' }] }, }),
  direct({ id: 'rename-branch', title: 'Rename a branch', shortTitle: 'Rename branch', description: 'Rename the current branch locally and publish the new name if needed.', category: 'branches', keywords: ['branch name', 'rename main'], result: {
    title: 'Rename locally first', summary: 'Change the branch label without changing its commits.', rationale: 'Branch renaming is safe locally; remote cleanup is a separate, visible step.', commands: [command('rename', 'git branch -m new-name', 'Rename the current branch', 'Replace new-name with the intended name.'), command('publish', 'git push -u origin new-name', 'Publish and set upstream', 'Skip this if the branch is local-only.'), command('delete-old', 'git push origin --delete old-name', 'Optionally remove the old remote name', 'Only after verifying the new branch exists remotely.', 'caution')], effects: [{ label: 'Commits', value: 'Unchanged', tone: 'positive' }, { label: 'Local branch', value: 'Renamed' }, { label: 'Old remote branch', value: 'Optional removal' }] }, }),
  direct({ id: 'detached-head', title: 'Recover from detached HEAD', shortTitle: 'Detached HEAD recovery', description: 'Preserve commits made without a branch.', category: 'branches', keywords: ['detached head', 'not on branch', 'head detached'], result: {
    title: 'Attach the current commit to a new branch', summary: 'Create a branch exactly where detached HEAD is pointing.', rationale: 'The new branch name prevents the commits from becoming hard to find later.', commands: [command('status', 'git status', 'Confirm detached HEAD', 'Look for “HEAD detached at”.'), command('branch', 'git switch -c recovered-work', 'Create and switch to a branch', 'All current commits are preserved.')], effects: [{ label: 'Current commits', value: 'Preserved', tone: 'positive' }, { label: 'HEAD state', value: 'Attached' }, { label: 'Existing branches', value: 'Untouched' }] }, }),
  direct({ id: 'restore-branch-reflog', title: 'Restore a branch using reflog', shortTitle: 'Restore branch with reflog', description: 'Move a damaged branch back to a known-good local point.', category: 'branches', keywords: ['restore branch', 'reflog reset', 'branch pointer'], result: {
    title: 'Preserve both states before moving anything', summary: 'Create recovery branches at the current and known-good commits.', rationale: 'Named branches make both states easy to inspect before you decide what to merge or reset.', commands: [command('current', 'git branch before-recovery', 'Save the current state', 'Creates a safety pointer.'), command('reflog', 'git reflog --date=local', 'Find the good commit', 'Choose the entry before the mistake.'), command('good', 'git branch recovered-state <commit-hash>', 'Preserve the good state', 'Inspect this branch before changing the original.')], effects: [{ label: 'Current state', value: 'Backed up', tone: 'positive' }, { label: 'Good state', value: 'New branch' }, { label: 'Original branch moved', value: 'No', tone: 'positive' }] }, }),
  direct({ id: 'move-commits', title: 'Move commits to another branch', shortTitle: 'Move commits', description: 'Copy selected commits onto the intended branch, then safely clean up.', category: 'branches', keywords: ['move commits', 'cherry pick branch'], result: {
    title: 'Cherry-pick onto the destination', summary: 'Copy the exact commits in oldest-to-newest order.', rationale: 'Cherry-pick makes the destination change explicit and keeps the source recoverable.', commands: [command('log', 'git log --oneline source-branch', 'Collect commit hashes', 'List them oldest to newest.'), command('switch', 'git switch destination-branch', 'Open the destination branch', 'Make sure it is up to date.'), command('pick', 'git cherry-pick <oldest-hash>^..<newest-hash>', 'Copy a contiguous range', 'Use individual hashes if the commits are not contiguous.', 'caution')], effects: [{ label: 'Destination', value: 'Gets new commits' }, { label: 'Source', value: 'Still preserved', tone: 'positive' }, { label: 'Conflicts possible', value: 'Yes' }] }, }),

  direct({ id: 'abort-merge', title: 'Abort a merge', shortTitle: 'Abort merge', description: 'Return to the state before an in-progress merge.', category: 'merges', keywords: ['abort merge', 'cancel merge', 'merge head'], popular: true, result: {
    title: 'Abort the in-progress merge', summary: 'Ask Git to reconstruct the pre-merge state.', rationale: 'git merge --abort is the purpose-built recovery command for an unfinished merge.', commands: [command('status', 'git status', 'Confirm a merge is active', 'Git will say you have unmerged paths.'), command('abort', 'git merge --abort', 'Return to the pre-merge state', 'This does not remove earlier commits.', 'caution')], effects: [{ label: 'Merge commit', value: 'Not created' }, { label: 'Pre-merge state', value: 'Restored', tone: 'positive' }, { label: 'Earlier work', value: 'Preserved' }], notes: ['If abort refuses because files changed after the merge began, save copies of those files before taking further action.'] }, }),
  direct({ id: 'merge-conflicts', title: 'Fix merge conflicts', shortTitle: 'Resolve merge conflicts', description: 'Resolve an in-progress merge one file at a time.', category: 'merges', keywords: ['merge conflict', 'unmerged paths', 'conflict markers'], popular: true, result: {
    title: 'Resolve, stage, and finish', summary: 'Edit each conflicted file, remove markers, then stage the resolved version.', rationale: 'Git considers a conflict resolved only after you stage the result.', commands: [command('status', 'git status', 'List conflicted files', 'Look under unmerged paths.'), command('diff', 'git diff --name-only --diff-filter=U', 'Show only unresolved paths', 'Read-only list.'), command('stage', 'git add <resolved-files>', 'Mark files resolved', 'Stage only after reviewing the full file.'), command('finish', 'git commit', 'Complete the merge', 'Git supplies a merge message.')], effects: [{ label: 'Your edits', value: 'Preserved when staged' }, { label: 'Merge', value: 'Completed' }, { label: 'History rewritten', value: 'No', tone: 'positive' }], beforeYouStart: ['Conflict markers are <<<<<<<, =======, and >>>>>>>. Remove all three marker lines after choosing the correct content.'] }, }),
  direct({ id: 'revert-merge-commit', title: 'Revert a merged commit', shortTitle: 'Revert merge commit', description: 'Undo a completed merge on a shared branch.', category: 'merges', keywords: ['undo merge commit', 'revert merge', 'mainline'], result: {
    title: 'Revert the merge using its mainline parent', summary: 'Create a new commit that reverses the merged changes.', rationale: 'For a typical feature merge, parent 1 is the branch you merged into.', commands: [command('inspect', 'git show --no-patch --pretty=%P <merge-hash>', 'Inspect the two parents', 'Verify which parent is the mainline.'), command('revert', 'git revert -m 1 <merge-hash>', 'Revert the merge', 'Use -m 1 only after confirming parent 1 is correct.', 'caution')], effects: [{ label: 'Shared history', value: 'Preserved', tone: 'positive' }, { label: 'Merge changes', value: 'Reversed' }, { label: 'Future re-merge', value: 'Needs planning', tone: 'warning' }], notes: ['Reverting a merge tells Git those changes were already integrated; re-merging the same branch later may not restore them automatically.'] }, }),
  direct({ id: 'recover-bad-merge', title: 'Recover from a bad merge', shortTitle: 'Recover bad merge', description: 'Safely reverse an unwanted completed merge.', category: 'merges', keywords: ['bad merge', 'undo merged pull request'], result: {
    title: 'Preserve history with a merge revert', summary: 'Identify the merge commit and revert it instead of resetting a shared branch.', rationale: 'This produces an auditable fix and avoids forcing collaborators to reconcile rewritten history.', commands: [command('merges', 'git log --oneline --merges -10', 'Find the merge hash', 'Confirm its subject and date.'), command('revert', 'git revert -m 1 <merge-hash>', 'Reverse the merge', 'Confirm parent 1 represents the branch that received the merge.', 'caution')], effects: [{ label: 'Remote history', value: 'Preserved', tone: 'positive' }, { label: 'New revert commit', value: 'Created' }, { label: 'Force push', value: 'Not needed', tone: 'positive' }] }, }),

  direct({ id: 'abort-rebase', title: 'Abort a rebase', shortTitle: 'Abort rebase', description: 'Return to the branch state from before an in-progress rebase.', category: 'rebase', keywords: ['abort rebase', 'cancel rebase'], popular: true, result: {
    title: 'Abort the in-progress rebase', summary: 'Restore the original branch tip and working state.', rationale: 'The rebase metadata still records where the operation began.', commands: [command('status', 'git status', 'Confirm a rebase is active', 'Git names the current rebase step.'), command('abort', 'git rebase --abort', 'Return to the original state', 'Stops the rebase.', 'caution')], effects: [{ label: 'Original branch', value: 'Restored', tone: 'positive' }, { label: 'Rebased commits', value: 'Discarded' }, { label: 'Remote affected', value: 'No' }] }, }),
  direct({ id: 'continue-rebase', title: 'Continue a rebase', shortTitle: 'Continue rebase', description: 'Resume after resolving the current conflict.', category: 'rebase', keywords: ['continue rebase', 'rebase conflict'], result: {
    title: 'Stage resolutions and continue', summary: 'Resolve every listed conflict before advancing.', rationale: 'The rebase pauses again if a later commit also conflicts.', commands: [command('status', 'git status', 'See the current conflict', 'Review the rebase instructions.'), command('stage', 'git add <resolved-files>', 'Mark conflicts resolved', 'Review files before staging.'), command('continue', 'git rebase --continue', 'Apply the next commit', 'Repeat if Git finds another conflict.', 'caution')], effects: [{ label: 'Resolved changes', value: 'Preserved' }, { label: 'Commit IDs', value: 'Rewritten', tone: 'warning' }, { label: 'Remote affected', value: 'No until pushed' }] }, }),
  direct({ id: 'skip-rebase-commit', title: 'Skip a conflicting rebase commit', shortTitle: 'Skip rebase commit', description: 'Omit the current commit from an in-progress rebase.', category: 'rebase', keywords: ['rebase skip', 'drop commit'], result: {
    title: 'Inspect before skipping', summary: 'Skip only when the current commit is truly unnecessary or already applied.', rationale: 'Skipping drops that commit’s patch from the rebased result.', commands: [command('show', 'git rebase --show-current-patch', 'Review what would be dropped', 'This is read-only.'), command('skip', 'git rebase --skip', 'Omit the current commit', 'Continues with the next commit.', 'dangerous', 'The skipped commit’s changes will not appear in the rebased branch.')], effects: [{ label: 'Current patch', value: 'Dropped', tone: 'warning' }, { label: 'Rebase', value: 'Continues' }, { label: 'Recovery', value: 'Possible via reflog' }] }, }),
  direct({ id: 'undo-completed-rebase', title: 'Undo a completed bad rebase', shortTitle: 'Undo completed rebase', description: 'Recover the branch state from before a local rebase.', category: 'rebase', keywords: ['bad rebase', 'reflog rebase', 'undo rebase'], popular: true, result: {
    title: 'Recover the pre-rebase tip on a new branch', summary: 'Use reflog to find the rebase start, then preserve it before changing anything.', rationale: 'A separate branch lets you compare old and rebased histories without destroying either.', commands: [command('reflog', 'git reflog --date=local', 'Find “rebase (start)”', 'The entry immediately before it is usually the old tip.'), command('recover', 'git switch -c before-rebase <commit-hash>', 'Preserve the original history', 'Inspect and compare this branch first.', 'caution')], effects: [{ label: 'Rebased branch', value: 'Untouched', tone: 'positive' }, { label: 'Original history', value: 'Recovered branch' }, { label: 'Force push', value: 'Not performed', tone: 'positive' }] }, }),

  direct({ id: 'abort-cherry-pick', title: 'Abort a cherry-pick', shortTitle: 'Abort cherry-pick', description: 'Cancel an in-progress cherry-pick and restore the prior state.', category: 'cherry-pick', keywords: ['cancel cherry pick', 'abort cherry-pick'], result: {
    title: 'Abort the cherry-pick', summary: 'Return to the branch state before the operation began.', rationale: 'Git’s abort command uses its sequencer state to restore the branch.', commands: [command('abort', 'git cherry-pick --abort', 'Cancel the operation', 'Works while a cherry-pick is in progress.', 'caution')], effects: [{ label: 'Original branch', value: 'Restored', tone: 'positive' }, { label: 'Cherry-picked changes', value: 'Removed' }, { label: 'Remote affected', value: 'No' }] }, }),
  direct({ id: 'continue-cherry-pick', title: 'Continue a cherry-pick', shortTitle: 'Continue cherry-pick', description: 'Finish copying a commit after resolving conflicts.', category: 'cherry-pick', keywords: ['cherry-pick conflict', 'continue cherry pick'], result: {
    title: 'Resolve, stage, and continue', summary: 'Mark every conflict resolved, then let Git finish the commit.', rationale: 'Staging records the exact resolution to use for the copied commit.', commands: [command('status', 'git status', 'List conflicts', 'Review every unmerged path.'), command('stage', 'git add <resolved-files>', 'Stage the resolutions', 'Inspect each file first.'), command('continue', 'git cherry-pick --continue', 'Finish the operation', 'Creates the cherry-picked commit.', 'caution')], effects: [{ label: 'Conflict resolution', value: 'Included' }, { label: 'New commit', value: 'Created' }, { label: 'Source branch', value: 'Untouched' }] }, }),
  direct({ id: 'undo-cherry-picked-commit', title: 'Undo a cherry-picked commit', shortTitle: 'Undo cherry-pick', description: 'Reverse a completed cherry-picked commit.', category: 'cherry-pick', keywords: ['undo cherry pick', 'revert cherry-picked'], result: {
    title: 'Revert the copied commit', summary: 'Create a new commit that reverses the cherry-pick.', rationale: 'Revert is safe whether or not the cherry-pick has already been pushed.', commands: [command('log', 'git log -5 --oneline', 'Confirm the copied commit hash', 'Check the latest commits.'), command('revert', 'git revert <cherry-picked-hash>', 'Reverse the commit', 'Creates a normal revert commit.')], effects: [{ label: 'History rewritten', value: 'No', tone: 'positive' }, { label: 'Copied change', value: 'Reversed' }, { label: 'Remote safe', value: 'Yes', tone: 'positive' }] }, }),

  direct({ id: 'pushed-wrong-commit', title: 'I pushed the wrong commit', shortTitle: 'Pushed wrong commit', description: 'Reverse an accidental remote commit without rewriting shared history.', category: 'pushes', keywords: ['wrong push', 'accidental push'], result: {
    title: 'Revert it and push the fix', summary: 'Create an inverse commit locally, review it, then push normally.', rationale: 'A revert is visible, auditable, and does not disrupt teammates.', commands: [command('revert', 'git revert <commit-hash>', 'Create the inverse commit', 'Use the hash of the accidental commit.'), command('show', 'git show --stat HEAD', 'Review the result', 'Confirm the expected files were reversed.'), command('push', 'git push', 'Publish the fix', 'No force flag needed.')], effects: [{ label: 'Shared history', value: 'Preserved', tone: 'positive' }, { label: 'Accidental change', value: 'Reversed' }, { label: 'Force push', value: 'Not needed', tone: 'positive' }] }, }),
  direct({ id: 'pushed-wrong-branch', title: 'I pushed to the wrong branch', shortTitle: 'Pushed wrong branch', description: 'Copy work to the intended branch and reverse it on the shared source branch.', category: 'pushes', keywords: ['push wrong branch', 'pushed to main'], result: {
    title: 'Copy, then revert', summary: 'Cherry-pick onto the correct branch before reverting the wrong branch.', rationale: 'This preserves both remote histories and avoids a force push.', commands: [command('hash', 'git log -1 --oneline wrong-branch', 'Copy the commit hash', 'Confirm it is the accidental commit.'), command('target', 'git switch correct-branch', 'Switch to the intended branch', 'Update it before cherry-picking.'), command('pick', 'git cherry-pick <commit-hash>', 'Copy the commit', 'Resolve any conflicts.', 'caution'), command('wrong', 'git switch wrong-branch', 'Return to the wrong branch', 'Use its real name.'), command('revert', 'git revert <commit-hash>', 'Reverse the shared commit', 'Push both branches normally.')], effects: [{ label: 'Correct branch', value: 'Gets change', tone: 'positive' }, { label: 'Wrong branch', value: 'Gets revert' }, { label: 'History rewritten', value: 'No', tone: 'positive' }] }, }),
  direct({ id: 'remove-pushed-commit', title: 'Remove a pushed commit safely', shortTitle: 'Remove pushed commit', description: 'Neutralize a remote commit without changing published history.', category: 'pushes', keywords: ['remove remote commit', 'safe undo pushed'], result: {
    title: 'Revert instead of reset', summary: 'Add a new commit that cancels the pushed change.', rationale: 'The original remains in history, but collaborators do not need to repair their branches.', commands: [command('revert', 'git revert <commit-hash>', 'Create a safe reversal', 'Review the generated diff.'), command('push', 'git push', 'Publish the reversal', 'Uses a normal fast-forward push.')], effects: [{ label: 'Published history', value: 'Preserved', tone: 'positive' }, { label: 'Content change', value: 'Reversed' }, { label: 'Original object', value: 'Still in history' }] }, }),
  direct({ id: 'force-with-lease', title: 'Understand force-with-lease', shortTitle: 'Force-with-lease guide', description: 'Use the safer force option only when rewriting a private branch is unavoidable.', category: 'pushes', keywords: ['force push', 'force-with-lease', 'rewrite remote'], result: {
    title: 'Refresh first, then use a guarded force push', summary: 'force-with-lease refuses if the remote changed since your last fetch.', rationale: 'It reduces the risk of overwriting someone else’s new commits, but still rewrites remote history.', commands: [command('fetch', 'git fetch origin', 'Refresh remote state', 'Updates your remote-tracking refs safely.'), command('lease', 'git push --force-with-lease', 'Push rewritten history with a guard', 'Use only on a branch whose collaborators have agreed.', 'dangerous', 'This rewrites remote history and can still disrupt anyone using the branch.')], effects: [{ label: 'Remote history', value: 'Rewritten', tone: 'warning' }, { label: 'Concurrent remote work', value: 'Guarded' }, { label: 'Shared branches', value: 'Avoid', tone: 'warning' }], beforeYouStart: ['Confirm the branch is private or coordinate with every collaborator.', 'Never substitute --force; it removes the remote-change guard.'] }, }),

  direct({ id: 'recover-reset-soft', title: 'Recover from git reset --soft', shortTitle: 'Recover soft reset', description: 'Restore the branch pointer after an accidental soft reset.', category: 'reset', keywords: ['reset soft', 'orig_head', 'commit disappeared'], result: {
    title: 'Move the branch back to ORIG_HEAD', summary: 'Restore the pre-reset commit while leaving staged contents intact.', rationale: 'Git records the old branch tip in ORIG_HEAD for recent history-moving operations.', commands: [command('inspect', 'git show --summary ORIG_HEAD', 'Verify the old tip', 'Confirm the commit message and date.'), command('restore', 'git reset --soft ORIG_HEAD', 'Restore the branch pointer', 'The index and working tree remain untouched.', 'caution')], effects: [{ label: 'Commit', value: 'Restored' }, { label: 'Staged changes', value: 'Preserved', tone: 'positive' }, { label: 'Working files', value: 'Untouched', tone: 'positive' }] }, }),
  direct({ id: 'recover-reset-mixed', title: 'Recover from git reset --mixed', shortTitle: 'Recover mixed reset', description: 'Find the pre-reset commit without risking current working changes.', category: 'reset', keywords: ['reset mixed', 'unstaged after reset'], result: {
    title: 'Preserve the old commit on a recovery branch', summary: 'Verify ORIG_HEAD, then name it without changing current files.', rationale: 'A new branch recovers the commit while leaving your current index and working tree alone.', commands: [command('inspect', 'git show --summary ORIG_HEAD', 'Verify the pre-reset tip', 'Confirm it is the commit you want.'), command('branch', 'git branch recovered-before-reset ORIG_HEAD', 'Preserve it on a branch', 'Switch later after saving current work.')], effects: [{ label: 'Lost commit', value: 'Recovered', tone: 'positive' }, { label: 'Current files', value: 'Untouched', tone: 'positive' }, { label: 'Original branch', value: 'Unchanged' }] }, }),
  direct({ id: 'recover-reset-hard', title: 'Recover from git reset --hard', shortTitle: 'Recover hard reset', description: 'Use reflog to recover commits after a destructive reset.', category: 'reset', keywords: ['reset hard', 'lost commit', 'recover hard reset'], popular: true, result: {
    title: 'Recover reachable commits with reflog', summary: 'Find the entry before the reset and preserve it on a new branch.', rationale: 'Committed work is usually still recoverable from reflog; never promise the same for uncommitted changes.', commands: [command('reflog', 'git reflog --date=local', 'Find the pre-reset commit', 'Look for the entry immediately before “reset: moving to”.'), command('recover', 'git switch -c recovered-after-reset <commit-hash>', 'Create a recovery branch', 'Inspect it before merging anything back.', 'caution')], effects: [{ label: 'Committed work', value: 'Usually recoverable', tone: 'positive' }, { label: 'Uncommitted work', value: 'May be unrecoverable', tone: 'warning' }, { label: 'Current branch', value: 'Untouched' }], notes: ['Git cannot reliably restore uncommitted working-tree changes erased by reset --hard. Check editor history, backups, or filesystem snapshots.'] }, }),
  direct({ id: 'reflog-recovery', title: 'Recover a deleted commit with reflog', shortTitle: 'Recover with reflog', description: 'Find a lost local commit and attach a new branch to it.', category: 'reset', keywords: ['reflog', 'deleted commit', 'lost commit', 'head@'], popular: true, result: {
    title: 'Let reflog lead you back', summary: 'Locate the commit hash from before the mistake, then create a branch there.', rationale: 'Reflog records recent local pointer changes that normal log may no longer show.', commands: [command('reflog', 'git reflog --date=local', 'Inspect local history', 'Find the commit message or action before the mistake.'), command('show', 'git show --stat <commit-hash>', 'Verify the candidate', 'Read-only inspection.'), command('recover', 'git switch -c recovered-work <commit-hash>', 'Preserve the commit', 'A new branch is safer than immediately resetting.', 'caution')], effects: [{ label: 'Current branch', value: 'Untouched', tone: 'positive' }, { label: 'Lost commit', value: 'Named again' }, { label: 'Remote affected', value: 'No' }], notes: ['Reflog is local to this clone and entries eventually expire. Act promptly, but inspect carefully.'] }, }),

  direct({ id: 'branch-ahead-behind', title: 'My local branch is ahead or behind', shortTitle: 'Branch ahead or behind', description: 'Understand divergence and update without discarding local commits.', category: 'branches', keywords: ['ahead behind', 'diverged', 'pull', 'remote branch', 'sync branch'], result: {
    title: 'Fetch first, then inspect the difference', summary: 'Refresh remote references without merging, then compare both directions.', rationale: 'Fetch is non-destructive and gives you accurate information before you choose merge or rebase.', commands: [command('fetch', 'git fetch origin', 'Refresh remote references', 'Downloads remote history without changing your branch.'), command('ahead', 'git log --oneline @{u}..HEAD', 'Show your local-only commits', 'These are the commits you are ahead by.'), command('behind', 'git log --oneline HEAD..@{u}', 'Show remote-only commits', 'These are the commits you are behind by.'), command('merge', 'git merge @{u}', 'Integrate the remote commits', 'Use this conservative option when both lists contain commits.', 'caution')], effects: [{ label: 'Local commits', value: 'Preserved', tone: 'positive' }, { label: 'Remote commits', value: 'Integrated' }, { label: 'History rewritten', value: 'No', tone: 'positive' }], notes: ['If your team explicitly prefers rebase and your local commits are private, git rebase @{u} is an alternative.'] }, }),

  direct({ id: 'sensitive-file', title: 'I committed a sensitive file', shortTitle: 'Sensitive file committed', description: 'Contain exposed credentials and stop tracking the file.', category: 'security', keywords: ['env', 'secret', 'password', 'api key', 'credentials'], popular: true, result: {
    title: 'Rotate the secret first', summary: 'Assume every committed credential is exposed—even if the commit was never pushed.', rationale: 'Removing the file in a later commit does not erase earlier Git objects, caches, forks, or logs.', commands: [command('ignore', 'printf ".env\\n" >> .gitignore', 'Ignore the file going forward', 'Edit the path if the sensitive file has another name.'), command('untrack', 'git rm --cached .env', 'Stop tracking it', 'Keeps the local .env file.', 'caution'), command('commit', 'git commit -m "Stop tracking sensitive configuration"', 'Record the removal', 'This does not purge old history.')], effects: [{ label: 'Credential security', value: 'Requires rotation', tone: 'warning' }, { label: 'Local file', value: 'Kept' }, { label: 'Future commits', value: 'Ignored' }, { label: 'Old history', value: 'Still contains file', tone: 'warning' }], beforeYouStart: ['Revoke or rotate every exposed password, token, and key at its provider immediately.', 'If pushed, notify the repository owner and follow the host’s documented sensitive-data removal process.'], notes: ['History rewriting is coordination-heavy and does not make an exposed credential safe again. Rotation is mandatory.'] }, }),
  emergency,
];

export const rescueScenarios: readonly RescueScenario[] = scenarios;

export const scenarioCategories: ReadonlyArray<{ id: ScenarioCategory; label: string }> = [
  { id: 'commits', label: 'Commits' }, { id: 'staging', label: 'Staging' }, { id: 'files', label: 'Files' },
  { id: 'branches', label: 'Branches' }, { id: 'merges', label: 'Merges' }, { id: 'rebase', label: 'Rebase' },
  { id: 'cherry-pick', label: 'Cherry-pick' }, { id: 'pushes', label: 'Pushes' }, { id: 'reset', label: 'Reset & reflog' },
  { id: 'security', label: 'Sensitive files' }, { id: 'emergency', label: 'Emergency' },
];

export function getScenario(id: string): RescueScenario | undefined {
  return rescueScenarios.find((scenario) => scenario.id === id);
}
