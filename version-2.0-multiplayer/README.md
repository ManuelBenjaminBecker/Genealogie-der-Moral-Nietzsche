# Moralstation 2.0 Multiplayer

Die Spielenden verbinden sich mit ihren eigenen iPads über einen Einladungslink und einen fünfstelligen Lobby-Code. Der Host spielt mit und bekommt wie alle anderen eine geheime Rolle.

## Einmalige Einrichtung

GitHub Pages stellt die Website bereit. Damit mehrere Geräte denselben Spielstand sehen, braucht die Seite zusätzlich ein Firebase-Projekt. Firebase-Web-Konfigurationswerte sind für eine Browser-App sichtbar; Zugriff und Datenschutz werden durch die Datenbankregeln und anonyme Anmeldung begrenzt. Niemals einen Firebase-Admin-Schlüssel oder ein Service-Account-JSON in diese Website hochladen.

### 1. Firebase-Projekt erstellen

1. Öffne [Firebase Console](https://console.firebase.google.com/) und erstelle ein Projekt.
2. Füge dem Projekt eine **Web-App** hinzu.
3. Kopiere die angezeigte Firebase-Konfiguration. Du brauchst `apiKey`, `authDomain`, `projectId` und `appId`.

### 2. Anonyme Anmeldung aktivieren

1. Öffne im Firebase-Projekt **Authentication → Sign-in method**.
2. Aktiviere **Anonymous / Anonym** und speichere.

### 3. Realtime Database einrichten

1. Öffne **Build → Realtime Database → Create Database**. Eine europäische Region ist für eine NRW-Klasse sinnvoll.
2. Kopiere die Datenbank-URL aus der Konsole. Trage sie zusammen mit den Firebase-Werten in `firebase-config.js` ein. Die Datei liegt in diesem Ordner; ersetze alle noch vorhandenen `HIER_...`-Platzhalter.
3. Öffne den Tab **Rules** und ersetze die Regeln durch den gesamten Inhalt aus `database.rules.json`. Klicke **Publish**.

Die Regeln machen individuelle Ergebniswerte nur für die jeweilige Person und den Host lesbar; gespeichert wird lediglich, ob die jeweilige Antwort richtig war. Rollen sind nur für die jeweilige Person lesbar und werden erst nach Spielende für alle sichtbar. Nur der Host kann Rollen setzen und die Runde verwalten.

### 4. Auf GitHub Pages veröffentlichen

1. Übertrage den Ordner `version-2.0-multiplayer/` einschließlich der ausgefüllten `firebase-config.js` in den Branch `manuelbenjaminbecker-among-us-classroom-game`. Die Firebase-Web-Konfiguration darf im Frontend stehen; sie enthält keine Admin-Zugangsdaten.
2. Öffne im Repository **Settings → Pages** und prüfe **Deploy from a branch → `manuelbenjaminbecker-among-us-classroom-game` → `/(root)`**. Diese Repository-Einstellung ist derzeit bereits so gesetzt; normalerweise musst du nichts daran ändern.
3. Übertrage die Dateien in den veröffentlichten Branch und warte, bis GitHub Pages den neuen Stand ausgeliefert hat.
4. Öffne die neue Spielseite:

   `https://manuelbenjaminbecker.github.io/Genealogie-der-Moral-Nietzsche/version-2.0-multiplayer/`

Wenn die Seite nach der Veröffentlichung noch 404 liefert, prüfe unter **Settings → Pages**, ob weiterhin dieser Branch mit `/(root)` ausgewählt ist.

## Spielen

1. Der Host öffnet den Link, erstellt eine Lobby und wählt eine Spielerzahl von 3 bis 6.
2. In der Lobby kopiert der Host den Einladungslink oder teilt den fünfstelligen Code.
3. Die anderen Spielenden öffnen den Link auf ihren iPads und geben Namen sowie Code ein.
4. Der Host startet erst, wenn mindestens drei Personen in der Lobby sind. Der Host zählt als Spieler.
5. Jede Person sieht nur ihre eigene Rolle und beantwortet jede Frage auf dem eigenen Gerät. Nach jeder Frage diskutiert die Gruppe gemeinsam.
6. Mindestens zwei Drittel richtige Antworten geben eine Minute hinzu; andernfalls werden zwei Minuten abgezogen und die Frage bleibt offen.
7. Der Fake Newser gewinnt, wenn die Zeit abläuft oder mindestens vier verschiedene Fragen falsch beantwortet wurden. Die TruTalker gewinnen, wenn alle zehn Fragen richtig beantwortet sind.

Die 10-Minuten-Runde benötigt eine Internetverbindung. Beim Schließen der Host-Seite stoppt der Timer nicht, aber die Runde kann erst fortgesetzt werden, wenn der Host wieder verbunden ist.
