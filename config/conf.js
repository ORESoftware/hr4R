/**
 * Created by amills001c on 9/11/15.
 */


//core
var path = require('path');
var nconf = require('nconf');
var appRoot = require('app-root-path');


function setupEnv() {

    global.colors = require('colors/safe');

    console.log('\n\nruntime NODE_ENV:', global.colors.bgYellow.blue(process.env.NODE_ENV));

    var provider = new nconf.Provider(); //create new instance of nconf

    var nconfInstance = provider.use('memory').argv(); // pull-in command line args

    //use_socket_server flag is passed at command line like so "npm start -- -- use_socket_server"
    nconfInstance.get('use_socket_server') ? nconfInstance.set('use_socket_server', true) : nconfInstance.set('use_socket_server', false);
    nconfInstance.get('use_hot_reloader') ? nconfInstance.set('use_hot_reloader', true) : nconfInstance.set('use_hot_reloader', false);

    nconfInstance.set('globalRoot', appRoot); //remove "/setup" from end of path

    var envSettings = require('./config_env.json');
    var scAdminEnv = envSettings.environments[process.env.NODE_ENV];
    if (!scAdminEnv) {
        throw new Error('config_env.json file is likely misconfigured; or the config file is mismatched with command line input; ' +
            'or no NODE_ENV argument was passed at the command line.');
    }
    else {
        nconfInstance.set('sc_admin_env', scAdminEnv);
    }

    var constants = require('./config_constants.json');
    if (!constants) {
        throw new Error('config_constants.json file is likely misconfigured; or the config file is mismatched with command line input; ' +
            'or no NODE_ENV argument was passed at the command line.');
    }
    else {
        nconfInstance.set('sc_admin_constants', constants);
    }

    return nconfInstance;

}

module.exports = setupEnv;


