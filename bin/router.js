var Router = require('koa-router');
var router = new Router();


var r = /(.*?)(\.json)?$/i;
router
    .post(r, function *(next) {
        this.params = {
            apiUrl : this.params[0]
        }
        yield next;
    }).get(r, function *(next) {
        this.params = {
            apiUrl : this.params[0]
        }
        yield next;
    }).delete(r, function *(next) {
        this.params = {
            apiUrl : this.params[0]
        }
        yield next;
    })

module.exports = router;