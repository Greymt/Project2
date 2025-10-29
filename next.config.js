const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const withImages = require("next-images");
const withFonts = require("next-fonts");
const withPlugins = require("next-compose-plugins");

module.exports = async (phase) => {
  /** @type {import("next").NextConfig} */
  const nextConfig = {
    webpack: (config, { dev, isServer }) => {
      // https://github.com/webpack-contrib/mini-css-extract-plugin#recommended
      // For production builds it's recommended to extract the CSS from your bundle being able to use parallel loading of CSS/JS resources later on.
      // For development mode, using style-loader because it injects CSS into the DOM using multiple <style></style> and works faster.
      if (!dev) {
        config.plugins.push(new MiniCssExtractPlugin({
          filename: 'static/chunks/[name].[fullhash].css',
          ignoreOrder: true
        }));
      }

      // Handle Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        net: false,
        tls: false,
        fs: false,
      };

      config.module.rules.push(
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            isServer ? { loader: 'file-loader' } : (dev ? { loader: 'style-loader' } : { loader: MiniCssExtractPlugin.loader }),
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ]
        }
      );
      return config;
    },
    typescript: {
      ignoreBuildErrors: true
    },
    swcMinify: false,
    poweredByHeader: false,
    trailingSlash: true,
    distDir: ".next"
  }
  return withPlugins([withImages, withFonts], nextConfig)(phase, { defaultConfig: {} })
}
