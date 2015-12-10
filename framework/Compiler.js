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
        var transclude;
        for(var i = 0; i < dirs.length; i++) {
            if(dirs[i].config.transclude) {
                transclude = true;
            }

            if(dirs[i].config.hasScope) {
                scope = scope.$new();
            }
            dirs[i].config.link(scope, element, dirs[i].expr);
        }

        var childs = element.children;
        for(var i = 0; i < childs.length; i++) {
            if(!transclude) {
                transclude = compiler.$compile(scope, childs[i]);
            }
        }
        return transclude;
    };

    this.$compileRoot = function() {
       var $rootScope = Provider.$get('$rootScope');
       compiler.$compile($rootScope, document.children[0]);
    };
}

var Compiler = new compilerSingltone();