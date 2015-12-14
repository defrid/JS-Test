Provider.$register("$http", function() {
    return function($scope) {
        $scope.xhr = new XMLHttpRequest();

        function doCallback(callback) {
            if ($scope.xhr.readyState === 4) {
                callback.call($scope, $scope.xhr.responseText, $scope.xhr.getAllResponseHeaders(), $scope.xhr.status);
            }
        }

        function get(url, callback) {
            $scope.xhr.open('GET', url, true);
            $scope.xhr.onreadystatechange = function() {
                doCallback(callback);
            };
            $scope.xhr.send(null);
        }

        function post(url, body, callback) {
            $scope.xhr.open('POST', url, true);
            $scope.xhr.onreadystatechange = function() {
                doCallback(callback);
            };
            $scope.xhr.send(body);
        }

        return {
            get: get,
            post: post
        }
    }
});

var httpTests = {
    Test1: function() {
        var $rootScope = Provider.$get("$rootScope");
        var $http = Provider.$get("$http");

        function callback(body, headers, status) {
            this.object = JSON.parse(body);
            var element = document.getElementById("http");
            Compiler.$compile(this, element);
        }

        var http = $http($rootScope);
        http.get("http://localhost:8000", callback);
    }
}       