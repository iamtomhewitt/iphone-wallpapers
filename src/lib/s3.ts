import dotenv from 'dotenv';
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

dotenv.config();

const client = new S3Client({
  region: 'eu-west-1',
  ...process.env.AWS_ACCESS_KEY && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  },
});

export default {
  getObjectAsJson: async (bucket: string, key: string) => {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    const contents = await response.Body?.transformToString() ?? '{}';
    return JSON.parse(contents);
  },
  itemExists: async (bucket: string, key: string) => {
    return await client
      .send(new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }))
      .then(() => true)
      .catch((err) => {
        if (err.name === 'NotFound') {
          return false;
        }
        throw err;
      });
  },
  save: async (bucket: string, key: string, data: any) => {
    return await client.send(new PutObjectCommand({
      Body: data,
      Bucket: bucket,
      Key: key,
    }));
  },
  send: client.send,
};