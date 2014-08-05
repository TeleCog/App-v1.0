angular.module('livewireApp')

.controller('ProvidersCtrl', function ($scope, $rootScope, $ionicModal, $ionicPopup, $ionicLoading, filterFilter, orderByFilter, ApiService) {
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
        providerType_key = '',
        result = false,
        count = 0;

        // Medical Specialty
        for (specialty_key in $scope.filterToggles.medical_specialty) {
            count += 1;

            if ($scope.filterToggles.medical_specialty[specialty_key] && provider.provider.medical_specialty === specialty_key) {
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
    },

    createVCModal = function () {
        // Video Conferencing Modal
        $ionicModal.fromTemplateUrl('/partials/app/providers/_vc.html', {
            scope: $scope
        }).then(function (modal) {
            createVisibleModalFn('vcModal', modal);
        });
    };

    // Filters selection
    $scope.selectFilter = function(filter) {
        $scope.currentFilter = filter;
        $scope.filtersModal.show();
    };

    // Filters Modal
    $ionicModal.fromTemplateUrl('/partials/app/providers/_filters.html', {
        scope: $scope
    }).then(function (modal) {
        createVisibleModalFn('filtersModal', modal);
    });

    // Providers Description Modal
    $ionicModal.fromTemplateUrl('/partials/app/providers/_provider.html', {
        scope: $scope
    }).then(function (modal) {
        createVisibleModalFn('providerModal', modal);
    });

    // Chat Messages Modal
    $ionicModal.fromTemplateUrl('/partials/app/providers/_chat.html', {
        scope: $scope
    }).then(function (modal) {
        createVisibleModalFn('chatModal', modal);
    });

    createVCModal();

    $scope.showVC = function () {
        $scope.vcModal.show().then(function () {
            $rootScope.$broadcast('providersCtrlVCModalShown');
        });
    };

    $scope.closeVC = function () {
        $rootScope.$broadcast('opentokSessionDisconnect');
        $scope.vcModal.remove().then(function () {
            createVCModal();
        });
    };

    $scope.showChat = function () {
        $scope.chatModal.show().then(function () {
            $rootScope.$broadcast('providersCtrlChatModalShown');
        });
    };

    $scope.closeChat = function () {
        $scope.chatModal.hide().then(function () {
            $rootScope.$broadcast('providersCtrlChatModalClosed');
        });
    };

    $scope.showProvider = function (provider) {
        $scope.currentProvider = provider;
        $scope.showProviderModal();
    };

    // Chat Message Notification Popup
    // Triggered on a button click, or some other target
    $scope.showChatPopup = function (provider) {
        // An elaborate, custom popup
        var chatPopup = $ionicPopup.confirm({
            template: 'You have a new message from ' + provider.provider.name,
            title: 'New Message',
            cancelText: 'Close',
            okText: 'View',
            okType: 'button-calm'
        });
        chatPopup.then(function(res) {
            if (res) {
                $scope.currentProvider = provider;
                chatPopup.close();
                $scope.showChat();
            }
        });
    };
    $rootScope.$on('chatReceived', function (chatEvent, providerId) {
        var i, l;

        for (i = 0, l = $scope.providers.length; i < l; i++) {
            if ($scope.providers[i].provider.id === parseInt(providerId, 10)) {
                $scope.showChatPopup($scope.providers[i]);
                return;
            }
        }
    });

    $ionicLoading.show({
        template: 'Loading <i class=ion-loading-c></i>'
    });

    $scope.filterProviders = function (providers, show) {
        $scope.filteredProviders = filterFilter(providers, evalProvider);
        $scope.filteredProviders = orderByFilter($scope.filteredProviders, '-provider.availability_new');

        if (!show) {
            $scope.closeFiltersModal();
        }
    };

    // Refresh On Slide Up
    $scope.doRefresh = function () {
        ApiService.providers.index().then(function () {
            $scope.providers = ApiService.getApiData().providers.index.providers;
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
        $scope.providers = ApiService.getApiData().providers.index.providers;
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
});
