angular.module('livewireApp')

.controller('ProvidersCtrl', function ($scope, $ionicModal, $ionicLoading, filterFilter, ApiService) {
    'use strict';

    // Create modal show/hide function in scope
    var createVisibleModalFn = function (name, modal) {
        var normalizedName;

        $scope[name] = modal; // Add modal to scope

        normalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        $scope['show' + normalizedName] = function () {
            $scope[name].show();
        };
        $scope['close' + normalizedName] = function () {
            $scope[name].hide();
        };
    },

    // Filter providers
    evalProvider = function (provider) {
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

        // Return if medical specialty does not match
        if (!result) {
            return !!result;
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

    // Filters Modal
    $ionicModal.fromTemplateUrl('/partials/main/_filters.html', {
        scope: $scope
    }).then(function (modal) {
        createVisibleModalFn('filtersModal', modal);
    });

    // Providers Description Modal
    $ionicModal.fromTemplateUrl('/partials/main/_provider.html', {
        scope: $scope
    }).then(function (modal) {
        createVisibleModalFn('providerModal', modal);
    });

    $ionicLoading.show({
        template: 'Loading <i class=ion-loading-c></i>'
    });

    $scope.filterProviders = function (providers) {
        $scope.filteredProviders = filterFilter(providers, evalProvider);
        $scope.closeFiltersModal();
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
