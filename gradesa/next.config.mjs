/** @type {import('next').NextConfig} */
const nextConfig = 
    {

        output: 'standalone',
      
        eslint: {
      
          // Don't run ESLint during production builds
      
          ignoreDuringBuilds: true,
      
        }
};

export default nextConfig;
