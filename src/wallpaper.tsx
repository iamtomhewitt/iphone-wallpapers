import fs from 'fs';
import { ImageResponse } from '@vercel/og';
import { http } from '@iamtomhewitt/http';
import { withErrorHandling } from '@iamtomhewitt/error';

import Comp from './comp';

export const handler = withErrorHandling(
  async () => {
    const imageResponse = new ImageResponse(<Comp />, {
      height: 800,
      width: 400,
    });

    return new Response(imageResponse.body, {
      headers: {
        'Content-Type': 'image/png',
        // Cache until midnight UTC — the image changes when the current-day dot moves.
        // URL params form the cache key naturally (different configs = different URLs).
        // 'Cache-Control': `public, s-maxage=${secondsUntilMidnight}, stale-while-revalidate=60`,
      },
    });
  }, (err, code) => http.response.json(code, {
    message: `${err.name}: ${err.message}`,
  }),
);

// (async () => {
//   const r = await handler(null);
//   const arrayBuffer = await r.arrayBuffer();

//   await fs.writeFileSync(
//     './output.png',
//     Buffer.from(arrayBuffer),
//   );
// })();