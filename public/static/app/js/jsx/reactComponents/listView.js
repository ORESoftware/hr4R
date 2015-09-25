/**
 * Created by denmanm1 on 7/21/15.
 */

//TODO: http://leoasis.github.io/posts/2014/03/22/from_backbone_views_to_react/

define(
    [
        'react'
    ],

    function (React) {

        /*  return function(collection){

         var List = React.createClass({
         //mixins: [React.Backbone],
         updateOnProps: {'items': collection.models},

         render: function () {
         var items = this.props.items.map(function (item) {
         return <Item item={item} key={item.cid}/>
         });
         return <li>{ items }</li>
         }
         });


         return List;
         }*/

        var Item = React.createClass({displayName: "Item",
            //mixins: [React.Backbone],
            updateOnProps: {'item': 'model'},

            render: function () {
                return React.createElement("span", null, React.createElement("p", null, React.createElement("li", null,  this.props.item.cid + ' ' + JSON.stringify(this.props.item.toJSON()))))
            }
        });


        var List = React.createClass({displayName: "List",
            //mixins: [React.Backbone],
            updateOnProps: {'items': 'collection'},

            render: function () {
                var items = this.props.items.map(function (item) {
                    return React.createElement(Item, {item: item, key: item.cid})
                });
                return React.createElement("li", null,  items )
            }
        });


        return List;


    });