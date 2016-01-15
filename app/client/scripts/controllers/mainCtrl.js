(function(window) {
    var addressBook = angular.module("addressBook", []);
    addressBook.controller("mainCtrl", ["$scope", "$http", function($scope, $http) {
        function countNumberOfPages(elementsOnPage, totalPages) {
            var numberOfPages = [];
            for(var i = 0; i < Math.ceil(totalPages / elementsOnPage); i++) {
                numberOfPages[i] = i + 1;
            }
            return numberOfPages;
        }

        var stateInput = document.getElementById("state");
        var cityInput = document.getElementById("city");
        var streetInput = document.getElementById("street");

        function callbackForGet(body, headers, status) {
            $scope.pages = countNumberOfPages(10, body["totalRecords"]);
            $scope.data = body["data"];
        }

        function callbackForDeleteAndPost(body, headers, status) {
            stateInput.value = "";
            cityInput.value = "";
            streetInput.value = "";
            $http.get("http://localhost:8000/page/?page=1&elementsOnPage=10").success(callbackForGet);
        }

        $http.get("http://localhost:8000/page/?page=1&elementsOnPage=10").success(callbackForGet);

        $scope.get = function(pageNumber) {
            $http.get("http://localhost:8000/page/" + "?page=" + pageNumber + "&elementsOnPage=10").success(callbackForGet);
        }

        $scope.delete = function(id) {
            $http.delete("http://localhost:8000/delete/" + id).success(callbackForDeleteAndPost);
        }

        $scope.post = function() {
            var reqBody = {
                state: stateInput.value,
                city: cityInput.value,
                street: streetInput.value
            }
            $http.post("http://localhost:8000/post/", reqBody).success(callbackForDeleteAndPost);
        }
    }]); 
})(window);