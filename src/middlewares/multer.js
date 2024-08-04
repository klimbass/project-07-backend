import multer from 'multer';
import {TEMP_UPLOAD_DIR} from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
    destination: TEMP_UPLOAD_DIR,
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now();
        cb(null, `${uniquePrefix}_${file.originalname}`);
    },
});

const limits = {
    fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
    const extensions = file.originalname.split('.').pop();
    if (extensions === 'exe') {
        return cb(createHttpError(400, 'exe file is not allowed'));
    }
    cb(null, true);
};

export const upload =  multer({
    storage,
    limits,
    fileFilter,
});
