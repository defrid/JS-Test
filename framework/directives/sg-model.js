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
    },
    Test1: function() {
        modelScopeTest(modelScope);
        console.log("Test1 success")
    }
};
