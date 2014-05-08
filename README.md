#### WORK IN PROGRESS

# Ionic boilerplate

This project aims to create a sample project with all boilerplate code & best practice for hybrid mobile apps using cordova and ionic framework. I'm not alone doing that, take a look at similar projects :

- [ionic-rocket](https://github.com/yrezgui/ionic-rocket)
- [generator-ionic](https://github.com/diegonetto/generator-ionic)

# Getting started

- `git clone git@github.com:loicknuchel/ionic-boilerplate.git` get code on your laptop
- `cd ionic-boilerplate` go to project root folder
- `npm install` to install all grunt dependencies
- `bower install` to install all bower dependencies
- `grunt serve` to test on your computer
- `mkdir platforms` create platforms folder (essential for cordova)
- `mkdir plugins` create plugins folder (essential for cordova)
- `mkdir www` create www folder (essential for cordova)
- `cordova platform add android` add android platform to the project
- `grunt build && cordova run android` to run app on your phone

# Grunt commands

- `grunt serve` use it to develop. It will open your project in browser with live realod.
- `grunt ripple` is an alternative to `grunt serve`. It will open your project in adobe ripple editor with live realod.
- `grunt build` builds your sources and put them in www/ folder to deploy on your device.

# Versions

- Node v0.10.26 (`node -v`)
- Cordova 3.4.1-0.1.0 (`cordova -version`)
- Bower 1.3.2 (`bower -v`)
- Ionic 1.0.0-beta.1 (see www/bower_components/ionic/release/version.json)

# Reminder

- `cordova create ionic-boilerplate com.example.IonicBoilerplate IonicBoilerplate` : Create cordova app
- `cordova platform add android` : Add android platform
