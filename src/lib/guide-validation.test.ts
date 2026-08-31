import { describe, expect, it } from 'vitest';
import { knowledgeGuides } from '@/data/guides';
import type { GitGuide } from '@/types/guides';
import { validateGuides } from './guide-validation';

const baseGuide: GitGuide = {
  id: 'valid-guide', title: 'Valid guide', description: 'A valid test guide.', domain: 'git', category: 'basics',
  aliases: ['valid alias'], keywords: [], explanation: 'Test explanation.', related: [], safety: 'safe',
  commands: [{ id: 'command-1', command: 'git status', label: 'Check status', description: 'Read the state.', safety: 'safe' }],
};

describe('knowledge-base validation', () => {
  it('accepts the complete production dataset', () => {
    expect(validateGuides(knowledgeGuides)).toEqual([]);
  });

  it('detects duplicate IDs and invalid routes', () => {
    expect(validateGuides([baseGuide, { ...baseGuide, id: 'valid-guide' }])).toContain('Duplicate guide ID: valid-guide');
    expect(validateGuides([{ ...baseGuide, id: 'Invalid Route' }])).toContain('Invalid route ID: Invalid Route');
  });

  it('detects broken related-guide references', () => {
    expect(validateGuides([{ ...baseGuide, related: ['missing-guide'] }])).toContain('valid-guide: unknown related guide missing-guide');
  });

  it('requires warnings on dangerous commands', () => {
    const dangerous: GitGuide = { ...baseGuide, safety: 'dangerous', commands: [{ ...baseGuide.commands[0], safety: 'dangerous' }] };
    expect(validateGuides([dangerous])).toContain('valid-guide: dangerous command missing warning');
  });

  it('detects missing titles, aliases, commands, and duplicate aliases', () => {
    const invalid = { ...baseGuide, title: '', aliases: ['same', 'SAME'], commands: [] };
    expect(validateGuides([invalid])).toEqual(expect.arrayContaining([
      'valid-guide: missing title', 'valid-guide: missing commands', 'valid-guide: duplicate aliases',
    ]));
  });
});
