var config = require('../config.json');

angular.module('opentok', [])

.directive('opentokContainer', function ($rootScope, $firebase, OpentokService) {
    var calculatePublisherSize = function () {
        return Math.floor(Math.min(document.height, document.width) * 0.30);
    },

    showViews = true,

    updateViews = function () {
        var publisherDiv, subscriberDiv;

        publisherDiv = document.getElementById('opentok-publisher');
        if (publisherDiv.style) {
            publisherDiv.style.width = (showViews ? calculatePublisherSize() : 1) + 'px';
            publisherDiv.style.height = publisherDiv.style.width;
            publisherDiv.style.zindex = 20;
        }

        subscriberDiv = document.getElementsByClassName('opentok-subscriber')[0];
        if (subscriberDiv.style) {
            subscriberDiv.style.width = (showViews ? document.width : 1) + 'px';
            subscriberDiv.style.height = (showViews ? document.height : 1) + 'px';
            subscriberDiv.style.zindex = 2;
        }

        OT.updateViews();
    },

    link = function (scope, element, attrs, sessionId) {
        var publisher, session, publisherSize;

        $rootScope.$broadcast('opentokLoading');

        OpentokService.requestSessionID().then(function () {
            var publisherDiv = null;
            publisherSize = calculatePublisherSize();

            // Create opentok-publisher div if it does not exists
            if (!document.getElementById('opentok-publisher')) {
                publisherDiv = document.createElement('div');
                publisherDiv.id = 'opentok-publisher';
                element[0].insertBefore(publisherDiv, element[0].firstChild);
            }

            publisher = TB.initPublisher(config.opentok.apiKey, 'opentok-publisher', {height: publisherSize, width: publisherSize});
            session = TB.initSession(config.opentok.apiKey, sessionId || OpentokService.getSessionID());

            session.on({
                'streamCreated': function (event) {
                    $rootScope.$broadcast('opentokLoaded');

                    var div = document.getElementsByClassName('opentok-subscriber')[0];

                    if (!div) {
                        div = document.createElement('div');
                        document.getElementsByClassName('opentok-subscribers')[0].appendChild(div);
                    }

                    div.id = 'stream' + event.stream.streamId;
                    session.subscribe(event.stream, div.id, {subscribeToAudio: true});
                    div.className += ' opentok-subscriber';
                    updateViews();
                }
            });

            // Generate token with sessionId (if not null), else it will use Opentok.requestSessionId
            session.connect(OpentokService.generateToken(sessionId), function () {
                session.publish(publisher);
                publisher.on({
                    'streamCreated': function (event) {
                        var sessionID, firebasePath, sessionRef, cameraModeRef;

                        // Notify provider
                        console.log("Notifying Provider");
                        sessionID = OpentokService.getSessionID();

                        if ($rootScope.isProvider()) {
                            firebasePath = '/agenttocustomer/pendingsessions/';
                        } else {
                            firebasePath = '/vccameramode/pendingsessions/';
                        }

                        sessionRef = new Firebase(config.firebase.videoConferencingURL + config.paths.prefix.split(/\.+/g)[1] + firebasePath + sessionID + '/node');

                        if ($rootScope.isProvider()) {
                            if (!sessionId) { // No need to notify customer if they called first (hence sessionId exists)
                                sessionRef.set({
                                    sessionId: sessionID,
                                    agentId: attrs.userId,
                                    customerToCall: attrs.agentId,
                                    providerName: attrs.userName,
                                    cameraOrientation: 1,
                                    isAdminCalling: 0
                                });
                                sessionRef.onDisconnect().remove();
                            }
                            cameraModeRef = new Firebase(config.firebase.videoConferencingURL + config.paths.prefix.split(/\.+/g)[1] + "/vccameramode/tempcameramode/" + sessionID + "/node");
                            cameraModeRef.set({
                                sessionId: sessionId || sessionID, // sessionId if it exists (from customer call), else use sessionID
                                cameramode: 1,
                                isvalid: 1,
                                agentId: attrs.userId,
                                agentStreamId: event.stream.streamId
                            });
                            cameraModeRef.onDisconnect().remove();
                        } else {
                            if (!sessionId) {
                                sessionRef.set({
                                    customerId: attrs.userId,
                                    sessionId: sessionID,
                                    isvalid: 1,
                                    ifWebRTCSupported: true,
                                    agentIdToCall: attrs.agentId,
                                    ifAdminCalling: 0,
                                    streamId: event.stream.streamId,
                                    customerName: attrs.userName
                                });
                                sessionRef.onDisconnect().remove();
                            }
                        }
                    }
                });
            });

            $rootScope.$on('maximizeVC', function () {
                showViews = true;
                updateViews();

                setTimeout(function () {
                    OT.updateViews();
                }, 1000);
            });

            $rootScope.$on('minimizeVC', function () {
                showViews = false;
                updateViews();
            });

            $rootScope.$on('opentokSessionDisconnect', function () {
                $rootScope.vc = $rootScope.vc || {};
                $rootScope.vc.vcWindowOpen = false;
                if (!document.body.classList.contains('platform-android')) {
                    publisher.destroy();
                }
                session.disconnect();
                console.log("Disconnecting Session");
            });
        });
    };

    window.addEventListener("orientationchange", function () {
        console.log("Orientation changed");
        updateViews();
    });

    return {
        restrict: 'E',
        template: '<div id="opentok-publisher"></div><div class="opentok-subscribers"><div class="opentok-subscriber"></div></div>',
        link: function (scope, elem, attrs) {
            if (scope.isDataLoaded) {
                $rootScope.$on('providersCtrlVCModalShown', function (vcEvent, sessionId) {
                    $rootScope.vc = $rootScope.vc || {};
                    $rootScope.vc.vcWindowOpen = true;
                    link(scope, elem, attrs, sessionId);
                });
            } else {
                $rootScope.$on('videoCtrlDataLoaded', function () {
                    $rootScope.$on('providersCtrlVCModalShown', function (vcEvent, sessionId) {
                        $rootScope.vc = $rootScope.vc || {};
                        $rootScope.vc.vcWindowOpen = true;
                        link(scope, elem, attrs, sessionId);
                    });
                });
            }
        }
    };
});
