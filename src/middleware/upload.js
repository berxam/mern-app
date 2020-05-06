const { resolve } = require('path')
const multer = require('multer')
const { cwebp } = require('webp-converter')

const UPLOADS_DIR = resolve(__dirname, '../../uploads')
const TMP_DIR = resolve(UPLOADS_DIR, './tmp')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TMP_DIR)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

/**
 * @returns {String} Time based, filename appropriate, unique string
 */
const dateString = () => (
  new Date().toISOString().replace(/:/g, '.')
)

/**
 * Replaces or adds an extension to a filename.
 *
 * @param {String} filename Name of the file (with or without extension)
 * @param {String} ext Extension to apply
 */
const replaceExtension = (filename, ext) => {
  const extPos = filename.lastIndexOf('.')
  const strEnd = extPos < 0 ? filename.length : extPos
  const name = filename.substr(0, strEnd)

  return name + '.' + ext
}

/**
 * Converts images to WebP and saves them to UPLOADS_DIR.
 *
 * @param {Array} images Image information objects from multer
 * @param {String} hostURL Requests host URL for linking to server uploads
 */
const saveImages = (images, hostURL = '') => {
  const URLs = []

  images.forEach(file => {
    const { filename, path } = file
    const newName = dateString() + replaceExtension(filename, 'webp')
    const dest = resolve(UPLOADS_DIR, newName)

    URLs.push(new Promise((resolve, reject) => {
      cwebp(path, dest, '-q 70', (status, error) => {
        if (error) return reject(error)
        resolve(hostURL + '/uploads/' + newName)
      })
    }))
  })

  return Promise.all(URLs)
}

module.exports = {
  upload: multer({ storage }),
  saveImages
}
