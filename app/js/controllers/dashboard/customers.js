angular.module('livewireApp')
.controller('CustomersCtrl', function ($scope, $ionicModal, $ionicLoading, orderByFilter, HeartbeatService, ApiService) {
    'use strict';

    // Spinner on page load while customers are being fetched
    $ionicLoading.show({
        template: 'Loading <i class=ion-loading-c></i>'
    });

    // Set Provider Available
    // in_call is false
    HeartbeatService.available(false);

    // Fetch list of provider's customers
    ApiService.customers.index().then(function () {
        $scope.$parent.customers = ApiService.getApiData().customers.index;
        // $scope.filterProviders($scope.providers, true);
        $ionicLoading.hide();
    }, function () {
        $ionicLoading.hide();
        console.log("Error");
    });

    // Determine if user is online
    $scope.isCustomerOnline = function (customer) {
        return customer ? customer.online : false;
    };

    // Customers Description Modal
    $ionicModal.fromTemplateUrl('/partials/app/dashboard/provider/_customer.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createVisibleModalFn('customerModal', modal);
    });

    $scope.showCustomer = function (customer) {
        $scope.$parent.currentCustomer = customer;
        $scope.showCustomerModal();
    };

    // Refresh On Slide Up
    $scope.doRefresh = function () {
        ApiService.customers.index().then(function () {
            $scope.$parent.customers = ApiService.getApiData().customers.index;
            $scope.filterCustomers($scope.customers);
            $scope.$broadcast('scroll.refreshComplete');
        }, function () {
            console.log("Error");
        });
    };

    // Filter customers
    $scope.filterCustomers = function (customers, predicate) {
        if (predicate) {
            $scope.currentFilter = predicate;
        }

        if (!$scope.currentFilter) {
            return;
        }

        $scope.filteredCustomers = orderByFilter(customers, $scope.currentFilter);
    };

    $scope.$on('refetchUsers', function (event, deferred) {
        ApiService.customers.index().then(function () {
            $scope.$parent.customers = ApiService.getApiData().customers.index;
            $scope.filterCustomers($scope.customers);
            deferred.resolve();
        }, function () {
            deferred.resolve();
            console.log("Error");
        });
    });
});
