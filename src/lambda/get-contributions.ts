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

    const getGithubContributions = async (username: string) => {
      const now = new Date();
      const from = new Date(now.getFullYear(), 0, 1).toISOString();
      const to = now.toISOString();

      const body = {
        query: `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              name
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    firstDay
                    contributionDays {
                      color
                      contributionCount
                      date
                      weekday
                    }
                  }
                }
              }
            }
          }`,
        variables: {
          username,
          from,
          to,
        },
      };

      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const contributions: any = {};
      const json = await response.json() as any;
      const { weeks = [] } = json.data.user.contributionsCollection.contributionCalendar;

      for (const week of weeks) {
        for (const day of week.contributionDays) {
          contributions[day.date] = day.contributionCount;
        }
      }

      return contributions;
    };

    const start = new Date();
    const thisYear = start.getFullYear();
    const githubContributions = await getGithubContributions('iamtomhewitt');
    const gitlabContributions = await getGitlabContributions('thewitt_wh', {
      after: `${thisYear}-01-01T00:00:00.000Z`,
    });

    await s3.save('iphone-wallpapers-data', 'github-contributions', JSON.stringify(githubContributions));
    await s3.save('iphone-wallpapers-data', 'gitlab-contributions', JSON.stringify(gitlabContributions));

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