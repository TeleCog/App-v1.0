angular.module('chat', ['firebase'])
.directive('chatContainer', function () {
    var link = function (scope, elem, attrs) {
        scope.$watch('providerId', function (newValue, oldValue) {
            scope.providerId = newValue;
        });
    };

    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            link(scope, elem, attrs);
        },
        templateUrl: '/partials/directives/chat.html',
        scope: {
            "providerId": "="
        },
        controller: require('./chatCtrl')
    };
});
