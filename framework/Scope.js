function Scope() {
	this.arrOfListeners = [];
	this.$new = function() {
		return new Scope();
	};
	this.$watch = function(watchFn, ListenerFn) {
		var set = {
			watchFn: watchFn,
			ListenerFn: ListenerFn
		}
		this.arrOfListeners.push(set);
	}
	this.$digest = function() {
		for(var i = 0; i < this.arrOfListeners.length; i++) {
			this.arrOfListeners[i].ListenerFn();
		}
	};
}


var $rootScope;
var scopeTests = {
    Test1: function() {
        console.assert(Scope && typeof Scope == 'function');

        $rootScope = new Scope();

        console.assert($rootScope.$new && typeof $rootScope.$new == 'function');

        var scope = $rootScope.$new();

        console.assert(typeof scope == 'object');
        console.log("Test1 Success");
    },
    Test2: function() {
        if (!$rootScope)
            $rootScope = new Scope();
        var counter = 0;
        var scope = $rootScope.$new();
        scope.$watch(
            function() {
                console.log('watchFn');
            },
            function() {
                counter++;
            }
        );

        scope.$digest();
        scope.$digest();
        scope.$digest();
        console.assert(counter === 3);
        console.log("Test2 Success");
    },
    Test3: function() {
        if (!$rootScope)
            $rootScope = new Scope();

        var scope = $rootScope.$new();

        scope.firstName = 'Joe';
        scope.counter = 0;

        scope.$watch(
            function() {
                return scope.firstName;
            },
            function() {
                scope.counter++;
            }
        );

        console.assert(scope.counter === 0); //No changes

        scope.$digest();
        scope.$digest();
        console.assert(scope.counter === 1);
        //No old value => one call for listeners
        //Further $digest call doesn't call listeners, value is not changed

        scope.firstName = 'Jane';
        scope.$digest();
        scope.$digest();
        scope.$digest();
        console.assert(scope.counter === 2); //One change = One listener call
        console.log("Test3 Success");
    },
    Test4: function Test4() {
        if (!$rootScope)
            $rootScope = new Scope();

        var scope = $rootScope.$new();
        scope.testObject = {
            a: 1,
            b: 2
        };

        scope.counter = 0;

        scope.$watch(
            function() {
                return {
                    a: 1,
                    b: 2
                };
            },
            function() {
                scope.counter++;
            }
        );
        scope.$digest();
        scope.$digest();
        console.assert(scope.counter === 1);
        console.log("Test4 Success");
    },
    Test5: function() {
        if (!$rootScope)
            $rootScope = new Scope();

        var scope = $rootScope.$new();

        scope.counterA = 0;
        scope.counterB = 0;

        scope.$watch(
            function() {
                return scope.counterA;
            },
            function() {
                scope.counterB++;
            }
        );
        scope.$watch(
            function() {
                return scope.counterB;
            },
            function() {
                scope.counterA++;
            }
        );

        scope.$digest();

        console.assert(false); //This must never call
        console.warn("Test5 Failed");
    },
    Test6: function() {
        if (!$rootScope)
            $rootScope = new Scope();

        var scope = $rootScope.$new();

        scope.value = NaN;
        scope.counter = 0;
        scope.$watch(
            function() {
                return scope.value;
            },
            function() {
                scope.counter++;
            }
        );

        scope.$digest();

        console.assert(scope.counter === 1); //NaN != NaN cause $digest to be always dirty
        console.log("Test6 Success");
    },
    Test7: function() {
        if (!$rootScope)
            $rootScope = new Scope();

        var scope = $rootScope.$new();

        scope.counter = 0;

        scope.$watch(
            function() {
                return scope.counter++;
            },
            function() {
                scope.$digest();
            }
        )
        scope.$digest();
        console.assert(true); //Avoid looped $digest
        console.warn("Test7 Failed");
    },
    Test8: function() {
        if (!$rootScope)
            $rootScope = new Scope();

        var scope = $rootScope.$new();

        scope.value = 1;
        scope.listenerFlag = false;
        scope.$watch(
            function(scope) {
                return scope.value;
            },
            function(newValue, oldValue, scope) {
                console.assert(newValue === 1);
                console.assert(oldValue === undefined);
                scope.listenerFlag = true;
            }
        );

        scope.$digest();

        console.assert(scope.listenerFlag);

        scope.$eval(function(localScope) {
            console.assert(Utils.deepEqual(scope, localScope));
        });
        console.log("Test8 Success");
    },
    Test9: function() {
        $rootScope = new Scope();
        var scope = $rootScope.$new();

        console.assert(Utils.deepEqual(scope.$$parent, $rootScope));
        console.assert(Utils.deepEqual($rootScope.$$children, [scope]));
        console.log("Test9 Success");
    },
    Test10: function() {
        if (!$rootScope)
            $rootScope = new Scope();
        var scope = $rootScope.$new();

        scope.obj = {
            a: 1,
            b: 2
        };

        scope.$watch(function(scope) {
            return scope.obj;
        }, function(newVal, oldVal, scope) {
            scope.obj.a--;
            console.log("call");
        });

        scope.$digest();
        console.log("Test10 Fail");
        console.assert(false); //Object is changed, but $digest doesn't catch it
    },
    Test11: function() {
        $rootScope = new Scope();
        var scope = $rootScope.$new();

        var scope2 = scope.$new();
        console.assert(Utils.deepEqual($rootScope.$$children, [scope]));
        console.assert(Utils.deepEqual(scope.$$children, [scope2]));
        scope.$destroy();
        console.assert(Utils.deepEqual($rootScope.$$children, []));
        console.assert(Utils.deepEqual(scope.$$children, []));
        console.assert(!scope.$$parent);
        console.log("Test11 Success");
    },
    Test12: function() {
        if (!$rootScope)
            $rootScope = new Scope();
        var scope = $rootScope.$new();

        scope.value = function() {
            return 123;
        }

        scope.Test = "Test";

        console.assert(scope.$eval('value') === 123);

        console.assert(scope.$eval('Test') === "Test");
        console.log("Test12 Success");
    },
    Test13: function() {
        if (!$rootScope)
            $rootScope = new Scope();
        var scope = $rootScope.$new();

        scope.value = 123;
        console.assert(scope.$eval("value") === 123);
        scope.$set("value", 456);
        console.assert(scope.$eval("value") === 456);

        scope.obj = {
            value: 123
        };
        console.assert(scope.$eval("obj.value") === 123);
        scope.$set("obj.value", 456);
        console.assert(scope.$eval("obj.value") === 456);

        console.log("Test13 Success");
    },


};
