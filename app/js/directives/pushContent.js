angular.module('livewireApp')
.directive('pushContent', function($timeout) {
    return {
        scope: { trigger: '@pushContent' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === "true") {
                    var pushContent = function () {
                        $timeout(function () {
                            var sibling = element.next()[0],
                            siblingPosition = null,
                            elementPosition = element[0].getBoundingClientRect(),
                            margin = 0;

                            sibling.style.marginTop = '0';
                            siblingPosition = sibling.getBoundingClientRect();

                            margin = elementPosition.bottom - siblingPosition.top;
                            sibling.style.marginTop = margin + 'px';
                        });
                    };

                    pushContent();

                    window.addEventListener("orientationchange", function () {
                        pushContent();
                    });
                }
            });
        }
    };
});
