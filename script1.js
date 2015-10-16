//Минимум
function min(a, b) {
	if(a < b) {
		console.log(a);
	} 
	else console.log(b);
}

//Рекурсия
//Проблему с отрицательными числами решил взятием модуля
function isEven(a) {
	if(Math.abs(a) === 0) {
		return true;
	}
	else if(Math.abs(a) === 1) {
		return false;
	}
	else {
		return isEven(Math.abs(a) - 2);
	}
}

//Считаем бобы
//Здесь не стал пользоваться методом .charAt, как описано в учебнике, решил воспользоваться свойством .length
function countBs(string) {
	var res = [];
	for (i = 0; i < string.length; i++) {
		if(string[i] === "B") {
			res.push(string[i]);
		}
	}
	return res.length;
}
function countChar(string, a) {
	var res = [];
	for (i = 0; i < string.length; i++) {
		if(string[i] === a) {
			res.push(string[i]);
		}
	}
	return res.length;
}

//Дополнительное задание

function reduce(arr, combine) {
	var res = arr[0];
	for(i = 1; i < arr.length; i ++) {
		res = combine(res, arr[i]); 
	};
	return res;
}
var result = reduce([1, 2, 3, 4, 5],  function(a, b) {
	return a + b;});
console.log(result);
