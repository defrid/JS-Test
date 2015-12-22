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
(function(window) {
    Provider.$register("$http", function() {
        return (function() {
            var xhr = new XMLHttpRequest();

            function sendRequest(HTTPRequest, url, body, callback) {
                xhr.open(HTTPRequest, url, true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        var data = JSON.parse(xhr.responseText);
                        return callback(data, xhr.getAllResponseHeaders(), xhr.status);
                    }
                };

                if(HTTPRequest === 'POST') {
                    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                    body = JSON.stringify(body);
                }

                xhr.send(body);
            }

            function get(url, callback) {
                sendRequest('GET', url, null, callback);
            }

            function post(url, body, callback) {
                sendRequest('POST', url, body, callback);
            }

            return {
                get: get,
                post: post
            };
        })();
    });
})(window);