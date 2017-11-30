import * as AWS from 'aws-sdk';

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
    const me = this;
    return me.processMessages().then(() => {
      return me.run();
    });
  }

  private async processMessages(): Promise<void[]> {
    try {
      const me = this;
      const messages: AWS.SQS.Message[] = await this.getMessages();
      return Promise.all(messages.map((message) => me.processMessage(message)));
    } catch (e) {
      return Promise.all([]);
    }
  }

  private getMessages(): Promise<AWS.SQS.Message[]> {
    const me = this;
    return new Promise((resolve, reject) => {
      me.sqsClient.receiveMessage({
        QueueUrl: me.queueUrl
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
    const me = this;
    const body = JSON.parse(message.Body);
    return me.consumerFn(body).then(() => {
      return me.deleteMessage(message);
    });
  }

  private deleteMessage(message: AWS.SQS.Message): Promise<null> {
    const me = this;
    return new Promise((resolve, reject) => {
      me.sqsClient.deleteMessage({
        QueueUrl: me.queueUrl,
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
