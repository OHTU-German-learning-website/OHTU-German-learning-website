/** @type {import('next').NextConfig} */
const nextConfig = 
    {
        output: 'standalone',
      
        eslint: {
            ignoreDuringBuilds: true,
        },

        // Add environment variables with default values for build time
        env: {
            SESSION_SECRET: process.env.SESSION_SECRET || 'secret',
            DB_HOST: process.env.DB_HOST || 'localhost',
            DB_PORT: process.env.DB_PORT || '5432',
            DB_USER: process.env.DB_USER || 'postgres',
            DB_PASSWORD: process.env.DB_PASSWORD || 'password',
            DB_NAME: process.env.DB_NAME || 'postgres'
        }
};

export default nextConfig;
