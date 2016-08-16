/* eslint-disable no-param-reassign, func-names, prefer-arrow-callback, prefer-template, max-len */

import * as Settings from '/server/common/server_settings';
import { Meteor } from 'meteor/meteor';
import CallsService from '/imports/api/calls/callsService';

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
      only: ['endpoint'],
      where: 'server',
    });
  };

  Router.route(Settings.API_ENDPOINT, function () {
    const relativePath = this.params.length > 0 ? this.params[0] : '';
    CallsService.registerRequest(relativePath, this.request);
    this.response.end('OK');
  }, {
    where: 'server',
    name: 'endpoint',
  });
}
