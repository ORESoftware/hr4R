/*
    Print Tool
    1. printf in JavaScript
    2. Prettify log's color
    3. Prettify JSONArray to table
    4. Simple date format
    
    External links
    http://en.wikipedia.org/wiki/Printf_format_string
*/


define(function(require, exports, module) {


    exports.isString = function(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }
    exports.isDate = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    /*
     重复打印
     */
    exports.repln = function(str, n) {
        var re = '';
        for (var i = 0; i < n; i++) {
            re += str;
        }
        console.log(re);
        return exports;
    }

    /*
     等价于 console.log，增加对日期的格式化
     exports.pln(obj[, obj])
     exports.pln(date[, date], format)
     */
    exports.pln = function(args) {
        args = [].slice.call(arguments, 0);

        // exports.pln(date [, date], format);
        if (exports.isDate(args[0]) && exports.isString(args[args.length - 1])) {
            for (var i = 0; i < args.length - 1; i++) {
                args[i] = exports.format(args[i], args[args.length - 1]);
            }
            console.log.apply({}, args.slice(0, args.length - 1));
            // exports.pln(obj [, obj])
        } else {
            console.log.apply({}, arguments);
        }
        return exports;
    }

    /*
     printf
     exports.pf(format, args)
     format
     %-ms    - String
     %-m.nd  - Number (both integer and float)
     %-mj    - JSON
     */
    exports.pf = exports.printf = function pf(format, args) {
        var rformat = /%([-+]?)(\d+)?(?:\.?(\d+)?)(s|d)/ig,
            out;

        // 参数 format 不是字符串，或者不含有格式标记，则不做格式化，直接输出
        if (typeof format !== 'string' || !format.match(rformat)) {
            console.log.apply({}, arguments);
            return exports;
        }

        // 格式化
        args = [].slice.call(arguments, 1);
        var index = 0;
        out = format.replace(rformat, function(match, dir, m, n, flag) {
            // console.log(match, dir, m, n, flag);
            var arg = args[index++] + '',
                prefix = '',
                suffix = '';
            switch (flag) {
                case 's':
                    break;
                case 'd':
                    var indexOf = arg.indexOf('.');
                    if (n && ~indexOf) arg = arg.slice(0, indexOf + 1 + parseInt(n));
                    break;
                case 'j':
                    arg = JSON.stringify(arg);
                    break;
            }
            // dir m
            var fix = parseInt(m) - arg.length;
            for (var i = 0; i < fix; i++) {
                dir === '-' ? suffix += ' ' : prefix += ' ';
            }
            return prefix + arg + suffix;
        })
        console.log(out);
        return exports;
    }

    /*
     color
     */
    var styles = {
        //styles
        'bold': ['\033[1m', '\033[22m'],
        'italic': ['\033[3m', '\033[23m'],
        'underline': ['\033[4m', '\033[24m'],
        'inverse': ['\033[7m', '\033[27m'],
        //grayscale
        'white': ['\033[37m', '\033[39m'],
        'grey': ['\033[90m', '\033[39m'],
        'black': ['\033[30m', '\033[39m'],
        //colors
        'blue': ['\033[34m', '\033[39m'],
        'cyan': ['\033[36m', '\033[39m'],
        'green': ['\033[32m', '\033[39m'],
        'magenta': ['\033[35m', '\033[39m'],
        'red': ['\033[31m', '\033[39m'],
        'yellow': ['\033[33m', '\033[39m']
    };
    for (var style in styles) {
        (function(style) {
            String.prototype.__defineGetter__(style, function() {
                return styles[style][0] + this + styles[style][1];
            });
            exports[style] = function(str) {
                console.log(styles[style][0] + str + styles[style][1]);
                return exports;
            }
        })(style)
    }
    exports.color = function(style, str) {
        console.log(styles[style][0] + str + styles[style][1]);
    };

    /*
     date
     */
    exports.patterns = {
        ISO8601Long: "yyyy-MM-dd HH:mm:ss",
        ISO8601Short: "y-m-d"
    };
    exports.rpatterns = {
        ISO8601Long: function(sdate) {
            var m = /(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/.exec(sdate);
            // var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
            return new Date(m[1], m[2], m[3], m[4], m[5], m[6]);
        },
        ISO8601Short: function(sdate) {
            var m = /(\d+)-(\d+)-(\d+)/.exec(sdate);
            return new Date(m[1], m[2], m[3]);
        }
    }

// http://docs.oracle.com/javase/1.4.2/docs/api/java/text/SimpleDateFormat.html
// http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date
    /*
     Format  Description                                                 Example
     ------- ----------------------------------------------------------- -------
     yyyy    A full numeric representation of a year, 4 digits           1999 or 2003
     yy      A two digit representation of a year                        99 or 03
     y       A two digit representation of a year                        99 or 03
     MM      Numeric representation of a month, with leading zeros       01 to 12
     M       Numeric representation of a month, without leading zeros    1 to 12
     dd      Day of the month, 2 digits with leading zeros               01 to 31
     d       Day of the month without leading zeros                      1 to 31
     HH      24-hour format of an hour with leading zeros                00 to 23
     H       24-hour format of an hour without leading zeros             0 to 23
     hh      12-hour format of an hour without leading zeros             1 to 12
     h       12-hour format of an hour with leading zeros                01 to 12
     mm      Minutes, with leading zeros                                 00 to 59
     m       Minutes, without leading zeros                              0 to 59
     ss      Seconds, with leading zeros                                 00 to 59
     s       Seconds, without leading zeros                              0 to 59
     SS      Milliseconds, with leading zeros                            000 to 999
     S       Milliseconds, without leading zeros                         0 to 999
     A       Uppercase Ante meridiem and Post meridiem                   AM or PM
     a       Lowercase Ante meridiem and Post meridiem                   am or pm

     */
    var patternLetters = {
        yyyy: 'getFullYear',
        yy: function(date) {
            return ('' + date.getFullYear()).slice(2);
        },
        y: 'yy',

        MM: function(date) {
            var m = date.getMonth() + 1;
            return m < 10 ? '0' + m : m;
        },
        M: function(date) {
            return date.getMonth() + 1;
        },

        dd: function(date) {
            var d = date.getDate();
            return d < 10 ? '0' + d : d;
        },
        d: 'getDate',

        HH: function(date) {
            var h = date.getHours();
            return h < 10 ? '0' + h : h;
        },
        H: 'getHours',
        hh: function(date) {
            var h = date.getHours() % 12;
            return h < 10 ? '0' + h : h;
        },
        h: function(date) {
            return date.getHours() % 12;
        },

        mm: function(date) {
            var m = date.getMinutes();
            return m < 10 ? '0' + m : m;
        },
        m: 'getMinutes',

        ss: function(date) {
            var s = date.getSeconds();
            return s < 10 ? '0' + s : s;
        },
        s: 'getSeconds',

        SS: function(date) {
            var ms = date.getMilliseconds();
            return ms < 10 && '00' + ms || ms < 100 && '0' + ms || ms
        },
        S: 'getMilliseconds',

        A: function(date) {
            return date.getHours() < 12 ? 'AM' : 'PM'
        },
        a: function(date) {
            return date.getHours() < 12 ? 'am' : 'pm'
        }
    }
    var rformat = new RegExp((function() {
        var re = [];
        for (var i in patternLetters) re.push(i);
        return '(' + re.join('|') + ')';
    })(), 'g');

// 格式化日期
    exports.format = function(date, format) {
        format = format.replace(rformat, function($0, flag) {
            return typeof patternLetters[flag] === 'function' ? patternLetters[flag](date) : patternLetters[flag] in patternLetters ? arguments.callee($0, patternLetters[flag]) : date[patternLetters[flag]]()
        });
        // console.log(format);
        return format;
    };
// 解析日期
    exports.parse = function(sdate, format) {
        return exports.rpatterns[format](sdate);
    };

    exports._parse = function(sdate, format) {
        /*
         1. 替换标记为正则分组，记录标记和分组的映射关系
         2. 生成解析正则，解析日期字符串
         3. 按照标记和分组的映射关系，解析出标记对应的值
         4. 构造 Date 对象。
         TODO
         */
    };


    /*
     table
     */
    exports.pt = exports.printTable = function(rs) {
        if (!rs || !rs.length) return;
        var style = genStyle(rs);
        var devider = genDevider(style);
        var th = genTh(style);
        var trs = genTr(rs, style);

        // console.log(style);

        console.log(devider);
        console.log(th);
        console.log(devider);
        for (var tr in trs) {
            console.log(trs[tr]);
        }
        console.log(devider);
        return exports;
    }

    function getLen(o) {
        var rcjk = /[\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FBF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]+/g;
        o = '' + o;
        var re = 0;
        for (var i = 0; i < o.length; i++) {
            if (o[i].match(rcjk)) re += 2;
            else re += 1;
        }
        return re;
    }

    function genStyle(rs) {
        var style = {};
        // init
        for (var r in rs) {
            for (var key in rs[r]) {
                style[key] = getLen(key);
            }
        }
        // calculate max width of a colume
        var width = 0;
        for (var key in style) {
            for (var r in rs) {
                width = getLen(rs[r][key]);
                style[key] = width > style[key] ? width : style[key];
            }
        }
        return style;
    }

    function genDevider(style) {
        var devider = '+';
        for (var key in style) {
            for (var i = 0; i < style[key] + 2; i++) {
                devider += '-';
            }
            devider += '+';
        }
        return devider;
    }

    function genTh(style) {
        var header = '|';
        for (var key in style) {
            header += ' ';
            header += key;
            for (var i = 0; i < style[key] + 2 - 1 - getLen(key); i++) {
                header += ' ';
            }
            header += '|';
        }
        return header;
    }

    function genTr(rs, style) {
        var trs = [];
        var tr;
        for (var r in rs) {
            tr = '|';
            for (var key in style) {
                tr += ' ';
                tr += rs[r][key];
                for (var i = 0; i < style[key] + 2 - 1 - getLen(rs[r][key]); i++) {
                    tr += ' ';
                }
                tr += '|';
            }
            trs.push(tr);
        }
        return trs;
    }

});

