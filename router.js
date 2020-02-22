var fs = require('fs');

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            if (mapping[url] instanceof Function)
            {
                router.post(path, mapping[url]);
            }else{
                router.post(path, mapping[url][0], mapping[url][1]);
            }
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router) {
    var files = fs.readdirSync(__dirname + '/routes');
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/routes/' + f);
        addMapping(router, mapping);
    }
}

module.exports = function (dir) {
    var
        controllers_dir = dir || 'router', // 如果不传参数，扫描目录默认为'controllers'
        router = require('express').Router();
    addControllers(router, controllers_dir);
    return router;
};