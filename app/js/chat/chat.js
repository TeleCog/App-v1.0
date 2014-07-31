angular.module('chat', ['firebase'])
.directive('chatContainer', function () {
    var link = function (scope, elem, attrs) {
        scope.$watch('providerId', function (newValue) {
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
})

.directive('isFocused', function($timeout) {
    return {
        scope: { trigger: '@isFocused' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === "true") {
                    $timeout(function() {
                        element[0].focus();

                        element.on('blur', function() {
                            element[0].focus();
                        });
                    });
                }

            });
        }
    };
});
