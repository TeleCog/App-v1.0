(function () {
    'use strict';

    angular.module('livewireApp', ['ionic', 'templatescache'])

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
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/signin');
        });

    // Register root-view controller
    require('./controllers/app');

    // Register services
    require('./services/api');
    require('./services/auth');

}());