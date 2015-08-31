/**
 * Created by denman on 8/15/2015.
 */

//TODO: http://www.w3.org/wiki/Dynamic_style_-_manipulating_CSS_with_JavaScript

define(function () {

    function add(sheetDesignator) {

        require(['#allCSS'], function (allCSS) {
            var sheet = document.createElement('style');
            sheet.innerHTML = allCSS[sheetDesignator];
            document.body.appendChild(sheet);
        });

    }

    function addVia(text) {

        var sheet = document.createElement('style');
        sheet.setAttribute("type", "text/css");
        //sheet.setAttribute("id", designtr);
        //sheet.setAttribute("designtr", designtr);
        sheet.innerHTML = text;
        document.body.appendChild(sheet);
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
        addVia:addVia,
        add: add,
        removeByAttr:removeByAttr,
        addViaText: addViaText,
        addCustom: addCustom
    };
});