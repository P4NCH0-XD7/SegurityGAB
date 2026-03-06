/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development warnings
    reactStrictMode: true,

    // Image optimization configuration
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.amazonaws.com',
                pathname: '/**',
            },
        ],
    },

    // Environment variables exposed to the browser
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    },
};

module.exports = nextConfig;
