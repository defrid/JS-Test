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

var providerTests = {
    Test1: function() {
        console.assert(Provider && typeof Provider == 'object');

        console.assert(Provider.$register && typeof Provider.$register == 'function');

        Provider.$register("Test1", function() {
            //Never called, but enough for Test1
        });

        console.log("Test1 Success");
    },

    Test2: function() {
        function Sample(val1, val2, val3) {};

        var depencies = Provider.$$annotate(Sample);
        console.assert(Utils.deepEqual(["val1", "val2", "val3"], depencies));

        console.log("Test2 Success");
    },

    Test3: function() {
        var called = false;

        var ServiceCalled = false;
        var FactoryCalled = false;

        function Sample(Service) {
            console.log("Sample called");
            console.assert(Service());
            called = true;
        }

        //Just example of Service realisation, does nothing right now
        Provider.$register("Service", function(Factory) {
            console.log("Service called");
            ServiceCalled = true;

			console.assert(Factory());

            return function() {
				return true;
			};
        });

        //Just example of Service realisation, does nothing right now
        Provider.$register("Factory", function($rootScope) {
            console.log("Factory called");
            FactoryCalled = true;
            return function() {
				return true;
			};
        });

        Provider.$invoke(Sample);

        console.assert(called);
        console.assert(ServiceCalled);
        console.assert(FactoryCalled);

        console.log("Test3 Success");
    },

    Test4: function() {
        function Foo(Bar) {
            console.assert(!!Foo);
            return function() {
                return true;
            };
        }

        var BarCalled = false;
        var FooBarCalled = false;

        //Just example of Service realisation, does nothing right now
        Provider.$register("Bar", function(FooBar) {
            console.log("Bar called");
            BarCalled = true;
            return function() {};
        });

        //Just example of Service realisation, does nothing right now
        Provider.$register("FooBar", function($rootScope) {
            console.log("FooBar called");
            FooBarCalled = true;
            return function() {};
        });

        Provider.$register("Foo", Foo);

        var res = Provider.$get("Foo");

        console.assert(res());

        console.assert(BarCalled);
        console.assert(FooBarCalled);

        console.log("Test4 Success");
    },

    Test5: function() {
        var called = false;

        function Controller($scope, Service) {
            called = $scope.value;
        }

        //Just example of Service realisation, does nothing right now
        Provider.$register("Service", function(Factory) {
            console.log("Service called");
            return function() {};
        });

        //Just example of Service realisation, does nothing right now
        Provider.$register("Factory", function($rootScope) {
            console.log("Factory called");
            return function() {};
        });

        Provider.$register("Ctrl", Controller);

        var $rootScope = Provider.$get("$rootScope");
        console.assert($rootScope);
        var scope = $rootScope.$new();
        scope.value = true;

        Provider.$get("Ctrl", {
            $scope: scope
        });

        console.assert(called);

        console.log("Test5 Success");
    },

    Test6: function() {
        console.assert(Provider.DIRECTIVE_POSTFIX);

        Provider.directive("sg-test", function() {
            return {
                hasScope: false,
                link: function() {
                    return true;
                }
            };
        });

        var sgTest = Provider.$get("sg-test" + Provider.DIRECTIVE_POSTFIX);

        console.assert(sgTest);
        console.assert(sgTest.link);
        console.log("Test6 Success");
    },

    Test7: function() {
        console.assert(Provider.CONTROLLER_POSTFIX);

        var $rootScope = Provider.$get("$rootScope");
        var scope = $rootScope.$new();
        Provider.Controller("ProviderCtrl", function($scope) {
            $scope.value = true;
        });

        var Ctrl = Provider.$get("ProviderCtrl" + Provider.CONTROLLER_POSTFIX);
        console.assert(Ctrl);
        Provider.$invoke(Ctrl, {
            $scope: scope
        })

        console.assert(scope.value);
        console.log("Test7 Success");
    }
};
