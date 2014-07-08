angular.module('livewireApp')

    .controller('ProvidersCtrl', function ($scope, $ionicLoading, ApiService) {
        'use strict';

        $ionicLoading.show({
            template: 'Loading ...'
        });

        ApiService.providers.index().then(function () {
            $scope.providers = ApiService.getApiData().providers.index;
            $ionicLoading.hide();
        }, function () {
            $ionicLoading.hide();
            console.log("Error");
        });
    });