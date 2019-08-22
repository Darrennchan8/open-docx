const { resolve } = require('path');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const manifest = require('./src/manifest.json');
const pkg = require('./package.json');

module.exports = {
    mode: "development",
    entry: './src/background.js',
    devtool: 'inline-source-map',
    output: {
        filename: 'background.js',
        path: resolve('dist/unpacked')
    },
    plugins: [
        new WebpackExtensionManifestPlugin({
            config: {
                ...manifest,
                name: pkg.name,
                description: pkg.description,
                version: pkg.version
            }
        })
    ]
};
