var crypto = require('crypto'),
buffer = require('buffer'),
config = require('../config.json');

angular.module('livewireApp')
.factory('OpentokService', function () {
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

            data = "session_id=" + sessionID
            + "&create_time=" + time
            + "&expire_time=" + (time + 86400) // seconds in a day
            + "&role=" + 'publisher'
            + "&connection_data="
            + "&nonce=" + Math.floor(Math.random() * 999999); // Pseudo-random nonce (could use a better PRNG)

            hash = crypto.createHmac('sha1', config.opentok.apiSecret)
            .update(data)
            .digest('hex');

            preCoded = "partner_id=" + config.opentok.apiKey + "&sig=" + hash + ":" + data;
            token = "T1==" + (new buffer.Buffer(preCoded)).toString('base64');

            console.log(preCoded);
            console.log(token);

            return token;
        },

        requestSessionID: function () {
            // TODO
        }
    };

});
