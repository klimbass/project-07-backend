import { initMongoDBConnection } from './db/initMongoDB.js';
import { setupServer } from './server.js';
import {createDirIfNotExists} from './utils/createDirIfNotExists.js';
import {TEMP_UPLOAD_DIR, UPLOAD_DIR} from './constants/index.js';

const bootstrap = async () => {
  await initMongoDBConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

bootstrap();
