# hr4R

clientside hot-reloading is much more useful than serverside hot-reloading - both can save you time - but clientsite hot-reloading can save you lots more time


##clientside hot-reloading

start the app with

gulp nodemon

this runs nodemon, after running some tasks

in this case, we transpile JSX and then run a metadata generator that I wrote that allows RequireJS to require entire directories, this is very
useful for controllers and views, especially controllers that follow some path convention.


./gulpfile.js contains this code at the bottom:

```
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
you have open on your development machine, sometimes I have 2 or 3


in the client code (all in ./public directory) we have a hotReloadHandler




