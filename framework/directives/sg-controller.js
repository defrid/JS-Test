var controllerTests = {
	Test1: function () {
		var controller = Provider.$get("sg-controller" + Provider.DIRECTIVE_POSTFIX);

		Provider.Controller("Ctrl", function ($scope) {
			$scope.value = true;
		});

		console.assert(controller);
		console.assert(controller.hasScope);

		var $rootScope = Provider.$get('$rootScope');

		var scope = $rootScope.$new();

		controller.link(scope, null, "Ctrl");

		console.assert(scope.value);
		console.log("Test1 success")
	},

	Test2: function() {
		var controller = Provider.$get("sg-controller" + Provider.DIRECTIVE_POSTFIX);

		Provider.Controller("Ctrl2", function ($scope, Factory) {
			$scope.value = true;
		});

		console.assert(controller);
		console.assert(controller.hasScope);

		Provider.$register("Factory", function ($rootScope) {
			console.log("Factory called");
			return function () { };
		});

		var $rootScope = Provider.$get('$rootScope');

		var scope = $rootScope.$new();

		controller.link(scope, null, "Ctrl2");

		console.assert(scope.value);
		console.log("Test2 success")
	}
};
