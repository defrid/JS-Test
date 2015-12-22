(function(window) {
    Provider.directive("sg-model", function() {
        return {
            hasScope: false,
            link: function(scope, element, expr) {
                var exprAsArray = expr.match(/\b\w+\b/g);
                var copy = scope;
                for(var i = 0; i < exprAsArray.length - 1; i ++) {
                    copy = copy[exprAsArray[i]];
                }

                function handlerOnInput() {
                    copy[exprAsArray[exprAsArray.length - 1]] = element.value;
                }

                if(element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
                    element.addEventListener("input", handlerOnInput);
                }

                function listener() {
                    if(element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
                        element.value = scope.$eval(expr);
                    } else {
                        element.innerHTML = scope.$eval(expr);
                    }   
                }

                scope.$watch(expr, listener);
            }
        };
    });
})(window);
