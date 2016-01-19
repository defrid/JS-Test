(function(window) {
    addressBook.controller("formCtrl", ["$scope", "$http", "$state", function($scope, $http, $state){
        function callback(body, headers, status) {
            $scope.state = "";
            $scope.city = "";
            $scope.street = "";
            $state.reload("tableForm");
        }

        $scope.post = function() {
            var reqBody = {
                state: $scope.state,
                city: $scope.city,
                street: $scope.street
            }
            $http.post("http://localhost:8000/post/", reqBody).success(callback);
        }
    }]);
})(window);