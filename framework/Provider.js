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

        function Sample(Service) {
            console.assert(!!Service);
            called = true;
        }

		var ServiceCalled = false;
		var FactoryCalled = false;

        //Just example of Service realisation, does nothing right now
        Provider.$register("Service", function(Factory) {
            console.log("Service called");
            ServiceCalled = true;
            return function() {};
        });

        //Just example of Service realisation, does nothing right now
        Provider.$register("Factory", function($rootScope) {
            console.log("Factory called");
            FactoryCalled = true;
            return function() {};
        });

        Provider.$invoke(Sample);

        console.assert(called);
        console.assert(ServiceCalled);
        console.assert(FactoryCalled);

        console.log("Test3 Success");
    },

    Test4: function() {
        function Sample(Service) {
            console.assert(!!Service);
            return function() {
                return true;
            };
        }

        var ServiceCalled = false;
        var FactoryCalled = false;

        //Just example of Service realisation, does nothing right now
        Provider.$register("Service", function(Factory) {
            console.log("Service called");
            ServiceCalled = true;
            return function() {};
        });

        //Just example of Service realisation, does nothing right now
        Provider.$register("Factory", function($rootScope) {
            console.log("Factory called");
            FactoryCalled = true;
            return function() {};
        });

        Provider.$register("Sample", Sample);

        var res = Provider.$get("Sample");

        console.assert(res());
        console.assert(ServiceCalled);
        console.assert(FactoryCalled);

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
