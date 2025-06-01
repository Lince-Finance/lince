import type { NextApiRequest, NextApiResponse } from 'next';
import { apiUrl } from '@/helpers/baseDomain';
import { csrfFetch } from '@/utils/fetcher';

export default async function scoreHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST')
    return res.status(405).end('Method Not Allowed');

  const { answers } = req.body as { answers?: Record<string, string> };
  if (!answers)
    return res.status(400).json({ error: 'Missing answers' });

  try {
    const endpoint = apiUrl('advisor', '/advisor/answers');

    const r = await csrfFetch(endpoint, {
      method : 'POST',
      body   : JSON.stringify({ answers }),
      headers: {
        'Content-Type': 'application/json',
        cookie        : req.headers.cookie ?? '',
        authorization : req.headers.authorization ?? '',
      },
    });

    const json = await r.json();
    return res.status(r.status).json(json);
  } catch (err: any) {
    console.error('[advisor/score] error:', err);
    return res.status(500).json({ error: err.message || 'internal-error' });
  }
}
