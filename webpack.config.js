import webpack from 'webpack'

export default {
  entry: {
    cli: './src/cli.js',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      test: ['cli.js'],
    }),
  ],
}
