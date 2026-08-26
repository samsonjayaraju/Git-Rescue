import Link from 'next/link';
import { ArrowLeft, GitBranch } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';

export default function NotFound() {
  return <><SiteHeader /><main className="not-found"><GitBranch size={28} /><span>404</span><h1>That recovery path wandered off.</h1><p>The guide may have moved, but your repository is untouched.</p><Link className="primary-button" href="/rescue"><ArrowLeft size={16} /> Browse rescue guides</Link></main></>;
}
