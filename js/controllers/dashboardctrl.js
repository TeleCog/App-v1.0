module.exports = function ($scope, $state, $ionicViewService) {
    'use strict';

    $ionicViewService.clearHistory();

    console.log($scope, $state);
};