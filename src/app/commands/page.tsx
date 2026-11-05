import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { CommandCatalog } from '@/components/commands/command-catalog';
import { commandCatalog } from '@/lib/command-catalog';

export const metadata: Metadata = {
  title: 'All Git commands',
  description: 'Browse every documented command in the Git 2.54 catalog. Search syntax, explore examples, and find safety-first guides for everyday and advanced Git workflows.',
};

export default function CommandsPage() {
  return <><SiteHeader /><main className="commands-page wide-section">
    <Link href="/" className="catalog-back"><ArrowLeft size={14} aria-hidden="true" /> Back to home</Link>
    <header className="catalog-heading"><div className="eyebrow"><span className="status-dot" /> {commandCatalog.length} commands · One reference</div><h1>Every Git command.<br /><em>One place.</em></h1><p>From your first commit to the internals. Find the command, understand its options, and know what comes next.</p></header>
    <CommandCatalog />
    <aside className="catalog-source"><strong>A complete, versioned reference.</strong><p>Includes all 156 command entries in the <a href="https://github.com/git/git/blob/v2.54.0/command-list.txt" target="_blank" rel="noreferrer">Git 2.54 command index</a>, including advanced helpers and optional integrations. Availability varies by Git version and installation. Examples carry their own risk levels; a command’s effect depends on its options.</p><p>Need help choosing a safe fix? <Link href="/rescue">Open Recovery <span aria-hidden="true">→</span></Link></p></aside>
  </main><SiteFooter /></>;
}
