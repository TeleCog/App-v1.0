var http = require('http');

module.exports = function ($scope, $state, AuthService) {
    'use strict';

    $scope.signIn = function (credentials) {
        var response = {};
        AuthService.login(credentials || {}, response).then(function () {
            $state.go('dashboard');
        }, function () {
            // Incorrect Signin
            if (Math.floor(response.status / 10) === 40) {
                $scope.authError = 'error';
            }
        });
    };
};