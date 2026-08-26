# Git Rescue

Git Rescue is a focused, safety-first web app that helps developers recover from common Git mistakes. It asks only the questions that change the answer, then provides copyable commands, plain-language explanations, visible risk levels, and safer alternatives.

No login, repository access, database, backend, or external API is required. All decision logic runs in the browser.

## Features

- Deterministic recovery flows for commits, staging, files, branches, merges, rebases, cherry-picks, pushes, resets, and exposed secrets
- Branching questions for context-sensitive recovery, including pushed vs local commits
- Dedicated reflog recovery and “I don’t know what I did” emergency mode
- Searchable local scenario catalog with shareable `/rescue/[scenario]` URLs
- Copyable terminal commands with transient copy feedback
- `safe`, `caution`, and `dangerous` command classifications
- Explicit acknowledgements before dangerous commands can be copied
- Light and dark themes with system-default detection and local preference persistence
- Compact Git command reference and command comparisons
- Responsive and keyboard-accessible interface

## Screenshots

Screenshots can be added here after the final visual review:

- `docs/screenshots/home-light.png`
- `docs/screenshots/rescue-flow-dark.png`
- `docs/screenshots/mobile-result.png`

## Tech stack

- Next.js 16 with the App Router
- React 19 and strict TypeScript
- Tailwind CSS 4 foundation with a custom monochrome design system
- Lucide React icons
- Framer Motion for short question/result transitions
- Vitest for the rescue engine

## Installation

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm test
npm run typecheck
npm run lint
```

## Build

```bash
npm run build
npm start
```

The project uses standard Next.js build commands and is ready to import into Vercel. Nothing in the repository performs deployment automatically.

## Project structure

```text
src/
  app/                       Routes, metadata, and global styles
    rescue/[slug]/           Shareable rescue result flows
  components/
    commands/                Command blocks and safety badges
    layout/                  Header and footer
    rescue/                  Search/picker and decision flow UI
    ui/                      Theme preference control
  data/
    rescue-flows.ts          Scenario decision trees and recovery content
    git-scenarios.ts         Command reference and comparisons
  lib/
    rescue-engine.ts         Pure decision-tree navigation
    rescue-engine.test.ts    Engine and flow-integrity tests
  types/
    rescue.ts                Shared flow schema
```

## How rescue flows work

Each scenario declares a `startStepId` and a map of steps. A step is either:

- a question with options pointing to the next step; or
- a result containing commands, effects, warnings, and explanatory notes.

The engine in `src/lib/rescue-engine.ts` is intentionally independent of React. It starts flows, validates transitions, moves backward, restarts, and derives the highest safety level of a result.

## Adding a new rescue scenario

1. Add a typed `RescueScenario` to `src/data/rescue-flows.ts`.
2. Include realistic search keywords and the narrowest appropriate category.
3. Use a direct result for a single unambiguous fix; use question steps only when an answer changes the safe command.
4. Classify every command and add a concrete warning to destructive commands.
5. Describe what changes, what stays intact, and whether a remote is affected.
6. Run `npm test`; the integrity test verifies every configured transition.

## Safety philosophy

Git Rescue prefers preserving information over shortening instructions:

- shared history is reverted rather than casually reset;
- recovery branches are created before destructive history movement;
- read-only inspection comes before mutation;
- `--force-with-lease` is explained instead of recommending `--force`;
- secret rotation is mandatory after credential exposure; deleting a file never claims to secure the old secret;
- uncommitted changes erased by `reset --hard` are never described as reliably recoverable.

Git Rescue provides educational guidance. Users remain responsible for reviewing repository state and adapting placeholders before running a command.

## Contributing

Keep changes focused on deterministic Git recovery. New flows should be technically verifiable, explain risk in plain language, include engine-safe transitions, and avoid dependencies on repository uploads or external services. Please run all checks before opening a contribution.

## License

MIT. See [LICENSE](LICENSE).
