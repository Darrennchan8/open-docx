const merge = require('lodash/merge');
const { resolve } = require('path');
const ExtensionReloader = require('webpack-extension-reloader');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const manifest = require('./src/manifest.json');
const pkg = require('./package.json');

const baseConfig = {
    mode: 'production',
    entry: {
        background: './src/background.js'
    },
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

module.exports = (env={}) => merge(
    baseConfig,
    env.watch ? {
        mode: "development",
        devtool: 'inline-source-map',
        watch: true,
        plugins: [
            new ExtensionReloader({
                entries: {
                    background: 'background'
                }
            })
        ]
    } : {})
