const notification = require('../routes/notification');
const user = require('../routes/user');
const auth = require('../routes/auth');
const lecture = require('../routes/lecture');
const request = require('../routes/request');
const chat = require('../routes/chat');
const defaultPage = require('../routes/default');

module.exports = function (app) {
    app.use('/', defaultPage)
    app.use('/api/notification', notification);
    app.use('/api/user', user),
    app.use('/api/auth', auth),
    app.use('/api/chat', chat),
    app.use('/api/lecture', lecture),
    app.use('/api/request', request)
}

