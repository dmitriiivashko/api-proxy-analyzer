import Url from 'url';
import Calls from './callsCollection';

export default class {
  static registerRequest(relativePath, request) {
    const url = request.url;
    const parsedUrl = JSON.stringify(Url.parse(request.url, true), null, 4);
    const method = request.method;
    const headers = JSON.stringify(request.headers, null, 4);
    const body = JSON.stringify(request.body, null, 4);
    const rawBody = request.rawBody;
    const timestamp = new Date();
    const files = JSON.stringify(request.files, null, 4);

    // if (this.request.files && this.request.files.length > 0) {
      // this.request.files
    // }
    // var path = this.request.files.file.path;
		// var name = this.request.files.file.name;

    Calls.insert({
      url,
      relativePath,
      parsedUrl,
      method,
      headers,
      body,
      files,
      rawBody,
      timestamp,
    });
  }

  static getCall(id) {
    return Calls.findOne({ _id: id });
  }
}
