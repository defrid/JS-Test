(function(window) {
    Provider.$register("$http", function() {
        return (function() {
            var xhr = new XMLHttpRequest();

            function sendRequest(HTTPRequest, url, body, callback) {
                xhr.open(HTTPRequest, url, true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if(xhr.responseText) {
                            var data = JSON.parse(xhr.responseText);
                        }
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

            function deleteReq(url, callback) {
                sendRequest('DELETE', url, null, callback);
            }

            return {
                get: get,
                post: post,
                deleteReq: deleteReq
            };
        })();
    });
})(window);
