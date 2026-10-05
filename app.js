const app = document.querySelector('#app');
const STATS_KEY = 'moralstation-stats';
const defaultNames = ['Alex', 'Bela', 'Cem', 'Daria', 'Elif', 'Finn'];

const S = {
  names: [...defaultNames],
  roles: [],
  show: 0,
  task: 0,
  score: 0,
  time: 0,
  timer: null,
  agentIndex: null,
  stats: loadStats()
};

const missions = [
  {
    room: 'Archiv',
    icon: '▤',
    title: 'Wer hat „gut“ erfunden?',
    prompt: 'Welche Frage stellt Nietzsches genealogische Methode?',
    choices: [
      'Welche Werte sind für alle Zeiten mathematisch beweisbar?',
      'Unter welchen historischen Bedingungen und Interessen entstanden unsere Werturteile?',
      'Welche Person darf allein festlegen, was gut ist?'
    ],
    correct: 1,
    explain: 'Genealogie fragt nach Herkunft, Bedingungen und Interessen hinter Werturteilen. Moral wird dadurch historisch untersucht statt als selbstverständlich vorausgesetzt.'
  },
  {
    room: 'Wertelabor',
    icon: '◈',
    title: 'Zwei Wertetafeln',
    prompt: 'Welche Gegenüberstellung rekonstruiert Nietzsches erste Abhandlung?',
    choices: [
      'Vornehme Wertung: gut/schlecht; ressentimentgeprägte Wertung: gut/böse.',
      'Vornehme Wertung: wahr/falsch; ressentimentgeprägte Wertung: schön/hässlich.',
      'Beide Wertungen meinen dasselbe und unterscheiden sich nur im Namen.'
    ],
    correct: 0,
    explain: 'Nietzsche beschreibt zunächst eine bejahende Wertsetzung „gut/schlecht“ und kontrastiert sie mit der reaktiven Umwertung „gut/böse“. Das rekonstruiert seine These, ohne sie als heutiges Urteil zu übernehmen.'
  },
  {
    room: 'Gedächtniskammer',
    icon: '⌁',
    title: 'Die Spur der Schuld',
    prompt: 'Welche Deutung entwickelt Nietzsche in der zweiten Abhandlung?',
    choices: [
      'Schuldgefühle sind angeboren und haben keine Geschichte.',
      'Er deutet Schuld zunächst über das Verhältnis von Gläubiger und Schuldner und verfolgt die Verinnerlichung von Trieben.',
      'Schuld entstand erst mit modernen Schulgesetzen.'
    ],
    correct: 1,
    explain: 'Nietzsche verbindet „Schuld“ zunächst mit dem Schuldverhältnis und beschreibt, wie ungelebte Triebe nach innen gelenkt werden. Das ist seine Genealogie, keine unstrittige historische Tatsache.'
  },
  {
    room: 'Beobachtungsdeck',
    icon: '⌕',
    title: 'Der kritische Scan',
    prompt: 'Welche Rückfrage prüft Nietzsches Argument philosophisch am stärksten?',
    choices: [
      'Ist seine historische Erzählung ausreichend belegt – und folgt aus der Herkunft eines Wertes schon, dass er ungültig ist?',
      'Ist ein Wert falsch, sobald Nietzsche ihn kritisiert?',
      'Sollten historische Texte grundsätzlich nicht hinterfragt werden?'
    ],
    correct: 0,
    explain: 'Eine Herkunftserklärung widerlegt einen Wert nicht automatisch. Zu prüfen sind sowohl Nietzsches historische Belege als auch der Übergang von der Entstehung eines Wertes zu seiner Bewertung.'
  }
];

function emptyStats() {
  return { games: 0, correct: 0, caught: 0, escaped: 0 };
}

function loadStats() {
  try {
    const value = JSON.parse(localStorage.getItem(STATS_KEY));
    return {
      games: Number(value?.games) || 0,
      correct: Number(value?.correct) || 0,
      caught: Number(value?.caught) || 0,
      escaped: Number(value?.escaped) || 0
    };
  } catch {
    return emptyStats();
  }
}

function saveStats() {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(S.stats));
  } catch {
    // The game still works when browser storage is disabled.
  }
}

