var config = require('../config.json');

angular.module('livewireApp')
.factory('HeartbeatService', function ($http, $timeout, $rootScope, AuthService) {
    'use strict';

    var access_token = AuthService.retrieveAccessToken(),
    name = $rootScope.isProvider() ? 'providers' : 'customers',

    setOnlineHeartBeat = function () {
        if (access_token) {
            $http.get(config.paths.prefix + config.paths.api[name].setOnlineHeartBeat +
                      '?access_token=' + encodeURIComponent(access_token),
            {
                'headers': {
                    'Accept': 'application/vnd.livewire+json;version=1'
                }
            });
        }

        $timeout(setOnlineHeartBeat, 6000);
    },

    available = function (in_call) {
        var callParam = angular.isDefined(in_call) ? '&in_call=' + in_call : '';

        if (access_token) {
            $http.get(config.paths.prefix + config.paths.api[name].available +
                      '?access_token=' + encodeURIComponent(access_token) +
                      callParam,
            {
                'headers': {
                    'Accept': 'application/vnd.livewire+json;version=1'
                }
            });
        }
    };

    return {
        available: available,
        run: setOnlineHeartBeat
    };
});
