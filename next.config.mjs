
/** @type {import('next').NextConfig} */
const nextConfig = {
       experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase body limit for Server Actions
    },
  },
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '**'
            },
            {
                protocol:'https',
                hostname: 'res.cloudinary.com',
                pathname: '**'
            }
        ]
    },
  
};

export default nextConfig;

