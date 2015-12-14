var httpTests = {
    Test1: function() {
        Provider.$register("$http", function() {
            return function($scope) {
                $scope.xhr = new XMLHttpRequest();
                $scope.xhr.open('GET', 'http://localhost:8000', true);
                $scope.xhr.onreadystatechange = function() {
                    if ($scope.xhr.readyState != 4) return;
                    $scope.object = JSON.parse($scope.xhr.responseText);
                    var element = document.getElementById("http");
                    Compiler.$compile($scope, element);
                };
            $scope.xhr.send(null);
            }
        });

        var $rootScope = Provider.$get("$rootScope");
        var $http = Provider.$get("$http");

        $http($rootScope);
    }
}