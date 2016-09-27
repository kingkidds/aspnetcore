var isDevBuild = process.argv.indexOf('--env.prod') < 0;
var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: isDevBuild ? 'inline-source-map' : null,
    resolve: { extensions: [ '', '.js', '.ts' ] },
    entry: { main: ['./ClientApp/boot-client.ts'] },
    module: {
        loaders: [
            { test: /\.ts$/, include: /ClientApp/, loader: 'ts', query: { silent: true } },
            { test: /\.html$/, loader: 'raw' },
            { test: /\.css/, loader: 'to-string!css' },
            { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'url', query: { limit: 25000 } }
        ]
    },
    output: {
        path: path.join(__dirname, 'wwwroot', 'dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./wwwroot/dist/vendor-manifest.json')
        })
    ].concat(isDevBuild ? [] : [
        // Plugins that apply in production builds only
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ])
};
