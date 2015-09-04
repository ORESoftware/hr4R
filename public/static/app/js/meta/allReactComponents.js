/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  ...so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        "app/js/jsx/reactComponents/FluxCart",
		"app/js/jsx/reactComponents/FluxCartApp",
		"app/js/jsx/reactComponents/FluxProduct",
		"app/js/jsx/reactComponents/Item",
		"app/js/jsx/reactComponents/Job",
		"app/js/jsx/reactComponents/JobsList",
		"app/js/jsx/reactComponents/listView",
		"app/js/jsx/reactComponents/MenuExample",
		"app/js/jsx/reactComponents/Picture",
		"app/js/jsx/reactComponents/PictureList",
		"app/js/jsx/reactComponents/RealTimeSearchView",
		"app/js/jsx/reactComponents/Service",
		"app/js/jsx/reactComponents/ServiceChooser",
		"app/js/jsx/reactComponents/TimerExample",
		"app/js/jsx/reactComponents/todoList"
    ],
    function(){

        return {

            "FluxCart": arguments[0],
			"FluxCartApp": arguments[1],
			"FluxProduct": arguments[2],
			"Item": arguments[3],
			"Job": arguments[4],
			"JobsList": arguments[5],
			"listView": arguments[6],
			"MenuExample": arguments[7],
			"Picture": arguments[8],
			"PictureList": arguments[9],
			"RealTimeSearchView": arguments[10],
			"Service": arguments[11],
			"ServiceChooser": arguments[12],
			"TimerExample": arguments[13],
			"todoList": arguments[14]
        }
  });