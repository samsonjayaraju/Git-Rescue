# Git Rescue

Git Rescue is a fast, safety-first Git and GitHub problem-solving knowledge base. Search in natural language or by command, open a concise guide, and get exact commands, an explanation, visible risk information, and related next steps.

The original recovery product remains intact: 42 decision-tree rescue flows still handle ambiguous mistakes such as undoing a pushed commit, recovering a deleted branch, resolving a merge, and using reflog after a reset.

Git Rescue uses no AI, login, repository access, database, backend, analytics, or external search service. Its content and search index are local TypeScript data, so ordinary use has no network dependency.

## What is included

- 223 canonical Git and GitHub guides across 24 categories
- 42 existing interactive rescue flows across 11 recovery categories
- Ranked local search over titles, aliases, keywords, commands, descriptions, and categories
- Case, punctuation, apostrophe, whitespace, accent, and minor-typo tolerance
- Keyboard search navigation with Arrow Up, Arrow Down, Enter, Escape, and Command/Control-K focus
- Shareable `/git/[slug]`, `/github/[slug]`, and existing `/rescue/[slug]` routes
- Static parameters and individual metadata for every guide
- Related-guide navigation based on the current category
- Copyable commands with `safe`, `caution`, and `dangerous` classifications
- Explicit acknowledgement before dangerous commands can be copied
- Reflog recovery and “I don’t know what I did” emergency mode
- Light and dark themes with persisted preference
- Responsive, accessible, monochrome interface

## Why there is no AI

Git commands should be deterministic, reviewable, fast, and available without sending repository context elsewhere. Git Rescue maps thousands of likely phrasings to a curated set of canonical guides. The ranking is predictable, the content is version-controlled, and every destructive recommendation is visible in the dataset and tests.

## Search architecture

`src/lib/guide-search.ts` normalizes a query and scores local `GuideSearchItem` records. Ranking strongly favors:

1. Exact title
2. Exact alias
3. Title or alias prefix/phrase matches
4. Command matches
5. Keyword and category matches
6. Description token matches

Small edit-distance matching is applied only to sufficiently long tokens. Results below a relevance threshold are removed to limit fuzzy noise. `src/data/guides/index.ts` adapts both canonical guides and existing rescue scenarios into the same search index without changing the rescue schema or engine.

## Knowledge-base architecture

```text
src/
  app/
    git/[slug]/                Static Git guide pages
    github/[slug]/             Static GitHub guide pages
    guides/                    Search and category directory
    rescue/[slug]/             Existing interactive rescue pages
  components/
    commands/                  Copy UI and safety badges
    guides/                    Unified search and guide layout
    rescue/                    Existing picker and decision flow UI
  data/
    guides/
      git/                     Basics, commits, branches, recovery, errors, and more
      github/                  Repositories, auth, PRs, Actions, CLI, releases, and secrets
      helpers.ts               Small typed guide authoring helper
      index.ts                 Catalog, categories, related links, and unified search items
    rescue-flows.ts            Existing 42 decision trees
    git-scenarios.ts           Command reference and comparisons
  lib/
    guide-search.ts            Pure deterministic search and ranking
    guide-validation.ts        Dataset integrity checks
    rescue-engine.ts           Existing pure decision-tree engine
  types/
    guides.ts                  Knowledge-base and search types
    rescue.ts                  Existing rescue-flow types
```

## Safety system

- `safe`: read-only or very unlikely to destroy work
- `caution`: changes repository or hosted state but is normally recoverable
- `dangerous`: can erase local work, remove hosted data, or rewrite history

Dangerous commands require a warning in the data and an explicit checkbox before copy. Git Rescue inspects state before changing it, creates recovery pointers where useful, recommends `git revert` for shared history, and uses `--force-with-lease` instead of an unguarded force push.

Placeholders such as `<file>`, `<branch>`, and `<commit-hash>` must be replaced and reviewed before running a command.

## Adding a guide

1. Choose the narrowest file under `src/data/guides/git` or `src/data/guides/github`.
2. Add a unique lowercase kebab-case `id`, concise title and description, useful aliases, keywords, commands, and safety level.
3. Include natural wording, exact error text, and common command names in aliases only when they genuinely describe the same task.
4. Add a concrete warning to every dangerous command.
5. Add optional workflow steps, an example, prerequisites, warnings, or notes only when they help at the terminal.
6. Add a category entry in `src/data/guides/index.ts` only when the new topic cannot fit an existing category.
7. Run the full validation suite.

Related guides default to nearby guides in the same curated category. An explicit `related` array can override this when a more specific cross-topic relationship is more useful; validation rejects broken references.

## Adding search aliases

Aliases should represent real alternative intent, not keyword stuffing. Good aliases for one commit guide include `how to commit`, `make a commit`, and `git commit`. Do not create duplicate guides for punctuation or minor wording changes; normalization already handles those differences.

## Adding a rescue flow

1. Add a typed `RescueScenario` to `src/data/rescue-flows.ts`.
2. Use a direct result for an unambiguous fix and question steps only when an answer changes the safe command.
3. Describe what changes, what remains intact, and whether a remote is affected.
4. Classify each command and include a warning for destructive commands.
5. Run the rescue-engine integrity tests.

## Development

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing and validation

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Tests cover query normalization, exact and fuzzy ranking, aliases, commands, categories, required search examples, invalid searches, duplicate IDs, routes, related references, dangerous-command warnings, and backward compatibility of the rescue engine.

## Production build and deployment preparation

`npm run build` creates the production Next.js application and statically generates canonical guide and rescue routes. `npm start` serves the result locally.

The repository contains no deployment automation, hosting configuration, remote creation, or GitHub connection. Choose and configure a hosting provider only as a separate, explicit deployment step.

## License

MIT. See [LICENSE](LICENSE).
