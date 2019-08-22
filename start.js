const chromeLaunch = require('chrome-launch');
const { resolve } = require('path');

const START_URL = 'http://hhoppe.com/microsoft_word_examples.html';
const EXTENSION_PATH = resolve('dist/unpacked');

chromeLaunch(START_URL, {
    args: [`--load-extension=${EXTENSION_PATH}`]
});
