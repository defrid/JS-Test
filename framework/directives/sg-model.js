Provider.directive("sg-model", function() {
    return {
        hasScope: false,
        link: function(scope, element, expr) {
            var exprAsArray = expr.match(/\b\w+\b/g);
            var copy = scope;
            for(var i = 0; i < exprAsArray.length - 1; i ++) {
                copy = copy[exprAsArray[i]];
            }

            function handlerOnInput() {
                copy[exprAsArray[exprAsArray.length - 1]] = element.value;
            }

            function handlerOnClick() {
                if(element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
                    element.value = scope.$eval(expr);
                } else {
                    element.innerHTML = scope.$eval(expr);
                }   
            }

            if(element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
                element.addEventListener("input", handlerOnInput);
            } else {
               element.addEventListener("click", handlerOnClick); 
            }

            scope.$watch(expr, handlerOnClick);
        }
    };
});

var modelScope = null;

function modelScopeTest($scope) {
    $scope.$digest();

    var clicker = document.getElementById("model-click");
    var span = document.getElementById("model-span");
    var input = document.getElementById("model-input");

    console.assert(span.innerHTML == 0);
    console.assert(input.value == 0);
    clicker.click();
    clicker.click();
    clicker.click();
    $scope.$digest();

    console.assert(span.innerHTML == 3);
    console.assert(input.value == 3);

    input.value = 10;
    var e = new Event('input');
    input.dispatchEvent(e);
    $scope.$digest();

    console.assert(span.innerHTML == 10);
    console.assert(input.value == 10);
}

var modelTests = {
    init: function() {
        Provider.Controller("ModelCtrl", function($scope) {
            modelScope = $scope;
            $scope.data = {
                value: 0
            }

            $scope.Click = function() {
                $scope.data.value++;
            };
        });

        var $rootScope = Provider.$get('$rootScope');
        Compiler.$compile($rootScope, document.getElementById("mdCtrl"));
    },
    Test1: function() {
        modelScopeTest(modelScope);
        console.log("Test1 success")
    }
};
