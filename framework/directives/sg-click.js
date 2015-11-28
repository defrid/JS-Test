Provider.directive("sg-click", function() {
    return {
        hasScope: false,
        link: function(scope, element, expr) {
            element.onclick = function() {
                scope.$eval(expr);
                scope.$digest();
            };
        }
    };
});

var localScope = null;

var clickTests = {
    init: function() {
        Provider.Controller("ClickCtrl", function($scope) {
            localScope = $scope;
            $scope.clickValue = 0;
            $scope.Click = function() {
                $scope.clickValue++;
            };
        });

        var $rootScope = Provider.$get('$rootScope');
        Compiler.$compile($rootScope, document.getElementById("clCtrl"));
    },
    Test1: function() {
        var element = document.getElementById("clickBtn");
        console.assert(localScope.clickValue === 0);
        element.click();
        element.click();
        element.click();
        console.assert(localScope.clickValue === 3);
        console.log("Test1 success");
    }
};
