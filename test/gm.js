var gm = require('gm')
//gm('./test/1.jpg').resize("40")

gm('./test/2.jpg').resize(40, 40).write('./test/1.jpg', function (err) {
    if (err) {
        return handler(err);
    }
});