#### WORK IN PROGRESS

# Ionic boilerplate

This project aims to create a sample project with all boilerplate code & best practice for hybrid mobile apps using cordova and ionic framework.
Alternativly, you can try the [yeoman ionic generator](https://github.com/diegonetto/generator-ionic).

# Getting started

- `git clone git@github.com:loicknuchel/ionic-boilerplate.git` get code on your laptop
- `cd ionic-boilerplate` go to project root folder
- `mkdir platforms` create platforms folder (essential for cordova)
- `mkdir plugins` create plugins folder (essential for cordova)
- `cordova platform add android` add android platform to the project
- `bower install` to install all bower dependencies
- `cordova run android` run app on your phone

# Versions

- Node v0.10.26 (`node -v`)
- Cordova 3.4.1-0.1.0 (`cordova -version`)
- Bower 1.3.2 (`bower -v`)

# Reminder

- `cordova create ionic-boilerplate org.knuchel.ionicboilerplate HelloIonic` : Create cordova app
- `cordova platform add android` : Add android platform
