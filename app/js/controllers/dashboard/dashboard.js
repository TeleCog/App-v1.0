angular.module('livewireApp')

.controller('DashboardCtrl', function ($scope, $rootScope, $q, $ionicModal, $ionicPopup, HeartbeatService) {
    'use strict';

    var createVCModal = function () {
        // Video Conferencing Modal
        $ionicModal.fromTemplateUrl('/partials/app/dashboard/_vc.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.createVisibleModalFn('vcModal', modal);
        });
    };

    // Run HeartBeats
    HeartbeatService.run();

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

    $scope.isAgentOnline = function () {
        var current = $scope.currentProvider || $scope.currentCustomer;
        if (!current) {
            return false;
        }

        return !!((current.provider && current.provider.availability_new) || current.online);
    };

    // Chat Messages Modal
    $ionicModal.fromTemplateUrl('/partials/app/dashboard/_chat.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createVisibleModalFn('chatModal', modal);
    });

    createVCModal();

    $scope.showVC = function (sessionId) {
        $scope.vcModal.show().then(function () {
            $rootScope.$broadcast('providersCtrlVCModalShown', sessionId);
        });
        if ($rootScope.isProvider()) {
            // Set Provider Available
            // in_call is true
            HeartbeatService.available(true);
        }
    };

    $scope.closeVC = function () {
        $rootScope.$broadcast('opentokSessionDisconnect');
        $rootScope.$broadcast('opentokLoaded'); // So that connecting notification goes away if it exists
        $scope.vcModal.hide();
        if ($rootScope.isProvider()) {
            // Set Provider Available
            // in_call is false
            HeartbeatService.available(false);
        }
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

    $scope.showVCFromChat = function () {
        var deferred, formerCurrentAgent, notOnlinePopup;

        $scope.chatModal.hide();

        if ($rootScope.vc && $rootScope.vc.vcWindowOpen) {
            $scope.vcModal.show().then(function () {
                $rootScope.$broadcast('maximizeVC');
            });
        } else {
            // Check if agent is still online
            deferred = $q.defer();
            formerCurrentAgent = $scope.currentProvider ? $scope.currentProvider.provider.id : $scope.currentCustomer.id;
            $scope.$broadcast("refetchUsers", deferred);
            deferred.promise.then(function () {
                var type, currentType, i, l, cur;

                // Readd current customer/provider
                type = $rootScope.isProvider() ? 'customers' : 'providers';
                currentType = $rootScope.isProvider() ? 'Customer' : 'Provider';

                for (i = 0, l = $scope[type].length; i < l; i++) {
                    cur = $scope[type][i].provider || $scope[type][i];
                    if (cur.id === formerCurrentAgent) {
                        $scope['current' + currentType] = $scope[type][i];
                        break;
                    }
                }

                if (!$scope.isAgentOnline()) {
                    // Show notification that agent is offline
                    notOnlinePopup = $ionicPopup.confirm({
                        template: ($scope.currentProvider ? $scope.currentProvider.provider.name : $scope.currentCustomer.first_name) +
                            ' is not currently online. Would you like to send them a message?',
                        title: 'Currently Offline',
                        cancelText: 'Cancel',
                        okText: 'Send Message',
                        okType: 'button-calm'
                    });
                    notOnlinePopup.then(function (res) {
                        if (res) {
                            notOnlinePopup.close();
                            $scope.chatModal.show();
                        }
                    });
                } else {
                    $scope.showVC();
                }
            });
        }
    };

    $scope.showChatFromVC = function () {
        $rootScope.$broadcast('minimizeVC');
        $scope.vcModal.hide();

        if ($rootScope.chat && $rootScope.chat.chatWindowOpen) {
            $scope.chatModal.show();
        } else {
            $scope.showChat();
        }
    };

    // Chat Message Notification Popup
    // Triggered on a button click, or some other target
    $scope.showChatPopup = function (agent, name) {
        // An elaborate, custom popup
        var chatPopup = $ionicPopup.confirm({
            template: 'You have a new message from ' + name,
            title: 'New Message',
            cancelText: 'Close',
            okText: 'View',
            okType: 'button-calm'
        });
        chatPopup.then(function (res) {
            var type = $rootScope.isProvider() ? 'Customer' : 'Provider';

            if (res) {
                $scope['current' + type] = agent;
                chatPopup.close();
                $scope.showChat();
            }
        });
    };
    $rootScope.$on('chatReceived', function (chatEvent, agentId) {
        var i, l, type, cur;

        type = $rootScope.isProvider() ? 'customers' : 'providers';

        for (i = 0, l = $scope[type].length; i < l; i++) {
            cur = $scope[type][i].provider || $scope[type][i];
            if (cur.id === parseInt(agentId, 10)) {
                $scope.showChatPopup($scope[type][i], cur.name || cur.first_name);
                return;
            }
        }
    });

    // VC Notification Popup
    // Triggered on a button click, or some other target
    $scope.showVCPopup = function (agent, name, sessionId) {
        // An elaborate, custom popup
        var vcPopup = $ionicPopup.confirm({
            template: 'You have a new video call from ' + name,
            title: 'New Video Call',
            cancelText: 'Hang Up',
            okText: 'Answer',
            okType: 'button-calm'
        });
        vcPopup.then(function (res) {
            var type = $rootScope.isProvider() ? 'Customer' : 'Provider';

            if (res) {
                $scope['current' + type] = agent;
                vcPopup.close();
                $scope.showVC(sessionId);
            } else {
                vcPopup.close();
                $rootScope.$broadcast('opentokCallCanceled', sessionId);
            }
        });
    };
    $rootScope.$on('vcReceived', function (vcEvent, agentId, agentName, sessionId) {
        var i, l, type, cur;

        type = $rootScope.isProvider() ? 'customers' : 'providers';

        for (i = 0, l = $scope[type].length; i < l; i++) {
            cur = $scope[type][i].provider || $scope[type][i];
            if (cur.id === parseInt(agentId, 10)) {
                $scope.showVCPopup($scope[type][i], agentName, sessionId);
                return;
            }
        }
    });
});
