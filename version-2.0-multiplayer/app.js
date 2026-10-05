import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getDatabase,
  get,
  onValue,
  ref,
  remove,
  runTransaction,
  set,
  update
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

const app = document.querySelector('#app');
const roomPrefix = 'moralstation-v2';
const savedSessionKey = 'moralstation-v2-session';
const inviteCode = new URLSearchParams(location.search).get('room') || '';
const missions = [
  {
    room: 'Archiv',
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
    title: 'Zwei Wertetafeln',
    prompt: 'Welche Gegenüberstellung rekonstruiert Nietzsches erste Abhandlung?',
    choices: [
      'Vornehme Wertung: gut/schlecht; ressentimentgeprägte Wertung: gut/böse.',
      'Vornehme Wertung: wahr/falsch; ressentimentgeprägte Wertung: schön/hässlich.',
      'Beide Wertungen meinen dasselbe und unterscheiden sich nur im Namen.'
    ],
    correct: 0,
    explain: 'Nietzsche beschreibt zunächst eine bejahende Wertsetzung „gut/schlecht“ und kontrastiert sie mit der reaktiven Umwertung „gut/böse“.'
  },
  {
    room: 'Gedächtniskammer',
    title: 'Die Spur der Schuld',
    prompt: 'Welche Deutung entwickelt Nietzsche in der zweiten Abhandlung?',
    choices: [
      'Schuldgefühle sind angeboren und haben keine Geschichte.',
      'Er deutet Schuld zunächst über das Verhältnis von Gläubiger und Schuldner und verfolgt die Verinnerlichung von Trieben.',
      'Schuld entstand erst mit modernen Schulgesetzen.'
    ],
    correct: 1,
    explain: 'Nietzsche verbindet „Schuld“ zunächst mit dem Schuldverhältnis und beschreibt, wie ungelebte Triebe nach innen gelenkt werden.'
  },
  {
    room: 'Beobachtungsdeck',
    title: 'Der kritische Scan',
    prompt: 'Welche Rückfrage prüft Nietzsches Argument philosophisch am stärksten?',
    choices: [
      'Ist seine historische Erzählung ausreichend belegt – und folgt aus der Herkunft eines Wertes schon, dass er ungültig ist?',
      'Ist ein Wert falsch, sobald Nietzsche ihn kritisiert?',
      'Sollten historische Texte grundsätzlich nicht hinterfragt werden?'
    ],
    correct: 0,
    explain: 'Eine Herkunftserklärung widerlegt einen Wert nicht automatisch. Zu prüfen sind sowohl Nietzsches historische Belege als auch der Übergang von Entstehung zu Bewertung.'
  },
  {
    room: 'Moralcomputer',
    title: 'Die Herkunft des Sittlichen',
    prompt: 'Warum ist Nietzsches Analyse der Moral kein bloßes „Entlarven“?',
    choices: [
      'Weil sie historische Bedingungen sichtbar macht, ohne sofort jede Moral zu vernichten.',
      'Weil er ein neues Gesetzbuch für alle Menschen schreibt.',
      'Weil er nur die christliche Kirche kritisieren will.'
    ],
    correct: 0,
    explain: 'Die Genealogie zeigt Entstehung und Funktion, ohne einfach alle moralischen Praktiken zu verwerfen.'
  },
  {
    room: 'Leidensstation',
    title: 'Das schlechte Gewissen',
    prompt: 'Welche Deutung passt zu Nietzsches Analyse des schlechten Gewissens?',
    choices: [
      'Es ist ein angeborenes Gefühl, das immer dieselbe moralische Wahrheit anzeigt.',
      'Es hängt mit der Verinnerlichung von Trieben und sozialer Selbstkontrolle zusammen.',
      'Es ist eine rein religiöse Erfahrung ohne soziale Bedeutung.'
    ],
    correct: 1,
    explain: 'Nietzsche beschreibt das schlechte Gewissen als Folge der Verinnerlichung und Selbstdisziplinierung in einer Gesellschaft.'
  },
  {
    room: 'Streitfeld',
    title: 'Ressentiment',
    prompt: 'Was ist Ressentiment in Nietzsches Analyse?',
    choices: [
      'Eine reaktive Haltung, die fremde Macht moralisch abwertet und eigene Ohnmacht umdeutet.',
      'Eine Erkenntnis, die nur Dankbarkeit ausdrückt.',
      'Ein Gefühl ohne jede soziale oder historische Bedeutung.'
    ],
    correct: 0,
    explain: 'Ressentiment ist eine reaktive Haltung: Unvermögen oder Ohnmacht werden in eine moralische Abwertung der anderen umgedeutet.'
  },
  {
    room: 'Seelenlabor',
    title: 'Die Macht des Blicks',
    prompt: 'Warum ist die Perspektive bei Nietzsche entscheidend?',
    choices: [
      'Weil Wertungen aus bestimmten historischen und sozialen Perspektiven entstehen.',
      'Weil Philosophie nur aus der Sicht einer Person möglich ist.',
      'Weil Werte ausschließlich psychologisch erklärt werden können.'
    ],
    correct: 0,
    explain: 'Wertungen entstehen in Perspektiven und Kontexten. Das macht sie erklärungsbedürftig, aber nicht automatisch beliebig.'
  },
  {
    room: 'Kritikdeck',
    title: 'Genealogie und Geltung',
    prompt: 'Was folgt aus der Herkunft eines Wertes nicht automatisch?',
    choices: [
      'Dass seine Entstehung historisch untersucht werden kann.',
      'Dass er dadurch bereits ungültig ist.',
      'Dass Genese und Geltung unterschieden werden sollten.'
    ],
    correct: 1,
    explain: 'Aus der Entstehung eines Wertes folgt nicht automatisch dessen Unwertigkeit. Genese und Geltung müssen getrennt geprüft werden.'
  },
  {
    room: 'Zukunftsbrücke',
    title: 'Die Aufgabe der Kritik',
    prompt: 'Welche Haltung beschreibt Nietzsches kritische Philosophie am ehesten?',
    choices: [
      'Eine bloße Abwertung alles Vergangenen.',
      'Eine Analyse von Herkunft und Folgen der Werte mit Blick auf neue Möglichkeiten.',
      'Eine reine Beschreibung historischer Fakten ohne jede kritische Frage.'
    ],
    correct: 1,
    explain: 'Nietzsches Kritik untersucht Herkunft und Wirkung von Werten und fragt nach anderen Möglichkeiten der Wertbildung.'
  }
];

