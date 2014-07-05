angular.module('livewireApp')

    .controller('RegisterCtrl', function ($scope, $state, $ionicModal, $ionicViewService, AuthService) {
        'use strict';

        $ionicModal.fromTemplateUrl('partials/termsofservice.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.termsOfService = function () {
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

        $scope.signIn = function (credentials) {
            var response = {};

            $scope.signingIn = true;

            AuthService.login(credentials || {}, response).then(function () {
                $scope.signingIn = false;
                // So that there won't be back button to login page
                $ionicViewService.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('app.home');
            }, function () {
                // Incorrect Signin
                $scope.signingIn = false;
                if (Math.floor(response.status / 10) === 40) {
                    $scope.authError = 'error';
                }
            });
        };
    });