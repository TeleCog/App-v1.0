angular.module('livewireApp')

    .controller('RegisterCtrl', function ($scope, $state, $ionicViewService, AuthService) {
        'use strict';

        $scope.signIn = function (credentials) {
            var response = {};

            $scope.signingIn = true;

            AuthService.login(credentials || {}, response).then(function () {
                $scope.signingIn = false;
                // So that there won't be back button to login page
                $ionicViewService.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('app.home');
            }, function () {
                // Incorrect Signin
                $scope.signingIn = false;
                if (Math.floor(response.status / 10) === 40) {
                    $scope.authError = 'error';
                }
            });
        };
    });