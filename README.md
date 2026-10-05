# Moralstation GEN-1887

Statische, iPad-taugliche Unterrichts-Webapp für eine EF-Philosophiestunde zu Friedrich Nietzsches *Zur Genealogie der Moral*. Für Gruppen mit genau 6 Personen, pass-and-play auf einem Gerät.

## Schnellstart

Alle vier Dateien in dasselbe GitHub-Repository legen. Dann unter **Settings > Pages** bei **Build and deployment** „Deploy from a branch“, Branch `main`, Ordner `/ (root)` wählen. Nach kurzer Zeit erscheint die öffentliche URL.

Lokal genügt das Öffnen von `index.html`. Es werden keine externen Dienste, Cookies, Accounts oder personenbezogenen Daten benötigt. Codenamen bleiben nur im Browser und werden nicht übertragen.

## Unterricht

- Dauer: 45 bis 60 Minuten
- Sozialform: Gruppen à 6, idealerweise ein iPad pro Gruppe
- Lernprodukt: Antworten auf vier Akten, begründete Verdachtsabstimmung, Exit-Ticket
- Inhalt: genealogische Methode; gut/schlecht und gut/böse; Schuld/Schuldner; Genese und Geltung
- Hinweis: Das Spiel ist eigenständig gestaltet und verwendet keine offiziellen Grafiken, Sounds oder Figuren eines kommerziellen Spiels.

## Anpassung

Aufgaben stehen in `app.js` im Array `missions`. Texte, Zeit (`4*60`) und Namen können dort direkt geändert werden.
