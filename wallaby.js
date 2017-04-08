module.exports = function (wallaby) {
    return {
        files: [
      { pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false },
            'build/**/*.js',
        ],

        tests: [
            'test/**/*test.js',
        ],

        setup() {
            global.expect = require('chai').expect;
        },

        compilers: {
            '**/*.js': wallaby.compilers.babel()
        },

        env: {
            type: 'node',
            runner: 'node',
        },
    };
};
