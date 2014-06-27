var http = require('http');

module.exports = function ($scope, $state, AuthService) {
    'use strict';

    $scope.spinner = angular.element(document.querySelectorAll(".validation-wait"));

    $scope.signIn = function (credentials) {
        var response = {};

        $scope.signingIn = true;

        AuthService.login(credentials || {}, response).then(function () {
            $scope.signingIn = false;
            $state.go('dashboard');
        }, function () {
            // Incorrect Signin
            $scope.signingIn = false;
            if (Math.floor(response.status / 10) === 40) {
                $scope.authError = 'error';
            }
        });
    };
};