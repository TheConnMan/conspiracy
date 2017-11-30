import ConsumerService from './ConsumerService';

const consumer = new ConsumerService(process.env.QUEUE_URL, (body) => {
  console.log(body);
  return Promise.resolve();
});

consumer.run();
