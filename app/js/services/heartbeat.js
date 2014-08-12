var config = require('../config.json');

angular.module('livewireApp')
.factory('HeartbeatService', function ($http, $timeout, AuthService) {
    'use strict';

    var access_token = AuthService.retrieveAccessToken(),

    setOnlineHeartBeat = function () {
        if (access_token) {
            $http.get(config.paths.prefix + config.paths.api.customers.setOnlineHeartBeat +
                      '?access_token=' + encodeURIComponent(access_token),
            {
                'headers': {
                    'Accept': 'application/vnd.livewire+json;version=1'
                }
            });
        }

        $timeout(setOnlineHeartBeat, 6000);
    };

    return {
        run: setOnlineHeartBeat
    };
});
