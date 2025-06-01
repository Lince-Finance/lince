import type { NextApiRequest, NextApiResponse } from 'next';
import { apiUrl } from '@/helpers/baseDomain';
import { csrfFetch } from '@/utils/fetcher';

export default async function answerHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST')
    return res.status(405).end('Method Not Allowed');

  try {
    console.debug('[API] in →', req.body);

    const endpoint = apiUrl('advisor', '/advisor/answer');

    const r = await csrfFetch(endpoint, {
      method : 'POST',
      body   : JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json',
        cookie        : req.headers.cookie ?? '',
        authorization : req.headers.authorization ?? '',
      },
    });

    const json = await r.json();
    console.debug('[API] out ←', { status: r.status, json });

    return res.status(r.status).json(json);
  } catch (err: any) {
    console.error('[advisor/answer] error:', err);
    return res.status(500).json({ error: err.message || 'internal-error' });
  }
}
