/**
 * Created by denman on 8/15/2015.
 */

//TODO: http://www.w3.org/wiki/Dynamic_style_-_manipulating_CSS_with_JavaScript

define(
    [
        '#allCSS'
    ],

    function (stylesheets) {

        function addStraight(sheetDesignator) {

            var sheet = document.createElement('style');
            sheet.innerHTML = stylesheets[sheetDesignator];
            document.body.appendChild(sheet);
        }

        function add(text) {

            var sheet = document.createElement('style');
            sheet.setAttribute("type", "text/css");
            sheet.innerHTML = text;
            document.body.appendChild(sheet);
        }

        function addCustom(custom) {

            var sheet = document.createElement('style');
            //sheet.innerHTML = "div {border: 2px solid black; background-color: blue;}";
            sheet.innerHTML = custom.text;
            document.body.appendChild(sheet);
        }

        return {
            add: add,
            addCustom: addCustom
        };
    });