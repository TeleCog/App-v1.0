var config = require('../config.json');

module.exports = function ($scope, $rootScope, $ionicLoading, $firebase, ApiService) {
    'use strict';

    var chatRef, syncChat, customerOnlineRef;

    $ionicLoading.show({
        template: 'Loading <i class=ion-loading-c></i>'
    });

    // Request Customer Information
    ApiService.customers.me().then(function () {
        $rootScope.$on('providersCtrlChatModalShown', function () {
            $scope.user = ApiService.getApiData().customers.me;
            $ionicLoading.hide();

            customerOnlineRef = new Firebase(config.firebase.chatURL + config.paths.prefix.split(/\.+/g)[1] + "/customer_online_status/" + $scope.user.id);
            customerOnlineRef.set(true);
            customerOnlineRef.onDisconnect().remove();

            chatRef = new Firebase(config.firebase.chatURL + config.paths.prefix.split(/\.+/g)[1] + '/providers/' + $scope.providerId);
            syncChat = $firebase(chatRef);
            $scope.messages = syncChat.$asArray();

            $scope.addMessage = function (message) {
                console.log(message);
                $scope.messages.$add({
                    id: $scope.user.id,
                    name: $scope.user.first_name,
                    message: message,
                    time: Date.now(),
                    image: ''
                });
            };
        });
    });

};
