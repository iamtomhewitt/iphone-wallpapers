const gitlabHeaders = {
  'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
};

const getContributions = async (username: string, queryParameters = {}) => {
  const perPage = 100;
  let page = 1;
  let all: any[] = [];

  while (true) {
    const queryParametersString = Object.entries(queryParameters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const url = `https://gitlab.com/api/v4/users/${username}/events?${queryParametersString}&per_page=${perPage}&page=${page}`;
    const data = await fetch(url, {
      headers: gitlabHeaders,
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

export const gitlab = {
  getContributions,
};