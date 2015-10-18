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
	for(i = arr.length - 1; i >=0; i--) {
		newarr.push(arr[i]);
	}
	return newarr;
}
console.log(reverseArray([1, 2, 3, 4, 7, 1]));

function reverseArrayInPlace(arr) {
	for(i = arr.length - 1; i >=0; i--) {
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
 var list = {};
 list.value = arr.shift();
	
	function fill(list) {
		while(arr.length > 0) {
			var cur = {};
			list.rest = cur;
			list.rest.value = arr.shift();
			list = list.rest;
			fill(list);
		}
	return list;
	}
fill(list);
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
	var arr = listToArray(list);
	return arr[position];
}
console.log(nth(arrayToList([10, 20, 30]), 1));

//Функция nth рекурсивно - здесь как понял, внутри должна быть рекурсивная функция. Собственно, взял ее из упражнения "Список в массив", только чтобы возвращала один элемент
function nthRec(list, position) {
	var arr = [];
	function searchValue(list) {
		for(var i in list) {
			if(typeof list[i] != "object") {
				arr.push(list[i]);
			}
			else {
				list = list[i];
				searchValue(list);
			}
		}
	}
	searchValue(list);
	return arr[position];
}
console.log(nthRec(arrayToList([10, 20, 30]), 1));

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
		else return true;
    }           
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

