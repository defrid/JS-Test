(function(window) {
    Provider.Controller("tableCtrl", function($scope) {
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
            $scope.$digest();
        }

        function callbackForDeleteAndPost(body, headers, status) {
            stateInput.value = "";
            cityInput.value = "";
            streetInput.value = "";
            http.get("http://localhost:8000/page/?page=1&elementsOnPage=10", callbackForGet);
        }

        var http = Provider.$get("$http");
        http.get("http://localhost:8000/page/?page=1&elementsOnPage=10", callbackForGet);

        $scope.get = function(pageNumber) {
            http.get("http://localhost:8000/page/" + "?page=" + pageNumber + "&elementsOnPage=10", callbackForGet);
        }

        $scope.delete = function(id) {
            http.deleteReq("http://localhost:8000/delete/" + id, callbackForDeleteAndPost);
        }

        $scope.post = function() {
            var reqBody = {
                state: stateInput.value,
                city: cityInput.value,
                street: streetInput.value
            }
            http.post("http://localhost:8000/post/", reqBody, callbackForDeleteAndPost);
        }
    }); 
})(window);