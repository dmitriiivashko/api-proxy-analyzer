import grid from '/imports/adapters/gridFs';
import { Readable } from 'stream';
import Url from 'url';
import _ from 'lodash';
import debugLib from 'debug';
import requestLib from 'request';
import { Meteor } from 'meteor/meteor';
import * as Constants from '/imports/startup/global_settings';
import Calls from './callsCollection';

const IGNORED_HEADERS = ['content-length', 'host'];
const debug = debugLib('main');

export default class CallsService {
  static registerRequest(relativePath, request, rule) {
    const url = request.url;
    const parsedUrl = JSON.stringify(Url.parse(request.url, true), null, 4);
    const method = request.method;
    const headers = JSON.stringify(request.headers, null, 4);
    const body = JSON.stringify(request.body, null, 4);
    const rawBody = request.rawBody;
    const timestamp = new Date();
    const files = JSON.stringify(request.files, null, 4);

    const callData = {
      url,
      relativePath,
      parsedUrl,
      method,
      headers,
      body: typeof body !== 'object' && rawBody == null ? body : null,
      files,
      rawBody: rawBody != null ? true : null,
      timestamp,
    };

    Calls.insert(callData, (error, _id) => {
      if (error) {
        throw error;
      }
      if (!rawBody) {
        return;
      }

      const s = new Readable();
      s.push(rawBody);
      s.push(null);

      const w = grid.createWriteStream({
        filename: `${_id}.txt`,
      });

      s.pipe(w);
    });

    if (!rule.autoProxy) {
      return;
    }

    if (!Constants.PROXY_RULES) {
      return;
    }

    _.forEach(Constants.PROXY_RULES, (singleProxyRule) => {
      CallsService.proxyCall(callData, singleProxyRule, request.headers, body);
    });
  }

  static proxyCall(call, rule, headers, callBody) {
    if (!Meteor.isServer) {
      return;
    }

    const proxyRule = rule;

    if (!proxyRule.autoProxy) {
      return;
    }

    if (!proxyRule.proxy || !_.isArray(proxyRule.proxy) || proxyRule.proxy.length === 0) {
      return;
    }

    const inputHeaders = headers || JSON.parse(call.headers);

    const proxyHeaders = {};
    _.forEach(inputHeaders, (value, key) => {
      if (_.includes(IGNORED_HEADERS, key)) {
        return;
      }
      proxyHeaders[key] = value;
    });

    let bodyToProxy = callBody;

    if (call._id) { // eslint-disable-line no-underscore-dangle, max-len
      const r = CallsService.getCallDataStream(`${call._id}.txt`); // eslint-disable-line no-underscore-dangle, max-len
      bodyToProxy = '';
      r.on('data', (chunk) => {
        bodyToProxy += chunk;
      });

      r.on('error', () => {
        CallsService._proxyCallDirect(proxyRule, call, proxyHeaders, bodyToProxy); // eslint-disable-line no-underscore-dangle, max-len
      });

      r.on('end', () => {
        CallsService._proxyCallDirect(proxyRule, call, proxyHeaders, bodyToProxy); // eslint-disable-line no-underscore-dangle, max-len
      });
    } else {
      CallsService._proxyCallDirect(proxyRule, call, proxyHeaders, bodyToProxy); // eslint-disable-line no-underscore-dangle, max-len
    }
  }

  static _proxyCallDirect(proxyRule, call, proxyHeaders, bodyToProxy) {
    _.forEach(proxyRule.proxy, (proxyUrl) => {
      requestLib({
        url: proxyUrl,
        method: call.method,
        headers: proxyHeaders,
        body: bodyToProxy,
      }, (error, response, bodyContent) => { // eslint-disable-line no-unused-vars
        if (error) {
          debug('PROXY ERROR', proxyUrl, call.method, proxyHeaders, bodyToProxy, error); // eslint-disable-line no-console, max-len
          return;
        }
        debug('REQUEST PROXIED'); // eslint-disable-line no-console
      });
    });
  }

  static getCall(id) {
    return Calls.findOne({ _id: id });
  }

  static getCallDataStream(_id) {
    const r = grid.createReadStream({
      filename: _id,
    });

    r.setEncoding('utf8');

    return r;
  }
}
