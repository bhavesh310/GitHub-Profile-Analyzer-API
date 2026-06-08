import express from 'express';
import { analyzeProfile, getProfiles, getProfileByUsername } from '../controllers/profileController.js';

const router = express.Router();

/**
 * @openapi
 * /analyze/{username}:
 *   post:
 *     tags:
 *       - Profiles
 *     summary: Analyze a GitHub profile and persist insights
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: GitHub username to analyze
 *     responses:
 *       201:
 *         description: Profile analyzed successfully
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */
router.post('/analyze/:username', analyzeProfile);

/**
 * @openapi
 * /profiles:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: Get all analyzed profiles with pagination, search, and sorting
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [followers, public_repos, last_analyzed_at]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Profiles fetched successfully
 */
router.get('/profiles', getProfiles);

/**
 * @openapi
 * /profiles/{username}:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: Get a single analyzed profile by username
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: GitHub username
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       404:
 *         description: Profile not found
 */
router.get('/profiles/:username', getProfileByUsername);

export default router;
