angular.module('livewireApp')

.controller('AppCtrl', function ($scope, $window, AuthService) {
    'use strict';

    $scope.signOut = function () {
        AuthService.invalidateToken();
        $window.location.reload();
    };

    console.log("AppCtrl");
});

// Require sub controllers
require('./signin');
require('./register');
require('./dashboard/dashboard');
require('./dashboard/providers');
require('./dashboard/customers');
require('./video');
