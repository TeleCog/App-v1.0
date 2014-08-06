angular.module('livewireApp')

.controller('AppCtrl', function ($scope, $state, $ionicViewService, AuthService) {
    'use strict';

    $scope.signOut = function () {
        AuthService.invalidateToken();

        // So that there won't be back button
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('signin');
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
