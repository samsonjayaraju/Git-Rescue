import { GitBranch } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Git Rescue home">
        <span className="brand-mark"><GitBranch aria-hidden="true" size={16} /></span>
        Git Rescue
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#common">Common fixes</Link>
        <Link href="/#guide">Git guide</Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
