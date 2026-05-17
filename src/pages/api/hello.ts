import type { NextApiRequest, NextApiResponse } from 'next'

import { ImageResponse } from '@vercel/og';
import Comp from '../comp';

export const runtime = 'edge';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const imageResponse = new ImageResponse(

    Comp(),

    { width: 400, height: 800 });

  return new Response(imageResponse.body, {
    headers: {
      'Content-Type': 'image/png',
      // Cache until midnight UTC — the image changes when the current-day dot moves.
      // URL params form the cache key naturally (different configs = different URLs).
      // 'Cache-Control': `public, s-maxage=${secondsUntilMidnight}, stale-while-revalidate=60`,
    },
  });
}

export default handler