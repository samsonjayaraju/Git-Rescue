import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GuideSearch } from '@/components/guides/guide-search';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { getGuideHref, guideCategories, knowledgeGuides } from '@/data/guides';

export const metadata: Metadata = { title: 'Git & GitHub guides', description: 'Search practical Git commands, GitHub CLI workflows, errors, explanations, and safety-first recovery guides.' };

export default function GuidesPage() {
  return <><SiteHeader /><main className="guides-index">
    <header><span>Complete command library</span><h1>Find the Git answer.<br />Keep the context.</h1><p>Search {knowledgeGuides.length} Git and GitHub guides plus the existing interactive rescue flows.</p></header>
    <GuideSearch variant="page" />
    <section className="category-directory"><div className="split-heading"><div><span>Browse by topic</span><h2>From first commit<br />to deep recovery.</h2></div><p>Every command includes its effect and risk level. Destructive commands remain clearly gated.</p></div>
      <div className="category-directory-grid">{guideCategories.map((category) => {
        const guides = knowledgeGuides.filter((guide) => guide.category === category.id);
        return <article id={category.id} key={category.id}><div><span>{category.domain}</span><strong>{guides.length}</strong></div><h3>{category.label}</h3><p>{category.description}</p><ul>{guides.slice(0, 4).map((guide) => <li key={guide.id}><Link href={getGuideHref(guide)}>{guide.title}<ArrowRight size={12} /></Link></li>)}</ul></article>;
      })}</div>
    </section>
  </main><SiteFooter /></>;
}
