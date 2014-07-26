var config = require('../config.json');

angular.module('opentok', [])

.directive('opentokContainer', function ($rootScope, $firebase, OpentokService) {
    var updateViews = function () {
        var publisherDiv, subscriberDiv;

        publisherDiv = document.getElementById('opentok-publisher');
        publisherDiv.style.width = Math.floor(Math.min(document.height, document.width) * 0.30) + 'px';
        publisherDiv.style.height = publisherDiv.style.width;

        subscriberDiv = document.getElementsByClassName('opentok-subscriber')[0];
        if (subscriberDiv.style) {
            subscriberDiv.style.width = document.width + 'px';
            subscriberDiv.style.height = document.height + 'px';
        }

        TB.updateViews();
    },

    link = function (scope, element, attrs) {
        var publisher, session;

        $rootScope.$broadcast('opentokLoading');

        OpentokService.requestSessionID().then(function () {
            publisher = TB.initPublisher(config.opentok.apiKey, 'opentok-publisher', {height: 300, width: 300});
            session = TB.initSession(config.opentok.apiKey, OpentokService.getSessionID());

            session.on({
                'streamCreated': function (event) {
                    var div = document.getElementsByClassName('opentok-subscriber')[0];
                    div.id = 'stream' + event.stream.streamId;
                    session.subscribe(event.stream, div.id, {subscribeToAudio: true});
                    div.className += ' opentok-subscriber';
                }
            });

            session.connect(OpentokService.generateToken(), function () {
                session.publish(publisher);
                publisher.on({
                    'streamCreated': function (event) {
                        // Notify provider
                        console.log("Notifying Provider");
                        var sessionID = OpentokService.getSessionID(),
                        sessionRef = new Firebase(config.firebase.videoConferencingURL + config.paths.prefix.split(/\.+/g)[1] + '/vccameramode/pendingsessions/' + sessionID + '/node');
                        sessionRef.set({
                            customerId: 38,
                            sessionId: sessionID,
                            isvalid: 1,
                            ifWebRTCSupported: true,
                            agentIdToCall: 1,
                            ifAdminCalling: 0,
                            streamId: event.stream.streamId,
                            customerName: 'Jon Skeet'
                        });
                    }
                });
            });

            $rootScope.$broadcast('opentokLoaded');
        });
    };

    window.addEventListener("orientationchange", function () {
        console.log("Orientation changed");
        updateViews();
    });

    return {
        restrict: 'E',
        template: '<div id="opentok-publisher"></div><div class="opentok-subscribers"><div class="opentok-subscriber"></div></div>',
        link: link
    };
});
