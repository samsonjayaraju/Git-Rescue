import { describe, expect, it } from 'vitest';
import { guideSearchItems } from '@/data/guides';
import type { GuideSearchItem } from '@/types/guides';
import { normalizeSearchText, searchGuides } from './guide-search';

function top(query: string): GuideSearchItem | undefined {
  return searchGuides(guideSearchItems, query, 1)[0]?.item;
}

describe('guide search', () => {
  it('normalizes punctuation, apostrophes, casing, accents, and repeated spaces', () => {
    expect(normalizeSearchText("  HOW   do I undo Git’s commit?  ")).toBe('how do i undo gits commit');
    expect(normalizeSearchText('Réflog')).toBe('reflog');
  });

  it('ranks an exact title above broader matches', () => {
    expect(top('Create a Git commit')?.sourceId).toBe('create-commit');
  });

  it('answers the required natural-language commit question', () => {
    expect(top('How to commit?')?.title).toBe('Create a Git commit');
    expect(top('how to commit')?.sourceId).toBe('create-commit');
  });

  it.each([
    ['undo commit', 'undo-last-commit'],
    ['push rejected', 'fix-non-fast-forward-push'],
    ['permission denied publickey', 'fix-permission-denied-publickey'],
    ['change remote url', 'change-remote-url'],
    ['gitignore not working', 'explain-gitignore-not-working'],
  ])('uses aliases to resolve “%s”', (query, expectedId) => {
    expect(top(query)?.sourceId).toBe(expectedId);
  });

  it('searches actual commands', () => {
    const results = searchGuides(guideSearchItems, 'git reset hard', 8);
    expect(results.some((result) => result.item.commands.some((command) => command.includes('git reset --hard')))).toBe(true);
  });

  it('returns multiple relevant reflog recovery resources', () => {
    const results = searchGuides(guideSearchItems, 'reflog', 12);
    expect(results.length).toBeGreaterThan(4);
    expect(results.some((result) => result.item.sourceId === 'view-reflog')).toBe(true);
    expect(results.some((result) => result.item.source === 'rescue')).toBe(true);
  });

  it('searches category names', () => {
    const results = searchGuides(guideSearchItems, 'github actions', 8);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.item.category === 'github-actions')).toBe(true);
  });

  it('tolerates a minor typo without allowing irrelevant fuzzy noise', () => {
    expect(searchGuides(guideSearchItems, 'commmit', 5).some((result) => result.item.title.toLowerCase().includes('commit'))).toBe(true);
    expect(searchGuides(guideSearchItems, 'quantum bananas', 5)).toEqual([]);
  });

  it('returns no results for empty input', () => {
    expect(searchGuides(guideSearchItems, '   ')).toEqual([]);
  });
});
