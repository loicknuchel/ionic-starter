#### WORK IN PROGRESS

# Ionic boilerplate

This project aims to let you start really quickly a new ionic project by simply cloning this repo. This app comes with an setted up environment, usefull boilerplate code and best practices with ionic.
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

- `git clone git@github.com:loicknuchel/ionic-boilerplate.git` get code on your laptop
- `cd ionic-boilerplate` go to project root folder
- `npm install` to install all grunt dependencies
- `bower install` to install all bower dependencies
- `grunt serve` to test on your computer

Your app is now running to your computer. To run it to your android device :

- `mkdir platforms plugins www` create folders for cordova
- `cordova platform add android` add android platform to the project
- `cordova plugin add org.apache.cordova.device org.apache.cordova.console https://github.com/driftyco/ionic-plugins-keyboard` add interesting plugins
- `grunt build && cordova run android` to run app on your phone

# Grunt commands

- `grunt serve` use it to develop. It will open your project in browser with live realod.
- `grunt ripple` is an alternative to `grunt serve`. It will open your project in adobe ripple editor with live realod.
- `grunt build` builds your sources and put them in www/ folder to deploy on your device.

# Personalize

If you use this template project, you might want to rename it. Here are all the place you have to change to do it :

- `bower.json`
- `config.xml`
- `package.json`

# Versions

- Node v0.10.26 (`node -v`)
- Cordova 3.5.0-0.2.4 (`cordova -version`)
- Bower 1.3.4 (`bower -v`)
- Ionic 1.0.0-beta.6 (see www/bower_components/ionic/release/version.json)

# Reminder

- `cordova create ionic-boilerplate com.example.IonicBoilerplate IonicBoilerplate` : Create cordova app
