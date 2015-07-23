/**
 * Created by amills001c on 7/22/15.
 */



define(
    [
        'rivets',
        'app/js/rivetsAdapter'
    ],
    function (Rivets, RivetsAdapter) {
        Rivets.configure({

            // Attribute prefix in templates
            prefix: 'rv',

            adapterx: RivetsAdapter,


            //adapters: {
            //  ':':RivetsAdapter
            //},

            // Preload templates with initial data on bind
            preloadData: true,

            // Root sightglass interface for keypaths
            rootInterface: '.',

            // Template delimiters for text bindings
            //templateDelimiters: ['{', '}'],

            templateDelimiters: ['{*{', '}*}'],

            // Augment the event handler of the on-* binder
            handler: function (target, event, binding) {
                this.call(target, event, binding.view.models)
            }

        });
    }
);


