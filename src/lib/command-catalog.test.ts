import { describe, expect, it } from 'vitest';
import { commandCatalog, commandCategories, filterCommands } from './command-catalog';

describe('complete command catalog', () => {
  it('keeps the versioned command inventory unique, sorted, and categorized', () => {
    const names = commandCatalog.map((entry) => entry.name);
    expect(names).toHaveLength(156);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual([...names].sort());
    for (const entry of commandCatalog) {
      expect(entry.syntax.trim()).not.toBe('');
      expect(commandCategories.some((category) => category.id === entry.category)).toBe(true);
    }
  });
  it('finds commands by syntax and intent, with intersecting filters', () => {
    expect(filterCommands('git reset --hard').map((entry) => entry.name)).toContain('reset');
    expect(filterCommands('delete branch').map((entry) => entry.name)).toContain('branch');
    expect(filterCommands('CAT-FILE', 'internals', 'advanced').map((entry) => entry.name)).toEqual(['cat-file']);
    expect(filterCommands('cat-file', 'files')).toEqual([]);
    expect(filterCommands('zzzz-nonexistent')).toEqual([]);
    expect(filterCommands('  ')).toHaveLength(156);
  });
  it('preserves destructive warnings and distinct risk levels for reset variants', () => {
    const reset = commandCatalog.find((entry) => entry.name === 'reset')!;
    expect(reset.examples.some((item) => item.command.includes('--soft') && item.safety !== 'dangerous')).toBe(true);
    expect(reset.examples.some((item) => item.command.includes('--hard') && item.safety === 'dangerous')).toBe(true);
    for (const entry of commandCatalog) {
      for (const example of entry.examples) {
        if (example.safety === 'dangerous') expect(example.warning?.trim()).toBeTruthy();
      }
    }
  });
});
