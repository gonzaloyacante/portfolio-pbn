module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/djlknirsd/**",
      },
    ],
    domains: ["res.cloudinary.com"],
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
};
