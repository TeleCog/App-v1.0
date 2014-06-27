module.exports = function ($scope, $state) {
    'use strict';

    $scope.signIn = function (user) {
        console.log('Sign-Ins', user);
        $state.go('dashboard');
    };
};