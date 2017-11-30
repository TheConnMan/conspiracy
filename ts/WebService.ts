import * as Request from 'request-promise';

import * as log4js from 'log4js';

const logger = log4js.getLogger();

class WebService {

  public requestUrl(payload): Promise<void> {
    return new Promise((resolve, reject) => {
      Request({
        body: typeof payload.body === 'object' ? JSON.stringify(payload.body) : payload.body,
        method: (payload.method || 'GET').toUpperCase(),
        qs: payload.params || {},
        timeout: payload.timeout || 5000,
        uri: payload.url
      }).promise().then((response) => {
        logger.info(`Response from ${payload.url}: ${response}`);
        resolve();
      }).catch((e) => {
        reject(e);
      });
    });
  }
}

export default WebService;
