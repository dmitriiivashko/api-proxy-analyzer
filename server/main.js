import { Meteor } from 'meteor/meteor';

require('../imports/startup/server/serverRoutes');

Meteor.startup(() => {
  // const basicAuth = new HttpBasicAuth('a', 'c');
  // basicAuth.protect(['/']);
});
