'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Info, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CommandBlock } from '@/components/commands/command-block';
import { SafetyBadge } from '@/components/commands/safety-badge';
import { rescueScenarios } from '@/data/rescue-flows';
import { chooseOption, getResultSafety, getStep, goBack, restartFlow, startFlow } from '@/lib/rescue-engine';
import type { RescueScenario } from '@/types/rescue';

export function RescueFlow({ scenario }: { scenario: RescueScenario }) {
  const [session, setSession] = useState(() => startFlow(scenario.id, rescueScenarios));
  const step = getStep(session, rescueScenarios);

  return (
    <main className="flow-page">
      <div className="flow-topline"><Link href="/#rescue"><ArrowLeft size={15} /> All fixes</Link><span>{scenario.category.replace('-', ' ')}</span></div>
      <div className="flow-heading"><span>Git Rescue</span><h1>{scenario.shortTitle}</h1><p>{scenario.description}</p></div>
      <div className="flow-workspace">
        <div className="flow-progress" aria-label="Flow progress"><span style={{ width: step.kind === 'result' ? '100%' : `${Math.min(35 + session.history.length * 30, 85)}%` }} /></div>
        <AnimatePresence mode="wait">
          <motion.section key={step.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {step.kind === 'question' ? (
              <div className="question-panel">
                {step.eyebrow && <span className="step-eyebrow">{step.eyebrow}</span>}
                <h2>{step.question}</h2>
                {step.helpText && <p className="question-help"><Info size={16} />{step.helpText}</p>}
                <div className="option-list">
                  {step.options.map((option) => (
                    <button key={option.id} type="button" onClick={() => setSession((current) => chooseOption(current, option.id, rescueScenarios))}>
                      <span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span><ArrowRight size={18} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="result-panel">
                <div className="result-kicker"><CheckCircle2 size={16} /><span>Recommended fix</span><SafetyBadge level={getResultSafety(step)} /></div>
                <h2>{step.title}</h2><p className="result-summary">{step.summary}</p>
                <div className="rationale"><Info size={17} /><p><strong>Why this is the safest path</strong>{step.rationale}</p></div>
                {step.beforeYouStart && <div className="before-box"><span>Before you start</span><ul>{step.beforeYouStart.map((item) => <li key={item}>{item}</li>)}</ul></div>}
                <div className="command-stack">{step.commands.map((item, index) => <CommandBlock item={item} order={index + 1} key={item.id} />)}</div>
                <div className="effects-section"><h3>What happens</h3><div className="effects-grid">{step.effects.map((effect) => <div key={effect.label}><span>{effect.label}</span><strong className={effect.tone ?? 'neutral'}>{effect.value}</strong></div>)}</div></div>
                {step.notes && <div className="notes-box"><strong>Keep in mind</strong><ul>{step.notes.map((note) => <li key={note}>{note}</li>)}</ul></div>}
              </div>
            )}
          </motion.section>
        </AnimatePresence>
        <div className="flow-controls">
          <button type="button" onClick={() => setSession((current) => goBack(current, rescueScenarios))} disabled={session.history.length === 0}><ArrowLeft size={15} /> Back</button>
          <button type="button" onClick={() => setSession((current) => restartFlow(current, rescueScenarios))}><RotateCcw size={14} /> Start over</button>
        </div>
      </div>
    </main>
  );
}
