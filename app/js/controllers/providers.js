angular.module('livewireApp')

.controller('ProvidersCtrl', function ($scope, $ionicModal, $ionicLoading, ApiService) {
    'use strict';

    $ionicModal.fromTemplateUrl('/partials/main/_filters.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $ionicLoading.show({
        template: 'Loading <i class=ion-loading-c></i>'
    });

    $scope.showFilters = function () {
        $scope.modal.show();
    };

    $scope.closeFilters = function () {
        $scope.modal.hide();
    };

    $scope.evalProvider = function (provider) {
        var specialty_key = '',
        institution_key = '',
        result = false,
        count = 0;

        // Medical Specialty
        for (specialty_key in $scope.filterToggles.medical_specialty) {
            count += 1;

            if ($scope.filterToggles.medical_specialty[specialty_key]
                && provider.provider.medical_specialty === specialty_key) {
                    result = true;
                    break;
                }
        }
        if (count === 0) {
            result = true; // If customer has not yet filtered
        }

        // Institution key is ID
        for (institution_key in $scope.filterToggles.institutions) {
            count += 1;

            if ($scope.filterToggles.institutions[institution_key]) {
                result = (provider.provider.institution_id === parseInt(institution_key, 10));

                if (result) {
                    break;
                }
            }
        }

        return !!result;
    };



    ApiService.institutions.index().then(function () {
        $scope.institutions = ApiService.getApiData().institutions.index;
    });

    ApiService.providers.index().then(function () {
        $scope.providers = ApiService.getApiData().providers.index.providers;
        $scope.filters = ApiService.getApiData().providers.index.filters;
        $ionicLoading.hide();
    }, function () {
        $ionicLoading.hide();
        console.log("Error");
    });

    $scope.filterToggles = {
        medical_specialty: {},
        institutions: {}
    };
});
