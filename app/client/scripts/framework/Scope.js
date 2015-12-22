(function(window) {
    window.Scope = function() {
        
        var scope = this;
        
        var $$arrOfListeners = [];
        
        this.$new = function() {
            var child = new Scope ();
            Object.setPrototypeOf(child, scope);
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
})(window);
