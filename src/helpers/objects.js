/**
 * Checks wether object is empty (has no own properties).
 *
 * @param {Object} object Object to check.
 * @returns {Boolean} True if has no own properties
 */
const objectIsEmpty = (object) => {
  for (const prop in object) {
    if (Object.prototype.hasOwnProperty.call(object, prop)) {
      return false
    }
  }

  return true
}

/**
 * Copies specified fields from an object.
 *
 * @param {Object} object Object from which to get key/value-pairs.
 * @param {String} fields Space-separated list of field names (keys).
 * @returns {Object} Object with all wanted keys that had values.
 */
const getObjectFields = (object, fields) => {
  const gottenFields = {}

  for (const key in object) {
    if (object[key] !== undefined && fields.includes(key)) {
      gottenFields[key] = object[key]
    }
  }

  return gottenFields
}

module.exports = { objectIsEmpty, getObjectFields }
