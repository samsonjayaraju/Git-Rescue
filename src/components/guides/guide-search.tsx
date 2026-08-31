'use client';

import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SafetyBadge } from '@/components/commands/safety-badge';
import { guideSearchItems, popularGuideItems } from '@/data/guides';
import { searchGuides } from '@/lib/guide-search';

const suggestions = ['How to commit?', 'Undo my last commit', 'Push rejected', 'Permission denied publickey'];

export function GuideSearch({ variant = 'hero' }: { variant?: 'hero' | 'page' }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const limit = variant === 'page' ? 18 : 8;
  const results = useMemo(() => searchGuides(guideSearchItems, query, limit), [query, limit]);
  const featured = popularGuideItems.slice(0, variant === 'page' ? 12 : 6);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  function updateQuery(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      updateQuery('');
      inputRef.current?.blur();
      return;
    }
    if (!results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      router.push(results[activeIndex]?.item.href ?? results[0].item.href);
    }
  }

  const visibleItems = query ? results.map((result) => result.item) : featured;

  return (
    <div className={`guide-search guide-search-${variant}`}>
      <div className="guide-search-input">
        <Search size={21} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the Git problem or command…"
          aria-label="Search Git and GitHub guides"
          aria-controls="guide-search-results"
          aria-expanded={Boolean(query)}
          aria-activedescendant={query && results.length ? `guide-result-${activeIndex}` : undefined}
          role="combobox"
          autoComplete="off"
        />
        {query ? <button type="button" onClick={() => updateQuery('')} aria-label="Clear search"><X size={16} /></button> : <kbd>⌘ K</kbd>}
      </div>

      {variant === 'hero' && (
        <div className="query-suggestions" aria-label="Popular searches">
          <span>Try</span>
          {suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => { updateQuery(suggestion); inputRef.current?.focus(); }}>{suggestion}</button>)}
        </div>
      )}

      <div className="guide-results-heading">
        <span>{query ? `${results.length} best ${results.length === 1 ? 'match' : 'matches'}` : 'Popular guides'}</span>
        {!query && variant === 'hero' && <Link href="/guides">Browse all {guideSearchItems.length} resources <ArrowRight size={13} /></Link>}
      </div>

      <div id="guide-search-results" className="guide-search-results" role={query ? 'listbox' : undefined}>
        {visibleItems.map((item, index) => (
          <Link
            id={query ? `guide-result-${index}` : undefined}
            role={query ? 'option' : undefined}
            aria-selected={query ? index === activeIndex : undefined}
            className={query && index === activeIndex ? 'active' : undefined}
            href={item.href}
            key={item.key}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <div className="guide-result-meta"><span>{item.domain === 'recovery' ? 'Guided rescue' : item.categoryLabel}</span><SafetyBadge level={item.safety} /></div>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            {item.commands[0] && <code>$ {item.commands[0]}</code>}
            <ArrowRight className="guide-result-arrow" size={16} aria-hidden="true" />
          </Link>
        ))}
        {query && results.length === 0 && (
          <div className="guide-search-empty">
            <Search size={18} />
            <strong>No clear match yet</strong>
            <p>Try a command name, an error message, or what you wanted Git to do.</p>
            <Link href="/rescue/emergency">Open emergency recovery <ArrowRight size={14} /></Link>
          </div>
        )}
      </div>

      {query && results.length > 0 && <div className="search-keyboard-hint"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd><CornerDownLeft size={10} /></kbd> open</span><span><kbd>esc</kbd> clear</span></div>}
    </div>
  );
}
