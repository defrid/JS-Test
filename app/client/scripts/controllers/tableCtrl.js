(function(window) {
    Provider.Controller("tableCtrl", function($scope) {
        $scope.data = [{state: "State", city: "City", street: "Street"}];
        $scope.array = [{value: 1}];

        function cb(body, headers, status) {
            $scope.array = body;
            $scope.$digest();
        }

        var http = Provider.$get("$http");
        http.get("http://localhost:8000/get", cb);

        $scope.Click = function() {
            function callback(body, headers, status) {
                $scope.data = body;
                $scope.$digest();
            }
            http.get("http://localhost:8000/get/" + $scope.clickedElement.innerHTML, callback);
        }
    }); 
})(window);