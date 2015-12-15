Provider.directive("sg-controller", function() {
    return {
        hasScope: true,
        link: function(scope, element, expr) {
            var controller = Provider.$get(expr + Provider.CONTROLLER_POSTFIX);
            Provider.$invoke(controller, {$scope: scope});
        }
    };
});
