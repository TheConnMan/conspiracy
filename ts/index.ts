import ConsumerService from './ConsumerService';
import WebService from './WebService';

import * as log4js from 'log4js';

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'info'
    }
  }
} as log4js.Configuration);
const logger = log4js.getLogger();
logger.level = 'info';

const consumer = new ConsumerService(process.env.QUEUE_URL, (body) => {
  return new WebService().requestUrl(body);
});

logger.info('Starting consumer');
consumer.run();
