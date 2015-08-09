/**
 * Created by denman on 8/2/2015.
 */

var fs = require("fs");
var path = require('path');

var dirs = null;


var getAllFilesFromFolder = function(dir) {

    var results = [];
    var stat;

    //console.log('dir before normalize:',dir);
    //dir = path.normalize(dir);
    //console.log('dir after normalize:',dir);

    fs.readdirSync(dir).forEach(function(file) {

        //var temp = file;
        file = dir+'/'+file;

        //console.log('file before join:',file);
        //file = path.join(dir,file);
        //console.log('file after join:',file);

        stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFilesFromFolder(file))
        } else {
            var str = String(file);
            results.push(str);
        }

    });

    return results;
};

module.exports = function runTheTrap(dir,append){

    //dirs = String(dir).split(path.sep);
    dirs = String(dir).split('/');

    //dirs = String(__dirname + '/controllers').split(path.sep);

    var length = dirs.length-1;

    var resulz = getAllFilesFromFolder(dir);
    //var resulz = getAllFilesFromFolder(__dirname + '/controllers');

    var array1 = resulz.map(function(item){

        //var split = String(item).split(path.sep);
        var split = String(item).split('/');

        for(var i = 0; i< length; i++){
            split.shift();
        }

        //item = split.join(path.sep);
        item = split.join('/');

        return String('"' + append + String(item).replace('.js','')).concat('"');
    });

    var array2 = resulz.map(function(item,index){

        //var split = String(item).split(path.sep);
        var split = String(item).split('/');

        for(var i = 0; i< length; i++){
            split.shift();
        }

        //item = split.join(path.sep);
        item = split.join('/');

        var firstPart = String(('"' + append + item + '"').replace('.js',''));
        var secondPart = ': arguments['.concat(index).concat(']');
        return firstPart + secondPart;
    });

    //fs.writeFileSync(__dirname +'/temp1.txt',array1.join(''));
    //fs.writeFileSync(__dirname +'/temp2.txt',array2.join(''));

    return array1.join(',\n\t\t').concat(';').concat(array2.join(',\n\t\t\t'));

};

//var resulz = getAllFilesFromFolder(__dirname + '/controllers');
//
//var array1 = resulz.map(function(item){
//
//    //if(String(item).indexOf('./') == 0){
//    //    item = item.substring(2);
//    //}
//
//    return String(', "app/js/'+ String(item).replace('.js','')).concat('"');
//});
//
//var array2 = resulz.map(function(item,index){
//
//    //if(String(item).indexOf('./') == 0){
//    //    item = item.substring(2);
//    //}
//
//    var firstPart = String(('"app/js/'+ item + '"').replace('.js',''));
//    var secondPart = ': arguments['.concat(index+1).concat(']');
//    return firstPart + secondPart;
//});
//
//fs.writeFileSync(__dirname +'/temp1.txt',array1.join('\n'));
//fs.writeFileSync(__dirname +'/temp2.txt',array2.join('\n'));
