const { randomBytes } = require('crypto')
const { Schema, model } = require('mongoose')
const { hash, compare } = require('bcryptjs')

const { NotificationSchema } = require('./Notifications')
const sendMail = require('../helpers/sendMail')

const ROLES = require('../helpers/roles')

const UserSchema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
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
  verificationKey: String,
  location: String,
  description: String
}, {
  timestamps: { createdAt: true }
})

UserSchema.pre('save', async function (next) {
  if (this.isModified('username') || this.isNew) {
    if (await UserModel.findOne({ username: this.username })) {
      return next(new Error('Username must be unique.'))
    }
  }

  if (this.isModified('email') || this.isNew) {
    if (await UserModel.findOne({ email: this.email })) {
      return next(new Error('Email must be unique.'))
    }

    const verificationKey = randomBytes(64).toString('hex')
    this.verificationKey = verificationKey

    const mailOpts = {
      to: this.email,
      subject: 'Verify your email',
      html: `Verify your email by clickin <a href="http://localhost:3000/verify?key=${verificationKey}">this link</a>.`
    }

    try {
      await sendMail(mailOpts)
    } catch (error) {
      console.error(error)
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

UserSchema.methods.comparePassword = async function (password) {
  return compare(password, this.password)
}

const UserModel = model('users', UserSchema)

module.exports = UserModel
