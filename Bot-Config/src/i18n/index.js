import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: {
    core: {
      country: 'Germany',
      yes: 'Yes',
      no: 'No'
    },
    shared: {
      lblBotConfiguration: 'Bot configuration',
      lblDialogueConfiguration: 'Dialogue configuration',
      btnEdit: 'Edit',
      btnSave: 'Save'
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
      lblNoBots: 'Looks like you have not created any bots yet.',
      btnGetStarted: 'Get started now'
    },
    marketplace: {
      lblPageTitle: 'Select bot template'
    },
    account: {
      lblPageTitle: 'Account details',
      phProductionId: 'Brand ID for production',
      phStagingId: 'Brand ID for staging'
    },
    admin: {
      lblPageTitle: 'Administration',
      lblManageBots: 'Manage bots',
      colUsername: 'Username',
      colAdmin: 'Administrator',
      colActions: 'Actions'
    }
  },
  de: {
    core: {
      country: 'Deutschland',
      yes: 'Ja',
      no: 'Nein'
    },
    shared: {
      lblBotConfiguration: 'Bot Konfiguration',
      lblDialogueConfiguration: 'Dialog Konfiguration',
      btnEdit: 'Bearbeiten',
      btnSave: 'Speichern'
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
      lblNoBots: 'Scheinbar hast du noch gar keine Bots erstellt.',
      btnGetStarted: 'Erstelle jetzt deinen ersten Bot'
    },
    marketplace: {
      lblPageTitle: 'Wähle eine Bot Vorlage aus'
    },
    account: {
      lblPageTitle: 'Konto Details',
      phProductionId: 'Brand ID für die Produktion',
      phStagingId: 'Brand ID für die Testumgebung'
    },
    admin: {
      lblPageTitle: 'Administration',
      lblManageBots: 'Bots verwalten',
      colUsername: 'Benutzername',
      colAdmin: 'Administrator',
      colActions: 'Aktionen'
    },
    botEdit: {
      lblIfUserSays: 'Wenn der Kunde etwas sagt wie',
      lblReplyWith: 'Dann antworte mit',
      phName: 'Name',
      phGreeting: 'Begrüßung',
      phQuestion: 'Frage',
      phUtterance: 'Aussage',
      phTextInput: 'Text',
      phLinkInput: 'Link',
      phSkillInput: 'Skill',
      btnSaveBot: 'Bot speichern',
      btnDeleteBot: 'Bot löschen',
      btnSaveIntent: 'Absicht speichern',
      btnDeleteIntent: 'Absicht löschen'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en',
  messages
})

export default i18n
