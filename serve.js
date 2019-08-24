const { resolve } = require('path');
const chromeLaunch = require('chrome-launch');
const config = require('./webpack.config.js');
const webpack = require('webpack');

const TEST_URL = 'http://hhoppe.com/microsoft_word_examples.html';
const EXTENSION_PATH = resolve('dist/unpacked');

let launched = false;

webpack(config({
    watch: true
}), (err, stats) => {
    if (err) {
        console.error(err);
    } else if (!launched) {
        launched = true;

        chromeLaunch(TEST_URL, {
            args: [`--load-extension=${EXTENSION_PATH}`]
        });
    }

    console.log(stats.toString({
        chunks: false,
        colors: true
    }));
});
