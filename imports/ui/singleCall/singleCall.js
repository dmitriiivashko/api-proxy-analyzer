import { Template } from 'meteor/templating';

/* eslint-disable prefer-arrow-callback */

import './singleCall.html';

function isUrlEncoded(context) {
  if (typeof context.headers === 'undefined') {
    return false;
  }
  const headers = JSON.parse(context.headers);
  return headers['content-type']
    && headers['content-type'].toLowerCase() === 'application/x-www-form-urlencoded';
}

function isFileUpload(context) {
  if (typeof context.headers === 'undefined') {
    return false;
  }
  const headers = JSON.parse(context.headers);
  return headers['content-type']
    && headers['content-type'].toLowerCase().match(/multipart\/form\-data/);
}

Template.singleCall.helpers({
  displayBody() {
    return this.method !== 'GET'
      && ((isUrlEncoded(this) && this.body) || (this.rawBody === null && this.body !== null));
  },
  displayRawBody() {
    return this.method !== 'GET' && !isUrlEncoded(this) && this.rawBody;
  },
  displayFiles() {
    return isFileUpload(this);
  },
});
