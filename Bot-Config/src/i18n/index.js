import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: {
    core: {
      country: 'Germany'
    },
    login: {
      lblUsername: 'Username',
      lblPassword: 'Password',
      btnLogin: 'Login'
    }
  },
  de: {
    core: {
      country: 'Deutschland'
    },
    login: {
      lblUsername: 'Benutzername',
      lblPassword: 'Passwort',
      btnLogin: 'Einloggen'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en',
  messages
})

export default i18n
