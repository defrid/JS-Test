(function(window) {
    Provider.directive("sg-repeat", function() {
        return {
            hasScope: false,
            transclude: true,
            link: function(scope, element, expr) {
                var itemName = expr.match(/(\w+)\s+in\s+(\w+)/)[1];
                var arrName = expr.match(/(\w+)\s+in\s+(\w+)/)[2];
                var parentElement = element.parentElement;
                var newElements = [element];

                function updateDOM(elem) {
                    for(var i = 0; i < scope[arrName].length; i++) {
                        var childScope = scope.$new();
                        childScope[itemName] = scope[arrName][i];
                        var newElement = elem.cloneNode(true);
                        newElements.push(newElement);
                        parentElement.insertBefore(newElement, newElements[0]);
                        for(var j = 0; j < newElement.children.length; j++) {
                            Compiler.$compile(childScope, newElement.children[j]);
                        }
                    }
                    parentElement.removeChild(elem);
                    newElements.shift();
                }

                updateDOM(newElements[0]);

                scope.$watch(arrName,
                             function() {
                                 for(var k = newElements.length - 1; k > 0; k--) {
                                     parentElement.removeChild(newElements[k]);
                                     newElements.pop();
                                 }
                                 updateDOM(newElements[0]);
                             });
            }
        };
    });
})(window);
