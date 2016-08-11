/* eslint-disable func-names, prefer-arrow-callback */
import '../../ui/layouts/layout';

Router.route('/', function () {
  this.layout('layout');
  this.render('calls');
});