const state = {
  auth: null,
  db: null,
  uid: '',
  code: '',
  name: '',
  meta: null,
  players: {},
  role: '',
  submitted: {},
  message: '',
  messageType: '',
  unsubscribers: [],
  answerTurn: null,
  resolvedTurn: null,
  timer: null,
  timerBusy: false
};

function roomPath(path = '') {
  return `rooms/${state.code}${path ? `/${path}` : ''}`;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function showMessage(message, type = '') {
  state.message = message;
  state.messageType = type;
}

function clearListeners() {
  state.unsubscribers.forEach((unsubscribe) => unsubscribe());
  state.unsubscribers = [];
  state.answerTurn = null;
  clearInterval(state.timer);
  state.timer = null;
}

function header() {
  return `<header class="topbar"><span class="brand">MORALSTATION · 2.0 MULTIPLAYER</span>${state.code ? `<span class="room-chip">LOBBY ${esc(state.code)}</span>` : '<span class="room-chip">3–6 SPIELER</span>'}</header>`;
}

function messageMarkup() {
  return state.message ? `<div class="notice ${state.messageType}">${esc(state.message)}</div>` : '';
}

function renderHome() {
  clearListeners();
  state.code = '';
  app.innerHTML = `${header()}
    <section class="panel">
      <p class="eyebrow">EF NRW · NIETZSCHE</p>
      <h1>Eine Crew.<br><span style="color:var(--cyan)">Ein Fake Newser.</span></h1>
      <p class="lead">Jede Person spielt auf dem eigenen iPad. Erstellt eine Lobby oder tretet mit einem Code bei.</p>
      ${messageMarkup()}
      <div class="button-row">
        <button class="button button-primary" id="create-room">Lobby erstellen</button>
        <button class="button" id="join-screen">Mit Code beitreten</button>
      </div>
      <p class="small" style="margin:20px 0 0">Der Host ist selbst ein aktiver Spieler und erhält ebenfalls eine Rolle.</p>
    </section>`;
  document.querySelector('#create-room').addEventListener('click', renderCreate);
  document.querySelector('#join-screen').addEventListener('click', () => renderJoin(inviteCode));
}

function renderCreate() {
  app.innerHTML = `${header()}<section class="panel">
    <p class="eyebrow">NEUE LOBBY</p><h2>Lobby erstellen</h2>
    ${messageMarkup()}
    <label class="field">Dein Spielername<input class="input" id="player-name" maxlength="20" autocomplete="nickname" placeholder="z. B. Mila"></label>
    <label class="field">Spielerzahl<select class="input" id="target-count"><option>3</option><option selected>4</option><option>5</option><option>6</option></select></label>
    <div class="button-row"><button class="button button-primary" id="create-submit">Lobby erstellen und beitreten</button><button class="button" id="back">Zurück</button></div>
  </section>`;
  document.querySelector('#create-submit').addEventListener('click', createLobby);
  document.querySelector('#back').addEventListener('click', renderHome);
}

function renderJoin(code = '') {
  app.innerHTML = `${header()}<section class="panel">
    <p class="eyebrow">LOBBY BEITRETEN</p><h2>Code eingeben</h2>
    ${messageMarkup()}
    <label class="field">Lobby-Code<input class="input code-input" id="join-code" maxlength="5" autocomplete="off" value="${esc(code.toUpperCase())}" placeholder="AB12C"></label>
    <label class="field">Dein Spielername<input class="input" id="player-name" maxlength="20" autocomplete="nickname" placeholder="z. B. Finn"></label>
    <div class="button-row"><button class="button button-primary" id="join-submit">Beitreten</button><button class="button" id="back">Zurück</button></div>
  </section>`;
  document.querySelector('#join-submit').addEventListener('click', joinLobby);
  document.querySelector('#back').addEventListener('click', renderHome);
  document.querySelector('#join-code').addEventListener('input', (event) => {
    event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
  });
}

function cleanName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 20);
}

function randomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function saveSession() {
  localStorage.setItem(savedSessionKey, JSON.stringify({ code: state.code, name: state.name }));
}

function connectToRoom(code) {
  clearListeners();
  state.code = code.toUpperCase();
  state.meta = null;
  state.players = {};
  state.submitted = {};
  state.role = '';
  saveSession();
  const metaRef = ref(state.db, roomPath('meta'));
  const playersRef = ref(state.db, roomPath('players'));
  const roleRef = ref(state.db, roomPath(`roles/${state.uid}`));
  state.unsubscribers.push(onValue(metaRef, (snapshot) => {
    state.meta = snapshot.val();
    if (!state.meta) {
      clearListeners();
      showMessage('Diese Lobby wurde geschlossen oder der Code ist nicht mehr gültig.', 'error');
      renderHome();
      return;
    }
    watchCurrentAnswers();
    renderRoom();
  }, handleDatabaseError));
  state.unsubscribers.push(onValue(playersRef, (snapshot) => {
    state.players = snapshot.val() || {};
    renderRoom();
    maybeResolveQuestion();
  }, handleDatabaseError));
  state.unsubscribers.push(onValue(roleRef, (snapshot) => {
    state.role = snapshot.val()?.role || '';
    renderRoom();
  }, handleDatabaseError));
}

