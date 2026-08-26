import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { RescueFlow } from '@/components/rescue/rescue-flow';
import { getScenario, rescueScenarios } from '@/data/rescue-flows';

export function generateStaticParams() {
  return rescueScenarios.map((scenario) => ({ slug: scenario.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const scenario = getScenario(slug);
  if (!scenario) return {};
  return {
    title: scenario.title,
    description: scenario.description,
    openGraph: { title: `${scenario.title} — Git Rescue`, description: scenario.description, images: [] },
    twitter: { title: `${scenario.title} — Git Rescue`, description: scenario.description, images: [] },
  };
}

export default async function RescuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = getScenario(slug);
  if (!scenario) notFound();
  return <><SiteHeader /><RescueFlow scenario={scenario} /><SiteFooter /></>;
}
