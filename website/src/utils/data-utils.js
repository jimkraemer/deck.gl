import {request, json, text} from 'd3-request';
import {withPrefix} from 'gatsby';

import {StreamParser} from './worker-utils';

export function loadData(url, worker, onSuccess) {
  if (worker) {
    const req = request(url);
    // use a web worker to parse data
    const dataParser = new StreamParser(withPrefix(worker), (data, meta) => {
      onSuccess(data, meta);
    });

    req
      .on('progress', dataParser.onProgress)
      .on('load', dataParser.onLoad)
      .get();
  } else if (/\.(json|geojson)$/.test(url)) {
    // load as json
    json(url, (error, response) => {
      if (!error) {
        onSuccess(response, {});
      }
    });
  } else {
    // load as plain text
    text(url, (error, response) => {
      if (!error) {
        onSuccess(response, {});
      }
    });
  }
}
