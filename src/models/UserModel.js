const { Schema, model } = require('mongoose')
const { hash, compare } = require('bcryptjs')

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: { createdAt: true }
})

// Hash the user's password before inserting a new user
UserSchema.pre('save', async function (next) {
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
