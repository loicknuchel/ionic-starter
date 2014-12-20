# Ionic starter

This repo aims to let you start really quickly a new ionic project by simply cloning this repo. This app comes with an setted up environment, usefull boilerplate code and best practices with ionic.
Feel free to open an issue to any question or suggestion you could have.

I'm not alone trying to achieve that, take a look at similar projects :

- [ionic-rocket](https://github.com/yrezgui/ionic-rocket)
- [generator-ionic](https://github.com/diegonetto/generator-ionic)
- [ionic-cli](http://ionicframework.com/getting-started/)

Tool used :

- [NodeJS](http://nodejs.org/)
- [Grunt](http://gruntjs.com/)
- [Bower](http://bower.io/)
- [Sass](http://sass-lang.com/) (has dependency on [Ruby](https://www.ruby-lang.org/))
- [Cordova](http://cordova.apache.org/)
- [AngularJS](https://angularjs.org/)
- [Ionic](http://ionicframework.com/)

# Getting started

- `git clone git@github.com:loicknuchel/ionic-starter.git` : get code on your laptop
- `cd ionic-starter` : go to project root folder
- `npm install` : install all grunt dependencies
- `bower install` : to install all bower dependencies
- `grunt serve` : to test on your computer
- You're now ready with a shiny livereload :D

To run it to your android device :

- `mkdir platforms plugins www` : create cordova folders
- `cordova platform add android` : add android platform to the project
- `cordova plugin add org.apache.cordova.device org.apache.cordova.console https://github.com/driftyco/ionic-plugins-keyboard` : add interesting plugins
- `grunt build && cordova run android` : build the app and run it on your phone

You have also other grunt commands :

- `grunt test` : run your test suite

# Personalize

If you use this template project, you might want to rename it. Here are all the place you have to change to do it :

- `config.xml`
- `bower.json`
- `package.json`

# Versions

- Node v0.10.26 (`node -v`)
- Cordova 4.1.2 (`cordova -version`)
- Bower 1.3.11 (`bower -v`)
- Ionic 1.0.0-beta.14 (see www/bower_components/ionic/release/version.json)

# TODO

- plugins added :
    - org.apache.cordova.device (http://ngcordova.com/docs/plugins/device/)
    - org.apache.cordova.console
    - https://github.com/driftyco/ionic-plugins-keyboard
- add standard usefull plugins :
    - org.apache.cordova.splashscreen (http://ngcordova.com/docs/plugins/splashscreen/)
    - https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git
    - org.apache.cordova.dialogs (http://ngcordova.com/docs/plugins/dialogs/)
    - de.appplant.cordova.plugin.local-notification (http://ngcordova.com/docs/plugins/localNotification/)
    - org.apache.cordova.statusbar (http://ngcordova.com/docs/plugins/statusbar/)
    - https://github.com/pushandplay/cordova-plugin-apprate (http://ngcordova.com/docs/plugins/appRate/)
    - https://github.com/whiteoctober/cordova-plugin-app-version (http://ngcordova.com/docs/plugins/appVersion/)
