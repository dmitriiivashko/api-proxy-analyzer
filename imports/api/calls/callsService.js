import Url from 'url';
import Calls from './callsCollection';

export default class {
  static registerRequest(request) {
    const url = request.url;
    const parsedUrl = JSON.stringify(Url.parse(request.url, true), null, 4);
    const method = request.method;
    const headers = JSON.stringify(request.headers, null, 4);
    const body = JSON.stringify(request.body, null, 4);
    const rawBody = request.rawBody;
    const timestamp = new Date();

    Calls.insert({
      url,
      parsedUrl,
      method,
      headers,
      body,
      rawBody,
      timestamp,
    });
  }
}
