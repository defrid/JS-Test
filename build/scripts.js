function compilerSingltone() {
    if(compilerSingltone.check) {
        return compilerSingltone.check;
    }
    else if(this === window) {
        return new compilerSingltone();
    }

    compilerSingltone.check = this;

    var compiler = this;

    this.$$getElementDirectives = function(element) {
        var attributes = element.attributes;
        var dirs = [];
        for(var i = 0; i < attributes.length; i++) {
            var directiveConfig = Provider.$get(attributes[i].nodeName + Provider.DIRECTIVE_POSTFIX);
            if(directiveConfig) {
                dirs.push({
                    expr: attributes[i].nodeValue,
                    config: directiveConfig
                });
            }
        }
        return dirs;
    };

    this.$compile = function(scope, element) {
        var dirs = compiler.$$getElementDirectives(element);
        var transclude;
        for(var i = 0; i < dirs.length; i++) {
            if(dirs[i].config.transclude) {
                transclude = true;
            }

            if(dirs[i].config.hasScope) {
                scope = scope.$new();
            }
            dirs[i].config.link(scope, element, dirs[i].expr);
        }

        var childs = element.children;
        for(var j = 0; j < childs.length; j++) {
            if(!transclude) {
                transclude = compiler.$compile(scope, childs[j]);
            }
        }
        return transclude;
    };

    this.$compileRoot = function() {
       var $rootScope = Provider.$get('$rootScope');
       compiler.$compile($rootScope, document.children[0]);
    };
}

var Compiler = new compilerSingltone();
function providerSingletone() {

    if(providerSingletone.check) {
        return providerSingletone.check;
    }
    else if(this === window) {
        return new providerSingletone();
    }

    providerSingletone.check = this;

    var provider = this;

    var $$providers = {};

    var $$cache = {
        $rootScope: new Scope()
    };

    this.$register = function(name, func) {
        $$providers[name] = func;
    };

    this.$$annotate = function(func) {
        var funcToString = func.toString();
        try {
            var paramsAsString = funcToString.match(/\(([^)]+)\)/)[1];
            var paramsAsArray = paramsAsString.split(/,\s/g);
        } catch(err) {
            return [null];
        }

        return paramsAsArray;
    };

    this.$invoke = function(func, locals) {
        var arrOfArgs = provider.$$annotate(func);
        var providers = [];
        for(var i = 0; i < arrOfArgs.length; i++) { 
            if(locals && locals.hasOwnProperty(arrOfArgs[i])) {
                providers.push(locals[arrOfArgs[i]]);
            }
            else if($$providers.hasOwnProperty(arrOfArgs[i])) {
                providers.push(provider.$get(arrOfArgs[i]));
            }
        }
        return func.apply(null, providers);
    };

    this.$get = function(providerName, locals) {
        if($$cache[providerName]) {
            return $$cache[providerName];
        }
        if(typeof($$providers[providerName]) != "function") {
            return null;
        }
        $$cache[providerName] = provider.$invoke($$providers[providerName], locals);
        return $$cache[providerName];
    };

    this.DIRECTIVE_POSTFIX = "-directive";

    this.directive = function(name, func) {
        $$providers[name + provider.DIRECTIVE_POSTFIX] = func;
    };

    this.CONTROLLER_POSTFIX = "-controller";

    this.Controller = function(name, func) {
        $$providers[name + provider.CONTROLLER_POSTFIX] = function() {
            return func;
        };
    };
}

