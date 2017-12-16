import config from '@/services/config'

const URL = `http://${config.server}:3000/api/v1/manage/users/`

/**
 * Credentials.
 *
 * @typedef {Object} Credentials
 * @property {string} username - the username
 * @property {string} password - the password
 */

/**
 * The Runtime service.
 * Provides functionality for accessing and interacting with the bot runtime.
 *
 * @author Marcel Herd
 * @module services/RuntimeService
 */
export default {
  /**
   * Tries to authenticate with the given credentials.
   * Returns a promise containing a token if successful, or an error message otherwise.
   *
   * @method authenticate
   * @param {Credentials} credentials - the credentials to authenticate with
   * @return {Promise} - a promise containing the response
   */
  authenticate (credentials) {
    let url = `http://${config.server}:3000/api/v1/authenticate`

    let payload = JSON.stringify(credentials)

    let headers = new Headers({ 'Content-Type': 'application/json' })
    let request = new Request(url, {
      method: 'POST',
      mode: 'cors',
      headers: headers,
      body: payload
    })

    return fetch(request).then(response => response.json())
  },

  /**
   * Finds the user with the given id.
   *
   * @method findUserById
   * @param {string} userId - the id to search with
   * @return {Promise} - a promise containing the response
   */
  findUserById (userId) {
    return fetch(URL + userId, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    .then(response => response.json())
  },

  /**
   * Finds all users.
   *
   * @method findAllUsers
   * @return {Promise} - a promise containing all users
   */
  findAllUsers () {
    return fetch(URL, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    .then(response => response.json())
  },

  /**
   * Saves the given user.
   *
   * @method saveUser
   * @param {Object} user - the user to save
   * @return {Promise} - a promise containing the response
   */
  saveUser (user) {
    return fetch(URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
  },

  /**
   * Updates the given user.
   *
   * @method updateUser
   * @param {Object} user - the user to update
   * @return {Promise} - a promise containing the response
   */
  updateUser (user) {
    let payload = JSON.stringify({
      brandId: user.brandId,
      stagingId: user.stagingId
    })

    let request = new Request(URL + user._id, {
      method: 'PATCH',
      mode: 'cors',
      body: payload,
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })

    return fetch(request).then(response => response.json())
  },

  /**
   * Deletes the user with the given id.
   *
   * @method deleteUser
   * @param {string} userId - the id of the user which is to be deleted
   * @return {Promise} - a promise containing the response
   */
  deleteUser (userId) {
    let request = new Request(URL + userId, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })

    return fetch(request)
  },

  /**
   * Finds all bots that belong to the user with the given id.
   *
   * @method findBotsByUser
   * @param {string} userId - the id of the user to which the bots belong
   * @return {Promise} - a promise containing the response
   */
  findBotsByUser (userId) {
    return fetch(`${URL + userId}/bots`, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    }).then(response => response.json())
  },

  /**
   * Finds the bot with the given id.
   *
   * @method findBotById
   * @param {string} userId - the id of the user to which the bot belongs
   * @param {string} botId - the id of the bot
   * @return {Promise} - a promise containing the response
   */
  findBotById (userId, botId) {
    return fetch(`${URL + userId}/bots/${botId}`, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    }).then(response => response.json())
  },

  /**
   * Deletes the bot with the given id.
   *
   * @method deleteBot
   * @param {string} userId - the id of the user to which the bot belongs
   * @param {string} botId - the id of the bot
   * @return {Promise} - a promise containing the response
   */
  deleteBot (userId, botId) {
    let request = new Request(`${URL + userId}/bots/${botId}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })

    return fetch(request).then(response => response.json())
  },

  /**
   * Saves the given bot.
   *
   * @method saveBot
   * @param {string} userId - the id of the user to which the bot will belong
   * @param {Object} bot - the bot that is to be saved
   * @return {Promise} - a promise containing the response
   */
  saveBot (userId, bot) {
    bot.template = bot.template.replace(' ', '-')

    let request = new Request(`${URL + userId}/bots/`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(bot),
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })

    return fetch(request).then(response => response.json())
  },

  /**
   * Updates the given bot.
   *
   * @method updateBot
   * @param {string} userId - the id of the user to which the bot belongs
   * @param {Object} bot - the updated bot
   * @return {Promise} - a promise containing the response
   */
  updateBot (userId, bot) {
    let payload = {
      name: bot.name,
      greeting: bot.greeting,
      environment: bot.environment,
      dialogTree: bot.dialogTree || {},
      intents: bot.intents || []
    }

    let request = new Request(`${URL + userId}/bots/${bot._id}`, {
      method: 'PATCH',
      mode: 'cors',
      body: JSON.stringify(payload),
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })

    return fetch(request).then(response => response.json())
  },

  /**
   * Toggles (starts/stops) the given bot.
   *
   * @param {string} userId - the id of the user to which the bot belongs
   * @param {Object} bot - the bot that is to be started/stopped
   * @return {Promise} - a promise containing the response
   */
  toggleBot (userId, bot) {
    let action = (bot.running ? 'stop' : 'start')
    let request = new Request(`${URL + userId}/bots/${bot._id}/${action}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })

    return fetch(request).then(response => response.json())
  }
}
