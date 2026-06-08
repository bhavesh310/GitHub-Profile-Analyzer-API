import { pool } from '../config/db.js';
import { fetchUserProfile } from '../services/githubService.js';
import { computeInsights } from '../utils/analyzer.js';

const analyzeProfile = async (req, res, next) => {
  const { username } = req.params;

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  try {
    const profileData = await fetchUserProfile(username.trim());
    const insights = computeInsights(profileData);
    const analyzedAt = new Date();

    const payload = {
      github_id: profileData.id,
      username: profileData.login,
      name: profileData.name || null,
      avatar_url: profileData.avatar_url || null,
      bio: profileData.bio || null,
      company: profileData.company || null,
      blog: profileData.blog || null,
      location: profileData.location || null,
      public_repos: profileData.public_repos || 0,
      public_gists: profileData.public_gists || 0,
      followers: profileData.followers || 0,
      following: profileData.following || 0,
      
      account_created_at: new Date(profileData.created_at)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' '),

     account_updated_at: new Date(profileData.updated_at)
     .toISOString()
     .slice(0, 19)
     .replace('T', ' '),
      followers_following_ratio: insights.followers_following_ratio, 
      account_age_days: insights.account_age_days,
      profile_completeness_score: insights.profile_completeness_score,
      has_bio: insights.has_bio ? 1 : 0,
      has_company: insights.has_company ? 1 : 0,
      has_blog: insights.has_blog ? 1 : 0,
      last_analyzed_at: analyzedAt,
    };

    const connection = await pool.getConnection();

    try {
      const [existingRows] = await connection.execute(
        'SELECT id FROM analyzed_profiles WHERE username = ?',
        [payload.username]
      );

      if (existingRows.length > 0) {
        const [updateResult] = await connection.execute(
          `UPDATE analyzed_profiles SET
            github_id = ?,
            name = ?,
            avatar_url = ?,
            bio = ?,
            company = ?,
            blog = ?,
            location = ?,
            public_repos = ?,
            public_gists = ?,
            followers = ?,
            following = ?,
            account_created_at = ?,
            account_updated_at = ?,
            followers_following_ratio = ?,
            account_age_days = ?,
            profile_completeness_score = ?,
            has_bio = ?,
            has_company = ?,
            has_blog = ?,
            last_analyzed_at = ?,
            updated_at = NOW()
          WHERE username = ?`,
          [
            payload.github_id,
            payload.name,
            payload.avatar_url,
            payload.bio,
            payload.company,
            payload.blog,
            payload.location,
            payload.public_repos,
            payload.public_gists,
            payload.followers,
            payload.following,
            payload.account_created_at,
            payload.account_updated_at,
            payload.followers_following_ratio,
            payload.account_age_days,
            payload.profile_completeness_score,
            payload.has_bio,
            payload.has_company,
            payload.has_blog,
            payload.last_analyzed_at,
            payload.username,
          ]
        );

        return res.status(200).json({
          success: true,
          message: 'Profile analyzed successfully',
          data: { ...payload, updatedRows: updateResult.affectedRows },
        });
      }

      const [insertResult] = await connection.execute(
        `INSERT INTO analyzed_profiles (
          github_id,
          username,
          name,
          avatar_url,
          bio,
          company,
          blog,
          location,
          public_repos,
          public_gists,
          followers,
          following,
          account_created_at,
          account_updated_at,
          followers_following_ratio,
          account_age_days,
          profile_completeness_score,
          has_bio,
          has_company,
          has_blog,
          last_analyzed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payload.github_id,
          payload.username,
          payload.name,
          payload.avatar_url,
          payload.bio,
          payload.company,
          payload.blog,
          payload.location,
          payload.public_repos,
          payload.public_gists,
          payload.followers,
          payload.following,
          payload.account_created_at,
          payload.account_updated_at,
          payload.followers_following_ratio,
          payload.account_age_days,
          payload.profile_completeness_score,
          payload.has_bio,
          payload.has_company,
          payload.has_blog,
          payload.last_analyzed_at,
        ]
      );

      return res.status(201).json({
        success: true,
        message: 'Profile analyzed successfully',
        data: { ...payload, id: insertResult.insertId },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

const getProfiles = async (req, res, next) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Math.min(Number(req.query.limit || 10), 100), 1);
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search.trim()}%` : '%';
  const sortBy = ['followers', 'public_repos', 'last_analyzed_at'].includes(req.query.sortBy)
    ? req.query.sortBy
    : 'last_analyzed_at';
  const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

  try {
    const connection = await pool.getConnection();

    try {
      const [countRows] = await connection.execute(
        `SELECT COUNT(*) AS total FROM analyzed_profiles WHERE username LIKE ?`,
        [search]
      );

      const total = countRows[0]?.total ?? 0;
      const [rows] = await connection.execute(
  `SELECT id,
          github_id,
          username,
          name,
          avatar_url,
          bio,
          company,
          blog,
          location,
          public_repos,
          public_gists,
          followers,
          following,
          account_created_at,
          account_updated_at,
          followers_following_ratio,
          account_age_days,
          profile_completeness_score,
          has_bio,
          has_company,
          has_blog,
          last_analyzed_at,
          created_at,
          updated_at
    FROM analyzed_profiles
    WHERE username LIKE ?
    ORDER BY ${sortBy} ${order}
    LIMIT ${Number(limit)}
    OFFSET ${Number(offset)}`,
  [search]
);

      return res.status(200).json({
        success: true,
        message: 'Profiles fetched successfully',
        data: {
          profiles: rows,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

const getProfileByUsername = async (req, res, next) => {
  const { username } = req.params;

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  try {
    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT id,
                github_id,
                username,
                name,
                avatar_url,
                bio,
                company,
                blog,
                location,
                public_repos,
                public_gists,
                followers,
                following,
                account_created_at,
                account_updated_at,
                followers_following_ratio,
                account_age_days,
                profile_completeness_score,
                has_bio,
                has_company,
                has_blog,
                last_analyzed_at,
                created_at,
                updated_at
          FROM analyzed_profiles
          WHERE username = ?
          LIMIT 1`,
        [username.trim()]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        data: rows[0],
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

export { analyzeProfile, getProfiles, getProfileByUsername };
