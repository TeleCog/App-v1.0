angular.module('chat', ['firebase'])
.directive('chatContainer', function () {
    var link = function (scope, elem, attrs) {
        var chatElement = function (message) {
            var container, label, span, p;

            container = elem[0].getElementsByTagName('ion-content')[0].getElementsByClassName('list')[0];

            // Chat
            label = document.createElement('label');
            label.className = 'item-input item-stacked-label';

            span = document.createElement('span');
            span.className = 'input-label';
            label.appendChild(span);

            p = document.createElement('p');
            p.textContent = message;
            label.appendChild(p);

            container.appendChild(label);
        };

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
