import fs from 'fs';
import { http } from '@iamtomhewitt/http';
import { withErrorHandling } from '@iamtomhewitt/error';

import Wallpaper from './wallpaper';

export const handler = withErrorHandling(
  async () => {
    const { ImageResponse } = await import('@vercel/og');

    const imageOptions = {
      height: 2556,
      width: 1179,
    };

    const res = new ImageResponse(<Wallpaper />, imageOptions);
    const arrayBuffer = await res.arrayBuffer();

    if (process.env.npm_lifecycle_event && process.env.npm_lifecycle_event === 'start') {
      fs.writeFileSync('output.png', Buffer.from(arrayBuffer)); // For local testing
    }

    return {
      body: Buffer.from(arrayBuffer).toString('base64'),
      isBase64Encoded: true,
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    };
  }, (err, code) => {
    console.log({
      err,
      code, 
    });
    return http.response.json(code, {
      message: `${err.name}: ${err.message}`,
      body: {
        error: `${err}`,
      },
    });
  },
);