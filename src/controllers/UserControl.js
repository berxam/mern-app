const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const login = async (req, res) => {
  const { email, password } = req.body

  const user = await UserModel.findOne({ email })

  if (!user) {
    res.sendStatus(404)
  } else {
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      res.sendStatus(401)
    } else {
      const payload = {
        username: user.username,
        email
      }

      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: '2 days' },
        (error, token) => {
          if (error) {
            res.status(401).json(error)
          } else {
            res.json({ token })
          }
        }
      )
    }
  }
}

const register = async (req, res) => {
  if (!req.body.email || !req.body.username || !req.body.password) {
    res.sendStatus(422)
  } else {
    const newUser = new UserModel({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })

    try {
      await newUser.save()
      res.sendStatus(201)
    } catch (error) {
      res.status(400).json(error)
    }
  }
}

module.exports = { login, register }
