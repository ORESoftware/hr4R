/**
 * Created by amills001c on 7/20/15.
 */


var ConfirmView = Backbone.View.extend({
    events: {
        'click .button': 'confirm'
    },
    confirm: function () {
        if (window.confirm(this.model.get('message'))) {
            this.model.set('confirmed', true);
        }
    }
});

var Controller = {
    initialize: function (options) {
        this.confirmControl = options.confirmControlModel;
        this.lasers = options.laserModel;

        this.confirmControl.on('change:confirmed', this.onConfirmation, this);
    },
    onConfirmation: function () {
        this.lasers.set('laserActivated', true);
    }
};