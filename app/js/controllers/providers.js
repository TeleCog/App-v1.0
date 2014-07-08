angular.module('livewireApp')

    .controller('ProvidersCtrl', function ($scope, $ionicLoading, ApiService) {
        'use strict';

        $ionicLoading.show({
            template: 'Loading <i class=ion-loading-c></i>'
        });

        ApiService.providers.index().then(function () {
            $scope.providers = ApiService.getApiData().providers.index.providers;
            $ionicLoading.hide();
        }, function () {
            $ionicLoading.hide();
            console.log("Error");
        });
    });