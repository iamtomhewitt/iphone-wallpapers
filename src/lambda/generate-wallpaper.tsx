import fs from 'fs';
import { ImageResponseOptions } from '@vercel/og';
import { http } from '@iamtomhewitt/http';
import { withErrorHandling } from '@iamtomhewitt/error';

import Wallpaper from '../components/wallpaper';
import { gitlab } from '../lib/gitlab';

export const handler = withErrorHandling(
  async () => {
    const { ImageResponse } = await import('@vercel/og');

    /**
     * TODO - gitlab doesnt have a endpoint for the object that powers their contribution graph :(
     * This probably would be better as a separate lambda, which runs every hour or so, and scrapes contributions, and saves them into
     * an s3 bucket / dynamo table or something
     * That way we can get rid of the processing out of here, as it's very slow and and might cause the iphone wallpaper generation
     * to fail with a timeout
     */

    const contributions = await gitlab.getContributions('thewitt_wh', {
      after: '2026-01-01T00:00:00.000Z',
    });

    const imageOptions: ImageResponseOptions = {
      height: 2556,
      width: 1179,
    };

    const res = new ImageResponse(<Wallpaper contributions={contributions} />, imageOptions);
    const arrayBuffer = await res.arrayBuffer();

    if (process.env.USER && process.env.USER === 'thewitt') {
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