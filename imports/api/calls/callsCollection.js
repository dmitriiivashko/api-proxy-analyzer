import { Mongo } from 'meteor/mongo';

const Calls = new Mongo.Collection('tasks');

/* eslint-disable prefer-arrow-callback */
if (Meteor.isServer) {
  Meteor.publish('calls', function callsPublication() {
    return Calls.find({});
  });
}

export { Calls as default };
