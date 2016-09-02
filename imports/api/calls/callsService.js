import grid from '/imports/adapters/gridFs';
import { Readable } from 'stream';
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

    Calls.insert({
      url,
      relativePath,
      parsedUrl,
      method,
      headers,
      body,
      files,
      rawBody: rawBody !== null ? rawBody : null,
      timestamp,
    }, (error, _id) => {
      if (error) {
        return;
      }
      if (!rawBody) {
        return;
      }

      const s = new Readable();
      s.push(rawBody);
      s.push(null);

      const w = grid.createWriteStream({
        filename: `${_id}.txt`,
      });

      s.pipe(w);
    });
  }

  static getCall(id) {
    return Calls.findOne({ _id: id });
  }
}
