angular.module('livewireApp')
.directive('chatContainer', function ($firebase) {
    var link = function (scope, elem, attrs) {

    };

    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            link(scope, elem, attrs);
        },
        templateUrl: '/partials/directives/chat.html'
    };
});
