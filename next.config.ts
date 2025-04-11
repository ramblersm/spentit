/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disable PWA in dev
})

const nextConfig = {
  reactStrictMode: true,
eslint: {
    ignoreDuringBuilds: true, // <-- This line skips lint errors
  },
}

module.exports = withPWA(nextConfig)
