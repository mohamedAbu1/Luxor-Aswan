/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dxpbyrcbklqrjlytmkum.supabase.co" },
      { protocol: "https", hostname: "bsrlydzntfpuyxcqwjpl.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    qualities: [75, 85, 100], // ✅ لتفادي التحذير في Next.js 16
  },
};

export default nextConfig;
