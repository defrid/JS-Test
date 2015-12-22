(function(window) {
    Provider.directive("sg-bind", function() {
        return {
            hasScope: false,
            link: function(scope, element, expr) {
                element.innerHTML = scope.$eval(expr);
                scope.$watch(expr, function() {element.innerHTML = scope.$eval(expr);});
            }
        };
    });
})(window);
