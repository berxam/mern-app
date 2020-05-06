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

UserSchema.pre('save', async function (next) {
  if (this.isModified('email') || this.isNew) {
    try {
      // Send email confirmation message

    } catch (err) {
      next(err)
    }
  }

  if (this.isModified('password') || this.isNew) {
    try {
      this.password = await hash(this.password, 12)
    } catch (err) {
      next(err)
    }
  }

  next()
})

// Compare password input to password saved in database
UserSchema.methods.comparePassword = async function (password) {
  return compare(password, this.password)
}

module.exports = model('users', UserSchema)
