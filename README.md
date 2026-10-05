:root {
  --bg: #07111f;
  --panel: #101e30;
  --ink: #f4f7fb;
  --muted: #aebbc9;
  --cyan: #5de2e7;
  --lime: #b9f46b;
  --red: #ff6474;
  --yellow: #ffd56a;
  --line: #29405b;
  --card: #0b1727;
  --shadow: #0008;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  background: radial-gradient(circle at 20% 0, #17304b 0, #07111f 42%, #040912 100%);
  color: var(--ink);
  font-family: ui-rounded, "SF Pro Rounded", system-ui, sans-serif;
}

.shell {
  max-width: 980px;
  margin: auto;
  padding: max(18px, env(safe-area-inset-top)) 18px 40px;
}

h1, h2, h3 {
  margin: .2em 0 .55em;
  line-height: 1.05;
}

h1 {
  font-size: clamp(2rem, 7vw, 4.8rem);
  letter-spacing: -0.05em;
}

h1 span { display: block; }

.eyebrow {
  text-transform: uppercase;
  letter-spacing: .16em;
  color: var(--cyan);
  font-weight: 900;
  font-size: .78rem;
}

.small-eyebrow {
  display: block;
  margin-bottom: 0.25rem;
}

.panel {
  background: color-mix(in srgb, var(--panel) 92%, transparent);
  border: 1px solid var(--line);
  border-radius: 28px;
  padding: clamp(18px, 4vw, 30px);
  box-shadow: 0 20px 70px var(--shadow);
}

.hero {
  min-height: 78vh;
  display: grid;
  align-content: center;
  gap: 18px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 18px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 8px;
}

.brand-mark {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  font-size: 2.1rem;
  font-weight: 1000;
  color: #07111f;
  background: linear-gradient(135deg, var(--cyan), var(--lime));
  box-shadow: 0 8px 24px rgba(93, 226, 231, 0.28);
}

.brand-kicker {
  display: block;
  font-size: .72rem;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 4px;
}

.tag {
  display: inline-block;
  padding: 7px 11px;
  border-radius: 999px;
  background: #17334e;
  color: var(--cyan);
  font-weight: 800;
  font-size: .84rem;
}

.alert {
  border-left: 5px solid var(--yellow);
  background: rgba(49, 43, 24, 0.95);
  padding: 14px 16px;
  border-radius: 12px;
}

.danger {
  border-color: #723647;
  background: #29131c;
}

.success {
  border-color: #41652e;
  background: #152318;
}

.bigrole {
  font-size: clamp(2rem, 8vw, 5.2rem);
  font-weight: 1000;
  letter-spacing: -.04em;
  color: var(--lime);
  line-height: 1;
  margin: .3em 0 .5em;
}

.bigrole.bad { color: var(--red); }

