/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
            fullUrl: true,
        },
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cbhskjvapedefwrhfhef.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/cabin-images/**",
            },
        ],
    },
};

export default nextConfig;
