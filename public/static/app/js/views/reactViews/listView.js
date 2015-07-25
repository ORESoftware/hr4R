/**
 * Created by amills001c on 7/21/15.
 */

//TODO: http://leoasis.github.io/posts/2014/03/22/from_backbone_views_to_react/

define(
    [
        'react'
    ],

    function (React) {

        var List = React.createClass({
            mixins: [React.Backbone],
            updateOnProps: {'items': 'collection'},

            render: function () {
                var items = this.props.items.map(function (item) {
                    return <Item item={item} key={item.cid}/>
                });
                return <li>{ items }</li>
            }
        });

});