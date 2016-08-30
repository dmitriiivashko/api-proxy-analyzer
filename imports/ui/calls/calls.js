import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import * as Constants from '/imports/startup/global_settings';
import Calls from '/imports/api/calls/callsCollection';
import moment from 'moment';
import './calls.html';

/* eslint-disable prefer-arrow-callback, no-underscore-dangle */

function allCalls() {
  return Calls.find({}, { sort: { timestamp: -1 }, limit: Constants.CALLS_LIMIT });
}

Template.calls.helpers({
  timestamp() {
    return moment(this.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS');
  },
  limit() {
    return Constants.CALLS_LIMIT;
  },
  calls() {
    return allCalls();
  },
  isEmpty() {
    return allCalls().count() === 0;
  },
});

Template.calls.events({
  'click .route-proxy'(event) {
    event.preventDefault();

    Meteor.call('calls.proxy', this._id);
  },

  'click .route-delete'(event) {
    event.preventDefault();

    if (!confirm('Are you sure')) { // eslint-disable-line no-undef, no-alert
      return;
    }

    Meteor.call('calls.delete', this._id);
  },
});
