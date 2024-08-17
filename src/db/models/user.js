import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true, default: 'User' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['woman', 'man'], default: 'woman' },
    weight: { type: Number, default: 0 },
    dailyActivityTime: { type: Number, default: 0 },
    dailyWaterNorm: { type: Number, default: 1.5 },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dntbkzhtq/image/upload/v1719141998/AquaTrack/defaultAvatar.webp',
    },
    verifyEmail: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
