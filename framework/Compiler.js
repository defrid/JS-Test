function compilerSingltone() {
    if(compilerSingltone.check) {
        return compilerSingltone.check;
    }
    else if(this === window) {
        return new compilerSingltone();
    }

    compilerSingltone.check = this;

    var compiler = this;

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

    this.$compile = function(scope, element) {
        var dirs = compiler.$$getElementDirectives(element);
        var ownScope;
        for(var i = 0; i < dirs.length; i++) {
            if(dirs[i].config.hasScope) {
                scope = scope.$new();
            }
            dirs[i].config.link(scope, element, dirs[i].expr);
        }

        var childs = element.children;
        for(var i = 0; i < childs.length; i++) {
            compiler.$compile(scope, childs[i]);
        }
    };

    this.$compileRoot = function() {
       var $rootScope = Provider.$get('$rootScope');
       compiler.$compile($rootScope, document.children[0]);
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
