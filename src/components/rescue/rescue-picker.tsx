'use client';

import { ArrowRight, Search, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { rescueScenarios, scenarioCategories } from '@/data/rescue-flows';
import type { ScenarioCategory } from '@/types/rescue';

export function RescuePicker({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ScenarioCategory | 'all'>('all');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rescueScenarios.filter((scenario) => {
      const matchesCategory = category === 'all' || scenario.category === category;
      const haystack = [scenario.title, scenario.description, ...scenario.keywords].join(' ').toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [category, query]);

  const displayed = compact && !query && category === 'all'
    ? rescueScenarios.filter((scenario) => scenario.popular).slice(0, 8)
    : results;

  return (
    <div className="picker">
      <label className="search-box">
        <Search size={19} aria-hidden="true" />
        <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your Git problem..." aria-label="Search Git problems" />
        <kbd>⌘ K</kbd>
      </label>
      {!compact && (
        <div className="category-tabs" aria-label="Filter by category">
          <button type="button" className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>All</button>
          {scenarioCategories.map((item) => <button type="button" className={category === item.id ? 'active' : ''} onClick={() => setCategory(item.id)} key={item.id}>{item.label}</button>)}
        </div>
      )}
      <div className="scenario-list" aria-live="polite">
        {displayed.map((scenario, index) => (
          <Link key={scenario.id} href={`/rescue/${scenario.id}`} className={scenario.emergency ? 'emergency-row' : ''}>
            <span className="problem-index">{scenario.emergency ? <ShieldAlert size={16} /> : String(index + 1).padStart(2, '0')}</span>
            <span><strong>{scenario.shortTitle}</strong><small>{scenario.description}</small></span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        ))}
        {displayed.length === 0 && <div className="empty-results"><strong>No exact match.</strong><span>Try “commit”, “branch”, “merge”, or start emergency mode.</span><Link href="/rescue/emergency">I don’t know what I did <ArrowRight size={15} /></Link></div>}
      </div>
      {compact && !query && <Link className="browse-all" href="/rescue">Browse all {rescueScenarios.length} rescue guides <ArrowRight size={15} /></Link>}
    </div>
  );
}
