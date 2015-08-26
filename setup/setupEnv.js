/**
 * Created by amills001c on 8/25/15.
 */

//logging


//core
var path = require('path');
var nconf = require('nconf');


function setupEnv() {

    var provider = new nconf.Provider(); //create new instance of nconf

    var nconfInstance = provider.use('memory').argv(); // pull-in command line args

    nconfInstance.set('globalRoot', __dirname.substring(0, __dirname.lastIndexOf(path.sep))); //remove "/setup" from end of path

    global.colors = require('colors');

    var envSettings = require('../config/config_env.json');
    var scEnv = envSettings.environments[process.env.NODE_ENV];
    if (!scEnv) {
        throw new Error('./config/config_env.json file is likely misconfigured; or the config file is mismatched with command line input; or no NODE_ENV argument was passed at the command line.\nTry this: "NODE_ENV=xxx npm start"');
    }
    else {
        nconfInstance.set('sc_env', scEnv);
    }

    log.info('\n\nSmartConnect runtime environment:', global.colors.bgYellow.blue(process.env.NODE_ENV));

    var constants = require('../config/config_constants.json');
    if (!constants) {
        throw new Error('./config/config_constants.json file is likely misconfigured; or the config file is mismatched with command line input; or no NODE_ENV argument was passed at the command line.\nTry this: "NODE_ENV=xxx npm start"');
    }
    else {
        nconfInstance.set('sc_constants', constants);
    }

    return nconfInstance;

}

module.exports = setupEnv;


