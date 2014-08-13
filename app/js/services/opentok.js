var crypto = require('crypto'),
buffer = require('buffer'),
config = require('../config.json');

angular.module('livewireApp')
.factory('OpentokService', function ($http) {
    var sessionID, token;

    return {
        generateToken: function () {
            var data, time, hash, preCoded;

            if (angular.isUndefined(sessionID) || sessionID === null) {
                throw {
                    name: 'SessionNotSet',
                    message: 'Session ID is not defined'
                };
            }

            time = Math.floor(Date.now() / 1000);

            data = "session_id=" + sessionID +
                "&create_time=" + time +
                "&expire_time=" + (time + 86400) + // seconds in a day
                "&role=" + 'publisher' +
                "&connection_data=" +
                "&nonce=" + Math.floor(Math.random() * 999999); // Pseudo-random nonce (could use a better PRNG)

            hash = crypto.createHmac('sha1', config.opentok.apiSecret)
            .update(data)
            .digest('hex');

            preCoded = "partner_id=" + config.opentok.apiKey + "&sig=" + hash + ":" + data;
            token = "T1==" + (new buffer.Buffer(preCoded)).toString('base64');

            return token;
        },

        requestSessionID: function () {
            return $http({
                method: 'POST',
                url: 'https://api.opentok.com/session/create',
                data: {"p2p.preference": "disabled"},
                headers: {
                    'X-TB-PARTNER-AUTH': config.opentok.apiKey + ':' + config.opentok.apiSecret,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data) {
                var regex = /<session_id>(.+)<\/session_id>/;
                var match = regex.exec(data);
                sessionID = match[1];
            }).error(function () {
                console.log("error");
            });
        },

        getSessionID: function () {
            return sessionID;
        }
    };

});
