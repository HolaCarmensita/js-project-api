import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  accessToken: {
    type: String,
    default: crypto.randomBytes(64).toString('hex'),
  },
  thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thought',
    },
  ],
});

export default User;
