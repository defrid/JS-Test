// Utils
function Utils() {
	
	if(check) {
		return check;
	}
	else if(this === window) {
		return new Utils();
	}
	
	var check = this;
	
	this.reduce = {};
	this.deepEquals = {};
	this.deepCopy = {};
}

var obj1 = new Utils;
var obj2 = new Utils;

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