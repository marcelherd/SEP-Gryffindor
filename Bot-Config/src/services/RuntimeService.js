import config from '@/services/config'

const URL = `http://${config.server}:3000/api/v1/manage/users/`

export default {

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

  findUserById (userId) {
    return fetch(URL + userId, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    .then(response => response.json())
  },

  findAllUsers () {
    return fetch(URL, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    .then(response => response.json())
  },

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

    return fetch(request)
  },

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

  findBotsByUser (userId) {
    return fetch(`${URL + userId}/bots`, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    }).then(response => response.json())
  },

  findBotById (userId, botId) {
    return fetch(`${URL + userId}/bots/${botId}`, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    }).then(response => response.json())
  },

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
  }

}