var Provider = new providerSingletone();
function Scope() {
    
    var scope = this;
    
    var $$arrOfListeners = [];
    
    this.$new = function() {
        var child = new Scope ();
        child.prototype = scope;
        child.prototype.constructor = child;
        child.$$parent = scope;
        scope.$$children.push(child);
        
        return child;
    };
    
    this.$$children = [];
    
    var $$CONST = {
        STOPON: 10
    };

    this.$watch = function(watchFn, listenerFn) {
        var set = {
            watchFn: watchFn,
            listenerFn: listenerFn,
            previous: undefined 
        };
        $$arrOfListeners.push(set);
    };
    
    var $$phase = null;
    
    function $$activatePhase(phase) {
        if($$phase === phase) {
            throw "No way!";
        }
        $$phase = phase;
    };
    
    function $$clearPhase() {
        $$phase = null;
    };
    
    function $$digestOnce() {
        var listeners = $$arrOfListeners;
        var foundChanges;
        for(var i = 0; i < listeners.length; i++) {
            var newVal = scope.$eval(listeners[i].watchFn);
            var oldVal = listeners[i].previous;
            if(oldVal === oldVal || newVal === newVal) {
                if(!Utils.deepEqual(oldVal, newVal)) {
                    listeners[i].previous = Utils.deepCopy(newVal);
                    listeners[i].listenerFn(newVal, oldVal, scope);
                    foundChanges = true;
                }
            }
        }
        return foundChanges;
    };
    
    this.$digest = function() {
        var counter = $$CONST.STOPON;
        var foundChanges;
        $$activatePhase("$digest");
        do {
            foundChanges = $$digestOnce();
            counter--;
            if(counter === 0) {
                throw "Limit is exceeded";
            }
        } while(foundChanges);
        $$clearPhase();
    };
    
    this.$eval = function(expr) {
        if(typeof expr === "function") {
            return expr(scope);
        }
        if(typeof(expr === "string")) {
            var exprAsArray = expr.match(/\b\w+\b/g);

            if(exprAsArray.length === 1) {
                if(this.hasOwnProperty(exprAsArray[0]) && typeof this[exprAsArray[0]] != "function") {
                    return this[exprAsArray[0]];
                }
                if(typeof this[exprAsArray[0]] === "function") {
                    return this[exprAsArray[0]](scope);
                }
            }

            if(exprAsArray.length > 1) {
                var nextExpr = exprAsArray.slice(1).join(".");
                return scope.$eval.call(this[exprAsArray[0]], nextExpr);
            }
        }
    };
    
    this.$destroy = function() {
        scope.$$parent.$$children.splice(scope.$$parent.$$children.indexOf(scope), 1);
        scope.$$parent = null;
        for(var count = scope.$$children.length; count > 0; count--) {
            scope.$$children[count - 1].$destroy();
        }
    };

    this.$set = function(property, value) {
        var propertyAsArray = property.split(/\./);

        if(propertyAsArray.length === 1) {
            this[propertyAsArray[0]] = value;
        }
        else if(propertyAsArray.length > 1) {
            var nextProperty = propertyAsArray.slice(1).join(".");
            return scope.$set.call(this[propertyAsArray[0]], nextProperty, value);
        }
    };
}

function utilsSingletone() {
    
    if(utilsSingletone.check) {
        return utilsSingletone.check;
    }
    else if(this === window) {
        return new utilsSingletone();
    }
    
    utilsSingletone.check = this;

    var utils = this;
    
    this.reduce = function(arr, combine) {
        var res = arr[0];
        for(i = 1; i < arr.length; i ++) {
            res = combine(res, arr[i]); 
        }
        return res;
    };

    this.deepEqual = function(obj1, obj2) {
        if (obj1 === obj2) {
            return true;
        }
        if (typeof(obj1) != "object" || obj1 === null || typeof(obj2) != "object" || obj2 === null) {
            return false;
        }

        if(Object.keys(obj1).length != Object.keys(obj2).length) {
            return false;
        }

        for (var property in obj1) {
            if (!(obj1.hasOwnProperty(property) && obj2.hasOwnProperty(property)) || !utils.deepEqual(obj1[property], obj2[property])) {
                return false;        
            }
        }
        return true;
    };
    
    this.deepCopy = function deepCopy(obj) {
        
        if (typeof obj != 'object' && typeof obj != 'function') {
            return obj;
        }
        
        var copy;

        if (typeof obj === 'function') {
            var that = this;
            copy = function() {
                return that.apply(this, arguments);
            };
            for(var key in this) {
                if (this.hasOwnProperty(key)) {
                    copy[key] = this[key];
                }
            }
        }
        else {
            copy = {};
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    copy[prop] = this.deepCopy(obj[prop]);
                }
            }
        }
        
        return copy;
    };
}

var Utils = new utilsSingletone();
Provider.directive("sg-bind", function() {
    return {
        hasScope: false,
        link: function(scope, element, expr) {
            element.innerHTML = scope.$eval(expr);
            scope.$watch(expr, function() {element.innerHTML = scope.$eval(expr);});
        }
    };
});

Provider.directive("sg-click", function() {
    return {
        hasScope: false,
        link: function(scope, element, expr) {
            function handler() {
                scope.$eval(expr);
                scope.$digest();
            }
            element.addEventListener("click", handler);
        }
    };
});

Provider.directive("sg-controller", function() {
    return {
        hasScope: true,
        link: function(scope, element, expr) {
            var controller = Provider.$get(expr + Provider.CONTROLLER_POSTFIX);
            Provider.$invoke(controller, {$scope: scope});
        }
    };
});

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
                    parentElement.appendChild(newElement);
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

Provider.$register("$http", function() {
    return (function() {
        var xhr = new XMLHttpRequest();

        function sendRequest(HTTPRequest, url, body, callback) {
            xhr.open(HTTPRequest, url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    return callback(xhr.responseText, xhr.getAllResponseHeaders(), xhr.status);
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

Provider.Controller("httpCtrl", function($scope) {
    function callback(body, headers, status) {
        $scope.object = JSON.parse(body);
        $scope.$digest();
    }
    var http = Provider.$get("$http");
    http.get("http://localhost:8000/get", callback);
    http.post("http://localhost:8000/post", {value: 20}, callback);
});