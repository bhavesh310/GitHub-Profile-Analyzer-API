import axios from 'axios';

const githubClient = axios.create({
  baseURL: process.env.GITHUB_API_BASE_URL || 'https://api.github.com',
  timeout: Number(process.env.GITHUB_API_TIMEOUT || 10000),
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'github-profile-analyzer',
  },
});

const fetchUserProfile = async (username) => {
  try {
    const response = await githubClient.get(`/users/${encodeURIComponent(username)}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const notFoundError = new Error('User not found');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    const apiError = new Error('Failed to fetch GitHub user data');
    apiError.statusCode = error.response?.status || 502;
    throw apiError;
  }
};

export { fetchUserProfile };