function watchCurrentAnswers() {
  const meta = state.meta;
  if (!meta || !['question', 'discussion'].includes(meta.phase) || state.answerTurn === meta.turn) return;
  if (state.answerTurn !== null) {
    const old = state.unsubscribers.pop();
    if (old) old();
  }
  state.answerTurn = meta.turn;
  state.submitted = {};
  state.unsubscribers.push(onValue(ref(state.db, roomPath(`submitted/${meta.turn}`)), (snapshot) => {
    state.submitted = snapshot.val() || {};
    renderRoom();
    maybeResolveQuestion();
  }, handleDatabaseError));
}

async function createLobby() {
  const name = cleanName(document.querySelector('#player-name').value);
  const targetCount = Number(document.querySelector('#target-count').value);
  if (!name) {
    showMessage('Bitte gib zuerst einen Spielernamen ein.', 'error');
    renderCreate();
    return;
  }
  state.name = name;
  const meta = {
    hostUid: state.uid,
    targetCount,
    phase: 'lobby',
    createdAt: Date.now(),
    turn: 0,
    timeLimit: 10 * 60,
    deadline: null,
    queue: [],
    solvedCount: 0,
    failedCount: 0,
    failedQuestions: [],
    lastResult: null
  };
  try {
    let created = false;
    for (let attempt = 0; attempt < 5 && !created; attempt += 1) {
      state.code = randomCode();
      const result = await runTransaction(ref(state.db, roomPath('meta')), (current) => current ? undefined : meta);
      created = result.committed;
    }
    if (!created) throw new Error('Es konnte kein freier Lobby-Code erzeugt werden. Bitte erneut versuchen.');
    await set(ref(state.db, roomPath(`players/${state.uid}`)), { name, joinedAt: Date.now() });
    connectToRoom(state.code);
  } catch (error) {
    showMessage(`Die Lobby konnte nicht erstellt werden: ${error.message}`, 'error');
    state.code = '';
    renderCreate();
  }
}

async function joinLobby() {
  const code = document.querySelector('#join-code').value.trim().toUpperCase();
  const name = cleanName(document.querySelector('#player-name').value);
  if (code.length !== 5 || !name) {
    showMessage('Bitte gib einen fünfstelligen Code und einen Namen ein.', 'error');
    renderJoin(code);
    return;
  }
  state.code = code;
  state.name = name;
  try {
    const [metaSnapshot, playersSnapshot] = await Promise.all([
      get(ref(state.db, roomPath('meta'))),
      get(ref(state.db, roomPath('players')))
    ]);
    const meta = metaSnapshot.val();
    const players = playersSnapshot.val() || {};
    if (!meta) throw new Error('Diese Lobby wurde nicht gefunden. Prüfe den Code.');
    if (meta.phase !== 'lobby') throw new Error('Das Spiel läuft bereits; ein Beitritt ist nicht mehr möglich.');
    if (Object.keys(players).length >= meta.targetCount && !players[state.uid]) throw new Error('Die Lobby ist bereits voll.');
    if (Object.values(players).some((player) => player.name.toLowerCase() === name.toLowerCase() && !players[state.uid])) {
      throw new Error('Dieser Name wird bereits verwendet.');
    }
    await set(ref(state.db, roomPath(`players/${state.uid}`)), { name, joinedAt: Date.now() });
    connectToRoom(code);
  } catch (error) {
    showMessage(error.message || 'Beitreten fehlgeschlagen.', 'error');
    state.code = '';
    renderJoin(code);
  }
}

function isHost() {
  return state.meta?.hostUid === state.uid;
}

function playerEntries() {
  return Object.entries(state.players);
}

function inviteUrl() {
  const url = new URL(location.href);
  url.search = `?room=${encodeURIComponent(state.code)}`;
  return url.toString();
}

async function copyInvite() {
  try {
    await navigator.clipboard.writeText(inviteUrl());
    showMessage('Einladungslink kopiert. Er öffnet direkt die Code-Eingabe.', 'success');
  } catch (error) {
    showMessage(`Kopieren nicht möglich. Teile diesen Link: ${inviteUrl()}`, 'error');
  }
  renderRoom();
}

