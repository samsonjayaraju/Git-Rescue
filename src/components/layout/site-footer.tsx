import { GitBranch } from 'lucide-react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><GitBranch size={15} aria-hidden="true" /> Git Rescue</div>
      <p>Deterministic Git answers and recovery. No repository access required.</p>
      <div><Link href="/guides">Browse guides</Link><Link href="/rescue">Start a rescue</Link><a href="https://git-scm.com/docs" target="_blank" rel="noreferrer">Official Git docs</a></div>
    </footer>
  );
}
