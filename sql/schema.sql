CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

CREATE TABLE IF NOT EXISTS analyzed_profiles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  github_id INT UNSIGNED NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  avatar_url VARCHAR(512),
  bio TEXT,
  company VARCHAR(255),
  blog VARCHAR(512),
  location VARCHAR(255),
  public_repos INT UNSIGNED NOT NULL DEFAULT 0,
  public_gists INT UNSIGNED NOT NULL DEFAULT 0,
  followers INT UNSIGNED NOT NULL DEFAULT 0,
  following INT UNSIGNED NOT NULL DEFAULT 0,
  account_created_at DATETIME NOT NULL,
  account_updated_at DATETIME NOT NULL,
  followers_following_ratio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  account_age_days INT UNSIGNED NOT NULL DEFAULT 0,
  profile_completeness_score TINYINT UNSIGNED NOT NULL DEFAULT 0,
  has_bio TINYINT(1) NOT NULL DEFAULT 0,
  has_company TINYINT(1) NOT NULL DEFAULT 0,
  has_blog TINYINT(1) NOT NULL DEFAULT 0,
  last_analyzed_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_followers (followers),
  INDEX idx_public_repos (public_repos),
  INDEX idx_last_analyzed_at (last_analyzed_at)
);
