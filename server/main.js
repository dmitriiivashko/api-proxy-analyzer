import { Meteor } from 'meteor/meteor';

import '/imports/startup/server/serverRoutes';
import * as GlobalSettings from '/imports/startup/global_settings';

Meteor.startup(() => {
  if (process.env.APITOOL_AUTH_LOGIN && process.env.APITOOL_AUTH_PASS) {
    const basicAuth = new HttpBasicAuth(
      process.env.APITOOL_AUTH_LOGIN,
      process.env.APITOOL_AUTH_PASS
    );
    basicAuth.protect(['/', GlobalSettings.FILES_ENDPOINT]);
  }
});
