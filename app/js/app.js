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
            if (!window.tinyHippos && window.hockeyapp) {
                var hockeyAppKey;
                if (document.body.classList.contains('platform-android')) {
                    hockeyAppKey = '1ece6be4a8270fd8f507a1136670b9f3';
                } else {
                    hockeyAppKey = 'df827303790bb10d09a30f9622adf145';
                }

                hockeyapp.start(function () {
                    console.log("HockeyApp started");
                }, function () {
                    console.log("HockeyApp could not start");
                }, hockeyAppKey);
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

        .state('app.dashboard', {
            url: "/dashboard",
            views: {
                'menuContent': {
                    abstract: true,
                    template: '<ui-view/>',
                    controller: "DashboardCtrl"
                }
            }
        })

        // Customer's dashboard with list of providers
        .state('app.dashboard.providers', {
            url: "/providers",
            templateUrl: "/partials/app/dashboard/customer/providers.html",
            controller: "ProvidersCtrl"
        })

        // Provider's dashboard with list of customers
        .state('app.dashboard.customers', {
            url: "/customers",
            templateUrl: "/partials/app/dashboard/provider/customers.html",
            controller: "CustomersCtrl"
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

    // Register Directives
    require('./directives/pushContent');

    // Register services
    require('./services/api');
    require('./services/auth');
    require('./services/opentok');
    require('./services/heartbeat');
}());
