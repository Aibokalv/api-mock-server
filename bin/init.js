module.exports = function(config){
    var koa = require('koa');
    var router = require('./router');
    var bodyParser = require('koa-bodyparser');
    var app = koa();
    var http = require('http');
    var md5 = require('md5');
    var querystring = require('querystring');
    var fs = require('fs');
    var Mock = require('mockjs');
    var path = require('path');
    var svn = require('svn');
    var Promise = require('promise');

    function encode(data, time, key){
        if (!key) key = config.apiKey;
        return md5(data + time + key);
    }
    function load(method, r, data) {
        return function (callback){
            data.device	= "web";
            data = JSON.stringify(data);

            var t = parseInt(+ new Date / 1000);
            data = querystring.stringify({
                r: r,
                k: encode(data, t),
                d: data,
                t: t,
                p: parseInt(Math.random() * (1000 + 1))
            });
            var options = {
                host: config.apiHost,
                port: config.apiPort,
                path: r,
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': data.length
                }
            }
            var req = http.request(options, function(res){
                var str = '';
                res.on('data', function (chunk) {
                    str += chunk
                });
                res.on('end', function () {
                    callback(null, {body: str, status: res.statusCode})
                });
                res.on('error', function(){
                    callback(null, null)
                })
            });

            req.write(data);
            req.end();

        }

    }

    function getMockData(r) {
        return function(callback){
            fs.readFile(path.join(process.cwd(), config.mockSource, r + '.json'), function (err, data) {
                if (err) callback(null, null);
                else callback(null, {body: Mock.mock(JSON.parse(data)), status: 200});
            });
        }
    }



    function walk(currentDirPath, leaffn, branchfn, obj) {
        var callee = arguments.callee;
        if (!obj) obj = {};
        if (!branchfn) branchfn = function(obj, filePath, name){
            callee.call(this, filePath, leaffn, branchfn, obj[name]);
        }
        var fs = require('fs'), path = require('path');
        fs.readdirSync(currentDirPath).forEach(function(name) {
            var filePath = path.join(currentDirPath, name);
            var state = fs.statSync(filePath);
            var nameWithoutExt = name.substring(0, name.lastIndexOf('.'))
            var content = fs.readFileSync(filePath);
            if (state.isFile()) {
                leaffn(obj, filePath, name, nameWithoutExt, content);
            } else if (state.isDirectory()) {
                branchfn(obj, filePath, name)
            }
        });
        return obj
    }


    walk(path.join(process.cwd(), config.typesSource), function(obj, filePath, name, nameWithoutExt, content){
        Mock.Random[nameWithoutExt] = (function(s){
            return function(){ return Mock.mock(s) }
        })(JSON.parse(content))
    });


    app
        .use(bodyParser())
        .use(router.routes())
        .use(router.allowedMethods())
        .use(function*(){
            if(this.params && (this.params.controller || this.params.apiUrl)) {
                this.params.apiUrl = this.params.apiUrl || ('/' + this.params.controller + '/' + this.params.action);

                console.log('--------------');
                console.log('请求接口：' + this.params.apiUrl);
                console.log('请求体:');
                console.log(this.request.body);

                var res = yield getMockData(this.params.apiUrl);
                if (!res) {
                    res = yield load('POST', this.params.apiUrl, this.request.body || {user_id: 4})
                }
                if (!res) {
                    res = { body: {code: 1, msg: '请求错误', obj: {}}, status: 500 }
                }
                if (config.converter) {
                    res = config.converter(res);
                }
                this.type = 'json';
                this.body = res.body;
                this.status = res.status;
                this.set("Access-Control-Allow-Origin", config.safeDomain)
            }

        })
    ;


    app.listen(config.port);

}