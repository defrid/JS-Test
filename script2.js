//Сумма диапазона
function range(a, b, step) {
	var res = [];
	res[0] = a;
	if(step === undefined) {
		while(a + 1 <= b) {
			res[res.length] = a += 1;
		}
	}
	else if(step > 0){
		while(a + step <= b) {
			res[res.length] = a += step;
		}
	}
	else {
		while(a + step >= b) {
			res[res.length] = a += step;
		}
	}
	return res;
}
function sum(arr) {
	s = 0;
	for(i = 0; i < arr.length; i++) {
		s += arr[i]; 
	}
	return s;
}
console.log(range(-5, 2));

//Обращаем вспять массив
function reverseArray(arr) {
	var newarr = [];
	for(var i = arr.length - 1; i >=0; i--) {
		newarr.push(arr[i]);
	}
	return newarr;
}
console.log(reverseArray([1, 2, 3, 4, 7, 1]));

function reverseArrayInPlace(arr) {
	for(var i = arr.length - 1; i >=0; i--) {
		arr.push(arr[i]);
	}
	var count = arr.length / 2 - 1;
	while(count >= 0) {
		arr.shift();
		count--;
	}
}
var arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);

//Список
function arrayToList(arr) {
 var list = {};
 var cur = {};

 list.value = arr.shift();
 list.rest = cur;
 
 var count = arr.length;
 
 while(count > 0) {
	cur.value = arr.shift();
	cur.rest = {};
	cur = cur.rest;
	count--;
}
return list;
}
console.log(arrayToList([10, 20, 30,40, 50]));

//Список с помощью рекурсии
function arrayToListRec(arr) {
	if(!arr.length) {
		return list;
	}
	else {
		var list = {};
		list.value = arr.shift();
		list.rest = arrayToListRec(arr);		
	}
	return list;
}
console.log(arrayToListRec([10, 20, 30, 40, 50]));

//Список в массив
function listToArray(list) {
	var arr = [];
	function bypass(list) {
		for(var i in list) {
			if(typeof list[i] != "object") {
				arr.push(list[i]);
			}
			else {
				list = list[i];
				bypass(list);
			}
		}
	}
	bypass(list);
	return arr;
}
console.log(listToArray(arrayToList([10, 20, 30, 40, 50])));

//Функция prepend
function prepend(value, list) {
	var forAdd = {};
	forAdd.value = value;
	forAdd.rest = list;
	return forAdd;
}
console.log(prepend(10, prepend(20, null)));

//Функция nth
function nth(list, position) {
	var count = 0;
	while(list.rest) {
		if(count === position) {
			return list.value;
		}
		count++;
		list = list.rest;
	}
}
console.log(nth(arrayToList([10, 20, 30]), 1));

//Функция nth рекурсивно
function nthRec(list, position) {
	if(list.hasOwnProperty("value")){
		if(position === 0) {
			return list.value;
		}
		else {
			position--;
			return nthRec(list.rest, position);
		}
	}
	else {
		return "undefined";
	}
}
console.log(nthRec(arrayToList([10, 20, 30]), 0));


//Глубокое сравнение
function deepEqual(obj1, obj2) {
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
}
var test1 = {};
var test2 = 5;
var test3 = 5;
var test4 = 7;
console.log(deepEqual(null, null));
console.log(deepEqual(null, test1));
console.log(deepEqual(test2, test3));
console.log(deepEqual(test3, test4));
console.log(deepEqual(test1, test4));
var obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
console.log(deepEqual(obj, {here: 1, object: 2}));
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
console.log(deepEqual(obj, {here: {is: "an"}, object: 3}));

//Реализация Stack и Queue
//Конструктор и push
function List(value) {
	this.head = {
		value: value
	};
}

function push(head, value) {
	while (head.rest) {
		head = head.rest;
	}
	head.rest = {
		value: value
	};
}

//Рекурсивный push
function pushRec(head, value) {
	if(!head.hasOwnProperty("rest")) {
		head.rest = {
			value: value
		}
	}
	else {
		pushRec(head.rest, value)
	}
}

var example = new List(5);
pushRec(example, 7);
pushRec(example, 10);
console.log(example);

//Функция pop для стэка
function popStack(stack) {
	while(stack.rest.hasOwnProperty("rest")) {
		stack = stack.rest;
	}
	var res = stack.rest;
	delete stack.rest;
	return res;
}
var stack = new List(9);
push(stack, 7);
push(stack, 10);
console.log(stack);
console.log(popStack(stack));
console.log(stack);

//Функция pop для очереди
function popQueue(queue) {
	var res = queue.head;
	var tail = queue.rest;
	delete queue.head;
	queue.head = {
		value: tail.value
	};
	queue.rest = tail.rest;
	return res;
}

var queue = new List(5);
push(queue, 7);
push(queue, 10);
push(queue, 15);
console.log(queue);
console.log(popQueue(queue));
console.log(queue);

//Функция deepCopy
function deepCopy(obj) {
	var newObj = {};
		function copy(obj) {
			for(var key in obj) {
				if(typeof obj[key] != "object" || obj[key] === null){
					var property = obj[key];
					newObj[key] = property;
				}
				else {
					copy(obj[i]);
				}
		}
	}
	copy(obj);
	return newObj;
}

var first = {
	property1: "hello",
	property2: {
		property1: "world",
		property2: "hey!"
	}
}
console.log(first);
var second = deepCopy(first);
console.log(second);

first.property1.property2 = "okaaay";
console.log(first);
console.log(second);





