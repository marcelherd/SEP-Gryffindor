const URL = 'http://localhost:3000/api/v1/manage/users/'

export default {
  getAll () {
    return fetch(URL, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    .then(response => response.json())
  },

  save (user) {
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

  delete (user) {
    let request = new Request(URL + user._id, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })

    return fetch(request)
  }
}
