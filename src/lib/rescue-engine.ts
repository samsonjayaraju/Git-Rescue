import type {
  RescueResultStep,
  RescueScenario,
  RescueSession,
  RescueStep,
  SafetyLevel,
} from '@/types/rescue';

export class RescueFlowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RescueFlowError';
  }
}

function getScenario(flowId: string, scenarios: readonly RescueScenario[]): RescueScenario {
  const scenario = scenarios.find((item) => item.id === flowId);
  if (!scenario) throw new RescueFlowError(`Unknown rescue flow: ${flowId}`);
  return scenario;
}

export function startFlow(flowId: string, scenarios: readonly RescueScenario[]): RescueSession {
  const scenario = getScenario(flowId, scenarios);
  if (!scenario.steps[scenario.startStepId]) {
    throw new RescueFlowError(`Flow ${flowId} has an invalid start step`);
  }
  return { flowId, stepId: scenario.startStepId, history: [] };
}

export function getStep(session: RescueSession, scenarios: readonly RescueScenario[]): RescueStep {
  const scenario = getScenario(session.flowId, scenarios);
  const step = scenario.steps[session.stepId];
  if (!step) throw new RescueFlowError(`Unknown step ${session.stepId} in ${session.flowId}`);
  return step;
}

export function chooseOption(
  session: RescueSession,
  optionId: string,
  scenarios: readonly RescueScenario[],
): RescueSession {
  const scenario = getScenario(session.flowId, scenarios);
  const step = getStep(session, scenarios);
  if (step.kind !== 'question') throw new RescueFlowError('Cannot choose an option on a result');
  const option = step.options.find((item) => item.id === optionId);
  if (!option) throw new RescueFlowError(`Unknown option ${optionId} on step ${step.id}`);
  if (!scenario.steps[option.nextStepId]) {
    throw new RescueFlowError(`Option ${optionId} points to a missing step`);
  }
  return { ...session, stepId: option.nextStepId, history: [...session.history, session.stepId] };
}

export function goBack(session: RescueSession, scenarios: readonly RescueScenario[]): RescueSession {
  getScenario(session.flowId, scenarios);
  if (session.history.length === 0) return session;
  const history = session.history.slice(0, -1);
  return { ...session, stepId: session.history[session.history.length - 1], history };
}

export function restartFlow(session: RescueSession, scenarios: readonly RescueScenario[]): RescueSession {
  return startFlow(session.flowId, scenarios);
}

const safetyWeight: Record<SafetyLevel, number> = { safe: 0, caution: 1, dangerous: 2 };

export function getResultSafety(result: RescueResultStep): SafetyLevel {
  return result.commands.reduce<SafetyLevel>(
    (highest, command) => safetyWeight[command.safety] > safetyWeight[highest] ? command.safety : highest,
    'safe',
  );
}

export function validateScenario(scenario: RescueScenario): string[] {
  const errors: string[] = [];
  if (!scenario.steps[scenario.startStepId]) errors.push('Start step is missing');
  for (const step of Object.values(scenario.steps)) {
    if (step.kind === 'question') {
      for (const option of step.options) {
        if (!scenario.steps[option.nextStepId]) errors.push(`${step.id}.${option.id} has no destination`);
      }
    }
    if (step.kind === 'result' && step.commands.length === 0) errors.push(`${step.id} has no commands`);
  }
  return errors;
}
