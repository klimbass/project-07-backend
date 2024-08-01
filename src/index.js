import { initMongoDBConnection } from './db/initMongoDB.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoDBConnection();
  setupServer();
};

bootstrap();