function view(html) {
  app.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function crewMemberMarkup(color = 'red', size = '') {
  return `<span class="crewmate ${size} ${color}" aria-hidden="true"><span class="visor"></span><span class="pack"></span></span>`;
}

function home() {
  clearInterval(S.timer);
  S.stats = loadStats();
  const played = S.stats.games;
  const average = played ? Math.round((S.stats.correct / (played * missions.length)) * 100) : 0;
  view(`
    <section class="home-screen">
      <header class="sitebar">
        <a class="wordmark" href="#" onclick="home(); return false;" aria-label="Zur Startseite">
          ${crewMemberMarkup('red', 'tiny')} <span>MORAL<span class="wordmark-light">STATION</span></span>
        </a>
        <span class="class-chip"><span class="status-dot"></span> PHILOSOPHIE · EF NRW</span>
      </header>

      <div class="hero-layout">
        <div class="hero-copy">
          <p class="eyebrow"><span class="status-dot"></span> EIN KLASSENRAUM-SOCIAL-DEDUCTION-SPIEL</p>
          <h1>Eine Crew.<br><span class="highlight">Ein Saboteur.</span><br>Vier Aufgaben.</h1>
          <p class="hero-description">Die Moralstation braucht ein Update. Rekonstruiert Nietzsches Genealogie der Moral, löst die philosophischen Aufgaben – und findet heraus, wer die Diskussion sabotiert.</p>
          <div class="hero-actions">
            <button class="button button-primary" onclick="setup()">Crew zusammenstellen <span aria-hidden="true">→</span></button>
            <button class="button button-quiet" onclick="teacher()">Lehrkraft-Info</button>
          </div>
          <div class="promise-row"><span>◉ Ein Gerät, sechs Spielende</span><span>◉ Offline spielbar</span><span>◉ Keine Anmeldung</span></div>
        </div>
        <div class="station-art" aria-label="Originale Crewfigur vor dem Sternenhimmel">
          <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
          <span class="star star-one"></span><span class="star star-two"></span><span class="star star-three"></span><span class="star star-four"></span>
          <div class="art-label label-top">MORALSTATION // GEN-1887</div>
          <div class="hero-crewmate">${crewMemberMarkup('red', 'large')}<span class="shadow"></span></div>
          <div class="art-label label-bottom"><span class="status-dot"></span> SYSTEM BEREIT</div>
        </div>
      </div>

      <section class="brief-strip" aria-label="Spielübersicht">
        <div><span class="brief-number">01</span><span><b>Verdeckte Rollen</b><small>Wer ist der Saboteur?</small></span></div>
        <div><span class="brief-number">04</span><span><b>Philosophie-Aufgaben</b><small>Erst diskutieren, dann lösen</small></span></div>
        <div><span class="brief-number">01</span><span><b>Notfallmeeting</b><small>Verdacht mit Gründen belegen</small></span></div>
      </section>
      <footer class="home-footer"><span>Ein eigenständiges Unterrichtsspiel im Weltraum-Social-Deduction-Genre.</span><span>${played} ${played === 1 ? 'Runde' : 'Runden'} gespielt · ${average}% Aufgabenquote</span></footer>
    </section>
  `);
}

function setup() {
  view(`
    <section class="panel setup-panel">
      <header class="screen-heading">
        <p class="eyebrow">01 / CREW-REGISTRIERUNG</p>
        <h2>Wer geht an Bord?</h2>
        <p>Verwendet Codenamen statt echter Namen. Danach wird das Gerät verdeckt herumgereicht.</p>
      </header>
      <div class="crew-form">
        ${S.names.map((name, index) => `
          <label class="name-field">
            <span class="player-number">${String(index + 1).padStart(2, '0')}</span>
            <input class="nameinput" aria-label="Codename ${index + 1}" maxlength="20" value="${esc(name)}" oninput="S.names[${index}]=this.value">
          </label>
        `).join('')}
      </div>
      <div class="notice"><span class="notice-icon">i</span><span>Alle sechs Personen spielen mit. Eine Person erhält heimlich die Saboteur-Rolle.</span></div>
      <div class="button-row">
        <button class="button button-primary" onclick="deal()">Rollen auslosen <span aria-hidden="true">→</span></button>
        <button class="button button-quiet" onclick="home()">Zurück</button>
      </div>
    </section>
  `);
}

function deal() {
  S.names = S.names.map((name, index) => name.trim() || `Crew ${index + 1}`);
  S.agentIndex = Math.floor(Math.random() * S.names.length);
  S.roles = S.names.map((_, index) => index === S.agentIndex ? 'Saboteur' : 'Crew');
  S.show = 0;
  S.task = 0;
  S.score = 0;
  passCard();
}

function passCard() {
  const colors = ['red', 'blue', 'yellow', 'green', 'pink', 'orange'];
  view(`
    <section class="panel pass-panel">
      <p class="eyebrow">GEHEIME ROLLENVERTEILUNG</p>
      <div class="handoff-icon">${crewMemberMarkup(colors[S.show % colors.length])}</div>
      <p class="pass-count">ÜBERGABE ${S.show + 1} / ${S.names.length}</p>
      <h2>Gerät an<br><span class="highlight">${esc(S.names[S.show])}</span></h2>
      <p>Alle anderen bitte wegschauen. Rolle nur ansehen, wenn du das Gerät allein hältst.</p>
      <button class="button button-primary" onclick="revealRole()">Meine Rolle ansehen <span aria-hidden="true">→</span></button>
    </section>
  `);
}

function revealRole() {
  const isSaboteur = S.roles[S.show] === 'Saboteur';
  view(`
    <section class="panel role-panel ${isSaboteur ? 'role-saboteur' : 'role-crew'}">
      <p class="eyebrow">NUR FÜR ${esc(S.names[S.show])} · NICHT WEITERZEIGEN</p>
      <div class="role-icon">${crewMemberMarkup(isSaboteur ? 'red' : 'cyan', 'large')}</div>
      <span class="role-label">${isSaboteur ? 'GEHEIMROLLE' : 'DEINE ROLLE'}</span>
      <h2>${isSaboteur ? 'Saboteur' : 'Crewmitglied'}</h2>
      <p>${isSaboteur
        ? 'Lenke die Crew bei den philosophischen Aufgaben in die Irre. Bleib dabei plausibel: keine erfundenen Nietzsche-Zitate und keine persönlichen Angriffe.'
        : 'Löst die Aufgaben gemeinsam und begründet eure Antworten. Achtet auf vorschnelle Schlüsse und prüft, wer die Diskussion in eine falsche Richtung lenkt.'}</p>
      <button class="button button-primary" onclick="nextRole()">Rolle verbergen <span aria-hidden="true">→</span></button>
    </section>
  `);
}

function nextRole() {
  S.show += 1;
  if (S.show < S.names.length) passCard();
  else briefing();
}

function briefing() {
  view(`
    <section class="panel briefing-panel">
      <p class="eyebrow"><span class="status-dot"></span> BRIEFING · ALLE ROLLEN VERTEILT</p>
      <h2>Die Moralstation ist bereit.</h2>
      <p class="lead">Vier Aufgaben warten. Beratet euch vor jeder Antwort – und begründet eure Entscheidung mit Nietzsches Text und Argumenten.</p>
      <div class="task-route">
        ${missions.map((mission, index) => `<div class="route-stop"><span>${mission.icon}</span><small>0${index + 1}</small><b>${mission.room}</b></div>`).join('')}
      </div>
      <div class="notice notice-warn"><span class="notice-icon">!</span><span>Die Fachaufgaben zählen für den Crew-Score. Das Saboteur-Geheimnis wird erst nach dem Meeting aufgelöst.</span></div>
      <button class="button button-primary" onclick="startMission()">Aufgaben starten <span aria-hidden="true">→</span></button>
    </section>
  `);
}

function startMission() {
  S.time = 4 * 60;
  runTimer();
  renderMission();
}

function runTimer() {
  clearInterval(S.timer);
  S.timer = setInterval(() => {
    S.time = Math.max(0, S.time - 1);
    const timer = document.querySelector('.timer');
    if (timer) timer.textContent = fmt(S.time);
    if (S.time === 0) clearInterval(S.timer);
  }, 1000);
}

function routeMarkup() {
  return missions.map((mission, index) => {
    const state = index < S.task ? 'complete' : index === S.task ? 'active' : '';
    return `<span class="route-node ${state}" title="${esc(mission.room)}">${state === 'complete' ? '✓' : String(index + 1).padStart(2, '0')}</span>`;
  }).join('');
}

function renderMission() {
  const mission = missions[S.task];
  view(`
    <section class="panel mission-panel">
      <div class="mission-topline"><span class="eyebrow">CREW-AUFGABE ${String(S.task + 1).padStart(2, '0')} / 04</span><span class="timer">${fmt(S.time)}</span></div>
      <div class="route-progress" aria-label="Aufgabenfortschritt">${routeMarkup()}</div>
      <div class="room-card">
        <div class="room-icon">${mission.icon}</div>
        <div><span class="eyebrow">STATION-TERMINAL</span><h2>${esc(mission.room)}</h2></div>
        <span class="signal-bars" aria-hidden="true"><i></i><i></i><i></i></span>
      </div>
      <div class="mission-question">
        <span class="task-type">DATENPAKET ${String(S.task + 1).padStart(2, '0')}</span>
        <h3>${esc(mission.title)}</h3>
        <p>${esc(mission.prompt)}</p>
      </div>
      <div class="choices">
        ${mission.choices.map((choice, index) => `
          <button class="choice" onclick="answer(${index})"><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${esc(choice)}</span><span class="choice-arrow">↗</span></button>
        `).join('')}
      </div>
      <p class="discussion-tip"><span>◉</span> Diskutiert zuerst miteinander. Nennt einen Grund und einen möglichen Einwand.</p>
    </section>
  `);
}

function answer(index) {
  clearInterval(S.timer);
  const mission = missions[S.task];
  const correct = index === mission.correct;
  if (correct) S.score += 1;
  view(`
    <section class="panel result-panel ${correct ? 'success' : 'failure'}">
      <p class="eyebrow">${correct ? 'DATENPAKET ÜBERTRAGEN' : 'SIGNAL FEHLERHAFT'}</p>
      <div class="result-mark">${correct ? '✓' : '!'}</div>
      <h2>${correct ? 'Gute Rekonstruktion.' : 'Prüft die Spur noch einmal.'}</h2>
      <p class="explanation">${esc(mission.explain)}</p>
      <div class="reflection-card"><span class="eyebrow">KURZE SICHERUNG</span><p>Eine Person fasst Nietzsches These zusammen. Eine andere ergänzt eine kritische Rückfrage.</p></div>
      <button class="button button-primary" onclick="advance()">${S.task < missions.length - 1 ? 'Nächster Raum' : 'Zum Notfallmeeting'} <span aria-hidden="true">→</span></button>
    </section>
  `);
}

function advance() {
  S.task += 1;
  if (S.task < missions.length) {
    S.time = 4 * 60;
    runTimer();
    renderMission();
  } else {
    meeting();
  }
}

function meeting() {
  S.time = 5 * 60;
  runTimer();
  view(`
    <section class="panel meeting-panel">
      <div class="meeting-banner"><span class="alert-beacon"></span><span>NOTFALL-MEETING</span><span class="timer">${fmt(S.time)}</span></div>
      <div class="meeting-content">
        <p class="eyebrow">LETZTE ABSTIMMUNG</p>
        <h2>Wer sabotiert<br>die Diskussion?</h2>
        <p>Jede Person nennt einen Verdacht <b>und einen fachlichen Beleg</b>. Stimmt danach gemeinsam ab.</p>
        <div class="vote-grid">
          ${S.names.map((name, index) => `<button class="vote-card" onclick="finish(${index})"><span class="vote-avatar">${crewMemberMarkup(['red', 'blue', 'yellow', 'green', 'pink', 'orange'][index])}</span><span>${esc(name)}</span><span class="vote-arrow">→</span></button>`).join('')}
        </div>
        <p class="discussion-tip"><span>◉</span> Bewertet Beiträge und Argumente – nicht Persönlichkeit oder Lautstärke.</p>
      </div>
    </section>
  `);
}

function finish(vote) {
  clearInterval(S.timer);
  const caught = vote === S.agentIndex;
  S.stats.games += 1;
  S.stats.correct += S.score;
  S.stats[caught ? 'caught' : 'escaped'] += 1;
  saveStats();
  const average = Math.round(S.score / missions.length * 100);
  view(`
    <section class="panel summary-panel">
      <p class="eyebrow">RUNDE ABGESCHLOSSEN · ERGEBNIS</p>
      <div class="summary-heading">${crewMemberMarkup(caught ? 'green' : 'red', 'large')}<div><h2>${caught ? 'Saboteur enttarnt!' : 'Saboteur entkommen!'}</h2><p>${caught ? 'Die Crew hat richtig abgestimmt.' : 'Die Crew lag bei der Abstimmung daneben.'}</p></div></div>
      <div class="summary-grid">
        <div class="summary-stat"><span>Saboteur</span><b>${esc(S.names[S.agentIndex])}</b></div>
        <div class="summary-stat"><span>Aufgaben richtig</span><b>${S.score} / ${missions.length}</b></div>
        <div class="summary-stat"><span>Fach-Score</span><b>${average}%</b></div>
      </div>
      <div class="reflection-card exit-ticket"><span class="eyebrow">EXIT-TICKET · EF NRW</span><h3>Bevor ihr von Bord geht</h3><ol><li>Erkläre „Genealogie“ in einem Satz.</li><li>Beschreibe die Wertverschiebung „gut/schlecht“ zu „gut/böse“.</li><li>Warum widerlegt die Herkunft eines Wertes ihn nicht automatisch?</li></ol></div>
      <div class="button-row"><button class="button button-primary" onclick="setup()">Neue Runde <span aria-hidden="true">→</span></button><button class="button button-quiet" onclick="home()">Zur Startseite</button></div>
    </section>
  `);
}

function teacher() {
  clearInterval(S.timer);
  view(`
    <section class="panel teacher-panel">
      <p class="eyebrow">LEHRKRAFT-MODUS · PHILOSOPHIE EF NRW</p>
      <h2>Unterricht mit Moralstation</h2>
      <p class="lead">Ein kooperatives Social-Deduction-Spiel zur textnahen Rekonstruktion und kritischen Prüfung von Nietzsches <i>Zur Genealogie der Moral</i>.</p>
      <div class="teacher-cards">
        <article class="teacher-card"><span class="teacher-icon">⌕</span><h3>Lernziele</h3><p>Die Lernenden rekonstruieren zentrale Gedanken der ersten und zweiten Abhandlung, analysieren die verwendeten Perspektiven und prüfen Nietzsches Argumentation.</p></article>
        <article class="teacher-card"><span class="teacher-icon">◈</span><h3>Kompetenzen</h3><p>Sachkompetenz: Positionen erschließen. Methodenkompetenz: Argumente analysieren. Urteilskompetenz: Tragfähigkeit und Grenzen beurteilen.</p></article>
        <article class="teacher-card"><span class="teacher-icon">⏱</span><h3>Ablauf · 45–60 Min.</h3><p>5 Min. Einstieg · 7 Min. Rollen · 20 Min. Aufgaben · 8 Min. Meeting · 10–20 Min. Textarbeit und Exit-Ticket.</p></article>
      </div>
      <div class="notice notice-warn"><span class="notice-icon">!</span><span><b>Didaktischer Hinweis:</b> Nietzsches Begriffe wie „Herren-“ und „Sklavenmoral“ als Gegenstand seiner Diagnose behandeln, nicht als Etiketten für Lernende. Genese ist nicht gleich Geltung. Ergebnisse an Textstellen rückbinden.</span></div>
      <p class="teacher-small">Die App funktioniert als Pass-and-play-Spiel auf einem Gerät. Sie ersetzt weder die Lektüre noch die gemeinsame Auswertung. Die Inhalte sind eigenständige Unterrichtsmaterialien und keine offiziellen Spielgrafiken oder -inhalte.</p>
      <button class="button button-primary" onclick="home()">Zur Startseite <span aria-hidden="true">→</span></button>
    </section>
  `);
}

function fmt(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

home();
