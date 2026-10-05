# Moralstation

Ein eigenständiges, offline spielbares Pass-and-play-Social-Deduction-Spiel für den Philosophieunterricht in der EF (NRW). Eine Crew löst vier Aufgaben zu Nietzsches *Zur Genealogie der Moral*, während ein Saboteur versucht, die Diskussion in die Irre zu lenken.

## Spielseite

Hauptversion:
https://manuelbenjaminbecker.github.io/Genealogie-der-Moral-Nietzsche/

Lobby-Version (3–6 Spieler mit Code):
https://manuelbenjaminbecker.github.io/Genealogie-der-Moral-Nietzsche/lobby-version/

> Hinweis: GitHub Pages veröffentlicht nur den Branch bzw. die Quelle, die in den Repository-Einstellungen für Pages konfiguriert ist. Wenn die Lobby-Version im Browser noch 404 liefert, muss der veröffentlichte Branch die Inhalte aus `lobby-version/` enthalten.

Version 2.0 Multiplayer (jedes iPad, gemeinsamer Echtzeitraum):
https://manuelbenjaminbecker.github.io/Genealogie-der-Moral-Nietzsche/version-2.0-multiplayer/

> Version 2.0 benötigt eine einmalige Firebase-Einrichtung. Die genaue Anleitung steht in `version-2.0-multiplayer/README.md`; GitHub Pages allein kann keine geräteübergreifenden Lobbys speichern.

## Spielen

`index.html` im Browser öffnen oder die statischen Dateien auf einem Webserver bereitstellen. Das Spiel braucht keine Installation und keinen Server. Auf einem Gerät werden sechs Rollen verdeckt nacheinander angezeigt; danach löst die Gruppe gemeinsam die Aufgaben und stimmt im Notfallmeeting ab.

Die Oberfläche ist für Tablets und Smartphones ausgelegt. Bei Bereitstellung über HTTPS oder localhost kann der Service Worker die App für die Offline-Nutzung zwischenspeichern.

## Unterrichtsidee

Die vier Aufgaben thematisieren genealogisches Fragen, die Wertgegensätze „gut/schlecht“ und „gut/böse“, Nietzsches Deutung von Schuld und schlechtem Gewissen sowie die kritische Prüfung seiner Methode. Die Quizantworten sind als Rekonstruktion von Nietzsches Argumenten gedacht, nicht als Zustimmung. Für die Auswertung sollten die Lernenden ihre Antworten an Textstellen prüfen und zwischen Genese und Geltung unterscheiden.

Vorgesehene Dauer: etwa 45–60 Minuten inklusive Einstieg, Diskussion und Exit-Ticket. Der Lehrkraft-Modus enthält Lernziele, Kompetenzbezug und einen Ablaufvorschlag.

Die App speichert ausschließlich eine anonyme Spielstatistik lokal im Browser. Codenamen werden nicht dauerhaft gespeichert; für den Unterricht sollten keine Klarnamen verwendet werden.
