import { openai }     from '../config/openaiConfig';
import { updateUser } from '../services/userDbService';
import type {
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';

export type RiskLevel = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';

export async function runInterview(
  userId: string,
  messages: ChatCompletionMessageParam[],
): Promise<{ done: boolean; nextQuestion?: string; risk?: RiskLevel }> {

  const ai = await openai();

  const resp = await ai.chat.completions.create({
    model       : process.env.ADVISOR_OPENAI_MODEL ?? 'gpt-4o',
    temperature : 0,
    messages    : [
      { role: 'system', content: process.env.ADVISOR_SYSTEM_PROMPT ?? '' },
      ...messages,
    ],
    tools: [{
      type: 'function',
      function: {
        name: 'finish_interview',
        parameters: {
          type: 'object',
          properties: {
            risk: { enum: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'] },
          },
          required: ['risk'],
        },
      },
    }],
    tool_choice: 'auto',
  });

  const choice = resp.choices[0];
  const call   = choice.message.tool_calls?.[0];

  if (choice.finish_reason === 'tool_calls' &&
      call?.function.name === 'finish_interview') {

    const { risk } = JSON.parse(call.function.arguments || '{}') as { risk: RiskLevel };

    await updateUser(userId, { riskProfile: risk });

    return { done: true, risk };
  }

  const next = choice.message.content?.trim() || '¿Podrías detallar un poco más?';
  return { done: false, nextQuestion: next };
}
