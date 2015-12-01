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
        };
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
            }
            for(var key in this) {
                if (this.hasOwnProperty(key)) {
                    copy[key] = this[key];
                }
            }
        }
        else {
            copy = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    copy[key] = this.deepCopy(obj[key]);
                }
            }
        }
        
        return copy;
    };
}

var Utils = new utilsSingletone();