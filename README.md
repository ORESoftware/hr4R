#hr4R 


client-side hot-reloading is much more useful than server-side hot-reloading - both can save you time - but client hot-reloading can save you lots more time,
and make designers' lives much better.

######the steps for clientside hot-reloading are:

1.  gulp.js watchers listen for filesystem changes
2.  socket.io server in gulpfile sends a message to all browser clients with the path of the file that changed
3.  client deletes cache representing that file/module, and re-requires it (using AJAX to pull it from the server filesystem)
4.  front-end app is configured / designed to re-evaluate all references to the modules that it wishes to hot-reload, in this case, only JS views, templates and CSS are 
     available to hot reload -  the router, controllers, datastores (Backbone Collections and Models) are not configured yet. I do suspect all files could be hot reloaded
     with the only exception being data stores. 


```RequireJS``` makes this all very easy to do since it's an asynchronous module loading system - you don't need to run a build or an incremental build to get the client code in
the air - and you may easily require a nominal file on the fly. In production, you can use r.js to build optimized (concatenated, minified) deployment files, and your requires 
essentially become synchronous instead of asynchronous. RequireJS is the real deal. Thanks RequireJS.


####Clientside hot-reloading

to run this Express server, you should have a local MongoDB instance running with this command

```ulimit -n 1024 && mongod --dbpath /some/path/anywhere/you/want/mongodb_dev_data --replSet rs0```

start the node.js Express server with

```gulp nodemon```

this runs Nodemon, after running some other important gulp tasks. Nodemon is a must-have, and it should be configured to ignore changes to your client code - in this
case, nodemon only looks for server changes and ignores changes that we make to the client code in the public directory. On the other hand - our front-end hot-reloading process
will listen exclusively to files in the public directory.

we run a couple tasks before starting nodemon - we transpile JSX and then run a metadata generator that I wrote that allows RequireJS to require entire directories, this is very
useful for controllers and views, especially controllers that follow some path convention. Without a controller path convention I know of no possible way from keeping 
your front-end router files from getting enormous.

next up, let's talk about the gulpfile.js at the root of the project


gulpfile.js contains this code at the bottom of the file:

```javascript

gulp.task('metagen:all', ['transpile-jsx'], function (done) {
    runAllMetagens(done);
});


gulp.task('nodemon', ['metagen:all', 'watch:hot-reload-front-end', 'watch:hot-reload-back-end'], function () {

    nodemon({

        script: 'bin/www.js',
        ext: 'js',
        ignore: ['public/*', '*.git/*', '*.idea/*', 'routes/*', 'gulpfile.js'],     //nodemon monitors our server for changes, but ignores changes to client code in public directory
        args: ['--use_socket_server', '--use_hot_reloader'],
        nodeArgs: [],
        env: {'NODE_ENV': 'development'}

    }).on('restart', []);

});
```

you should look into what the  'watch:hot-reload-front-end' task does - it sends a socket.io message to the browser, however many browsers
you have open on your development machine, sometimes I have 2 or 3 and I need all browser windows to receive an update, of course they all do, 
thanks to websockets, thanks Socket.io.


in the client code (all client code is in the ./public directory) we have a hotReloadHandler, which is a socket.io client


there's some extra ugly code in there that resolves paths that I wish to simplify but essentially the code looks like this



```javascript

socketHotReload.on('hot-reload (.jsx)', function (data) {

    updateProgressBar(40);

    hotReloader.hotReload(data,function(err,result){              // deletes the cached module reference

        if(err){
            alert(err);
            return;
        }

        updateProgressBar(60);

        var filename = deCapitalizeFirstLetter(reconcilePath1(data,'jsx'));

        require(['#allViews'],function(allViews){                  // AJAX is used to re-require the file
            allViews[filename] = result;                           // new file is loaded and we update the singleton "allViews" that holds the references to every view in the app
            updateProgressBar(80);
            Backbone.history.loadUrl(Backbone.history.fragment);   // we re-render all views in sight, via the Backbone router (this does not refresh the page!)
            updateProgressBar(100);
        });
    });
});

```


the above calls the following module, which does all the reloading, for .js, templates and CSS


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


that's pretty much it for client-side hot-reloading
<br>
...next up we have serverside hot-reloading


#### hot-reloading Node.js Express server code


I debated whether to include this portion of serverside reloading, but I think it's actually easier to reload servercode and then when you get the idea, 
you can try the clientside second.


in our canonical app.js, at the root of the project, we have this:


```javascript

var runRoute = null;

if (app.get('env') === 'development') {
    runRoute = function (path) {   //this hot reloads all file in the routes dir (serverside hot-reloading - less time waiting for server to restart with nodemon)
        return function (req, res, next) {
            require(path)(req, res, next);
        };
    }
}
else {
    runRoute = function (path) {  //for production and test environments, runRoute function resolves modules immediately
        return require(path);
    }
}

//ROUTES
app.use('/', runRoute('./routes/index'));


```

 as you can see, if we are in the development environment, ```runRoute``` is function that returns a function (known as functor for all you academics),
 which means that every time a route is hit, it re-evaluates the require statement - so if we reload a file, it will re-evaluate the require pulling in the new file 
 and avoiding re-referencing the old file. DON'T WORRY. If the file is already cached it will not slow down your development server, at all. If you delete the cache, only
 then will it have to do the extra work of re-requiring the file. It does not have to re-require everytime. Just to be sure you get that.
 
 Got it? pretty straightforward
 
 
 we don't need socket.io for serverside reloading - because we already have an HTTP server listening for stuff
 
 
 so in development mode we just need to add a route that can handle hot-reload requests like so:
 
 ```javascript 
 
 if (app.get('env') === 'development') {
     app.post('/hot-reload', function (req, res, next) {  //route to handle serverside hot-reloading of files in our /routes dir
         var path = req.body.path;
         path = require.resolve(path);
         if (path.indexOf('node_modules') < 0 && path.indexOf('routes') > 0) {
             try {
                 delete require.cache[path];
                 res.send({success: 'successfully deleted cache with keyname: ' + path});
             }
             catch (err) {
                 res.send({error: String(err)});
             }
         }
     });
 }
 ```
 
 as you can see, I configured it to ignore anything in /node_modules/ directory and made sure only the /routes directory was being listened to;
 I could have just used '/routes/' but just in case there was some node_module with '/routes/' in the path, I added that clause. Not as fail proof
 as I would like, but should work for now.
 
 
 the final part of the equation is similar to front-end reloading - we use gulp to listen to the filesystem - like so:
 
 
 ```javascript
 
 gulp.task('watch:hot-reload-back-end', function () {
 
     //if route file changes, we just reload that one route, it works
 
     gulp.watch('./routes/**/*.js').on('change', function (file) {
 
         request({
                 method: 'POST',
                 json: {
                     path: file.path
                 },
                 uri: 'http://localhost:3000/hot-reload'
             },
             function (err, response, body) {
                 if (err) {
                     console.log(colors.red(ijson.parse(err).error));
                 }
                 else {
                     console.log(colors.blue(ijson.parse(body).success));
                 }
             });
     });
 });

```

(ijson is library that I wrote to make JSON idempotent, it works ok but not great)


the only advantage of serverside hot-reloading is avoiding the wait for server restarts, which can become all too frequent. However, I don't personally see
server hot-reloading to be as useful as client hot reloading.

if you have any questions you can open an issue, thanks!
 
 
 
 

