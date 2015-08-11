/**
 * Created by amills001c on 8/6/15.
 */


define(function(){


    window.no_op = function () {};

    window.no_op_err = function () {
        throw new Error('this no_op function should not have been called.')
    };

    window.saveToLocalStorage = function (key, val) {
        var str = JSON.stringify(val);
        localStorage.setItem(key, str);
    };

    window.readFromLocalStorage = function (key) {
        var val = localStorage.getItem(key);
        return JSON.parse(val);
    };

    window.throwGlobalError = function(err){
        if(!(err instanceof Error)){
            throw new Error('need to pass this function an instance of Error');
        }
        console.log(err.toString());
        throw err;
    };

    window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
        /*
         document.write is actually what we want to use here,
         because it overwrites everything else on the screen
         */
        if(errorMsg){
            console.log(errorMsg.toString());
        }
        if(url){
            url = url.toString();
        }

        document.open();
        document.write('<h1> error message:' + errorMsg + '</h1>');
        document.write('<h2> url:' + url +'</h2>');
        document.write('line number:' + lineNumber);
        document.write('<p>All args:</p>');
        for(var i = 0; i < arguments.length; i++){
            document.write('<p>' + arguments[i] +'</p>');
        }
        document.close();
        return true;
    };

});