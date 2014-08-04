(function () {
    'use strict';

    // Load npm dependencies
    require('./opentok/opentok');
    require('./chat/chat');
    require('firebase');
    require('angularfire');

    angular.module('livewireApp', ['ionic', 'templatescache', 'opentok', 'chat', 'firebase'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            var currentdate = new Date();

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard && !window.tinyHippos) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
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

            // Hide Splash Screen
            navigator.splashscreen.hide();

            // Print current time
            console.log(currentdate.getHours() + ":" +
                        currentdate.getMinutes() + ":" +
                        currentdate.getSeconds());
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('signin', {
            url: "/signin",
            templateUrl: "/partials/signin/signin.html",
            controller: "SigninCtrl"
        })

        .state('register', {
            url: "/register",
            templateUrl: "/partials/register/register.html",
            controller: "RegisterCtrl"
        })

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "/partials/app/menu.html",
            controller: "AppCtrl"
        })

        .state('app.providers', {
            url: "/providers",
            views: {
                'menuContent': {
                    templateUrl: "/partials/app/providers/providers.html",
                    controller: "ProvidersCtrl"
                }
            }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/signin');
    })

    .run(function ($rootScope, AuthService) {
        var role, roles, roleFn;
        roles = AuthService.Role;

        roleFn = function (roleToCheck) {
            return function () {
                return AuthService.getRole() === roleToCheck;
            };
        };

        // isRole functions
        for (role in roles) {
            if (Object.prototype.hasOwnProperty.call(roles, role)) {
                $rootScope['is' + roles[role].charAt(0).toUpperCase() + roles[role].slice(1)] = roleFn(roles[role]);
            }
        }
    });

    // Register root-view controller
    require('./controllers/app');

    // Register services
    require('./services/api');
    require('./services/auth');
    require('./services/opentok.js');
}());
