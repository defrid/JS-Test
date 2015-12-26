(function(window) {
    Provider.Controller("tableCtrl", function($scope) {
        $scope.data = [{state: "State", city: "City", street: "Street"}];
        $scope.pages = [{value: 1}];

        function callback(body, headers, status) {
            $scope.pages = body;
            $scope.$digest();
        }

        var http = Provider.$get("$http");
        http.get("http://localhost:8000/get/?elementsOnPage=10", callback);

        $scope.Click = function(pageNumber) {
            function callback(body, headers, status) {
                $scope.data = body;
                $scope.$digest();
            }
            http.get("http://localhost:8000/page/" + "?page=" + pageNumber + "&elementsOnPage=10", callback);
        }
    }); 
})(window);