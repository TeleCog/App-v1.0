(function () {
    'use strict';

    // Load npm dependencies
    require('./opentok/opentok');

    angular.module('livewireApp', ['ionic', 'templatescache', 'opentok'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            var currentdate = new Date();

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard
                && !window.tinyHippos) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    window.StatusBar.styleDefault();
                }
                // HockeyApp SDK
                if (!window.tinyHippos) {
                    hockeyapp.start(function () {
                        console.log("HockeyApp started");
                    }, function () {
                        console.log("HockeyApp could not start");
                    }, "df827303790bb10d09a30f9622adf145");
                }

                // Print current time
                console.log(currentdate.getHours() + ":"
                            + currentdate.getMinutes() + ":"
                            + currentdate.getSeconds());
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('signin', {
            url: "/signin",
            templateUrl: "/partials/signin.html",
            controller: "SigninCtrl"
        })

        .state('register', {
            url: "/register",
            templateUrl: "/partials/register.html",
            controller: "RegisterCtrl"
        })

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "/partials/menu.html",
            controller: "AppCtrl"
        })

        .state('app.providers', {
            url: "/providers",
            views: {
                'menuContent': {
                    templateUrl: "/partials/main/providers.html",
                    controller: "ProvidersCtrl"
                }
            }
        })

        .state('app.video', {
            url: "/video",
            views: {
                'menuContent': {
                    templateUrl: '/partials/main/video.html',
                    controller: "VideoCtrl"
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/signin');
    });

    // Register root-view controller
    require('./controllers/app');

    // Register services
    require('./services/api');
    require('./services/auth');
    require('./services/opentok.js');
}());
