function utilsSingletone() {
	
	if(utilsSingletone.check) {
		return utilsSingletone.check;
	}
	else if(this === window) {
		return new utilsSingletone();
	}
	
	utilsSingletone.check = this;
	
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
 
		for (var property in obj1) {
			if (!(obj1.hasOwnProperty(property) && obj2.hasOwnProperty(property)) || !deepEqual(obj1[property], obj2[property])) {
				return false;        
			}
		}
		return true;
	};
	
	this.deepCopy = function(obj) {
		var newObj = {};
			for(var key in obj) {
				if(typeof obj[key] != "object" || obj[key] === null){
					var property = obj[key];
					newObj[key] = property;
				}
				else {
					newObj[key] = this.deepCopy(obj[key]);
				}
			}
		return newObj;
	};
}

var Utils = new utilsSingletone();