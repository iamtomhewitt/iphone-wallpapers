import { http } from '@iamtomhewitt/http';
import { withErrorHandling } from '@iamtomhewitt/error';

import Comp from './comp';

export const handler = withErrorHandling(
  async () => {
    const { ImageResponse } = await import('@vercel/og');

    const res = new ImageResponse(<Comp />, {
      width: 1179,
      height: 2556,
    });

    const arrayBuffer = await res.arrayBuffer();

    console.log('byte length', arrayBuffer.byteLength);
    console.log(Buffer.from(arrayBuffer).toString('base64'));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: Buffer.from(arrayBuffer).toString('base64'),
      isBase64Encoded: true,
    };
  }, (err, code) => http.response.json(code, {
    message: `${err.name}: ${err.message}`,
  }),
);