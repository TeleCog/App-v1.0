var config = require('../config.json');

module.exports = function ($scope, $rootScope, $ionicScrollDelegate, $firebase, ApiService) {
    'use strict';

    var chatRef, syncChat, name, othername, customerOnlineRef, customerRef, syncCustomer, chatWindowOpen;

    $scope.messages = {};

    name = $rootScope.isProvider() ? 'providers' : 'customers';
    othername = $rootScope.isProvider() ? 'customers' : 'providers';

    // Request Customer Information
    ApiService[name].me().then(function () {
        $scope.user = ApiService.getApiData()[name].me;

        // Customer Online Firebase
        if (!$rootScope.isProvider()) {
            customerOnlineRef = new Firebase(config.firebase.chatURL + config.paths.prefix.split(/\.+/g)[1] + "/customer_online_status/" + $scope.user.id);
            customerOnlineRef.set(true);
            customerOnlineRef.onDisconnect().remove();
        }

        // Chat Customer Receive Firebase
        customerRef = new Firebase(config.firebase.chatURL + config.paths.prefix.split(/\.+/g)[1] + '/' + name + '/' + $scope.user.id);
        syncCustomer = $firebase(customerRef).$asArray();

        syncCustomer.$watch(function (event) {
            var indexToRemove, agentId;

            if (event.event === 'child_added') {
                indexToRemove = (syncCustomer.length === 0) ? 0 : syncCustomer.length - 1;
                agentId = syncCustomer[indexToRemove].id;

                $scope.messages[agentId] = $scope.messages[agentId] || [];
                $scope.messages[agentId].push(syncCustomer[indexToRemove]);

                // Make the chat window scroll to the bottom 
                if (chatWindowOpen) {
                    $ionicScrollDelegate.scrollBottom();
                } else {
                    $rootScope.$broadcast('chatReceived', agentId);
                }

                syncCustomer.$remove(indexToRemove);
            }
        });

        $rootScope.$on('providersCtrlChatModalShown', function () {
            chatWindowOpen = true;

            ApiService.chats.index({ myId: $scope.user.id, foreignId: $scope.agentId }).then(function () {
                var messages = ApiService.getApiData().chats.index[$scope.agentId];

                $scope.messages[$scope.agentId] = $scope.messages[$scope.agentId] || [];
                // Merge fetched messages with messages (rightmost element is removed to avoid message duplication)
                Array.prototype.unshift.apply($scope.messages[$scope.agentId], messages.slice(0, messages.length - 1));

                // Make the chat window scroll to the bottom 
                $ionicScrollDelegate.scrollBottom();
            });

            // Chat Provider Firebase
            chatRef = new Firebase(config.firebase.chatURL + config.paths.prefix.split(/\.+/g)[1] + '/' + othername + '/' + $scope.agentId);
            syncChat = $firebase(chatRef);

            $scope.addMessage = function (message) {
                var packet = {
                    id: $scope.user.id,
                    name: $scope.user.first_name,
                    message: message,
                    time: Date.now(),
                    image: $scope.user.image.thumb.url || 'https://www.livewiremedical.com/assets/default_customer.png'
                };

                syncChat.$push(packet).then(function () {
                    packet.name = 'Me';

                    $scope.messages[$scope.agentId] = $scope.messages[$scope.agentId] || [];
                    $scope.messages[$scope.agentId].push(packet);

                    // Make the chat window scroll to the bottom 
                    $ionicScrollDelegate.scrollBottom();

                    // Clear textarea
                    $scope.chat.message = '';
                });
            };
        });

        $rootScope.$on('providersCtrlChatModalClosed', function () {
            chatWindowOpen = false;
        });
    });

};
