angular.module('livewireApp')

    .controller('SigninCtrl', function ($scope, $state, $ionicLoading, $ionicViewService, AuthService) {
        'use strict';

        var showLoading = function () {
            $ionicLoading.show({
                template: 'Signing In...'
            });
        },
            goHome = function () {
                // So that there won't be back button to login page
                $ionicViewService.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('app.providers');
            };

        if (AuthService.retrieveAccessToken()) {
            goHome();
        }

        $scope.signIn = function (credentials) {
            var response = {};

            showLoading();

            AuthService.login(credentials || {}, response).then(function () {
                $ionicLoading.hide();
                goHome();
            }, function () {
                $ionicLoading.hide();
                // Incorrect Signin
                if (Math.floor(response.status / 10) === 40) {
                    $scope.authError = 'error';
                }
            });
        };
    });