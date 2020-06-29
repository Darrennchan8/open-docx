const isPlainObject = require('is-plain-object');
const merge = require('deepmerge');
const { resolve } = require('path');
const ExtensionReloader = require('webpack-extension-reloader');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');

const getBaseConfig = () => {
    const manifest = require('./src/manifest.json');
    const pkg = require('./package.json');
    return {
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
    }
};

module.exports = (env={}) => merge.all([
    getBaseConfig(),
    env.watch ? {
        mode: "development",
        devtool: 'inline-source-map',
        watch: true,
        plugins: [
            new ExtensionReloader({
                entries: {
                    background: 'background'
                }
            }),
            new ExtraWatchWebpackPlugin({
                files: ['src/manifest.json']
            })
        ]
    } : {}
], {
    isMergeableObject: o => isPlainObject(o) || Array.isArray(o)
})
