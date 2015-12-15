function providerSingletone() {

    if(providerSingletone.check) {
        return providerSingletone.check;
    }
    else if(this === window) {
        return new providerSingletone();
    }

    providerSingletone.check = this;

    var provider = this;

    var $$providers = {};

    var $$cache = {
        $rootScope: new Scope()
    };

    this.$register = function(name, func) {
        $$providers[name] = func;
    };

    this.$$annotate = function(func) {
        var funcToString = func.toString();
        try {
            var paramsAsString = funcToString.match(/\(([^)]+)\)/)[1];
            var paramsAsArray = paramsAsString.split(/,\s/g);
        } catch(err) {
            return [null];
        }

        return paramsAsArray;
    };

    this.$invoke = function(func, locals) {
        var arrOfArgs = provider.$$annotate(func);
        var providers = [];
        for(var i = 0; i < arrOfArgs.length; i++) { 
            if(locals && locals.hasOwnProperty(arrOfArgs[i])) {
                providers.push(locals[arrOfArgs[i]]);
            }
            else if($$providers.hasOwnProperty(arrOfArgs[i])) {
                providers.push(provider.$get(arrOfArgs[i]));
            }
        }
        return func.apply(null, providers);
    };

    this.$get = function(providerName, locals) {
        if($$cache[providerName]) {
            return $$cache[providerName];
        }
        if(typeof($$providers[providerName]) != "function") {
            return null;
        }
        $$cache[providerName] = provider.$invoke($$providers[providerName], locals);
        return $$cache[providerName];
    };

    this.DIRECTIVE_POSTFIX = "-directive";

    this.directive = function(name, func) {
        $$providers[name + provider.DIRECTIVE_POSTFIX] = func;
    };

    this.CONTROLLER_POSTFIX = "-controller";

    this.Controller = function(name, func) {
        $$providers[name + provider.CONTROLLER_POSTFIX] = function() {
            return func;
        };
    };
}

var Provider = new providerSingletone();