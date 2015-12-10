Provider.directive("sg-controller", function() {
    return {
        hasScope: true,
        link: function(scope, element, expr) {
            var controller = Provider.$get(expr + Provider.CONTROLLER_POSTFIX);
            Provider.$invoke(controller, {$scope: scope});
        }
    };
});

var controllerTests = {
    Test1: function () {
        var controller = Provider.$get("sg-controller" + Provider.DIRECTIVE_POSTFIX);

        Provider.Controller("Ctrl1", function ($scope) {
            $scope.value = true;
        });

        console.assert(controller);
        console.assert(controller.hasScope);

        var $rootScope = Provider.$get('$rootScope');

        var scope = $rootScope.$new();

        controller.link(scope, null, "Ctrl1");

        console.assert(scope.value);
        console.log("Test1 success")
    },

    Test2: function() {
        var controller = Provider.$get("sg-controller" + Provider.DIRECTIVE_POSTFIX);

        Provider.Controller("Ctrl2", function ($scope, Factory1) {
            $scope.value = true;
        });

        console.assert(controller);
        console.assert(controller.hasScope);

        Provider.$register("Factory1", function ($rootScope) {
            console.log("Factory1 called");
            return function () { };
        });

        var $rootScope = Provider.$get('$rootScope');

        var scope = $rootScope.$new();

        controller.link(scope, null, "Ctrl2");

        console.assert(scope.value);
        console.log("Test2 success")
    }
};
