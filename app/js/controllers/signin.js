angular.module('livewireApp')

.controller('SigninCtrl', function ($scope, $state, $ionicModal, $ionicLoading, $ionicViewService, AuthService) {
    'use strict';

    var showLoading = function () {
        $ionicLoading.show({
            template: 'Signing In <i class=ion-loading-c></i>'
        });
    },
    goHome = function () {
        // So that there won't be back button to login page
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.providers');
    };

    if (AuthService.retrieveAccessToken()) {
        goHome();
    } else if (!$scope.roleSelection && !window.sessionStorage.getItem("roleSelection")) {
        // Select Role Modal
        $ionicModal.fromTemplateUrl('/partials/signin/_selectrole.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.selectRoleModal = modal;
            $scope.selectRoleModal.show();
        });
    }

    $scope.selectRole = function (selectedRole) {
        $scope.roleSelection = selectedRole;
        window.sessionStorage.setItem("roleSelection", selectedRole);
        $scope.selectRoleModal.remove();
    };

    $scope.getRoleSelection = function () {
        return $scope.roleSelection || window.sessionStorage.getItem("roleSelection");
    };

    $scope.signIn = function (credentials) {
        var response = {};

        showLoading();

        AuthService.login(credentials || {}, $scope.roleSelection, response).then(function () {
            $ionicLoading.hide();
            goHome();
        }, function () {
            $ionicLoading.hide();
            // Incorrect Signin
            if (Math.floor(response.status / 10) === 40) {
                $scope.authError = 'error';
            }
        });
    };
});
