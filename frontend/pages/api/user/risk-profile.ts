import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.cookie || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const { profile } = await response.json();
      console.log('[risk-profile] GET response:', { profile });
      return res.status(200).json({ riskProfile: profile.riskProfile });
    } catch (error) {
      console.error('[getRiskProfile]', error);
      return res.status(500).json({ error: 'Unable to fetch risk profile' });
    }
  } else if (req.method === 'POST') {
    try {
      const { riskProfile } = req.body;
      if (!riskProfile) {
        return res.status(400).json({ error: 'Risk profile is required' });
      }

      console.log('[risk-profile] POST request:', { riskProfile });

      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.cookie || '',
        },
        body: JSON.stringify({ riskProfile }),
      });

      if (!response.ok) {
        throw new Error('Failed to update risk profile');
      }

      const result = await response.json();
      console.log('[risk-profile] POST response:', result);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('[updateRiskProfile]', error);
      return res.status(500).json({ error: 'Unable to update risk profile' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler; 