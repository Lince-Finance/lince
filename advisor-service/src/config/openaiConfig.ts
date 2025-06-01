// src/config/openaiConfig.ts
import OpenAI from 'openai';
import { getParam } from '../utils/parameterStore';

let cached: OpenAI | null = null;

export async function openai(): Promise<OpenAI> {
  if (cached) return cached;

  const apiKey =
    process.env.ADVISOR_OPENAI_API_KEY
      || await getParam('/lince/ADVISOR_OPENAI_API_KEY');

  cached = new OpenAI({ apiKey });
  return cached;
}
