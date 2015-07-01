/**
 * Created by amills001c on 6/9/15.
 */


({
    "baseUrl": "./public/static",
    "dir": "js-built",
    "appDir": ".",
    //"name": "app/js/main",
    "mainConfigFile": "./public/static/app/js/main.js",
    //"out": "./public/static/app/js/optimized.js",
    //"optimize": 'none',
    // Define the modules to compile.
    "modules": [

        // When compiling the main file, don't include the FAQ module.
        // We want to lazy-load FAQ since it probably won't be used
        // very much.
        {
            name: "all",

            // Explicitly include modules that are NOT required
            // directly by the MAIN module. This allows us to include
            // commonly used modules that we want to front-load.
            include: [
                //"text"
            ],

            // Use the *shallow* exclude; otherwise, dependencies of
            // the FAQ module will also be excluded from this build
            // (including jQuery and text and util modules). In other
            // words, a deep-exclude would override our above include.
            excludeShallow: [
                //"views/faq"
            ]
        }
     /*   ,

        // When compiling the FAQ module, don't include the modules
        // that have already been included as part of the main
        // compilation (ie. jquery, text, util). This way, we only
        // include the parts of the FAQ dependencies that are unique
        // to the FAQ module (ie. its HTML).
        {
            name: "views/faq",

            // If we don't exclude these modules, they will be doubly
            // defined in our main module (since these are ALSO
            // dependencies of our main module).
            exclude: [
                "jquery",
                "text",
                "util"
            ]
        }*/

    ],
})