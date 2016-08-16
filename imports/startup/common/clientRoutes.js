/* eslint-disable func-names, prefer-arrow-callback, no-underscore-dangle, object-shorthand */
import '/imports/ui/layouts/layout';
import { Meteor } from 'meteor/meteor';
import CallsService from '/imports/api/calls/callsService';

Router.route('/', {
  name: 'index',
  subscriptions() {
    Meteor.subscribe('calls');
  },
  action() {
    this.layout('layout');
    this.render('calls');
  },
});

Router.route('/calls/:_id', {
  name: 'call.single',
  subscriptions() {
    Meteor.subscribe('calls');
  },
  action() {
    this.layout('layout');
    this.render('singleCall', {
      data: function () {
        return CallsService.getCall(this.params._id);
      },
    });
  },
});
