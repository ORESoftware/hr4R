/**
 * Created by amills001c on 7/21/15.
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

        var Item = React.createClass({
            //mixins: [React.Backbone],
            updateOnProps: {'item': 'model'},

            render: function () {
                return <span><p><li>{ this.props.item.cid + ' ' + JSON.stringify(this.props.item.toJSON()) }</li></p></span>
            }
        });


        var List = React.createClass({
            //mixins: [React.Backbone],
            updateOnProps: {'items': 'collection'},

            render: function () {
                var items = this.props.items.map(function (item) {
                    return <Item item={item} key={item.cid}/>
                });
                return <li>{ items }</li>
            }
        });


        return List;


    });