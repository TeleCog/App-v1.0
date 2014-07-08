angular.module('livewireApp')

    .controller('SigninCtrl', function ($scope, $state, $ionicLoading, $ionicViewService, AuthService) {
        'use strict';

        $scope.signIn = function (credentials) {
            var response = {};

            $ionicLoading.show({
                template: 'Signing In...'
            });

            AuthService.login(credentials || {}, response).then(function () {
                $ionicLoading.hide();
                // So that there won't be back button to login page
                $ionicViewService.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('app.home');
            }, function () {
                $ionicLoading.hide();
                // Incorrect Signin
                if (Math.floor(response.status / 10) === 40) {
                    $scope.authError = 'error';
                }
            });
        };
    });