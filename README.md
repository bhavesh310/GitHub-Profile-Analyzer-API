# GitHub Profile Analyzer

## Project Overview

GitHub Profile Analyzer is a backend API built with Node.js, Express.js, and MySQL. It analyzes GitHub user profiles using the GitHub public API, computes useful insights, and stores the results in a MySQL database for later querying.

## Features

- Analyze GitHub profiles using GitHub public API
- Store analyzed results in MySQL
- Update existing profiles instead of creating duplicates
- Pagination, search, and sorting for profile listing
- Single profile retrieval by username
- Health check endpoint
- Global error handling
- Rate limiting and request logging
- Swagger/OpenAPI documentation
- API versioning under `/api/v1`

## Folder Structure

```
github-profile-analyzer/
├── sql/
│   └── schema.sql
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── profileController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── routes/
│   │   └── profileRoutes.js
│   ├── services/
│   │   └── githubService.js
│   ├── utils/
│   │   └── analyzer.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Installation Steps

1. Clone the repository or copy the project files.
2. Navigate to the project folder:
   ```bash
   cd github-profile-analyzer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` and update values.
5. Create the database and table using the schema file.

## Environment Variables

Required variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `PORT`
- `GITHUB_API_BASE_URL`
- `GITHUB_API_TIMEOUT`
- `RATE_LIMIT_WINDOW_MINUTES`
- `RATE_LIMIT_MAX_REQUESTS`

## Database Setup

1. Create the database and table:
   ```sql
   SOURCE sql/schema.sql;
   ```
2. Verify the `github_analyzer` database exists.

## API Documentation

The API is versioned under `/api/v1` and exposes the following endpoints:

- `GET /api/v1/health`
- `POST /api/v1/analyze/:username`
- `GET /api/v1/profiles`
- `GET /api/v1/profiles/:username`
- `GET /api/v1/docs`

### Analyze GitHub Profile

`POST /api/v1/analyze/:username`

Request parameters:
- `username` - GitHub username to analyze

Success response:

```json
{
  "success": true,
  "message": "Profile analyzed successfully",
  "data": {
    "username": "octocat",
    "followers_following_ratio": 4,
    "profile_completeness_score": 85
n  }
}
```

### Get All Analyzed Profiles

`GET /api/v1/profiles`

Query parameters:
- `page` (default: `1`)
- `limit` (default: `10`)
- `search` - filter by username
- `sortBy` - `followers`, `public_repos`, or `last_analyzed_at`
- `order` - `asc` or `desc`

### Get Single Profile

`GET /api/v1/profiles/:username`

Success response:

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "username": "octocat",
    "name": "The Octocat"
  }
}
```

## Sample Requests

Analyze profile:

```bash
curl -X POST http://localhost:5000/api/v1/analyze/octocat
```

List profiles:

```bash
curl "http://localhost:5000/api/v1/profiles?page=1&limit=5&search=octo&sortBy=followers&order=desc"
```

Get profile:

```bash
curl http://localhost:5000/api/v1/profiles/octocat
```

## Deployment Instructions

1. Ensure Node.js and MySQL are available in the deployment environment.
2. Set environment variables in the production environment.
3. Run database migrations using `sql/schema.sql`.
4. Start the server:
   ```bash
   npm start
   ```

## Technologies Used

- Node.js
- Express.js
- MySQL
- mysql2
- Axios
- dotenv
- cors
- express-rate-limit
- morgan
- Swagger UI