button {
  appearance: none;
  border: 0;
  border-radius: 16px;
  background: linear-gradient(180deg, var(--cyan), #7fe6ee);
  color: #04131b;
  font-weight: 950;
  font-size: 1rem;
  padding: 15px 20px;
  min-height: 52px;
  cursor: pointer;
  margin: 6px 8px 6px 0;
  transition: transform .14s ease, box-shadow .14s ease;
  box-shadow: 0 10px 24px rgba(93, 226, 231, 0.2);
}
button:hover { transform: translateY(-1px); }
button:active { transform: translateY(0); }
button.secondary {
  background: #20344b;
  color: var(--ink);
  border: 1px solid #3d5774;
  box-shadow: none;
}
button.danger { background: var(--red); color: #24050a; }
button:disabled { opacity: .4; }

.choices {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.choice {
  display: block;
  width: 100%;
  text-align: left;
  background: rgba(23, 41, 62, 0.9);
  color: var(--ink);
  border: 1px solid #34506c;
  padding: 16px 18px;
  min-height: 60px;
}

.choice.selected { outline: 3px solid var(--cyan); }

.progress {
  height: 10px;
  background: #07101c;
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 18px;
}

.progress > div {
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--lime));
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.timer {
  font-variant-numeric: tabular-nums;
  font-weight: 1000;
  color: var(--yellow);
}

.quote {
  font-family: Georgia, serif;
  font-size: 1.08rem;
  line-height: 1.5;
  border-left: 4px solid var(--cyan);
  padding-left: 12px;
  margin: 16px 0 10px;
}

.small {
  font-size: .9rem;
  color: var(--muted);
  line-height: 1.45;
}

.nameinput {
  width: 100%;
  background: #091422;
  border: 1px solid #3f5871;
  color: var(--ink);
  border-radius: 13px;
  padding: 14px;
  font-size: 1rem;
  margin: 5px 0;
}

.votegrid button { min-height: 72px; }

.reveal { animation: pop .28s ease-out; }
@keyframes pop {
  from { transform: scale(.94); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.action-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.action-stack.compact { margin-top: 16px; }

.home-tagline {
  font-size: .85rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--cyan);
  font-weight: 900;
}

.home-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.home-meta span,
.mission-kicker {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(93, 226, 231, 0.08);
  border: 1px solid rgba(93, 226, 231, 0.2);
  color: var(--cyan);
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.stats-box {
  margin-top: 20px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: rgba(7, 17, 31, 0.42);
  padding: 16px;
}

.stats-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.status-pill {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: .7rem;
  letter-spacing: .09em;
  text-transform: uppercase;
  font-weight: 800;
}
.status-pill.online {
  background: rgba(185, 244, 107, 0.11);
  color: var(--lime);
  border: 1px solid rgba(185, 244, 107, 0.35);
}
.status-pill.offline {
  background: rgba(255, 100, 116, 0.1);
  color: var(--red);
  border: 1px solid rgba(255, 100, 116, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
}

.stat {
  background: rgba(11, 23, 39, 0.85);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px 10px;
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 1.2rem;
  color: var(--cyan);
  margin-bottom: 4px;
}

.stat span {
  color: var(--muted);
  font-size: .76rem;
}

.history-list {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(11, 23, 39, 0.7);
  border: 1px solid rgba(41, 64, 91, 0.7);
}

.history-item.empty {
  justify-content: center;
  color: var(--muted);
}

.history-item small { color: var(--muted); }

.role-header { margin-top: .5em; }
.badge {
  display: inline-block;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.badge-success {
  background: rgba(185, 244, 107, 0.12);
  border-color: rgba(185, 244, 107, 0.25);
  color: var(--lime);
}
.badge-danger {
  background: rgba(255, 100, 116, 0.12);
  border-color: rgba(255, 100, 116, 0.25);
  color: var(--red);
}

.teacher-sneakpeek {
  margin: 1em 0 1.2em;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 100, 116, 0.08);
  border: 1px solid rgba(255, 100, 116, 0.25);
}
.agent-name {
  color: var(--red);
  font-weight: 800;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin: 14px 0;
}

.agent-badge {
  display: inline-block;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 100, 116, 0.1);
  border: 1px solid rgba(255, 100, 116, 0.25);
  color: var(--red);
  font-weight: 900;
  margin-bottom: 8px;
}

.scoreline { display: flex; justify-content: space-between; margin: 8px 0; }
.scoreline strong { color: var(--cyan); }
.exit-card { margin: 20px 0; }

.teacher-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 16px 0 8px;
}

.danger-panel {
  background: rgba(41, 19, 28, 0.9);
  border-color: rgba(255, 100, 116, 0.4);
}

.mission-title-wrap h2 {
  margin-top: 10px;
}

@media (max-width: 620px) {
  .shell { padding: 12px; }
  .panel { border-radius: 18px; }
  .topbar { align-items: flex-start; flex-direction: column; }
  .brand-wrap { align-items: flex-start; }
}
