var isodate = require('../../util/isodate');

angular.module('livewireApp')
.controller('CustomersCtrl', function ($scope, $ionicModal, $ionicLoading, filterFilter, orderByFilter, ApiService) {
    'use strict';

    // Spinner on page load while customers are being fetched
    $ionicLoading.show({
        template: 'Loading <i class=ion-loading-c></i>'
    });

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
        var interval;

        if (!customer || !customer.last_time_online) {
            return false;
        }

        interval = Date.now() - isodate(customer.last_time_online);
        if (interval > 10 * 60 * 1000) { // Ten minutes
            return false;
        }

        return true;
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

    // Filters
    $scope.filters = {
        firstName: '',
        lastName: ''
    };

    // Years for DOB filter
    $scope.years = (function () {
        var i = 0, start = (new Date()).getFullYear(), years = ['All'];

        for (i = 0; i < 100; i++) {
            years.push(start - i);
        }

        return years;
    }());

    // Months for DOB filter
    $scope.months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Filters Modal
    $ionicModal.fromTemplateUrl('/partials/app/dashboard/provider/_filters.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createVisibleModalFn('filtersModal', modal);
    });

    // Filter customers
    $scope.filterCustomers = function (customers) {
        $scope.filteredCustomers = filterFilter(customers, function (customer) {
            var result;

            if ($scope.filters.firstName.length > 0) {
                result = customer.first_name.indexOf($scope.filters.firstName) !== -1;
            } else {
                result = true;
            }

            if ($scope.filters.lastName.length > 0) {
                result = customer.last_name.indexOf($scope.filters.lastName) !== -1;
            }

            // TODO DOB Filtering

            return result;
        });
        $scope.closeFiltersModal();
    };
});
