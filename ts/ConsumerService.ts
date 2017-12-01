import * as AWS from 'aws-sdk';

import * as log4js from 'log4js';

const logger = log4js.getLogger();

class ConsumerService {

  public sqsClient: AWS.SQS;

  constructor(private queueUrl: string, private consumerFn: (item) => Promise<void>, region = 'us-east-1') {
    if (!queueUrl) {
      throw new Error('QUEUE_URL is required');
    }
    this.sqsClient = new AWS.SQS({
      region
    });
  }

  public run(): Promise<string> {
    return this.processMessages().then(() => {
      return this.run();
    });
  }

  private async processMessages(): Promise<void[]> {
    try {
      const messages: AWS.SQS.Message[] = await this.getMessages();
      if (messages.length !== 0) {
        logger.info(`Processing ${messages.length} message(s)`);
      }
      return Promise.all(messages.map((message) => this.processMessage(message)));
    } catch (e) {
      return Promise.all([]);
    }
  }

  private getMessages(): Promise<AWS.SQS.Message[]> {
    return new Promise((resolve, reject) => {
      this.sqsClient.receiveMessage({
        QueueUrl: this.queueUrl
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Messages);
        }
      });
    });
  }

  private processMessage(message: AWS.SQS.Message): Promise<void> {
    const body = JSON.parse(message.Body);
    return this.consumerFn(body).then(() => {
      return this.deleteMessage(message);
    }).catch((e) => {
      logger.error(`Error processing message: ${e.message}`, e.cause);
      return this.deleteMessage(message);
    });
  }

  private deleteMessage(message: AWS.SQS.Message): Promise<null> {
    return new Promise((resolve, reject) => {
      this.sqsClient.deleteMessage({
        QueueUrl: this.queueUrl,
        ReceiptHandle: message.ReceiptHandle
      }, (err, data) => {
        if (err) {
          resolve();
        } else {
          resolve();
        }
      });
    });
  }
}

export default ConsumerService;
