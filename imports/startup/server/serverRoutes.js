/* eslint-disable no-param-reassign, func-names, prefer-arrow-callback, prefer-template, max-len */

import url from 'url';
// import Meteor from 'meteor/meteor';

if (Meteor.isServer) {
  Router.configureBodyParsers = function () {
    Router.onBeforeAction(Iron.Router.bodyParser.json(), { where: 'server' });
    Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({ extended: false }), { where: 'server' });
    Router.onBeforeAction(Iron.Router.bodyParser.raw({
      type: '*/*',
      verify(req, res, body) {
        req.rawBody = body.toString();
      },
    }), {
      only: ['push-endpoint'],
      where: 'server',
    });
  };
}

Router.route('/push-endpoint', function () {
  this.response.end(
    JSON.stringify(this.request.url, null, 4) + `\n\n` +
    JSON.stringify(url.parse(this.request.url, true), null, 4) + `\n\n` +
    JSON.stringify(this.request.method, null, 4) + `\n\n` +
    JSON.stringify(this.request.headers, null, 4) + `\n\n` +
    JSON.stringify(this.request.body, null, 4) + `\n\n` +
    JSON.stringify(this.request.rawBody, null, 4)
  );
}, { where: 'server' });
