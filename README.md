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
    │   |   ├── Layout                     # Komponenten die das Seitenlayout definieren
    │   |   |   ├── PageContent.vue                 # Wrapper Komponente für andere Komponente
    │   |   |   └── Sidebar.vue                     # Aufbau der Navigations Sidebar
    │   |   ├── Create.vue                 # Komponente um neue Bots zu erzeugen
    │   |   ├── Edit.vue                   # Bearbeiten eines Existieren Bots
    │   |   ├── Index.vue                  # Startseite der Konfiguraitonsumgebung
    │   |   ├── Overwiew.vue               # Auflisten/Statusabfrage/Löschen/Start/Stop Bots
    │   |   ├── TemplateSelection.vue      # Auflisten der Bot Templates
    │   |   ├── Tree.vue                   # Implementierung Baumstruktur für Botkonfiguration
    │   |   └── treeItem.vue               # Darstellung Baumstruktur für Botkonfiguraiton
    │   ├── router
    │   |   └──  index.js                  # Enthält alle Routen des Frontends 
    │   ├── store                   # Vuex Store um Daten zwischen Komponenten übertragen
    │   |   ├── actions.js                 #  Definiert die möglichen Aktionen auf dem Store
    │   |   ├── getters.js                 #  Definiert die Getter
    │   |   ├── index.js                   #  Erstellt den Vuex Store
    │   |   ├── mutation-types.js          #  Definiert die möglichen Mutationen
    │   |   └── mutations.js               #  Implementiert die möglichen möglcihen Mutationen des Vuex Store
    │   ├── App.vue                #  Bot Plattform User Interface  
    │   ├── config.js              # Konfigurationsumgebung Farben
    │   └── main.js                # Konfiguraitonsumgebung Layout
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
    
