(function(window) {
    Provider.Controller("httpCtrl", function($scope) {
        function callback(body, headers, status) {
            $scope.object = JSON.parse(body);
            $scope.$digest();
        }
        var http = Provider.$get("$http");
        http.get("http://localhost:8000/get", callback);
        http.post("http://localhost:8000/post", {value: 20}, callback);
    });
})(window);
