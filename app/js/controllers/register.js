angular.module('livewireApp')

.controller('RegisterCtrl', function ($scope, $rootScope, $state, $ionicLoading, $ionicModal, $ionicViewService, AuthService) {
    'use strict';

    $ionicModal.fromTemplateUrl('/partials/register/_termsofservice.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Go back to signin if needed
    $rootScope.$broadcast('$viewHistory.historyChange', {
        showBack: true
    });
    $scope.backButtonShown = true;

    $scope.goBackToSignin = function () {
        $state.go('signin');
    };

    $scope.user = {};

    $scope.termsOfService = function (registrationForm) {
        $scope.registrationFormElement = registrationForm;
        $scope.modal.show();
    };

    $scope.closeTermsOfService = function () {
        $scope.modal.hide();
    };

    $scope.passwordPattern = (function () {
        var upper = new RegExp('[A-Z]'),
        lower = new RegExp('[a-z]'),
        digit = new RegExp('[0-9]');

        return {
            test: function (value) {
                return upper.test(value) && lower.test(value) && digit.test(value) && value.length >= 8;
            }
        };
    }());

    $scope.register = function () {
        var response = {};

        $ionicLoading.show({
            template: 'Registering <i class=ion-loading-c></i>'
        });

        AuthService.register(angular.copy($scope.user), response).then(function () {
            $ionicLoading.hide();
            $scope.modal.hide();
            if (response.data && response.data.customer && response.data.customer.oauth && response.data.customer.oauth.token) {

                $scope.emailTaken = false;

                // So that there won't be back button to login page
                $ionicViewService.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('app.dashboard.providers');

            }
        }, function () {
            $ionicLoading.hide();
            $scope.modal.hide();
            // Registration did not work
            if (response.status === 422) {
                if (response.data && response.data.errors && response.data.errors.email) {
                    $scope.registrationFormElement.email.$setPristine();
                    $scope.emailTaken = true;
                }
            }
        });
    };

});
