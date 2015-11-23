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