# Bot-Marketplace

**Beschreibung:**
Bereitstellung mehrerer Bot-Templates in einer Art Marktplatz.
Je nach Auswhal wird ein anderer Bot erstellt

**Ordnerstruktur:**

    ├── FAQ-Bot                  # Bot welcher allgemeine Fragen beantworten soll
    ├── Hello-World-Bot          # Bot welcher begrüßt
    │   └── index.js                      #Implementierung Hello World Bot
    ├── Welcome-Bot              # Bot welche begrüßt, Fragen weiterleitet und zuordnet
    ├── app.js                   # Startet Server, Stellt Bot Templates zur Verfügung
    ├── package-lock.json        # Autogenerierte Abhängigkeiten
    └── package.json             # Allgemeine Infos zum Programm
