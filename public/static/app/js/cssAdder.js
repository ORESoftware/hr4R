/**
 * Created by denman on 8/15/2015.
 */

//TODO: http://www.w3.org/wiki/Dynamic_style_-_manipulating_CSS_with_JavaScript

/*
 TODO:

 To cater to internet explorer, you have to set the stylesheet to be disabled as it keeps the css styles in memory so removing the element will not work,
 it can also cause it to crash in some instances if I remember correctly.

 This also works for cross browser.

 e.g

 document.styleSheets[0].disabled = true;
 //so in your case using jquery try

 $('link[title=mystyle]')[0].disabled=true;

 */

define(function () {

    function add(sheetDesignator) {

        require(['#allCSS'], function (allCSS) {
            var sheet = document.createElement('style');
            sheet.innerHTML = allCSS[sheetDesignator];
            document.body.appendChild(sheet);
        });

    }

    function removeAllTempCSS(){

        $('#temp-css').children().each(function(){
            $(this).remove();
        });

    }


    function addAllVia(stylesheetsToAdd,isPerm){
        var arrayLength = stylesheetsToAdd.length;
        for (var i = 0; i < arrayLength; i++) {
            addVia(stylesheetsToAdd[i],isPerm);
        }
    }

    function addVia(text,isPerm) {

        var sheet = document.createElement('style');
        sheet.setAttribute("type", "text/css");
        //sheet.setAttribute("id", designtr);
        //sheet.setAttribute("designtr", designtr);
        sheet.innerHTML = text;
        //document.body.appendChild(sheet);
        if(isPerm){
            $('#perm-css').append(sheet);
        }
        else{
            $('#temp-css').append(sheet);
        }

    }

    function addViaText(designtr, text) {

        var sheet = document.createElement('style');
        sheet.setAttribute("type", "text/css");
        sheet.setAttribute("id", designtr);
        sheet.setAttribute("designtr", designtr);
        sheet.innerHTML = text;
        document.body.appendChild(sheet);
    }

    function addCustom(custom) {

        var sheet = document.createElement('style');
        //sheet.innerHTML = "div {border: 2px solid black; background-color: blue;}";
        sheet.innerHTML = custom.text;
        document.body.appendChild(sheet);
    }

    function removeByAttr(designtr) {

        //document.getElementById(designtr).disabled = true;
        //$('style[designtr="' + designtr + '"]').remove();

        $("[id$=css]").remove();

        //var elems = document.querySelectorAll('style');
        //
        //elems.forEach(function(elem,index){
        //
        //    elem.disabled = true;
        //});
    }

    function setEnabled(designtr) {

        //$('style')

    }

    function setDisabled(designtr) {

        //$('style')

    }

    return {
        addAllVia:addAllVia,
        removeAllTempCSS:removeAllTempCSS,
        addVia:addVia,
        add: add,
        removeByAttr:removeByAttr,
        addViaText: addViaText,
        addCustom: addCustom
    };
});