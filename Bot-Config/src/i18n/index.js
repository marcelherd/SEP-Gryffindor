import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: {
    core: {
      country: 'Germany'
    },
    menu: {
      btnAccount: 'Account',
      btnAdmin: 'Admin',
      btnLogout: 'Log out'
    },
    login: {
      lblUsername: 'Username',
      lblPassword: 'Password',
      btnLogin: 'Login'
    },
    overview: {
      lblPageTitle: 'Overview',
      lblPageTitleUser: 'Overview for user {user}',
      lblBorn: 'Born',
      lblAwake: 'awake since',
      lblAsleep: 'asleep since',
      lblNeverRan: 'Bot has never ran',
      lblIntroduction: 'Hi! I\'m {name} the {template}!',
      lblConversations: 'I had {conversations} conversations so far',
      lblForwards: 'And forwarded {forwards} times',
      btnEdit: 'Edit'
    },
    marketplace: {
      lblPageTitle: 'Select bot template'
    }
  },
  de: {
    core: {
      country: 'Deutschland'
    },
    menu: {
      btnAccount: 'Konto',
      btnAdmin: 'Admin',
      btnLogout: 'Ausloggen'
    },
    login: {
      lblUsername: 'Benutzername',
      lblPassword: 'Passwort',
      btnLogin: 'Einloggen'
    },
    overview: {
      lblPageTitle: 'Übersicht',
      lblPageTitleUser: 'Übersicht für den Benutzer {user}',
      lblBorn: 'Geboren am',
      lblAwake: 'wach seit',
      lblAsleep: 'schläft seit',
      lblNeverRan: 'Bot wurde noch nie gestartet',
      lblIntroduction: 'Hi! Ich bin {name} der {template}!',
      lblConversations: 'Ich hatte bisher {conversations} Konversationen',
      lblForwards: 'Und habe {forwards} mal weitergeleitet',
      btnEdit: 'Bearbeiten'
    },
    marketplace: {
      lblPageTitle: 'Wähle eine Bot Vorlage aus'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en',
  messages
})

export default i18n
