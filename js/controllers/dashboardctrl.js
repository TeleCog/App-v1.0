module.exports = function ($scope, $state, $ionicViewService) {
    'use strict';

    // So that there won't be back button to login page
    $ionicViewService.clearHistory();

    console.log($scope, $state);
};