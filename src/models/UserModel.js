const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

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
})

// Hash the user's password before inserting a new user
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const hash = await bcrypt.hash(this.password, 12)
      this.password = hash
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
  const res = await bcrypt.compare(password, this.password)
  return res
}

module.exports = model('users', UserSchema)
