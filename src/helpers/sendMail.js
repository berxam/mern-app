const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
})

module.exports = (options) => {
  options.from = `Swapza <${process.env.EMAIL_ADDRESS}>`

  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (err, info) => {
      if (err) reject(err)
      else resolve(info)
    })
  })
}
