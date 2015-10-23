// Utils
function Utils() {
	
	if(Utils.check) {
		return Utils.check;
	}
	else if(this === window) {
		return new Utils();
	}
	
	Utils.check = this;
	
	this.reduce = {};
	this.deepEquals = {};
	this.deepCopy = {};
}

//Utils через замыкание

var closure = function() {
	var instance;
	
	return function() {
		if(instance) {
			return instance;
		}
		else return function newUtils() {
			this.reduce = {};
			this.deepEquals = {};
			this.deepCopy = {};
		}		
	}
}

var obj1 = closure;
var obj2 = closure;

console.log(obj1 === obj2);

//Abstract Factory

function abstractClass() {
	
}

function inheritor1() {
	
}
inheritor1.prototype = new abstractClass();

function inheritor2() {
	
}
inheritor2.prototype = new abstractClass();

function abstractFactory() {
	
}

concrteFactory1 = function() {
	return new inheritor1();
};
concreteFactory2 = function() {
	return new inheritor2();
}

console.log()