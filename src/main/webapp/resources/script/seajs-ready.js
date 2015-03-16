/**
 * Created by zqc on 2015/3/15.
 */

seajs.config({
    paths: {
        'script': './script',
        'css': './css'
    },
    alias: {
        'login': 'script/login.js',
        'jquery': 'jquery-1.11.2.min.js',
        'jquery-plugin': 'jquery-plugin.js',
        'backbone': 'backbone-min.js',
        'underscore': 'underscore-min.js',
        'webapp': 'script/webapp.js?v=1015',
        'webapp.css': 'css/webapp.css',
        'login.css': 'css/login.css'
    }
});
seajs.use('login', function (login) {
    login.loginHw();
});