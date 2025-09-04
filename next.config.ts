import createMDX from '@next/mdx';
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}

const withMDX = createMDX({
  //
  extension: /\.(md|mdx)$/
})
 
module.exports = withMDX(nextConfig)