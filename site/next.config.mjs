import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  images: { unoptimized: true }, // static export has no image optimizer
  reactStrictMode: true,
  agentRules: false,
};

export default withMDX(config);
