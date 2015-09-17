# hr4R

client-side hot-reloading is much more useful than server-side hot-reloading - both can save you time - but client hot-reloading can save you lots more time,
and make designers lives much better.

the steps for clientside reloading are:

###(1) gulp watchers listen for filesystem changes
###(2) socket.io server in gulpfile sends a message to all browser clients with the path of the file that changed
###(3) client deletes cache representing that file/module, and re-requires it (using AJAX to pull it from the server filesystem)
###(4) front-end app is configured / designed to re-evaluate all references to the modules that it wishes to hot-reload, in this case, only JS views, templates and CSS are 
### available to hot reload -  the router, controllers, datastores (Backbone Collections and Models) are not configured yet. I do suspect all files could be hot reloaded
### expect for data stores. 

RequireJS makes this all very easy to do since it's an asynchronous module loading system - you don't need to run a build or an incremental build to get the client code in
the air - and you easily require a nominal file on the fly. Thanks RequireJS.


##clientside hot-reloading

start the app with

```gulp nodemon```

this runs nodemon, after running some other important gulp tasks. nodemon is a must have, and it should be configured to ignore changes to your client code, in this
case, nodemon only looks for server changes and ignores changes that we make to the client code in the public directory - on the other hand - our front-end hot-reloading process
will listen exclusively to files in the public directory.

we run a couple tasks before starting nodemon - we transpile JSX and then run a metadata generator that I wrote that allows RequireJS to require entire directories, this is very
useful for controllers and views, especially controllers that follow some path convention. Without a controller path convention I know of no possible way from keeping 
your router files from getting enormous.

next up, let's talk about the gulpfile.js at root of the project


./gulpfile.js contains this code at the bottom of the file:

```javascript

gulp.task('metagen:all', ['transpile-jsx'], function (done) {
    runAllMetagens(done);
});


gulp.task('nodemon', ['metagen:all', 'watch:hot-reload-front-end', 'watch:hot-reload-back-end'], function () {

    nodemon({

        script: 'bin/www.js',
        ext: 'js',
        ignore: ['public/*', '*.git/*', '*.idea/*', 'routes/*', 'gulpfile.js'],
        args: ['--use_socket_server', '--use_hot_reloader'],
        nodeArgs: [],
        env: {'NODE_ENV': 'development'}

    }).on('restart', []);

});
```

you should look into what the  'watch:hot-reload-front-end' task does - it sends a socket.io message to the browser, however many browsers
you have open on your development machine, sometimes I have 2 or 3 and I need all to receive an update, of course they all do, thanks websockets


in the client code (all in ./public directory) we have a hotReloadHandler, which is a socket.io client


there's some extra code that resolves paths that I wish to simplify but essentially the code looks like this





```javascript

   socketHotReload.on('hot-reload (.jsx)', function (data) {

                    updateProgressBar(40);

                    hotReloader.hotReload(data,function(err,result){

                        if(err){
                            alert(err);
                            return;
                        }

                        updateProgressBar(60);

                        var filename = deCapitalizeFirstLetter(reconcilePath1(data,'jsx'));

                        require(['#allViews'],function(allViews){
                            allViews[filename] = result;
                            updateProgressBar(80);
                            Backbone.history.loadUrl(Backbone.history.fragment);
                            updateProgressBar(100);
                        });
                    });
                });
```

the above calls this module, which does all the reloading, for .js, templates and CSS

```javascript

define(function () {

        var hotReloadSimple = function (item, callback) {
            require.undef(item);
            require([item], function (file) {
                callback(null, file);
            });
        };

        return {
            hotReload:hotReloadSimple
        }

    });
```


that's pretty much it

