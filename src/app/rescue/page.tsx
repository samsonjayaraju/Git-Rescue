import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { RescuePicker } from '@/components/rescue/rescue-picker';

export const metadata: Metadata = { title: 'Browse Git recovery guides', description: 'Search safe, interactive recovery flows for common Git mistakes.' };

export default function RescueIndexPage() {
  return <><SiteHeader /><main className="rescue-index"><div className="flow-heading"><span>All rescue guides</span><h1>What went wrong?</h1><p>Search in your own words or filter by the part of Git that needs attention.</p></div><RescuePicker /></main><SiteFooter /></>;
}
