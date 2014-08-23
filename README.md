LiveWire App
=====================

LiveWire app built using [Cordova](http://cordova.apache.org) (PhoneGap) and [Ionic](http://ionicframework.com)

## Set up

After installing Cordova, run:

    npm install
    bower install

## Developing

This project uses the [git-flow](http://nvie.com/posts/a-successful-git-branching-model/) branching model, so the main development branch is develop.

The task runner is [gulp](http://gulpjs.com/), and running `gulp` will automatically start the watching system and livereload server.

## Updating Ionic

To update to a new version of Ionic, open bower.json and change the version listed there.

For example, to update from version `1.0.0-beta.4` to `1.0.0-beta.5`, open bower.json and change this:

```
"ionic": "driftyco/ionic-bower#1.0.0-beta.4"
```

To this:

```
"ionic": "driftyco/ionic-bower#1.0.0-beta.5"
```

After saving the update to bower.json file, run `bower install`.

#### Using the Nightly Builds of Ionic

If you feel daring and want use the bleeding edge 'Nightly' version of Ionic, change the version of Ionic in your bower.json to this:

```
"ionic": "driftyco/ionic-bower#master"
```

Warning: the nightly version is not stable.