async function leaveLobby() {
  try {
    const closeRoom = isHost() && state.meta.phase === 'lobby';
    await remove(ref(state.db, roomPath(`players/${state.uid}`)));
    if (closeRoom) await update(ref(state.db, roomPath('meta')), { phase: 'closed' });
    clearListeners();
    localStorage.removeItem(savedSessionKey);
    showMessage('', '');
    renderHome();
  } catch (error) {
    showMessage(`Lobby verlassen fehlgeschlagen: ${error.message}`, 'error');
    renderRoom();
  }
}

async function startGame() {
  const players = playerEntries();
  if (!isHost() || players.length < 3 || players.length > 6) return;
  const fakeUid = players[Math.floor(Math.random() * players.length)][0];
  const roles = Object.fromEntries(players.map(([uid]) => [uid, { role: uid === fakeUid ? 'Fake Newser' : 'TruTalker' }]));
  const now = Date.now();
  const meta = {
    ...state.meta,
    phase: 'question',
    queue: shuffle(missions.map((_, index) => index)),
    turn: 1,
    timeLimit: 10 * 60,
    deadline: now + 10 * 60 * 1000,
    solvedCount: 0,
    failedCount: 0,
    lastResult: null,
    startedAt: now
  };
  try {
    await Promise.all([
      ...Object.entries(roles).map(([uid, role]) => set(ref(state.db, roomPath(`roles/${uid}`)), role)),
    ]);
    await update(ref(state.db, roomPath('meta')), meta);
    state.role = roles[state.uid]?.role || '';
    renderRoom();
  } catch (error) {
    showMessage(`Spielstart fehlgeschlagen: ${error.message}`, 'error');
    renderRoom();
  }
}

function activeMission() {
  const index = state.meta?.queue?.[0];
  return Number.isInteger(index) ? missions[index] : null;
}

function remainingSeconds() {
  if (!state.meta?.deadline) return state.meta?.timeLimit || 0;
  return Math.max(0, Math.ceil((state.meta.deadline - Date.now()) / 1000));
}

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function renderRoom() {
  if (!state.meta) return;
  const meta = state.meta;
  const players = playerEntries();
  if (meta.phase === 'closed') {
    showMessage('Der Host hat diese Lobby geschlossen.', 'error');
    renderHome();
    return;
  }

  if (meta.phase === 'lobby') {
    app.innerHTML = `${header()}<section class="panel">
      <p class="eyebrow">WARTERAUM</p><h2>Lobby ${esc(state.code)}</h2>
      <p class="lead">Teile den Code oder den Einladungslink. Der Host spielt mit und kann genauso Fake Newser sein.</p>
      ${messageMarkup()}
      <div class="grid-two"><div class="stat-row"><span class="stat-label">Spielende</span><b class="stat-value">${players.length} / ${meta.targetCount}</b></div><div class="stat-row"><span class="stat-label">Spielername</span><b class="stat-value">${esc(state.name)}</b></div></div>
      <div class="player-list">${players.map(([uid, player]) => `<div class="player-row"><span class="player-name">${esc(player.name)}${uid === state.uid ? ' (du)' : ''}</span>${uid === meta.hostUid ? '<span class="host-tag">HOST · SPIELT MIT</span>' : ''}</div>`).join('')}</div>
      <div class="notice">${players.length < 3 ? 'Mindestens 3 und höchstens 6 Spielende. Warte, bis mindestens 3 Personen da sind.' : 'Alle sind bereit? Der Host kann das Spiel starten.'}</div>
      <div class="button-row"><button class="button button-primary" id="start-game" ${!isHost() || players.length < 3 ? 'disabled' : ''}>Spiel starten</button><button class="button" id="copy-invite">Einladungslink kopieren</button><button class="button" id="leave">Lobby verlassen</button></div>
    </section>`;
    document.querySelector('#start-game').addEventListener('click', startGame);
    document.querySelector('#copy-invite').addEventListener('click', copyInvite);
    document.querySelector('#leave').addEventListener('click', leaveLobby);
    return;
  }

  if (meta.phase === 'ended') {
    clearInterval(state.timer);
    const crewWon = meta.winner === 'TruTalker';
    app.innerHTML = `${header()}<section class="panel">
      <p class="eyebrow">RUNDE BEENDET</p>
      <h1 class="${crewWon ? 'winner' : 'loser'}">${crewWon ? 'TruTalker gewinnen!' : 'Fake Newser gewinnt!'}</h1>
      <p class="lead">${esc(meta.endReason || '')}</p>
      <div class="grid-two">
        <div class="stat-row"><span class="stat-label">Fake Newser</span><b class="stat-value">${esc(players.find(([uid]) => uid === meta.fakeUid)?.[1]?.name || 'Wird aufgedeckt …')}</b></div>
        <div class="stat-row"><span class="stat-label">Fragen richtig</span><b class="stat-value">${meta.solvedCount} / ${missions.length}</b></div>
        <div class="stat-row"><span class="stat-label">Falsche Gruppenrunden</span><b class="stat-value">${meta.failedCount}</b></div>
        <div class="stat-row"><span class="stat-label">Zeit übrig</span><b class="stat-value">${formatTime(remainingSeconds())}</b></div>
      </div>
      <div class="notice">Besprecht zum Schluss: Welche Argumente waren überzeugend? Welche Frage war am schwierigsten?</div>
      <button class="button" id="leave">Zur Startseite</button>
    </section>`;
    document.querySelector('#leave').addEventListener('click', leaveLobby);
    return;
  }

  if (meta.phase === 'discussion') {
    renderDiscussion(players);
    startTimer();
    return;
  }

  renderQuestion(players);
  startTimer();
  maybeResolveQuestion();
}

