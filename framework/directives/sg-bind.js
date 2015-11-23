Provider.directive("sg-bind", function() {
    return {
        hasScope: false,
        link: function(scope, element, expr) {
            element.innerHTML = scope.bindTest;
            scope.$watch(expr, function() {element.innerHTML = scope.bindTest});
        }
    };
});

var bindTests = {
    Test1: function() {
        var bind = Provider.$get("sg-bind" + Provider.DIRECTIVE_POSTFIX)
        console.assert(bind);

        var $rootScope = Provider.$get('$rootScope');
        $rootScope.bindTest = "Test";
        var element = document.getElementById('bind');

        bind.link($rootScope, element, function(scope) {
            return scope.bindTest;
        });

        console.assert(element.innerHTML === "Test");

        $rootScope.bindTest = "Another Test";
        $rootScope.$digest();

        console.assert(element.innerHTML === "Another Test");
        console.log("Test1 success")
    }
};
