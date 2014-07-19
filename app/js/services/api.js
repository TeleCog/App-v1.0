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

        providers: {
            index: function () {
                return $http.get(config.paths.prefix + config.paths.api.providers.index
                                 + '?access_token=' + encodeURIComponent(AuthService.retrieveAccessToken()),
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

        institutions: {
            index: function () {
                return $http.get(config.paths.prefix + config.paths.api.institutions.index
                                 + '?access_token=' + encodeURIComponent(AuthService.retrieveAccessToken()),
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
