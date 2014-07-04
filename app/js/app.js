(function () {
    'use strict';

    var livewireApp = angular.module('livewireApp', ['ionic']);

    livewireApp

        .config(function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('signin', {
                    url: "/sign-in",
                    templateUrl: "sign-in.html",
                    controller: require('./controllers/signinctrl')
                })
                .state('forgotpassword', {
                    url: "/forgot-password",
                    templateUrl: "forgot-password.html"
                })
                .state('dashboard', {
                    url: "/dashboard",
                    templateUrl: "dashboard.html",
                    controller: require('./controllers/dashboardctrl')
                });


            $urlRouterProvider.otherwise("/sign-in");

        })

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
        });

    // Register services
    (require('./services/authservice'))(livewireApp);

}());