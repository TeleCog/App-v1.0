angular.module('livewireApp')

.controller('DashboardCtrl', function ($scope, $rootScope, $ionicModal, $ionicPopup) {
    'use strict';

    var createVCModal = function () {
        // Video Conferencing Modal
        $ionicModal.fromTemplateUrl('/partials/app/dashboard/_vc.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.createVisibleModalFn('vcModal', modal);
        });
    };

    // Create modal show/hide function in scope
    $scope.createVisibleModalFn = function (name, modal) {
        var normalizedName;

        $scope[name] = modal; // Add modal to scope

        normalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        $scope['show' + normalizedName] = function () {
            $scope[name].show();
        };
        $scope['close' + normalizedName] = function () {
            $scope[name].hide();
        };
    };

    // Filters selection
    $scope.selectFilter = function(filter) {
        $scope.currentFilter = filter;
        $scope.filtersModal.show();
    };

    // Chat Messages Modal
    $ionicModal.fromTemplateUrl('/partials/app/dashboard/_chat.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createVisibleModalFn('chatModal', modal);
    });

    createVCModal();

    $scope.showVC = function () {
        $scope.vcModal.show().then(function () {
            $rootScope.$broadcast('providersCtrlVCModalShown');
        });
    };

    $scope.closeVC = function () {
        $rootScope.$broadcast('opentokSessionDisconnect');
        $scope.vcModal.remove().then(function () {
            createVCModal();
        });
    };

    $scope.showChat = function () {
        $scope.chatModal.show().then(function () {
            $rootScope.$broadcast('providersCtrlChatModalShown');
        });
    };

    $scope.closeChat = function () {
        $scope.chatModal.hide().then(function () {
            $rootScope.$broadcast('providersCtrlChatModalClosed');
        });
    };

    // Chat Message Notification Popup
    // Triggered on a button click, or some other target
    $scope.showChatPopup = function (provider) {
        // An elaborate, custom popup
        var chatPopup = $ionicPopup.confirm({
            template: 'You have a new message from ' + provider.provider.name,
            title: 'New Message',
            cancelText: 'Close',
            okText: 'View',
            okType: 'button-calm'
        });
        chatPopup.then(function(res) {
            if (res) {
                $scope.currentProvider = provider;
                chatPopup.close();
                $scope.showChat();
            }
        });
    };
    $rootScope.$on('chatReceived', function (chatEvent, providerId) {
        var i, l;

        for (i = 0, l = $scope.providers.length; i < l; i++) {
            if ($scope.providers[i].provider.id === parseInt(providerId, 10)) {
                $scope.showChatPopup($scope.providers[i]);
                return;
            }
        }
    });
});
