import path from 'node:path';
export const MONGO_DB = {
  MONGODB_USER: 'MONGODB_USER',
  MONGODB_PASSWORD: 'MONGODB_PASSWORD',
  MONGODB_URL: 'MONGODB_URL',
  MONGODB_DB: 'MONGODB_DB',
};

export const FORTY_MINUTES = 40 * 60 * 1000;
export const SEVEN_DAY = 7 * 24 * 60 * 60 * 1000;

export const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');

export const UPLOAD_DIR = path.join(process.cwd(), 'upload');

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.resolve('src', 'templates');
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

export const dateRegex =/^(?:20[2-9]{2})-(?:(?:0[1-9]|1[0-2]))-(?:(?:0[1-9]|1[0-9]|2[0-8])|(?:29|30)(?=\-(?:0[13-9]|1[0-2]))|(?:31(?=\-(?:0[13578]|1[02])))|(?:29(?=\-02\-(?:(?:(?:[2468][048]|[3579][26])00)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26]))))))$/;
export const dateAndTimeRegex =/^(?:20[2-9][0-9])-(?:(?:0[1-9]|1[0-2]))-(?:(?:0[1-9]|1[0-9]|2[0-8])|(?:29|30)(?=\-(?:0[13-9]|1[0-2]))|(?:31(?=\-(?:0[13578]|1[02])))|(?:29(?=\-02\-(?:(?:(?:[2468][048]|[3579][26])00)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])))))) (?:[01][0-9]|2[0-3]):[0-5][0-9]$/
export const monthRegex = /^(?:20[2-9][0-9])-(?:(?:0[1-9]|1[0-2]))$/;
