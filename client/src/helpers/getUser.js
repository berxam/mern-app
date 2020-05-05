/**
 * Gets user from localStorage.
 *
 * @returns {Object|null} User if found, null otherwise
 */
export default () => {
  let user = localStorage.getItem('jid')

  if (user !== null) {
    try {
      user = JSON.parse(user)
    } catch (error) {
      console.error("Can't parse userdata from localStorage. Log out and log back in to store valid userdata.")
      user = null
    }
  }

  return user
}