function renderQuestion(players) {
  const mission = activeMission();
  if (!mission) return;
  const answered = state.submitted[state.uid] === true;
  const answeredCount = Object.keys(state.submitted).length;
  const roleText = state.role ? `Deine geheime Rolle: ${state.role}.` : 'Deine geheime Rolle wird geladen …';
  app.innerHTML = `${header()}<section class="panel">
    <div class="topbar"><span class="eyebrow">FRAGE ${Math.min(state.meta.solvedCount + 1, missions.length)} VON ${missions.length}</span><span class="timer" id="timer">${formatTime(remainingSeconds())}</span></div>
    <div class="progress"><span style="width:${Math.round(state.meta.solvedCount / missions.length * 100)}%"></span></div>
    <p class="eyebrow">${esc(mission.room)} · TURN ${state.meta.turn}</p><h2>${esc(mission.title)}</h2>
    <p class="lead">${esc(mission.prompt)}</p>
    <div class="notice">${esc(roleText)} Wähle deine Antwort nur auf deinem iPad. Danach diskutiert ihr gemeinsam.</div>
    <div class="choice-list">${mission.choices.map((choice, index) => `<button class="choice" data-answer="${index}" ${answered ? 'disabled' : ''}><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${esc(choice)}</span></button>`).join('')}</div>
    <div class="notice">Eingegangen: ${answeredCount} / ${players.length}${answered ? ' · Deine Antwort ist gespeichert.' : ''}</div>
  </section>`;
  app.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => submitAnswer(Number(button.dataset.answer))));
}

async function submitAnswer(choice) {
  const mission = activeMission();
  if (!mission || state.submitted[state.uid] === true || !Number.isInteger(choice)) return;
  try {
    await set(ref(state.db, roomPath(`outcomes/${state.meta.turn}/${state.uid}`)), choice === mission.correct);
    await set(ref(state.db, roomPath(`submitted/${state.meta.turn}/${state.uid}`)), true);
  } catch (error) {
    showMessage(`Antwort konnte nicht gespeichert werden: ${error.message}`, 'error');
    renderRoom();
  }
}

