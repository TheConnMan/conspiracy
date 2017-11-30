# Conspiracy - An Inside Job

Conspiracy uses SQS as a secure transfer from the outside world to run jobs (HTTP calls) internally.

## Usage

### Quick Start

First create an [AWS SQS topic](https://console.aws.amazon.com/sqs/home). **NOTE:** Make sure to set the SQS **Receive Message Wait Time** to 20s for long polling and to reduce the total number of SQS API calls (which you are billed for).

Then run the following:

```
git clone https://github.com/TheConnMan/conspiracy.git
cd conspiracy
npm install
QUEUE_URL=<queue-url> AWS_ACCESS_KEY_ID=<access-key> AWS_SECRET_ACCESS_KEY=<secret-key> npm start
```

### SQS Payload

Conspiracy takes a JSON job payload defining the job URL, method, and parameters.

```
{
  "method": "POST",
  "url": "https://webhook.site/<key>",
  "timeout": 10000,
  "params": {
    "key": "value"
  },
  "body": {
    "json": true
  }
}
```

### Environment Variables
- **AWS_ACCESS_KEY_ID** - AWS access key with SQS permissions
- **AWS_SECRET_ACCESS_KEY** - AWS secret key with SQS permissions
- **QUEUE_URL** - AWS SQS queue URL for consuming jobs
