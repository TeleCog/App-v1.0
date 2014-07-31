var config = require('../config.json');

module.exports = function ($scope, $rootScope, $ionicScrollDelegate, $firebase, ApiService) {
    'use strict';

    var chatRef, syncChat, customerOnlineRef, customerRef, syncCustomer;

    $scope.messages = [];

    // Request Customer Information
    ApiService.customers.me().then(function () {
        $rootScope.$on('providersCtrlChatModalShown', function () {
            $scope.user = ApiService.getApiData().customers.me;

            // Customer Online Firebase
            customerOnlineRef = new Firebase(config.firebase.chatURL + config.paths.prefix.split(/\.+/g)[1] + "/customer_online_status/" + $scope.user.id);
            customerOnlineRef.set(true);
            customerOnlineRef.onDisconnect().remove();

            // Chat Provider Firebase
            chatRef = new Firebase(config.firebase.chatURL + config.paths.prefix.split(/\.+/g)[1] + '/providers/' + $scope.providerId);
            syncChat = $firebase(chatRef);

            // Chat Customer Receive Firebase
            customerRef = new Firebase(config.firebase.chatURL + config.paths.prefix.split(/\.+/g)[1] + '/customers/' + $scope.user.id);
            syncCustomer = $firebase(customerRef).$asArray();

            syncCustomer.$watch(function (event) {
                var indexToRemove;

                if (event.event === 'child_added') {
                    indexToRemove = (syncCustomer.length === 0) ? 0 : syncCustomer.length - 1;

                    $scope.messages.push(syncCustomer[indexToRemove]);

                    // Make the chat window scroll to the bottom 
                    $ionicScrollDelegate.scrollBottom();

                    syncCustomer.$remove(indexToRemove);
                }
            });

            $scope.addMessage = function (message) {
                var packet = {
                    id: $scope.user.id,
                    name: $scope.user.first_name,
                    message: message,
                    time: Date.now(),
                    image: 'https://www.livewiremedical.com/assets/default_customer.png'
                };

                syncChat.$push(packet).then(function () {
                    packet.name = 'Me';
                    $scope.messages.push(packet);

                    // Make the chat window scroll to the bottom 
                    $ionicScrollDelegate.scrollBottom();
                });
            };
        });
    });

};
