/* eslint-disable no-param-reassign, func-names, prefer-arrow-callback, prefer-template, max-len */

import * as Settings from '/server/common/server_settings';
import * as GlobalSettings from '/imports/startup/global_settings';
import _ from 'lodash';
import debugLib from 'debug';
import { Meteor } from 'meteor/meteor';
import CallsService from '/imports/api/calls/callsService';
import Busboy from 'busboy';
// import { inspect } from 'util';
// import fs from 'fs';
// import path from 'path';
// import os from 'os';

const debug = debugLib('main');

if (Meteor.isServer) {
  Router.configureBodyParsers = function () {
    Router.onBeforeAction(Iron.Router.bodyParser.json({ limit: Settings.REQUEST_SIZE_LIMIT }), { where: 'server' });
    Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
      // type: (req) => !req.headers['content-type'].match(/(multipart\/form\-data|text\/plain)/i),
      extended: false,
      limit: Settings.REQUEST_SIZE_LIMIT,
    }), { where: 'server' });
    Router.onBeforeAction((req, res, next) => {
      if (req.method === 'POST' && req.headers['content-type'] && req.headers['content-type'].match(/multipart\/form\-data/i)) {
        const files = {};
        const body = {};
        const busboy = new Busboy({
          headers: req.headers,
        });
        busboy.on('file', function onfile(fieldname, file, filename, encoding, mimetype) { // eslint-disable-line no-unused-vars
          // const saveTo = path.join(os.tmpDir(), filename);
          let fileSizeBytes = 0;
          // file.pipe(fs.createWriteStream(saveTo));

          file.on('data', function ondata(data) {
            fileSizeBytes += data.length;
          });

          file.on('end', function onend() {
            files[fieldname] = {
              originalFilename: filename,
              // path: saveTo,
              size: fileSizeBytes,
            };
          });
        });
        busboy.on('finish', function onfinish() {
          req.files = files;
          req.body = body;
          next();
        });
        busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => { // eslint-disable-line no-unused-vars
          body[fieldname] = val;
        });
        req.pipe(busboy);
      } else {
        next();
      }
    }, { where: 'server' });
    Router.onBeforeAction(Iron.Router.bodyParser.raw({
      type: (req) => !req.headers['content-type'] || !req.headers['content-type'].match(/multipart\/form\-data/i),
      verify(req, res, body) {
        req.rawBody = body.toString();
      },
      limit: Settings.REQUEST_SIZE_LIMIT,
    }), {
      only: ['endpoint'],
      where: 'server',
    });
  };

  _.forEach(Settings.API_ENDPOINTS, (rule) => {
    if (!rule.path) {
      return true;
    }

    Router.route(rule.path, function () {
      debug('REQUEST CALL RECEIVED');
      const relativePath = this.params.length > 0 ? this.params[0] : '';
      CallsService.registerRequest(relativePath, this.request, rule);
      this.response.end('OK');
    }, {
      where: 'server',
      name: 'endpoint',
    });

    return true;
  });

  Router.route(`${GlobalSettings.FILES_ENDPOINT}/:filename`, function () {
    const resp = this.response;

    const r = CallsService.getCallDataStream(this.params.filename);

    let output = '';

    r.on('data', function (chunk) {
      output += chunk;
    });

    r.on('error', function () {
      resp.writeHead(404);
      resp.end('Not Found');
      return;
    });

    r.on('end', function () {
      resp.writeHead(200, { 'Content-Type': 'text/plain' });
      resp.end(output);
    });
  }, { where: 'server' });
}