function renderDiscussion(players) {
  const result = state.meta.lastResult;
  if (!result) return;
  app.innerHTML = `${header()}<section class="panel">
    <p class="eyebrow">DISKUSSIONSPHASE · FRAGE ${state.meta.solvedCount + (result.majorityCorrect ? 0 : 1)} VON ${missions.length}</p>
    <h2>${result.majorityCorrect ? 'Mehrheit richtig: +1 Minute' : 'Weniger als 66% richtig: −2 Minuten'}</h2>
    <div class="grid-two">
      <div class="stat-row"><span class="stat-label">Richtige Antworten</span><b class="stat-value">${result.correctCount} / ${players.length}</b></div>
      <div class="stat-row"><span class="stat-label">Restzeit</span><b class="stat-value timer" id="timer">${formatTime(remainingSeconds())}</b></div>
    </div>
    <div class="notice"><b>${esc(result.questionTitle)}</b><br>${esc(result.explanation)}</div>
    <p class="lead">Diskutiert die Antwort. ${!result.majorityCorrect ? 'Die Frage kommt später erneut.' : 'Diese Frage ist erledigt.'}</p>
    ${isHost() ? '<button class="button button-primary" id="continue">Diskussion beenden · nächste Frage</button>' : '<p class="small">Der Host gibt die nächste Frage frei, sobald die Diskussion abgeschlossen ist.</p>'}
  </section>`;
  const button = document.querySelector('#continue');
  if (button) button.addEventListener('click', continueAfterDiscussion);
}

async function continueAfterDiscussion() {
  if (!isHost() || state.meta.phase !== 'discussion') return;
  const seconds = remainingSeconds();
  if (seconds <= 0) return endGame('Fake Newser', 'Die Zeit ist abgelaufen, bevor alle Fragen gelöst waren.');
  if (state.meta.queue.length === 0) return endGame('TruTalker', 'Alle 10 Fragen wurden korrekt beantwortet.');
  try {
    await update(ref(state.db, roomPath('meta')), {
      phase: 'question',
      turn: state.meta.turn + 1,
      lastResult: null
    });
  } catch (error) {
    showMessage(`Nächste Frage konnte nicht gestartet werden: ${error.message}`, 'error');
    renderRoom();
  }
}

async function maybeResolveQuestion() {
  if (!isHost() || state.meta?.phase !== 'question' || state.resolvingTurn === state.meta.turn) return;
  const players = playerEntries();
  if (players.length < 3 || players.some(([uid]) => state.submitted[uid] !== true)) return;
  state.resolvingTurn = state.meta.turn;
  const mission = activeMission();
  let outcomeSnapshots;
  try {
    outcomeSnapshots = await Promise.all(players.map(([uid]) => get(ref(state.db, roomPath(`outcomes/${state.meta.turn}/${uid}`)))));
  } catch (error) {
    state.resolvingTurn = null;
    showMessage(`Antworten konnten nicht ausgewertet werden: ${error.message}`, 'error');
    renderRoom();
    return;
  }
  const correctCount = outcomeSnapshots.filter((snapshot) => snapshot.val() === true).length;
  const majorityCorrect = correctCount / players.length >= 2 / 3;
  const failedCount = state.meta.failedCount + (majorityCorrect ? 0 : 1);
  const failedQuestions = majorityCorrect
    ? (state.meta.failedQuestions || [])
    : [...new Set([...(state.meta.failedQuestions || []), state.meta.queue[0]])];
  const solvedCount = state.meta.solvedCount + (majorityCorrect ? 1 : 0);
  const queue = majorityCorrect ? state.meta.queue.slice(1) : state.meta.queue;
  const deadline = state.meta.deadline + (majorityCorrect ? 60_000 : -120_000);
  const outOfTime = deadline <= Date.now();
  const crewComplete = queue.length === 0;
  const impostorThreshold = failedQuestions.length >= Math.ceil(missions.length / 3);

  const updateData = {
    phase: 'discussion',
    queue,
    deadline,
    solvedCount,
    failedCount,
    failedQuestions,
    lastResult: {
      questionTitle: mission.title,
      explanation: mission.explain,
      correctCount,
      majorityCorrect,
      turn: state.meta.turn
    }
  };
  try {
    await update(ref(state.db, roomPath('meta')), updateData);
    if (impostorThreshold) {
      await endGame('Fake Newser', 'Mindestens ein Drittel der Fragen wurde von der Gruppe nicht richtig beantwortet.');
    } else if (outOfTime) {
      await endGame('Fake Newser', 'Die Zeit ist abgelaufen, bevor alle Fragen gelöst waren.');
    } else if (crewComplete) {
      await endGame('TruTalker', 'Alle 10 Fragen wurden korrekt beantwortet.');
    }
  } catch (error) {
    state.resolvingTurn = null;
    showMessage(`Auswertung fehlgeschlagen: ${error.message}`, 'error');
    renderRoom();
  }
}

