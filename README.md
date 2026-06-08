# 🔍 GitHub Profile Analyzer

> A backend REST API that analyzes GitHub user profiles using the GitHub public API, computes insights, and persists results in a MySQL database.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

# Overview

**GitHub Profile Analyzer** is a production-ready backend API that fetches and analyzes GitHub profiles on demand. It computes metrics like follower-to-following ratio and profile completeness score, stores results in MySQL, and exposes a clean, versioned REST API for querying those results.

The project demonstrates how a well-structured Node.js backend — with proper middleware, error handling, rate limiting, and auto-generated API docs — should look and behave in a real-world setting.

> Analyze once. Query forever.

---

# Features

- 🔗 **GitHub Integration** — Fetches live profile data via the GitHub public API
- 🧠 **Profile Insights** — Computes follower/following ratio and profile completeness score
- 🗄️ **MySQL Persistence** — Stores and updates analyzed profiles without duplicates
- 📋 **Paginated Listing** — Supports pagination, search, and multi-field sorting
- 🔎 **Single Profile Lookup** — Retrieve any analyzed profile by username
- ❤️ **Health Check Endpoint** — Simple uptime monitoring
- 🛡️ **Rate Limiting** — Protects the API from abuse
- 📝 **Request Logging** — Morgan-powered HTTP request logs
- 📖 **Swagger Docs** — Auto-generated OpenAPI documentation at `/api/v1/docs`
- 🔢 **API Versioning** — All routes scoped under `/api/v1`
- ⚠️ **Global Error Handling** — Centralized, consistent error responses

---

# Tech Stack

| Layer              | Technology         |
| ------------------ | ------------------ |
| Runtime            | Node.js            |
| Framework          | Express.js         |
| Database           | MySQL              |
| Database Driver    | mysql2             |
| HTTP Client        | Axios              |
| API Docs           | Swagger UI         |
| Rate Limiting      | express-rate-limit |
| Request Logging    | Morgan             |
| Environment Config | dotenv             |
| CORS               | cors               |

---

# Project Structure

```text
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

---

# Getting Started

## Prerequisites

- Node.js 18+
- MySQL 8+
- npm / pnpm / bun
- Git

## Installation

```bash
# Clone the repository
git clone https://github.com/bhavesh310/github-profile-analyzer.git

# Navigate to the project directory
cd github-profile-analyzer

# Install dependencies
npm install

# Copy environment config
cp .env.example .env
```

Edit `.env` and fill in your database credentials and configuration values.

## Database Setup

```sql
SOURCE sql/schema.sql;
```

Verify the `github_analyzer` database and tables exist before starting the server.

## Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

# Environment Variables

Create a `.env` file based on `.env.example` and configure the following:

| Variable                   | Description                            |
| -------------------------- | -------------------------------------- |
| `DB_HOST`                  | MySQL host (e.g., `localhost`)         |
| `DB_PORT`                  | MySQL port (e.g., `3306`)              |
| `DB_USER`                  | MySQL username                         |
| `DB_PASSWORD`              | MySQL password                         |
| `DB_NAME`                  | Database name (`github_analyzer`)      |
| `PORT`                     | Server port (e.g., `5000`)             |
| `GITHUB_API_BASE_URL`      | GitHub API base URL                    |
| `GITHUB_API_TIMEOUT`       | Request timeout in milliseconds        |
| `RATE_LIMIT_WINDOW_MINUTES`| Rate limit window duration             |
| `RATE_LIMIT_MAX_REQUESTS`  | Max requests per window per IP         |

---

# API Reference

All endpoints are versioned under `/api/v1`.

| Method | Endpoint                        | Description                    |
| ------ | ------------------------------- | ------------------------------ |
| GET    | `/api/v1/health`                | Health check                   |
| POST   | `/api/v1/analyze/:username`     | Analyze a GitHub profile       |
| GET    | `/api/v1/profiles`              | List all analyzed profiles     |
| GET    | `/api/v1/profiles/:username`    | Get a single profile           |
| GET    | `/api/v1/docs`                  | Swagger UI documentation       |

---

## Analyze a GitHub Profile

```http
POST /api/v1/analyze/:username
```

**Path Parameters**

| Parameter  | Description             |
| ---------- | ----------------------- |
| `username` | GitHub username to analyze |

**Success Response**

```json
{
  "success": true,
  "message": "Profile analyzed successfully",
  "data": {
    "username": "octocat",
    "followers_following_ratio": 4,
    "profile_completeness_score": 85
  }
}
```

---

## Get All Analyzed Profiles

```http
GET /api/v1/profiles
```

**Query Parameters**

| Parameter | Default | Description                                      |
| --------- | ------- | ------------------------------------------------ |
| `page`    | `1`     | Page number                                      |
| `limit`   | `10`    | Results per page                                 |
| `search`  | —       | Filter by username                               |
| `sortBy`  | —       | `followers`, `public_repos`, or `last_analyzed_at` |
| `order`   | —       | `asc` or `desc`                                  |

---

## Get Single Profile

```http
GET /api/v1/profiles/:username
```

**Success Response**

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

---

# Sample Requests

```bash
# Analyze a GitHub profile
curl -X POST http://localhost:5000/api/v1/analyze/octocat

# List profiles with filters
curl "http://localhost:5000/api/v1/profiles?page=1&limit=5&search=octo&sortBy=followers&order=desc"

# Fetch a single profile
curl http://localhost:5000/api/v1/profiles/octocat

# Health check
curl http://localhost:5000/api/v1/health
```

---

# Deployment

1. Ensure Node.js and MySQL are available in the target environment.
2. Set all required environment variables.
3. Run the schema to initialize the database:
   ```bash
   mysql -u root -p < sql/schema.sql
   ```
4. Build and start:
   ```bash
   npm start
   ```

Compatible with any Node.js hosting platform — Railway, Render, AWS EC2, DigitalOcean, and more.

---

# Author

## Bhavesh Ghatode

Full Stack Developer • Backend Engineer • AI Builder

### Connect

- GitHub: [github.com/bhavesh310](https://github.com/bhavesh310)
- LinkedIn: [linkedin.com/in/bhavesh-kumar-4466a3276](https://www.linkedin.com/in/bhavesh-kumar-4466a3276)

---

<p align="center">
  <i>Built with Node.js, Express, and a relentless focus on clean backend architecture.</i>
</p>
