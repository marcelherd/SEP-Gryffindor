import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: {
    core: {
      country: 'Germany',
      username: 'Username',
      password: 'Password',
      yes: 'Yes',
      no: 'No',
      unknownError: 'An unknown error has occured.',
      confirmation: 'Are you sure?'
    },
    shared: {
      lblBotConfiguration: 'Bot configuration',
      lblDialogueConfiguration: 'Dialogue configuration',
      phName: 'Name',
      phGreeting: 'Greeting',
      phProductionId: 'Brand ID for production',
      phStagingId: 'Brand ID for staging',
      btnEdit: 'Edit',
      btnSave: 'Save',
      btnBack: 'Back'
    },
    menu: {
      btnAccount: 'Account',
      btnAdmin: 'Administration',
      btnLogout: 'Log out'
    },
    login: {
      btnLogin: 'Login'
    },
    overview: {
      lblPageTitle: 'Overview',
      lblPageTitleUser: 'Overview for user {user}',
      lblBorn: 'Born',
      lblAwake: 'awake since',
      lblAsleep: 'asleep since',
      lblNeverRan: 'Bot has never run',
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
      lblPageTitle: 'Account details'
    },
    admin: {
      lblPageTitle: 'Administration',
      lblManageBots: 'Manage bots',
      colUsername: 'Username',
      colAdmin: 'Administrator',
      colActions: 'Actions'
    },
    userCreate: {
      lblPageTitle: 'New user',
      lblAccountDetails: 'Account details'
    },
    botEdit: {
      lblIfUserSays: 'If user says something like',
      lblReplyWith: 'Then reply with',
      lblCurrentlyTesting: 'Please wait while the bot is being trained',
      lblTargetEnvironment: 'Target environment',
      phQuestion: 'Question',
      phUtterance: 'Utterance',
      phTextInput: 'Text',
      phLinkInput: 'Link',
      phSkillInput: 'Skill',
      btnSaveBot: 'Save bot',
      btnDeleteBot: 'Delete bot',
      btnSaveIntent: 'Save intent',
      btnDeleteIntent: 'Delete intent',
      btnTesting: 'Test your bot',
      infoBotSaved: 'Bot saved',
      confirmIntentDelete: 'Do you really want to delete this intent?',
      confirmBotDelete: 'Do you really want to delete this bot?'
    },
    botCreate: {
      lblPageTitle: 'Bot details',
      lblHeader: 'Create the {template}',
      lblProfilePicture: 'Profile picture'
    },
    testing: {
      lblPageTitle: 'Testing {name}',
      lblOnline: 'Online now',
      phInput: 'Type here...'
    }
  },
  de: {
    core: {
      country: 'Deutschland',
      username: 'Benutzername',
      password: 'Passwort',
      yes: 'Ja',
      no: 'Nein',
      unknownError: 'Ein unerwarteter Fehler ist aufgetreten.',
      confirmation: 'Bist du sicher?'
    },
    shared: {
      lblBotConfiguration: 'Bot Konfiguration',
      lblDialogueConfiguration: 'Dialog Konfiguration',
      phName: 'Name',
      phGreeting: 'Begrüßung',
      phProductionId: 'Brand ID für die Produktion',
      phStagingId: 'Brand ID für die Testumgebung',
      btnEdit: 'Bearbeiten',
      btnSave: 'Speichern',
      btnBack: 'Zurück'
    },
    menu: {
      btnAccount: 'Konto',
      btnAdmin: 'Administration',
      btnLogout: 'Ausloggen'
    },
    login: {
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
      lblPageTitle: 'Konto Details'
    },
    admin: {
      lblPageTitle: 'Administration',
      lblManageBots: 'Bots verwalten',
      colAdmin: 'Administrator',
      colActions: 'Aktionen'
    },
    userCreate: {
      lblPageTitle: 'Neuer Benutzer',
      lblAccountDetails: 'Konto Details'
    },
    botEdit: {
      lblIfUserSays: 'Wenn der Kunde etwas sagt wie',
      lblReplyWith: 'Dann antworte mit',
      lblCurrentlyTesting: 'Bitte warten Sie, während der Bot trainiert wird',
      lblTargetEnvironment: 'Zielumgebung',
      phQuestion: 'Frage',
      phUtterance: 'Aussage',
      phTextInput: 'Text',
      phLinkInput: 'Link',
      phSkillInput: 'Weiterleitung',
      btnSaveBot: 'Bot speichern',
      btnDeleteBot: 'Bot löschen',
      btnSaveIntent: 'Absicht speichern',
      btnDeleteIntent: 'Absicht löschen',
      btnTesting: 'Probiere deinen Bot aus',
      infoBotSaved: 'Bot wurde gespeichert',
      confirmIntentDelete: 'Willst du diese Absicht wirklich löschen?',
      confirmBotDelete: 'Willst du diesen Bot wirklich löschen?'
    },
    botCreate: {
      lblPageTitle: 'Bot Details',
      lblHeader: 'Erstelle den {template}',
      lblProfilePicture: 'Profilbild'
    },
    testing: {
      lblPageTitle: 'Teste {name}',
      lblOnline: 'Jetzt online',
      phInput: 'Hier schreiben...'
    }
  },
  fr: {
    core: {
      country: 'Allemagne',
      username: 'Nom d\'utilisateur',
      password: 'Mot de passe',
      yes: 'Oui',
      no: 'Non',
      unknownError: 'Une erreur inconnue est survenue.',
      confirmation: 'Est-ce que tu es sûr?'
    },
    shared: {
      lblBotConfiguration: 'Configuration du bot',
      lblDialogueConfiguration: 'Configuration du dialogue',
      phName: 'Nom',
      phGreeting: 'Salutation',
      phProductionId: 'Brand ID pour la production',
      phStagingId: 'Brand ID pour l\'environnement du test',
      btnEdit: 'Éditer',
      btnSave: 'Sauvegarder',
      btnBack: 'Retour'
    },
    menu: {
      btnAccount: 'Compte',
      btnAdmin: 'L\'administration',
      btnLogout: 'Déconnexion'
    },
    login: {
      btnLogin: 'Connexion'
    },
    overview: {
      lblPageTitle: 'Vue d\'ensemble',
      lblPageTitleUser: 'Vue d\'ensemble pour l\'utilisateur {user}',
      lblBorn: 'Né',
      lblAwake: 'Actif depuis',
      lblAsleep: 'Inactif depuis',
      lblNeverRan: 'Le bot ne s\'est jamais lancé',
      lblIntroduction: 'Salut! Je suis {name} le {template}!',
      lblConversations: 'J\'ai déja eu {conversations} conversations',
      lblForwards: 'Et j\'ai transféré {forwards} fois',
      lblNoBots: 'Il semblerait que tu n\'aies pas crée de bots pour le moment.',
      btnGetStarted: 'Créer ton premier bot'
    },
    marketplace: {
      lblPageTitle: 'Choisir un type de Bot '
    },
    account: {
      lblPageTitle: 'Détails du compte'
    },
    admin: {
      lblPageTitle: 'L\'administration',
      lblManageBots: 'Gérer les bots',
      colAdmin: 'L\'administrateur',
      colActions: 'Les actions'
    },
    userCreate: {
      lblPageTitle: 'Nouvel utilisateur',
      lblAccountDetails: 'Détails sur la compte'
    },
    botEdit: {
      lblIfUserSays: 'Si le client dit quelque chose comme ',
      lblReplyWith: 'Alors réponds par',
      lblCurrentlyTesting: 'Patientes s\'il te plaît pendant le bot est s\'entrainé ',
      lblTargetEnvironment: 'Environnement ciblé',
      phQuestion: 'Question',
      phUtterance: 'Déclaration',
      phTextInput: 'Texte',
      phLinkInput: 'Lien',
      phSkillInput: 'Transfert',
      btnSaveBot: 'Sauvegarder le bot',
      btnDeleteBot: 'Effacer le Bot',
      btnSaveIntent: 'Sauvegarder l\'intention',
      btnDeleteIntent: 'Effacer l\'intention',
      btnTesting: 'Teste ton bot',
      infoBotSaved: 'Bot sauvegardé',
      confirmIntentDelete: 'Est-ce que tu es sûr de vouloir supprimer cette intention?',
      confirmBotDelete: 'Est-ce que tu es sûr de vouloir supprimer ce bot?'
    },
    botCreate: {
      lblPageTitle: 'Détails sur les bots',
      lblHeader: 'Créer un {template}',
      lblProfilePicture: 'Photo de profil'
    },
    testing: {
      lblPageTitle: 'Teste {name}',
      lblOnline: 'en ligne maintenant',
      phInput: 'Écris ici...'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en',
  messages
})

export default i18n
