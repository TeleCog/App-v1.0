angular.module('livewireApp')
.factory('ApiService', function ($http, $ionicViewService, $state, AuthService) {
    'use strict';

    var config = require('../config.json'),
    apiData = {},

    authFailure = function (status) {
        if (status === 401) {
            // Invalidate Access Token (to prevent infinite loop)
            AuthService.invalidateToken();

            // So that there won't be back button to login page
            $ionicViewService.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('signin');
        }

    };

    return {
        getApiData: function () {
            return apiData;
        },

        chats: {
            index: function (args) {
                var type = 'customer', foreignId = args.foreignId,
                customer_id = args.myId, provider_id = args.foreignId;

                if (AuthService.getRole() === AuthService.Role.provider) {
                    customer_id = args.foreignId;
                    provider_id = args.myId;
                    type = 'provider';
                }

                return $http.get(config.paths.prefix + config.paths.api.chats.index +
                                 '?access_token=' + encodeURIComponent(AuthService.retrieveAccessToken()) +
                                 '&customer_id=' + customer_id + '&provider_id=' + provider_id + '&type=' + type,
                {
                    'headers': {
                        'Accept': 'application/vnd.livewire+json;version=1'
                    }
                }).success(function (data) {
                    apiData.chats = apiData.chats || {};
                    apiData.chats.index = apiData.chats.index || {};
                    apiData.chats.index[foreignId] = data;
                }).error(function (data, status) {
                    authFailure(status);
                });
            }
        },

        providers: {
            me: function () {
                return $http.get(config.paths.prefix + config.paths.api.providers.me +
                                 '?access_token=' + encodeURIComponent(AuthService.retrieveAccessToken()),
                {
                    'headers': {
                        'Accept': 'application/vnd.livewire+json;version=1'
                    }
                }).success(function (data) {
                    apiData.providers = apiData.providers || {};
                    apiData.providers.me = data;
                }).error(function (data, status) {
                    authFailure(status);
                });
            },

            index: function () {
                return $http.get(config.paths.prefix + config.paths.api.providers.index +
                                 '?access_token=' + encodeURIComponent(AuthService.retrieveAccessToken()),
                {
                    'headers': {
                        'Accept': 'application/vnd.livewire+json;version=1'
                    }
                })
                .success(function (data) {
                    apiData.providers = apiData.providers || {};
                    apiData.providers.index = data;
                })
                .error(function (data, status) {
                    authFailure(status);
                });
            }
        },

        customers: {
            me: function () {
                return $http.get(config.paths.prefix + config.paths.api.customers.me +
                                 '?access_token=' + encodeURIComponent(AuthService.retrieveAccessToken()),
                {
                    'headers': {
                        'Accept': 'application/vnd.livewire+json;version=1'
                    }
                }).success(function (data) {
                    apiData.customers = apiData.customers || {};
                    apiData.customers.me = data;
                }).error(function (data, status) {
                    authFailure(status);
                });
            },

            index: function () {
                return $http.get(config.paths.prefix + config.paths.api.customers.index +
                                 '?access_token=' + encodeURIComponent(AuthService.retrieveAccessToken()),
                {
                    'headers': {
                        'Accept': 'application/vnd.livewire+json;version=1'
                    }
                }).success(function (data) {
                    apiData.customers = apiData.customers || {};
                    apiData.customers.index = data;
                }).error(function (data, status) {
                    authFailure(status);
                });
            }
        },

        institutions: {
            index: function () {
                return $http.get(config.paths.prefix + config.paths.api.institutions.index +
                                 '?access_token=' + encodeURIComponent(AuthService.retrieveAccessToken()),
                {
                    'headers': {
                        'Accept': 'application/vnd.livewire+json;version=1'
                    }
                })
                .success(function (data) {
                    apiData.institutions = apiData.institutions || {};
                    apiData.institutions.index = data;
                })
                .error(function (data, status) {
                    authFailure(status);
                });
            }
        }
    };
});
