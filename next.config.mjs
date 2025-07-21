/** @type {import('next').NextConfig} */
const nextConfig = { 
    images: {
    remotePatterns: [
       { protocol:"https",
        hostname:'randomuser.me',
    },
    ], // Add the domain here
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};



export default nextConfig;
