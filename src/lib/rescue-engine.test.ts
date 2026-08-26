import { describe, expect, it } from 'vitest';
import { rescueScenarios } from '@/data/rescue-flows';
import {
  chooseOption,
  getResultSafety,
  getStep,
  goBack,
  RescueFlowError,
  restartFlow,
  startFlow,
  validateScenario,
} from './rescue-engine';

describe('rescue engine', () => {
  it('follows branching logic to the correct result', () => {
    let session = startFlow('undo-last-commit', rescueScenarios);
    session = chooseOption(session, 'not-pushed', rescueScenarios);
    session = chooseOption(session, 'keep-staged', rescueScenarios);
    const result = getStep(session, rescueScenarios);
    expect(result.kind).toBe('result');
    if (result.kind === 'result') expect(result.commands[0].command).toBe('git reset --soft HEAD~1');
  });

  it('selects the shared-history-safe result for a pushed commit', () => {
    const start = startFlow('undo-last-commit', rescueScenarios);
    const session = chooseOption(start, 'pushed', rescueScenarios);
    const result = getStep(session, rescueScenarios);
    expect(result.kind).toBe('result');
    if (result.kind === 'result') expect(result.commands[0].command).toBe('git revert HEAD');
  });

  it('classifies a destructive result as dangerous', () => {
    let session = startFlow('undo-last-commit', rescueScenarios);
    session = chooseOption(session, 'not-pushed', rescueScenarios);
    session = chooseOption(session, 'discard', rescueScenarios);
    const result = getStep(session, rescueScenarios);
    expect(result.kind).toBe('result');
    if (result.kind === 'result') expect(getResultSafety(result)).toBe('dangerous');
  });

  it('rejects invalid flow IDs', () => {
    expect(() => startFlow('missing-flow', rescueScenarios)).toThrow(RescueFlowError);
  });

  it('navigates backward and restarts', () => {
    const start = startFlow('undo-last-commit', rescueScenarios);
    const advanced = chooseOption(start, 'not-pushed', rescueScenarios);
    expect(goBack(advanced, rescueScenarios)).toEqual(start);
    expect(restartFlow(advanced, rescueScenarios)).toEqual(start);
  });

  it('validates every configured flow', () => {
    for (const scenario of rescueScenarios) expect(validateScenario(scenario)).toEqual([]);
  });
});
