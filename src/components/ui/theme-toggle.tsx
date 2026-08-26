'use client';

import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('git-rescue-theme', next ? 'dark' : 'light');
  }

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label="Toggle light or dark theme">
      <Sun className="theme-sun" aria-hidden="true" size={17} />
      <Moon className="theme-moon" aria-hidden="true" size={17} />
    </button>
  );
}
