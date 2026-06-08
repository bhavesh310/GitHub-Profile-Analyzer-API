const calculateFollowersFollowingRatio = (followers, following) => {
  if (following === 0) {
    return Number(followers.toFixed(2));
  }

  return Number((followers / following).toFixed(2));
};

const calculateAccountAgeDays = (accountCreatedAt) => {
  const createdDate = new Date(accountCreatedAt);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const diff = Date.now() - createdDate.getTime();
  return Math.max(0, Math.floor(diff / millisecondsPerDay));
};

const calculateProfileCompletenessScore = ({ bio, company, blog, location, avatar_url, public_repos, followers }) => {
  let score = 0;

  if (bio && bio.trim().length > 0) score += 20;
  if (company && company.trim().length > 0) score += 15;
  if (blog && blog.trim().length > 0) score += 15;
  if (location && location.trim().length > 0) score += 10;
  if (avatar_url && avatar_url.trim().length > 0) score += 10;
  if (public_repos > 0) score += 15;
  if (followers > 0) score += 15;

  return Math.min(score, 100);
};

const computeInsights = (profile) => {
  const followers = Number(profile.followers ?? 0);
  const following = Number(profile.following ?? 0);
  const public_repos = Number(profile.public_repos ?? 0);

  return {
    followers_following_ratio: calculateFollowersFollowingRatio(followers, following),
    account_age_days: calculateAccountAgeDays(profile.created_at),
    profile_completeness_score: calculateProfileCompletenessScore({
      bio: profile.bio,
      company: profile.company,
      blog: profile.blog,
      location: profile.location,
      avatar_url: profile.avatar_url,
      public_repos,
      followers,
    }),
    has_bio: Boolean(profile.bio && profile.bio.trim().length > 0),
    has_company: Boolean(profile.company && profile.company.trim().length > 0),
    has_blog: Boolean(profile.blog && profile.blog.trim().length > 0),
  };
};

export { computeInsights };
