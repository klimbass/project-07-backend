import { model, Schema } from 'mongoose';
import { dateAndTimeRegex } from '../../constants/index.js';

const getCurrentDate = () => {
    const now = new Date();
    // Приведення дати до рядка у форматі 'YYYY-MM-DD HH:mm'
    return now.toISOString().slice(0, 16).replace('T', ' ');
};

//Checks date for the pattern
function validator(date) {
  return dateAndTimeRegex.test(date);
}

const waterSchema = new Schema(
  {
    volume: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      validate: validator,
      required: true,
      default: getCurrentDate
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  },

  { timestamps: true, versionKey: false },
);


export const WaterCollection = model('water', waterSchema);


