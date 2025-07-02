/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "avatars.githubusercontent.com",
				protocol: "https",
			},
		],
		domains: ["lh3.googleusercontent.com"],
	},
};

module.exports = nextConfig;
