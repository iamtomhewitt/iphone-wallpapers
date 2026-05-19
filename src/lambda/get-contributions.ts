import { withErrorHandling } from '@iamtomhewitt/error';

import s3 from '../lib/s3';

export const handler = withErrorHandling(
  async () => {
    const getGitlabContributions = async (username: string, queryParameters = {}) => {
      const perPage = 100;
      let page = 1;
      let all: any[] = [];

      while (true) {
        const queryParametersString = Object.entries(queryParameters)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');

        const url = `https://gitlab.com/api/v4/users/${username}/events?${queryParametersString}&per_page=${perPage}&page=${page}`;
        const data = await fetch(url, {
          headers: {
            'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
          },
        })
          .then(x => x.json()) as any[];

        console.log('Page', page, 'has', data.length, 'events');

        all = all.concat(data);

        if (data.length < perPage) {
          break;
        }

        page += 1;
      }

      return all.reduce((acc, event) => {
        const date = event.created_at.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
    };

    const start = new Date();
    const thisYear = start.getFullYear();
    const contributions = await getGitlabContributions('thewitt_wh', {
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