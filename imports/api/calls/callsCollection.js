import grid from '/imports/adapters/gridFs';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import * as Constants from '/imports/startup/global_settings';
import CallsService from '/imports/api/calls/callsService';

const Calls = new Mongo.Collection('calls');

/* eslint-disable prefer-arrow-callback */
if (Meteor.isServer) {
  Meteor.publish('calls', function callsPublication() {
    return Calls.find({}, { sort: { timestamp: -1 }, limit: Constants.CALLS_LIMIT });
  });
}

Meteor.methods({
  'calls.delete'(callId) { // eslint-disable-line meteor/audit-argument-checks
    Calls.remove({ _id: callId });
    if (Meteor.isServer) {
      grid.remove({
        filename: `${callId}.txt`,
      });
    }
  },
  'calls.proxy'(callId) { // eslint-disable-line meteor/audit-argument-checks, no-unused-vars
    if (Meteor.isServer) {
      const call = CallsService.getCall(callId);
      _.forEach(Constants.PROXY_RULES, (singleProxyRule) => {
        CallsService.proxyCall(call, singleProxyRule);
      });
    }
    if (Meteor.isClient) {
      alert('Request successfully proxied'); // eslint-disable-line no-alert, no-undef
    }
  },
});

export { Calls as default };
