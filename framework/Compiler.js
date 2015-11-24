function compilerSingltone() {
    if(compilerSingltone.check) {
        return compilerSingltone.check;
    }
    else if(this === window) {
        return new compilerSingltone();
    }

    compilerSingltone.check = this;

    this.$$getElementDirectives = function(element) {
        var attributes = element.attributes;
        var dirs = [];
        for(var i = 0; i < attributes.length; i++) {
            var directiveConfig = Provider.$get(attributes[i].nodeName + Provider.DIRECTIVE_POSTFIX);
            if(directiveConfig) {
                dirs.push({
                    expr: attributes[i].nodeValue,
                    config: directiveConfig
                });
            }
        }
        return dirs;
    };
}

var Compiler = new compilerSingltone();

var compilerTests = {
    Test1: function () {
        console.assert(Compiler && typeof Compiler == 'object');

        console.assert(Compiler.$$getElementDirectives && typeof Compiler.$$getElementDirectives == 'function');

        var element = document.getElementById("dir-test");

        var dirs = Compiler.$$getElementDirectives(element);

        console.assert(dirs[0].expr === "Ctrl");
        console.assert(dirs[1].expr === "value");

        console.assert(dirs[0].config.hasScope);
        console.assert(!dirs[1].config.hasScope);

        console.log("Test1 success");
    },
    Test2: function () {
        Provider.Controller("MainCtrl", function ($scope) {
            $scope.value = function () {
                return "Test2 Success";
            }
        });

        var $rootScope = Provider.$get('$rootScope');
        var element = document.getElementById("compile-test");

        Compiler.$compile($rootScope, element);

        var bindElement = document.getElementById("compile-inner");

        console.assert(bindElement.innerHTML === "Test2 Success");
    },
};
