var repeatScope = Provider.$get('$rootScope');

function repeatScopeTest($scope) {
    var TEST_LENGTH = 5;

    $scope.$digest();

    var elements = document.getElementsByClassName("repeatParent");
    console.assert(elements.length === 3);

    for (var i = 0; i < TEST_LENGTH; i++)
        $scope.data[i] = {
            value: i
        };
    $scope.$digest();
    elements = document.getElementsByClassName("repeatParent");
    console.assert(elements.length === TEST_LENGTH);

    for (var i = 0; i < elements.length; i++) {
        console.assert(elements[i].firstElementChild.innerHTML == i);
    }

    $scope.data[0].value = 100;
    $scope.$digest();
    console.assert(document.getElementsByClassName("repeatParent")[0].firstElementChild.innerHTML == 100);

    $scope.data[$scope.data.length] = {
        value: 50
    };
    $scope.data.push({
        value: 60
    });
    $scope.$digest();

    elements = document.getElementsByClassName("repeatParent");
    console.assert($scope.data.length === elements.length);
    for (var i = 0; i < elements.length; i++) {
        console.assert(elements[i].firstElementChild.innerHTML == $scope.data[i].value);
    }

    $scope.data = [{
        value: -1
    }, {
        value: -2
    }, {
        value: -3
    }];
    $scope.$digest();

    elements = document.getElementsByClassName("repeatParent");

    for (var i = 0; i < elements.length; i++) {
        console.assert(elements[i].firstElementChild.innerHTML == $scope.data[i].value);
    }

    $scope.data[$scope.data.length] = {
        value: 300
    };
    $scope.data.push({
        value: 400
    });
    $scope.$digest();
}

var repeatTests = {
    init: function() {
        Provider.Controller("RepeatCtrl", function($scope) {
            repeatScope = $scope;
            $scope.data = [{
                value: -10
            }, {
                value: -20
            }, {
                value: -30
            }];

        });

        var $rootScope = Provider.$get('$rootScope');
        Compiler.$compile($rootScope, document.getElementById("rpCtrl"));
    },
    Test1: function() {
        repeatScopeTest(repeatScope);
        console.log("Test1 success")
    }
};
