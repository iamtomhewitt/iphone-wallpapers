import fs from 'fs';
import { ImageResponseOptions } from '@vercel/og';
import { http } from '@iamtomhewitt/http';
import { withErrorHandling } from '@iamtomhewitt/error';

import Wallpaper from '../components/wallpaper';
import s3 from '../lib/s3';
import { getTimeData } from '../lib/date';
import { merge } from '../lib/object';

export const handler = withErrorHandling(
  async () => {
    const { ImageResponse } = await import('@vercel/og');

    const imageOptions: ImageResponseOptions = {
      height: 2556,
      width: 1179,
    };

    const gitlabContributions = await s3.getObjectAsJson('iphone-wallpapers-data', 'gitlab-contributions');
    const githubContributions = await s3.getObjectAsJson('iphone-wallpapers-data', 'github-contributions');
    const mergedContributions = merge(gitlabContributions, githubContributions);
    const timeData = await getTimeData();

    const res = new ImageResponse(<Wallpaper timeData={timeData} contributions={mergedContributions} />, imageOptions);
    const arrayBuffer = await res.arrayBuffer();

    if (process.env.USER && process.env.USER === 'thewitt') {
      fs.writeFileSync('output.png', Buffer.from(arrayBuffer)); // For local testing
    }

    return {
      body: Buffer.from(arrayBuffer).toString('base64'),
      headers: {
        'Content-Type': 'image/png',
      },
      isBase64Encoded: true,
      statusCode: 200,
    };
  }, (err, code) => {
    console.log({
      code,
      err,
    });
    return http.response.json(code, {
      body: {
        error: `${err}`,
      },
      message: `${err.name}: ${err.message}`,
    });
  },
);