# SEP-Gryffindor

| Vorname | Nachname | Matrikelnummer
| ------ | ------ | ------ |
| Björn	| Nehmert	| 	1515343
| Daniel	| Eggert| 		1513511
| Dario	| Capuana	| 	1613518
| Felix	| Navas	| 	1412100
| Simon	| Schwarz	| 	1521554
| Marcel| 	Herd	| 	1527440
| Gordon| Shumway |


# Bot Config

**Beschreibung:**
Webbasiertes User Interface um Bot zu erstellen und verwalten

**OrdnerStruktur:**

    ├── build                   # Autogeneriert
    ├── config                  # Autogeneriert
    ├── src                     # Wichtige Dateien an denen gearbeitet wird
    │   ├── components 
    │   |   ├── Layout                     # Darstellung unf Funktionen der Benutzeroberfläche
    │   |   |   ├── PageContent.vue                 # Inhalt der Sidebar
    │   |   |   └── Sidebar.vue                     # Aufbau der Sidebar
    │   |   ├── Create.vue                 # Sendet Bot zum Speichern an Server
    │   |   ├── Edit.vue                   # Bearbeiten eines Existieren Bots
    │   |   ├── Index.vue                  # Startseite der Konfiguraitonsumgebung
    │   |   ├── Overwiew.vue               # Auflisten/Statusabfrage/Löschen/Start/Stop Bots
    │   |   ├── TemplateSelection.vue      # Auflisten der Bot Templates
    │   |   ├── Tree.vue                   # Implementierung Baumstruktur für Botkonfiguration
    │   |   └── treeItem.vue               # Darstellung Baumstruktur für Botkonfiguraiton
    │   ├── router
    │   |   └──  index.js                  # Verwaltung der Routen zum Backend   
    │   ├── store                   # Ablage für Vue.js Anwendungen
    │   |   ├── actions.js                 #  
    │   |   ├── getters.js                 #
    │   |   ├── index.js                   #
    │   |   ├── mutation-types.js          # 
    │   |   └── mutations.js               #
    │   └── main.js              
    ├── static                  # statische Dateien (Logo)
    ├── test/unit               # Autogenerierte tests
    └── README.md               # Anleitung Bot Config Starten mit npm


# Bot-Marketplace

**Beschreibung:**
Bereitstellung mehrerer Bot-Templates in einer Art Marktplatz. 
Je nach Auswhal wird ein anderer Bot erstellt

**OrdnerStruktur:**

    ├── FAQ-Bot                  # Bot welcher allgemeine Fragen beantworten soll
    ├── Hello-World-Bot          # Bot welcher begrüßt
    │   └── index.js                      #Implementierung Hello World Bot
    ├── Welcome-Bot              # Bot welche begrüßt, Fragen weiterleitet und zuordnet
    ├── app.js                   # Startet Server, Stellt Bot Templates zur Verfügung
    ├── package-lock.json        # Autogenerierte Abhängigkeiten
    └── package.json             # Allgemeine Infos zum Programm


# Bot-Runtime

**Beschreibung:**
Laufzeitumgebung um Bots zu erstellen, löschen und verwalten.

**OrdnerStruktur:**

    ├── controllers              # Enthält middleware für Anfragen an die Runtime
    │   ├── AuthController.js                # Authentifizierungsmiddleware
    │   └── ManageController.js              # Middleware um mit Bots zu interagieren
    ├── routes                   
    │   └── manages.js                       # Verwaltung der Routen zum Frontend
    ├── services                 
    │   └── Botservice.js                    # Interkation mit persistenten Bots
    ├── .editorconfig            # EsLint Konfiguraitonsdatei Abstände 
    ├── .eslintignore            # EsLint Ignoredatei
    ├── .eslintrc.json           # EsLint Konfigurationsdatei Regeln (airbnb styleguide)
    ├── .gitattributes
    ├── chache.js                # Dient zum Speichern von Objekten im Cache. Initialisiert 2 Anfangsbots
    ├── config.js                # Konfiguriert die Express app
    └── index.js                 # Initialisiert Bot-Runtime Server
    
