const { Schema, model } = require('mongoose')
const { hash, compare } = require('bcryptjs')

const { NotificationSchema } = require('./Notifications')

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: String,
  notifications: [NotificationSchema],
  rating: {
    positive: {
      type: Number,
      default: 0
    },
    negative: {
      type: Number,
      default: 0
    }
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: true }
})

// Hash the user's password before inserting a new user
UserSchema.pre('save', async function (next) {
  console.log('[UserSchema:save]')
  if (this.isModified('password') || this.isNew) {
    try {
      this.password = await hash(this.password, 12)
      next()
    } catch (err) {
      next(err)
    }
  } else {
    next()
  }
})

// Compare password input to password saved in database
UserSchema.methods.comparePassword = async function (password) {
  const res = await compare(password, this.password)
  return res
}

module.exports = model('users', UserSchema)
