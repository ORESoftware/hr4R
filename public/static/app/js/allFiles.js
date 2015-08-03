/**
 * Created by denman on 8/2/2015.
 */

var fs = require("fs");
var path = require('path');


var getAllFilesFromFolder = function(dir) {

    var results = [];
    var stat;

    fs.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFilesFromFolder(file))
        } else {
            var str1 = String(file);
            //var str = str1.substring(str1.indexOf('app/js'));
            results.push(str1);
        }

    });

    return results;
};

var resulz = getAllFilesFromFolder(__dirname + '/controllers');

var array1 = resulz.map(function(item){

    if(String(item).indexOf('./') == 0){
        item = item.substring(2);
    }

    return String(', "app/js/'+ String(item).replace('.js',''));
});

var array2 = resulz.map(function(item,index){

    if(String(item).indexOf('./') == 0){
        item = item.substring(2);
    }

    var firstPart = String(('"app/js/'+ item + '"').replace('.js',''));
    var secondPart = firstPart.concat(': arguments[').concat(index+1).concat(']');
    return secondPart;
});

fs.writeFileSync('./temp1.txt',array1.join('\n'));
fs.writeFileSync('./temp2.txt',array2.join('\n'));
