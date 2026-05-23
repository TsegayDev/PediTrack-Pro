import type { NextConfig } from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
let basePath = '';

if (isGithubActions && process.env.GITHUB_REPOSITORY) {
  const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
  // If it's a project repository (not username.github.io), set basePath to /repo-name
  if (repo && !repo.toLowerCase().endsWith('.github.io')) {
    basePath = `/${repo}`;
  }
}

const nextConfig: NextConfig = {
  output: 'export',        // Enable static export for GitHub Pages
  trailingSlash: true,     // Ensure clean URLs like /home/index.html are generated
  reactStrictMode: true,   // Recommended for React robustness

  images: {
    unoptimized: true,     // Required for static export (no Next.js optimization server)
  },

  basePath: basePath,      // Dynamically handle repository paths
};

export default nextConfig;

