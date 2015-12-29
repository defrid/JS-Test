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

        function callback(body, headers, status) {
            $scope.pages = countNumberOfPages(10, headers.match(/Total Elements: (\d+)/)[1]);
            $scope.data = body;
            stateInput.value = "";
            cityInput.value = "";
            streetInput.value = "";
            $scope.$digest();
        }

        var http = Provider.$get("$http");
        http.get("http://localhost:8000/page/?page=1&elementsOnPage=10", callback);

        $scope.get = function(pageNumber) {
            http.get("http://localhost:8000/page/" + "?page=" + pageNumber + "&elementsOnPage=10", callback);
        }

        $scope.delete = function(id) {
            http.deleteReq("http://localhost:8000/delete/" + "?id=" + id + "&page=1&elementsOnPage=10", callback);
        }

        $scope.post = function() {
            var reqBody = {
                state: stateInput.value,
                city: cityInput.value,
                street: streetInput.value
            }
            http.post("http://localhost:8000/post/" + "?page=1&elementsOnPage=10", reqBody, callback)
        }
    }); 
})(window);