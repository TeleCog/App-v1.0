angular.module('livewireApp')
.controller('ProvidersCtrl', function ($scope, $ionicModal, $ionicLoading, filterFilter, orderByFilter, ApiService) {
    'use strict';

    // Filter providers
    var evalProvider = function (provider) {
        var specialty_key = '',
        institution_key = '',
        providerType_key = '',
        result = false,
        count = 0;

        // Medical Specialty
        for (specialty_key in $scope.filterToggles.medical_specialty) {
            if ($scope.filterToggles.medical_specialty[specialty_key]) {
                count += 1;

                if (provider.provider.medical_specialty === specialty_key) {
                    result = true;
                    break;
                }
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

        // Return if institution does not match
        if (!result) {
            return !!result;
        }

        // Provider type
        for (providerType_key in $scope.filterToggles.provider_type) {
            count += 1;

            if ($scope.filterToggles.provider_type[providerType_key]) {
                result = provider.provider.provider_type === providerType_key;
                if (result) {
                    break;
                }
            }
        }

        return !!result;
    };

    // Filters Modal
    $ionicModal.fromTemplateUrl('/partials/app/dashboard/customer/_filters.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createVisibleModalFn('filtersModal', modal);
    });

    // Providers Description Modal
    $ionicModal.fromTemplateUrl('/partials/app/dashboard/customer/_provider.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createVisibleModalFn('providerModal', modal);
    });

    $scope.showProvider = function (provider) {
        $scope.$parent.currentProvider = provider;
        $scope.showProviderModal();
    };

    $ionicLoading.show({
        template: 'Loading <i class=ion-loading-c></i>'
    });

    $scope.filterProviders = function (providers, show) {
        $scope.filteredProviders = filterFilter(providers, evalProvider);
        $scope.filteredProviders = orderByFilter($scope.filteredProviders, '-provider.availability_new');

        // So that the initial select institution modal stays open
        if (!show) {
            $scope.closeFiltersModal();
        }
    };

    // Refresh On Slide Up
    $scope.doRefresh = function () {
        ApiService.providers.index().then(function () {
            $scope.$parent.providers = ApiService.getApiData().providers.index.providers;
            $scope.filters = ApiService.getApiData().providers.index.filters;
            $scope.filterProviders($scope.providers);
            $scope.$broadcast('scroll.refreshComplete');
        }, function () {
            console.log("Error");
        });
    };

    ApiService.institutions.index().then(function () {
        $scope.institutions = ApiService.getApiData().institutions.index;
    });

    ApiService.providers.index().then(function () {
        $scope.$parent.providers = ApiService.getApiData().providers.index.providers;
        $scope.filters = ApiService.getApiData().providers.index.filters;
        $scope.filterProviders($scope.providers, true);
        $ionicLoading.hide();

        // Select Institution
        $scope.selectFilter('institution');
    }, function () {
        $ionicLoading.hide();
        console.log("Error");
    });

    $scope.filterToggles = {
        medical_specialty: {},
        institutions: {},
        provider_type: {}
    };

    $scope.$on('refetchUsers', function (event, deferred) {
        ApiService.providers.index().then(function () {
            $scope.$parent.providers = ApiService.getApiData().providers.index.providers;
            $scope.filters = ApiService.getApiData().providers.index.filters;
            $scope.filterProviders($scope.providers);
            deferred.resolve();
        }, function () {
            deferred.resolve();
            console.log("Error");
        });
    });

});