async function endGame(winner, reason) {
  if (!isHost() || state.meta.phase === 'ended') return;
  try {
    await update(ref(state.db, roomPath('meta')), {
      phase: 'ended',
      winner,
      endReason: reason
    });
    const roleSnapshots = await Promise.all(playerEntries().map(([uid]) => get(ref(state.db, roomPath(`roles/${uid}`)))));
    const fakeIndex = roleSnapshots.findIndex((snapshot) => snapshot.val()?.role === 'Fake Newser');
    const fakeUid = fakeIndex >= 0 ? playerEntries()[fakeIndex][0] : null;
    await update(ref(state.db, roomPath('meta')), { fakeUid });
  } catch (error) {
    showMessage(`Spielende konnte nicht gespeichert werden: ${error.message}`, 'error');
    renderRoom();
  }
}

function startTimer() {
  if (state.timer) return;
  state.timer = setInterval(() => {
    const timer = document.querySelector('#timer');
    if (timer) timer.textContent = formatTime(remainingSeconds());
    if (isHost() && remainingSeconds() <= 0 && state.meta?.phase !== 'ended' && !state.timerBusy) {
      state.timerBusy = true;
      endGame('Fake Newser', 'Die Zeit ist abgelaufen, bevor alle Fragen gelöst waren.')
        .finally(() => { state.timerBusy = false; });
    }
  }, 1000);
}

function handleDatabaseError(error) {
  showMessage(`Verbindung zur Lobby fehlgeschlagen: ${error.message}`, 'error');
  if (state.meta) renderRoom();
  else renderHome();
}

function renderSetupError(message) {
  app.innerHTML = `${header()}<section class="panel">
    <p class="eyebrow">EINMALIGE EINRICHTUNG ERFORDERLICH</p><h2>Firebase noch nicht konfiguriert</h2>
    <p>${esc(message)}</p>
    <p>Lege ein Firebase-Projekt an, aktiviere anonyme Anmeldung und Realtime Database und trage die Web-Konfiguration in <code>firebase-config.js</code> ein. Die Anleitung steht in <code>README.md</code> im Ordner dieser Version.</p>
  </section>`;
}

async function bootstrap() {
  if (firebaseConfig.apiKey.startsWith('HIER_') || firebaseConfig.projectId === 'HIER_PROJECT_ID') {
    renderSetupError('Diese Version kann erst mit dem gemeinsamen Echtzeit-Backend mehrere iPads verbinden.');
    return;
  }
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    state.auth = getAuth(firebaseApp);
    state.db = getDatabase(firebaseApp);
    const credential = await signInAnonymously(state.auth);
    state.uid = credential.user.uid;
    const saved = JSON.parse(localStorage.getItem(savedSessionKey) || 'null');
    if (saved?.code && saved?.name) {
      state.code = saved.code;
      state.name = saved.name;
      const playerSnapshot = await get(ref(state.db, roomPath(`players/${state.uid}`)));
      if (playerSnapshot.exists()) {
        connectToRoom(saved.code);
        return;
      }
      localStorage.removeItem(savedSessionKey);
    }
    if (inviteCode) renderJoin(inviteCode);
    else renderHome();
  } catch (error) {
    renderSetupError(`Firebase konnte nicht verbunden werden: ${error.message}`);
  }
}

bootstrap();
