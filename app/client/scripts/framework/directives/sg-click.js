Provider.directive("sg-click", function() {
    return {
        hasScope: false,
        link: function(scope, element, expr) {
            function handler() {
                scope.$eval(expr);
                scope.$digest();
            }
            element.addEventListener("click", handler);
        }
    };
});
