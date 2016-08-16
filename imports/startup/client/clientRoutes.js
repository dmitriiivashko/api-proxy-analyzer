/* eslint-disable func-names, prefer-arrow-callback, no-underscore-dangle, object-shorthand */
import '/imports/ui/layouts/layout';
import CallsService from '/imports/api/calls/callsService';

Router.route('/', function () {
  this.layout('layout');
  this.render('calls');
});

Router.route('/calls/:_id', function () {
  this.layout('layout');
  this.render('single_call', {
    data: function () {
      return CallsService.getCall(this.params._id);
    },
  });
});
