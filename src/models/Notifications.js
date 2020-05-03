const EventEmitter = require('events').EventEmitter
const { Schema } = require('mongoose')

const NotificationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  listingId: String,
  isUnseen: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: true }
})

// This emitter is triggered when you call
// const user = UserModel.findById(id)
// user.notifications.push(notif)
// user.save()
const notifEmitter = new EventEmitter()

NotificationSchema.pre('save', function (next) {
  if (this.isNew) {
    console.log('[NotificationSchema:save]', 'This notif saved to', this.parent()._id)
    console.log(notifEmitter)
    notifEmitter.emit('newNotif', this, this.parent()._id)
  }
  next()
})

module.exports = { NotificationSchema, notifEmitter }
