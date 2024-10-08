import { model, Schema } from 'mongoose';
import { DATE_AND_TIME_REGEX } from '../../constants/index.js';



//Checks date for the pattern
function validator(date) {
  return DATE_AND_TIME_REGEX.test(date);
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
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  },

  { timestamps: true, versionKey: false },
);


export const WaterCollection = model('water', waterSchema);


