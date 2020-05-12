const { randomBytes } = require('crypto')
const { Schema, model } = require('mongoose')
const { hash, compare } = require('bcryptjs')

const { NotificationSchema } = require('./Notifications')

const ROLES = {
  BASIC: 1,
  ADMIN: 2
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    default: ROLES.BASIC
  },
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
  },
  verificationKey: String
}, {
  timestamps: { createdAt: true }
})

// Checks if some user already has `field` with `value`
const uniqueValidator = (field) => {
  return async (value) => {
    const user = await UserModel.findOne({ [field]: value })
    return !user
  }
}

UserSchema.path('email').validate(
  uniqueValidator('email'), 'Email already in use!'
)

UserSchema.path('username').validate(
  uniqueValidator('username'), 'Username already in use!'
)

UserSchema.pre('save', async function (next) {
  if (this.isModified('email') || this.isNew) {
    // 1. Generate a verification key
    const verificationKey = randomBytes(64).toString('hex')
    // 2. Set the verification key as user.verificationKey
    this.verificationKey = verificationKey
    // 3. Send email containing link to verification
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

const UserModel = model('users', UserSchema)

module.exports = UserModel
