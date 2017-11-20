# Bot-Runtime

**Beschreibung:**
Laufzeitumgebung um Bots zu erstellen, löschen und verwalten.

**Ordnerstruktur:**

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
