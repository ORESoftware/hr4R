/**
 * Created by amills001c on 8/31/15.
 */

var _ = require('underscore');

function A() {
    this.sam = 'big';
}


var p = {
    d: function () {
        return 'this is d';
    },
    e: function () {
        return 'this is e';
    }
};


A.prototype = p;

var a = new A();


var B = function (dog) {
    this.dog = dog;
};


//B.prototype = {
//
//    b:'turtle',
//    c:'mouse'
//
//};
//
//var a = Object.create(a);

//B.prototype = _.extend(Object.create(a.__proto__),{
//
//    sam: 'small'
//
//});


B.prototype = _.extend(Object.create(a),{

    barf:'shit',
    sam:'crap'

});




var b = new B('jap');

console.log(b);
console.log(b.sellCigarettes());





