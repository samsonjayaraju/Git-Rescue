import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, CheckCircle2, CircleDot, Info } from 'lucide-react';
import Link from 'next/link';
import { CommandBlock } from '@/components/commands/command-block';
import { SafetyBadge } from '@/components/commands/safety-badge';
import { getGuideById, getGuideHref, guideCategories } from '@/data/guides';
import type { GitGuide } from '@/types/guides';

export function GuidePage({ guide }: { guide: GitGuide }) {
  const category = guideCategories.find((item) => item.id === guide.category);
  const related = guide.related.map(getGuideById).filter((item): item is GitGuide => Boolean(item));

  return (
    <main className="guide-page">
      <div className="guide-breadcrumb">
        <Link href="/guides"><ArrowLeft size={14} /> All guides</Link>
        <span>/</span><span>{category?.label ?? guide.category}</span>
      </div>

      <header className="guide-page-header">
        <div className="guide-page-kicker"><span>{guide.domain === 'github' ? 'GitHub guide' : 'Git guide'}</span><SafetyBadge level={guide.safety} /></div>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
        {guide.whenToUse && <div className="guide-when"><CircleDot size={15} /><span><strong>Use this when</strong>{guide.whenToUse}</span></div>}
      </header>

      <div className="guide-page-layout">
        <article className="guide-page-content">
          {guide.prerequisites?.length ? (
            <section className="guide-callout guide-callout-neutral">
              <Info size={18} /><div><h2>Before you start</h2><ul>{guide.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </section>
          ) : null}

          <section className="guide-content-section">
            <div className="guide-section-title"><span>01</span><div><h2>Commands</h2><p>Replace placeholders such as &lt;file&gt; or &lt;branch-name&gt; before copying.</p></div></div>
            <div className="command-stack">{guide.commands.map((command, index) => <CommandBlock item={command} order={index + 1} key={command.id} />)}</div>
          </section>

          <section className="guide-content-section">
            <div className="guide-section-title"><span>02</span><div><h2>What this does</h2></div></div>
            <div className="guide-prose"><p>{guide.explanation}</p></div>
          </section>

          {guide.steps?.length ? (
            <section className="guide-content-section">
              <div className="guide-section-title"><span>03</span><div><h2>Workflow</h2><p>Follow the steps in order and review Git’s output between commands.</p></div></div>
              <ol className="guide-steps">{guide.steps.map((step, index) => <li key={step.title}><span>{index + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
            </section>
          ) : null}

          {guide.example && <section className="guide-example"><span>Example</span><pre>{guide.example}</pre></section>}

          {guide.warnings?.length ? (
            <section className="guide-callout guide-callout-warning">
              <AlertTriangle size={18} /><div><h2>Important</h2><ul>{guide.warnings.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </section>
          ) : null}

          {guide.notes?.length ? (
            <section className="guide-callout guide-callout-notes">
              <BookOpen size={18} /><div><h2>Things to know</h2><ul>{guide.notes.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </section>
          ) : null}
        </article>

        <aside className="guide-page-aside">
          <div><span>Guide type</span><strong>{guide.domain === 'github' ? 'GitHub & gh CLI' : 'Git command line'}</strong></div>
          <div><span>Risk level</span><SafetyBadge level={guide.safety} /></div>
          <div><span>Commands</span><strong>{guide.commands.length}</strong></div>
          <Link href="/rescue"><CheckCircle2 size={15} /> Need guided recovery?</Link>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="related-guides">
          <div><span>Keep going</span><h2>Related guides</h2></div>
          <div className="related-guide-grid">{related.map((item) => <Link href={getGuideHref(item)} key={item.id}><span>{guideCategories.find((categoryItem) => categoryItem.id === item.category)?.label}</span><h3>{item.title}</h3><p>{item.description}</p><ArrowRight size={15} /></Link>)}</div>
        </section>
      )}
    </main>
  );
}
