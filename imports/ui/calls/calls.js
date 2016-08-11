import { Template } from 'meteor/templating';
import * as Constants from '../../startup/constants.js';
import './calls.html';

Template.calls.helpers({
  limit() {
    return Constants.CALLS_LIMIT;
  },
  calls() {
    return [
      {
        _id: '1',
        timestamp: 123,
      },
      {
        _id: '2',
        timestamp: 1234,
      },
      {
        _id: '3',
        timestamp: 12356,
      },
    ];
  },
});
