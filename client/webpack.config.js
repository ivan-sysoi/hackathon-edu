const path = require('path')
const devServer = require('@webpack-blocks/dev-server2')
const splitVendor = require('webpack-blocks-split-vendor')
const happypack = require('webpack-blocks-happypack')
const serverSourceMap = require('webpack-blocks-server-source-map')
const nodeExternals = require('webpack-node-externals')
const AssetsByTypePlugin = require('webpack-assets-by-type-plugin')
const ChildConfigPlugin = require('webpack-child-config-plugin')
const SpawnPlugin = require('webpack-spawn-plugin')
//const SpawnPlugin = require('spawn-webpack-plugin')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const OfflinePlugin = require('offline-plugin')

const {
  addPlugins, createConfig, entryPoint, env, setOutput,
  sourceMaps, defineConstants, webpack, group,
} = require('@webpack-blocks/webpack2')

const isProduction = process.env.NODE_ENV === 'production'

const host = process.env.HOST || 'localhost'
const port = (+process.env.PORT + 1) || 3001
const sourceDir = 'src'
const publicName = 'public'
const sourcePath = path.join(process.cwd(), sourceDir)
const domain = isProduction ? '/public/' : `http://${host}:${port}/`

const distPath = path.join(process.cwd(), isProduction ? 'dist' : 'dev_dist')

const babel = () => () => ({
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
})

const assets = () => () => {
  let loaders
  if (isProduction) {
    loaders = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            minimize: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: (loader) => {
              const plugins = [
                require('postcss-plugin'),
                require('postcss-discard-duplicates'),
                require('autoprefixer')({
                  browsers: [
                    'last 3 version',
                    'ie >= 10',
                  ],
                }),
              ]
              return plugins
            },
          },
        },
        {
          loader: 'sass-loader',
        },
      ],
    })
  } else {
    loaders = [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: (loader) => {
            const plugins = [
              require('postcss-plugin'),
              require('postcss-discard-duplicates'),
              require('autoprefixer')({
                browsers: [
                  'last 3 version',
                  'ie >= 10',
                ],
              }),
            ]
            return plugins
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [path.join(__dirname, sourcePath)]
        },
      },
    ]
  }
  return {
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|svg|woff2?|ttf|eot)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        },
        {
          test: /\.scss$/,
          use: loaders,
        },
      ],
    },
  }
}

const resolveModules = () => () => ({
  resolve: {
    modules: [path.resolve(__dirname, sourceDir), 'node_modules'],
    alias: {
      styles: path.resolve(__dirname, './src/assets/styles/'),
      leaflet: path.resolve(__dirname, './node_modules/leaflet/dist/leaflet.js'),
    },
  },
})

const base = () => group([
  setOutput({
    filename: '[name].[contenthash].js',
    path: path.join(distPath, publicName),
    publicPath: domain,
  }),
  defineConstants({
    'process.env.NODE_ENV': process.env.NODE_ENV,
  }),
  addPlugins([
    new webpack.ProgressPlugin(),
    new ExtractTextPlugin('[contenthash].css'),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),
    new OfflinePlugin(),
  ]),

  assets(),
  resolveModules(),

  env('development', [
    happypack([
      babel(),
    ]),
  ]),
  env('production', [
    babel(),
  ]),
])

const server = createConfig([
  base(),
  entryPoint({ server: path.join(sourcePath, 'server.js') }),
  setOutput({
    filename: '../[name].js',
    libraryTarget: 'commonjs2',
  }),
  addPlugins([
    new webpack.BannerPlugin({
      banner: 'global.assets = require("./assets.json");',
      raw: true,
    }),
  ]),
  () => ({
    target: 'node',
    externals: [nodeExternals()],
    stats: 'verbose',
  }),

  env('development', [
    serverSourceMap(),
    addPlugins([
      //new SpawnPlugin({
      //  command: 'npm run start:dev', // Required. Just put a valid command you can run on terminal
      //  sync: true, // Optional. `false` by default
      //  //spawn: require('cross-spawn') // Optional. Just use it if you want to use another version of `require('child_process').spawn`
      //})
      new SpawnPlugin('npm', ['run', 'start:dev'], {
        detached: false,
        stdio: 'inherit',
        shell: true,
      }),
    ]),
    () => ({
      watch: true,
    }),
  ]),
])

const client = createConfig([
  base(),
  entryPoint({
    client: path.join(sourcePath, 'client.js'),
  }),
  addPlugins([
    new AssetsByTypePlugin({ path: path.join(distPath, 'assets.json') }),
    new ChildConfigPlugin(server),
  ]),

  env('development', [
    devServer({
      contentBase: publicName,
      historyApiFallback: { index: `/${publicName}/` },
      headers: { 'Access-Control-Allow-Origin': '*' },
      allowedHosts: [
        'localhost:3000',
      ],
      proxy: {
        //api: 'http://77.77.77.77:8000/api',
        //auth: 'http://77.77.77.77:8000/auth',
      },
      publicPath: '/',
      compress: true,
      host,
      port,
    }),
    sourceMaps(),
    addPlugins([
      new webpack.NamedModulesPlugin(),
    ]),
  ]),

  env('production', [
    splitVendor(),
    addPlugins([
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
        },
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        comments: false,
      }),
      //new CompressionPlugin({
      //  asset: '[path].gz[query]',
      //  algorithm: 'gzip',
      //  test: /\.(js|html)$/,
      //  threshold: 10240,
      //  minRatio: 0.8
      //}),
    ]),
  ]),
])
module.exports = client
