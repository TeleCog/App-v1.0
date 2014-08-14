angular.module('livewireApp')

.controller('VideoCtrl', function ($scope, $rootScope, $timeout, $ionicLoading, ApiService) {

    var config = require('../config.json');
    var name = $rootScope.isProvider() ? 'providers' : 'customers';

    var startVCRequestListener = function () {
        var sessionRef, meRef, updateRating;

        if ($rootScope.isProvider()) {

            console.log("Starting VC Request Listener As Provider");

            // Establish Queue
            meRef = new Firebase(config.firebase.videoConferencingURL + config.paths.prefix.split(/\.+/g)[1] +
                                 '/providers/' + $scope.user.id);
            meRef.set({providerId: $scope.user.id, inCall: false, available: true, rating:1});
            meRef.onDisconnect().remove();

            updateRating = function () {
                var rand = Math.floor((Math.random()*5)+1);
                meRef.update({rating: rand});
                $timeout(updateRating, 4 * 1000 * 60);
            };

            $timeout(updateRating, 4 * 1000 * 60);

            // Notify user of vc request
            sessionRef = new Firebase(config.firebase.videoConferencingURL + config.paths.prefix.split(/\.+/g)[1] +
                                      '/vccameramode/pendingsessions');
            sessionRef.on('child_added', function (snapshot) {
                var sessionMessage = snapshot.val();
                var customerId, sessionId, customerName;
                if(sessionMessage.node.isvalid === 1 && (parseInt(sessionMessage.node.agentIdToCall, 10) === $scope.user.id )) {
                    customerId = sessionMessage.node.customerId;
                    sessionId = sessionMessage.node.sessionId;
                    customerName = sessionMessage.node.customerName;

                    $rootScope.$broadcast('vcReceived', customerId, customerName, sessionId);
                }
            });

        } else {

            sessionRef = new Firebase(config.firebase.videoConferencingURL + config.paths.prefix.split(/\.+/g)[1] +
                                      '/agenttocustomer/pendingsessions');

            sessionRef.on('child_added', function (snapshot) {
                var sessionMessage = snapshot.val();
                var providerName, agentId, sessionId;
                if (parseInt(sessionMessage.node.customerToCall, 10) === $scope.user.id) {
                    providerName = sessionMessage.node.providerName;
                    agentId = sessionMessage.node.agentId;
                    sessionId = sessionMessage.node.sessionId;

                    $rootScope.$broadcast('vcReceived', agentId, providerName, sessionId);
                }
            });

        }
    };

    // Request Customer Information
    ApiService[name].me().then(function () {
        $scope.user = ApiService.getApiData()[name].me;
        $rootScope.$broadcast('videoCtrlDataLoaded');
        $scope.isDataLoaded = true;
        startVCRequestListener();
    });

    $rootScope.$on('opentokLoading', function () {
        console.log('Received: OpentokLoading');
        $ionicLoading.show({
            template: 'Connecting <i class=ion-loading-c></i>'
        });
    });

    $rootScope.$on('opentokLoaded', function () {
        console.log('Received: OpentokLoaded');
        $ionicLoading.hide();
    });

});
