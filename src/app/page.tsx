import { ArrowRight, Check, Eye, GitBranch, History, LockKeyhole, MousePointer2, ShieldCheck, Terminal } from 'lucide-react';
import Link from 'next/link';
import { SafetyBadge } from '@/components/commands/safety-badge';
import { GuideSearch } from '@/components/guides/guide-search';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { RescuePicker } from '@/components/rescue/rescue-picker';
import { commandComparisons, gitReference } from '@/data/git-scenarios';
import { guideCategories, knowledgeGuides } from '@/data/guides';
import { rescueScenarios } from '@/data/rescue-flows';

const popular = rescueScenarios.filter((scenario) => scenario.popular && !scenario.emergency).slice(0, 6);

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section id="top" className="search-hero wide-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> {knowledgeGuides.length} Git &amp; GitHub guides · {rescueScenarios.length} rescue flows</div>
            <h1>You broke Git.<br />Let’s find <em>the fix.</em></h1>
            <p>Search Git or GitHub and get the exact command, explanation, and safety information you need.</p>
            <p className="privacy-note"><LockKeyhole size={13} /> No AI. No login. No repository access.</p>
          </div>
          <GuideSearch />
        </section>

        <section className="home-categories wide-section">
          <div className="split-heading"><div><span>Browse the library</span><h2>Start with the topic.</h2></div><p>Git fundamentals, GitHub workflows, troubleshooting, and safety-first recovery in one local reference.</p></div>
          <div className="home-category-grid">{guideCategories.slice(0, 12).map((category) => {
            const count = knowledgeGuides.filter((guide) => guide.category === category.id).length;
            return <Link href={`/guides#${category.id}`} key={category.id}><span>{String(count).padStart(2, '0')}</span><div><h3>{category.label}</h3><p>{category.description}</p></div><ArrowRight size={15} /></Link>;
          })}</div>
        </section>

        <section id="common" className="common-section wide-section">
          <div className="split-heading"><div><span>Recovery tools</span><h2>When something<br />already went wrong.</h2></div><p>The original decision-tree rescue tools remain available, with safe paths based on whether work was pushed or should be preserved.</p></div>
          <div className="common-grid">
            {popular.map((scenario, index) => <Link href={`/rescue/${scenario.id}`} key={scenario.id}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{scenario.shortTitle}</h3><p>{scenario.description}</p></div><ArrowRight size={18} /></Link>)}
          </div>
          <Link className="browse-all" href="/rescue">Browse all {rescueScenarios.length} rescue flows <ArrowRight size={14} /></Link>
        </section>

        <section id="rescue" className="rescue-section section-shell">
          <div className="section-heading"><span>Guided rescue</span><h2>Not sure what to search?</h2><p>Choose the closest mistake. We’ll only ask what changes the safest answer.</p></div>
          <RescuePicker compact />
        </section>

        <section className="how-section section-shell">
          <div className="section-heading"><span>How it works</span><h2>Calm questions. Precise recovery.</h2><p>No vague advice and no command before context.</p></div>
          <div className="three-steps">
            <article><span><MousePointer2 size={18} /></span><b>01</b><h3>Pick the mistake</h3><p>Search in plain language or choose a familiar problem.</p></article>
            <article><span><Eye size={18} /></span><b>02</b><h3>Confirm what matters</h3><p>We ask whether work was pushed, committed, or should be kept.</p></article>
            <article><span><Terminal size={18} /></span><b>03</b><h3>Run the safe fix</h3><p>Copy exact commands with effects, risk, and backup steps explained.</p></article>
          </div>
        </section>

        <section className="safety-section wide-section">
          <div className="safety-copy"><span>Safety by default</span><h2>Know what a command will do <em>before</em> you run it.</h2><p>Every recommendation carries a plain-language risk level. Dangerous commands stay locked until you acknowledge exactly what could be lost.</p><ul><li><Check size={15} /> Shared history defaults to git revert</li><li><Check size={15} /> Recovery branches come before destructive resets</li><li><Check size={15} /> --force-with-lease replaces unsafe --force</li></ul></div>
          <div className="safety-scale">
            <div><SafetyBadge level="safe" /><p>Read-only or very unlikely to destroy data.</p><code>git status</code></div>
            <div><SafetyBadge level="caution" /><p>Changes repository state, normally recoverable.</p><code>git reset --soft</code></div>
            <div><SafetyBadge level="dangerous" /><p>May erase local work or rewrite history.</p><code>git reset --hard</code></div>
          </div>
        </section>

        <section className="reflog-section wide-section">
          <div className="reflog-terminal"><div><span><History size={15} /> reflog</span><small>Local recovery log</small></div><code><i>def456</i> HEAD@{'{1}'}: commit: Add payment page<br /><i>91fe20</i> HEAD@{'{2}'}: checkout: moving from main<br /><i>1bf304</i> HEAD@{'{3}'}: rebase (finish): returning to refs/heads/main</code></div>
          <div><span>Git’s safety net</span><h2>Lost a commit?<br />Try the reflog.</h2><p>Branches are pointers. When one moves or disappears, reflog often remembers where it used to point.</p><Link className="text-link" href="/rescue/reflog-recovery">Start reflog recovery <ArrowRight size={16} /></Link></div>
        </section>

        <section className="comparison-section wide-section">
          <div className="split-heading"><div><span>Easy to confuse</span><h2>Similar commands.<br />Very different outcomes.</h2></div><p>Small distinctions that prevent large mistakes.</p></div>
          <div className="comparison-list">{commandComparisons.map((item) => <details key={item.id}><summary><span>{item.title}</span><span>+</span></summary><div className="comparison-body"><div><code>{item.left.name}</code><p>{item.left.detail}</p><small>{item.left.use}</small></div><div><code>{item.right.name}</code><p>{item.right.detail}</p><small>{item.right.use}</small></div><strong>{item.rule}</strong></div></details>)}</div>
        </section>

        <section id="guide" className="guide-section wide-section">
          <div className="section-heading"><span>Small Git guide</span><h2>The commands behind recovery.</h2><p>Enough reference to understand the fix—without building another documentation site.</p></div>
          <div className="reference-grid">{gitReference.map((item) => <article key={item.command}><div><code>{item.command}</code><SafetyBadge level={item.safety} /></div><p>{item.description}</p><small><b>Use when</b>{item.when}</small><pre>$ {item.example}</pre></article>)}</div>
        </section>

        <section className="privacy-section section-shell"><ShieldCheck size={30} /><h2>Your code stays yours.</h2><p>Git Rescue does not connect to GitHub, inspect repositories, upload source code, or store your answers. Everything runs locally in this page.</p><div><span>No account</span><span>No tracking</span><span>No backend</span></div></section>

        <section className="final-cta section-shell"><GitBranch size={25} /><h2>Ready to <em>undo</em> the panic?</h2><p>Tell us what happened. We’ll take it one safe step at a time.</p><Link className="primary-button" href="#rescue">Fix my Git <ArrowRight size={17} /></Link></section>
      </main>
      <SiteFooter />
    </>
  );
}
