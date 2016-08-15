import { Template } from 'meteor/templating';
import * as Constants from '/imports/startup/global_settings';
import Calls from '/imports/api/calls/callsCollection';
import moment from 'moment';
import './calls.html';

/* eslint-disable prefer-arrow-callback */

Template.calls.onCreated(function callsOnCreated() {
  Meteor.subscribe('calls');
});

Template.calls.helpers({
  timestamp() {
    return moment(this.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS');
  },
  limit() {
    return Constants.CALLS_LIMIT;
  },
  calls() {
    return Calls.find({}, { sort: { timestamp: -1 } });
  },
});
