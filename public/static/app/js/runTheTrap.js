/**
 * Created by denman on 8/2/2015.
 */


var fs = require('fs');

var str1 = fs.readFileSync('./requirejsTemplate.js');

var str2 = fs.readFileSync('./temp1.js');
var str3 = String(str1).replace('****',str2);

var str4 = fs.readFileSync('./temp2.js');
 str3 = str3.replace('$$$$',str4);

fs.writeFileSync('./allControllers.js',str3);

