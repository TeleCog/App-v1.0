angular.module('livewireApp')

.controller('VideoCtrl', function ($scope, $rootScope, $ionicLoading, ApiService) {

    var name = $rootScope.isProvider() ? 'providers' : 'customers';

    // Request Customer Information
    ApiService[name].me().then(function () {
        $scope.user = ApiService.getApiData()[name].me;
        $rootScope.$broadcast('videoCtrlDataLoaded');
        $scope.isDataLoaded = true;
    });

    $rootScope.$on('opentokLoading', function () {
        console.log('Received: OpentokLoading');
        $ionicLoading.show({
            template: 'Loading <i class=ion-loading-c></i>'
        });
    });

    $rootScope.$on('opentokLoaded', function () {
        console.log('Received: OpentokLoaded');
        $ionicLoading.hide();
    });

});
