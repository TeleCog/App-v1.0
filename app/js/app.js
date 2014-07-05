(function () {
    'use strict';

    var livewireApp = angular.module('livewireApp', ['ionic']);

    livewireApp

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    window.StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {

            $stateProvider

                .state('signin', {
                    url: "/signin",
                    templateUrl: "partials/signin.html",
                    controller: "SigninCtrl"
                })

                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "partials/menu.html",
                    controller: 'AppCtrl'
                })

                .state('app.home', {
                    url: "/home",
                    views: {
                        'menuContent': {
                            templateUrl: "partials/home.html"
                        }
                    }
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/signin');
        });

    // Register services
    require('./controllers/signin');
    (require('./services/authservice'))(livewireApp);

}());