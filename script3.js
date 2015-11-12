// Utils
function Utils() {
    
    if(Utils.check) {
        return Utils.check;
    }
    else if(this === window) {
        return new Utils();
    }
    
    Utils.check = this;
    
    this.reduce = function(arr, combine) {
        var res = arr[0];
        for(i = 1; i < arr.length; i ++) {
            res = combine(res, arr[i]); 
        };
        return res;
    };
    
    this.deepEquals = function(obj1, obj2) {
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
                    newObj[key] = deepCopy(obj[key]);
                }
            }
        return newObj;
    };
}

//Utils через замыкание

var closure = function() {
    var instance;
    
    return function() {
        if(instance) {
            return instance;
        }
        else return function() {
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

function extend(Child, Parent) {
    var F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}

//Создаем абстрактный класс "танк"
function tank() {
    this.hasTracks = true;
    this.color = "green";
    
    //Расстояние, которое танк может проехать
    this.distance = function(fuel) {};
}

//Реализация абстрактного класса (его наследники)

//Легкий танк
function lightTank() {
    this.distance = function(fuel) {
        return fuel * 5;
    }
}

extend(lightTank, tank);



//Тяжелый танк
function heavyTank() {
    this.distance = function(fuel) {
        return fuel * 3;
    }
}

extend(heavyTank, tank);


//Абстрактная фабрика

function tankFactory() {
    this.createTank = function() {
        return new tank;
    };
}

//Фабрика легких танков
lightTankFactory = function() {
    this.createTank = function() {
        return new lightTank();
    }
};

extend(lightTankFactory, tankFactory);


//Фабрика тяжелых танков
heavyTankFactory = function() {
    this.createTank = function() {
        return new heavyTank();
    }
}

extend(heavyTankFactory, tankFactory);

var inst = new lightTankFactory;
var test = inst.createTank();

console.log(test instanceof tank);