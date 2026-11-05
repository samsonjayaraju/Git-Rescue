'use client';

import { ArrowRight, BookOpen, ChevronDown, Search, Terminal, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { commandCatalog, commandCategories, filterCommands, type CommandEntry } from '@/lib/command-catalog';
import { CommandBlock } from './command-block';

function CommandDetails({ entry }: { entry: CommandEntry }) {
  const [open, setOpen] = useState(false);
  return <details className="catalog-entry" onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary>
      <span className="catalog-command-name"><Terminal size={15} aria-hidden="true" /><code>git {entry.name}</code></span>
      <span className="catalog-description">{entry.description}</span>
      <span className="catalog-kind">{entry.advanced ? 'Advanced' : commandCategories.find((category) => category.id === entry.category)?.label}</span>
      <ChevronDown size={16} className="catalog-chevron" aria-hidden="true" />
    </summary>
    {open && <div className="catalog-details">
      <div className="catalog-detail-heading"><h3>Syntax & options</h3><a href={`https://git-scm.com/docs/git-${entry.name}`} target="_blank" rel="noreferrer">Full manual <ArrowRight size={13} aria-hidden="true" /></a></div>
      <pre className="catalog-syntax"><code>{entry.syntax}</code></pre>
      <p className="catalog-syntax-hint">Square brackets mean optional arguments. Replace angle-bracket placeholders before running a command. Available options depend on your Git version.</p>
      {entry.examples.length > 0 && <><h3>Examples & common variations</h3><p className="catalog-syntax-hint">Each example is a separate use case. Review its linked guide for prerequisites and recovery steps.</p>{entry.examples.map((example, index) => <CommandBlock key={example.command} item={example} order={index + 1} />)}</>}
      <CommandBlock item={{ id: `${entry.name}-help`, label: 'Read the installed manual', description: 'Check the documentation for the Git version on your machine.', command: `git help ${entry.name}`, safety: 'safe' }} order={entry.examples.length + 1} />
      {entry.guides.length > 0 && <div className="catalog-related"><h3>Step-by-step guides</h3>{entry.guides.map((guide) => <Link href={guide.href} key={guide.href}><BookOpen size={14} aria-hidden="true" />{guide.title}<ArrowRight size={13} aria-hidden="true" /></Link>)}</div>}
    </div>}
  </details>;
}

export function CommandCatalog() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [scope, setScope] = useState('all');
  const searchRef = useRef<HTMLInputElement>(null);
  const results = filterCommands(query, category, scope);

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);

  function clearFilters() { setQuery(''); setCategory('all'); setScope('all'); }

  return <section className="catalog-browser" aria-label="Git command catalog">
    <label className="search-box catalog-search">
      <Search size={20} aria-hidden="true" />
      <input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search commands or a task, like delete a branch…" aria-label="Search all Git commands" />
      <kbd>⌘ / Ctrl K</kbd>
    </label>
    <div className="catalog-controls">
      <div className="catalog-scopes" role="group" aria-label="Command type">
        {[['all', 'All commands'], ['everyday', 'High-level'], ['advanced', 'Advanced / Internals']].map(([value, label]) => <button key={value} type="button" aria-pressed={scope === value} onClick={() => setScope(value)}>{label}</button>)}
      </div>
      <label className="catalog-category">Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{commandCategories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    </div>
    <div className="catalog-results-heading"><span role="status">{results.length} of {commandCatalog.length} commands <span aria-hidden="true">·</span> A–Z</span>{(query || category !== 'all' || scope !== 'all') && <button type="button" onClick={clearFilters}><X size={12} aria-hidden="true" /> Clear filters</button>}<span>Expand a command to explore</span></div>
    <div className="catalog-list">
      {results.map((entry) => <CommandDetails key={entry.name} entry={entry} />)}
      {results.length === 0 && <div className="empty-results"><strong>No commands found.</strong><span>Try a command such as “stash” or a task such as “delete branch”.</span><button type="button" className="secondary-button" onClick={clearFilters}>Show all commands</button></div>}
    </div>
  </section>;
}
