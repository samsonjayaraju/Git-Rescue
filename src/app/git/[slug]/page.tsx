import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuidePage } from '@/components/guides/guide-page';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { getGuide, knowledgeGuides } from '@/data/guides';

export const dynamicParams = false;

export function generateStaticParams() {
  return knowledgeGuides.filter((guide) => guide.domain === 'git').map((guide) => ({ slug: guide.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide('git', slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.description, openGraph: { title: `${guide.title} — Git Rescue`, description: guide.description }, twitter: { title: `${guide.title} — Git Rescue`, description: guide.description } };
}

export default async function GitGuideRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide('git', slug);
  if (!guide) notFound();
  return <><SiteHeader /><GuidePage guide={guide} /><SiteFooter /></>;
}
