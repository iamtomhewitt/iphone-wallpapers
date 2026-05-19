import { withErrorHandling } from '@iamtomhewitt/error';

import s3 from '../lib/s3';
import { gitlab } from '../lib/gitlab';

export const handler = withErrorHandling(
  async () => {
    const start = new Date();
    const thisYear = start.getFullYear();
    const contributions = await gitlab.getContributions('thewitt_wh', {
      after: `${thisYear}-01-01T00:00:00.000Z`,
    });

    await s3.save('iphone-wallpapers-data', 'gitlab-contributions', JSON.stringify(contributions));

    const seconds = (new Date().getTime() - start.getTime()) / 1000;
    console.log(`Contributions saved in ${seconds} seconds`);
  },
  (err, code) => {
    console.log({
      err,
      code,
    });
    throw new Error(`Could not get contributions - ${err} | ${code}`);
  },
);