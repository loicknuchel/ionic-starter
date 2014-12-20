// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/ionic/release/js/ionic.js',
      'app/bower_components/ionic/release/js/ionic-angular.js',
      'app/bower_components/ngCordova/dist/ng-cordova.js',
      'app/bower_components/localforage/dist/localforage.js',
      'app/bower_components/angular-localforage/dist/angular-localForage.js',
      'app/bower_components/moment/moment.js',
      'app/bower_components/moment-duration-format/lib/moment-duration-format.js',
      'app/bower_components/lodash/dist/lodash.compat.js',
      // endbower
      'app/bower_components/angular-mocks/angular-mocks.js', // should be added because it's in devDependencies...
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
