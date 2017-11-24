import config from '@/services/config.js'

const URL = `http://${config.server}:4000/api/v1/discover/`

export default {
  getTemplates () {
    return fetch(URL).then(response => response.json())
  }
}
