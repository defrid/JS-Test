var addressBook = angular.module("addressBook", ["ui.router"]);
(function(window) {
    addressBook.controller("mainCtrl", ["$scope", "$http", "$state", function($scope, $http, $state) {
        function countNumberOfPages(elementsOnPage, totalPages) {
            var numberOfPages = [];
            for(var i = 0; i < Math.ceil(totalPages / elementsOnPage); i++) {
                numberOfPages[i] = i + 1;
            }
            return numberOfPages;
        }

        function callbackForGet(body, headers, status) {
            $scope.pages = countNumberOfPages(10, body["totalRecords"]);
            $scope.data = body["data"];
            $state.go("tableForm");
        }

        function callbackForDelete(body, headers, status) {
            $http.get("http://localhost:8000/page/?page=1&elementsOnPage=10").success(callbackForGet);
        }

        $http.get("http://localhost:8000/page/?page=1&elementsOnPage=10").success(callbackForGet);

        $scope.get = function(pageNumber) {
            $http.get("http://localhost:8000/page/" + "?page=" + pageNumber + "&elementsOnPage=10").success(callbackForGet);
        }

        $scope.delete = function(id) {
            $http.delete("http://localhost:8000/delete/" + id).success(callbackForDelete);
        }
    }]);  
})(window);