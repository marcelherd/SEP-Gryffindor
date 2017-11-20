# Bot Config

**Beschreibung:**
Webbasiertes User Interface um Bot zu erstellen und verwalten

**Ordnerstruktur:**

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
