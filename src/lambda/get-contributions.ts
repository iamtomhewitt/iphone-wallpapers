import { withErrorHandling } from '@iamtomhewitt/error';

import s3 from '../lib/s3';

export const handler = withErrorHandling(
  async () => {
    const now = new Date();

    const getGitlabContributions = async (username: string) => {
      const fetchByPage = async (page = 1) => {
        const params = new URLSearchParams({
          after: new Date(now.getFullYear(), 0, 1, 0, 0, 0).toISOString(),
          page: `${page}`,
          per_page: '100',
        });

        const response = await fetch(`https://gitlab.com/api/v4/users/${username}/events?${params}`, {
          headers: {
            'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
          },
        });

        const events = await response.json() as any[];
        const totalPages = Number(response.headers.get('x-total-pages') || 1);

        return {
          events: events.map(e => ({
            action: e.action_name,
            createdAt: e.created_at.split('T')[0],
          })),
          totalPages,
        };
      };

      const { totalPages } = await fetchByPage(1);

      return await Promise.all(
        Array.from({
          length: totalPages,
        }, (_, i) => fetchByPage(i),
        ))
        .then(items => items.map(item => item.events))
        .then(items => items.flat())
        .then(items => items.filter(item => !['left'].includes(item.action)))
        .then(items => items.reduce((acc: any, { createdAt }) => {
          acc[createdAt] = (acc[createdAt] ?? 0) + 1;
          return acc;
        }, {}));
    };

    const getGithubContributions = async (username: string) => {
      const body = {
        query: `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              name
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks {
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
          from: new Date(now.getFullYear(), 0, 1, 0, 0, 0).toISOString(),
          to: now.toISOString(),
          username,
        },
      };

      const response = await fetch('https://api.github.com/graphql', {
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const contributions: Record<string, number> = {};
      const json = await response.json() as any;

      const { weeks = [] } = json.data.user.contributionsCollection.contributionCalendar;

      for (const week of weeks) {
        for (const day of week.contributionDays) {
          contributions[day.date] = day.contributionCount;
        }
      }

      return contributions;
    };

    const githubContributions = await getGithubContributions('iamtomhewitt');
    const gitlabContributions = await getGitlabContributions('thewitt_wh');

    await s3.save('iphone-wallpapers-data', 'github-contributions', JSON.stringify(githubContributions));
    await s3.save('iphone-wallpapers-data', 'gitlab-contributions', JSON.stringify(gitlabContributions));

    const seconds = (new Date().getTime() - now.getTime()) / 1000;
    console.log(`Contributions saved in ${seconds} seconds`);
  },
  (err, code) => {
    console.log({
      code,
      err,
    });
    throw new Error(`Could not get contributions - ${err} | ${code}`);
  },
);