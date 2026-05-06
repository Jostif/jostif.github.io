/**
 * Jostif — components.js
 * Single source of truth for sidebar, topbar, footer, and all base styles.
 * Edit SITE_CONFIG below, then every page updates automatically.
 *
 * Usage on any page:
 *   <script src="/assets/components.js"></script>   (root pages)
 *   <script src="../assets/components.js"></script> (one folder deep)
 *
 *   Then at the bottom of <body>:
 *   <script>
 *     initPage({
 *       title:      'Page Title',
 *       breadcrumb: 'section/page',
 *       tags: [{ label: 'Easy', color: 'green' }],
 *     });
 *   </script>
 */

// ═══════════════════════════════════════════════════════════
//  SITE CONFIG — edit here, affects every page
// ═══════════════════════════════════════════════════════════
// Compute base path from how deep the current page sits.
// "assets/components.js"   → depth 0 → base = ""
// "../assets/components.js" → depth 1 → base = "../"
const _base = (() => {
  const s = document.querySelector('script[src*="components.js"]');
  if (!s) return '';
  const ups = (s.getAttribute('src').match(/\.\.\//g) || []).length;
  return '../'.repeat(ups);
})();

const SITE_CONFIG = {
  handle: 'Jostif',
  tagline: '~/writeups & cheatsheets',
  vpn_ip: '10.10.14.22',          // ← update when you reconnect
  github: 'jostif.github.io',

  nav: [
    { label: 'Dashboard', href: 'index.html', icon: '⌂', badge: null },
    { label: 'Writeups', href: 'writeups/', icon: '◈', badge: '2' },
    { label: 'Tools', href: 'tools.html', icon: '⚙', badge: null },
  ],

  cheatsheets: [
    { label: 'Quick Reference', href: 'cheatsheets/index.html', icon: '≡', badge: null, color: 'var(--accent)' },
    { label: 'Linux Pentest', href: 'cheatsheets/linux_methodology.html', icon: '🐧', badge: null, color: 'var(--green)' },
    { label: 'Web Pentest', href: 'cheatsheets/Web_cheatsheet.html', icon: '🌐', badge: null, color: 'var(--orange)' },
    { label: 'AD Cheatsheet', href: 'cheatsheets/AD_cheatsheet.html', icon: '🏛', badge: null, color: 'var(--yellow)' },
    { label: 'Windows & AD', href: 'cheatsheets/Windows_methodology.html', icon: '🪟', badge: null, color: 'var(--purple)' },
    { label: 'ADCS Attacks', href: 'cheatsheets/ADCS_Cheatsheet.html', icon: '🔐', badge: null, color: 'var(--red)' },
    { label: 'MSSQL Reference', href: 'cheatsheets/mssql_cheatsheet.html', icon: '🗄', badge: null, color: 'var(--teal)' },
  ],

  difficulty: [
    { label: 'Easy', color: 'var(--green)', href: 'writeups/?diff=easy', count: 5 },
    { label: 'Medium', color: 'var(--orange)', href: 'writeups/?diff=medium', count: 4 },
    { label: 'Hard', color: 'var(--red)', href: 'writeups/?diff=hard', count: 2 },
    { label: 'Insane', color: 'var(--purple)', href: 'writeups/?diff=insane', count: 1 },
  ],

  os: [
    { label: 'Linux', icon: '🐧', href: 'writeups/?os=linux' },
    { label: 'Windows', icon: '🪟', href: 'writeups/?os=windows' },
    { label: 'Active Directory', icon: '📦', href: 'writeups/?os=ad' },
  ],
};

// ═══════════════════════════════════════════════════════════
//  BASE CSS
// ═══════════════════════════════════════════════════════════
function _injectStyles() {
  if (document.getElementById('oxr-styles')) return;
  const s = document.createElement('style');
  s.id = 'oxr-styles';
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;500;600&display=swap');

:root {
  --bg:        #0a0c0f;
  --bg2:       #0f1117;
  --bg3:       #161b22;
  --surface:   #1c2128;
  --surface2:  #22272e;
  --border:    #30363d;
  --green:     #39d353;
  --gdim:      #1f6b2e;
  --gglow:     rgba(57,211,83,0.12);
  --text:      #e6edf3;
  --muted:     #7d8590;
  --accent:    #58a6ff;
  --red:       #f85149;
  --orange:    #ffa657;
  --purple:    #bc8cff;
  --yellow:    #e3b341;
  --teal:      #39c5cf;
  --mono:      'JetBrains Mono', monospace;
  --sans:      'Space Grotesk', sans-serif;
  --sbw:       248px;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
::selection { background: var(--gdim); color: white; }
html { scroll-behavior: smooth; }

body {
  background: var(--bg); color: var(--text);
  font-family: var(--sans); min-height: 100vh; overflow-x: hidden;
}
body::before {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:9999;
  background: repeating-linear-gradient(0deg,transparent,transparent 2px,
    rgba(0,0,0,0.022) 2px,rgba(0,0,0,0.022) 4px);
}

/* ── SIDEBAR ── */
#oxr-sb {
  position:fixed; left:0; top:0; bottom:0; width:var(--sbw);
  background:var(--bg2); border-right:1px solid var(--border);
  display:flex; flex-direction:column; z-index:200; overflow-y:auto;
}
#oxr-sb::-webkit-scrollbar { width:4px; }
#oxr-sb::-webkit-scrollbar-track { background:var(--bg); }
#oxr-sb::-webkit-scrollbar-thumb { background:var(--surface2); border-radius:2px; }

.sb-logo { padding:20px 18px 18px; border-bottom:1px solid var(--border); }
.sb-logo-tag { font-family:var(--mono); font-size:10px; color:var(--green); margin-bottom:4px; letter-spacing:.05em; }
.sb-logo-name { font-family:var(--mono); font-size:21px; font-weight:700; color:var(--text); text-decoration:none; display:block; transition:color .15s; }
.sb-logo-name:hover { color:var(--green); }
.sb-logo-name em { color:var(--green); font-style:normal; }
.sb-logo-sub { font-size:11px; color:var(--muted); margin-top:3px; font-family:var(--mono); }

.sb-sec { padding:13px 10px 6px; }
.sb-sec-lbl { font-family:var(--mono); font-size:10px; color:var(--muted); letter-spacing:.12em; text-transform:uppercase; padding:0 8px; margin-bottom:5px; }

.sb-item {
  display:flex; align-items:center; gap:10px;
  padding:7px 10px; border-radius:6px; cursor:pointer;
  font-size:12px; font-family:var(--mono); color:var(--muted);
  transition:all .15s; text-decoration:none; border:1px solid transparent;
}
.sb-item:hover { background:var(--surface); color:var(--text); }
.sb-item.active { background:var(--gglow); color:var(--green); border-color:rgba(57,211,83,.25); }
.sb-icon { font-size:13px; width:16px; text-align:center; flex-shrink:0; }
.sb-badge { margin-left:auto; font-size:10px; background:var(--surface2); color:var(--muted); padding:1px 6px; border-radius:8px; font-family:var(--mono); }
.sb-item.active .sb-badge { background:var(--gdim); color:var(--green); }

.sb-foot { margin-top:auto; padding:13px 16px; border-top:1px solid var(--border); font-family:var(--mono); font-size:10px; color:var(--muted); }
.sb-dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--green); margin-right:5px; animation:sb-pulse 2s infinite; }
@keyframes sb-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

/* ── MAIN ── */
#oxr-main { margin-left:var(--sbw); min-height:100vh; display:flex; flex-direction:column; }

/* ── TOPBAR ── */
#oxr-top {
  position:sticky; top:0; z-index:100;
  background:var(--bg2); border-bottom:1px solid var(--border);
  padding:10px 36px; display:flex; align-items:center; gap:10px;
  font-family:var(--mono); font-size:12px; color:var(--muted);
}
.top-crumb { flex:1; }
.top-crumb .top-root { color:var(--green); }
.top-crumb a { color:var(--muted); text-decoration:none; }
.top-crumb a:hover { color:var(--text); }

/* ── PAGE CONTENT ── */
.page-content { padding:40px 48px; flex:1; }

/* ── FOOTER ── */
#oxr-foot {
  border-top:1px solid var(--border); padding:18px 48px;
  font-family:var(--mono); font-size:11px; color:var(--muted);
  display:flex; justify-content:space-between; align-items:center;
}
#oxr-foot a { color:var(--green); text-decoration:none; }

/* ── SHARED TAG ── */
.tag { padding:2px 9px; border-radius:4px; font-size:10px; font-family:var(--mono); border:1px solid; display:inline-block; }
.tag-green  { background:rgba(57,211,83,.1);  color:var(--green);  border-color:rgba(57,211,83,.3);  }
.tag-blue   { background:rgba(88,166,255,.1); color:var(--accent); border-color:rgba(88,166,255,.3); }
.tag-orange { background:rgba(255,166,87,.1); color:var(--orange); border-color:rgba(255,166,87,.3); }
.tag-red    { background:rgba(248,81,73,.1);  color:var(--red);    border-color:rgba(248,81,73,.3);  }
.tag-purple { background:rgba(188,140,255,.1);color:var(--purple); border-color:rgba(188,140,255,.3);}
.tag-teal   { background:rgba(57,197,207,.1); color:var(--teal);   border-color:rgba(57,197,207,.3); }
.tag-yellow { background:rgba(227,179,65,.1); color:var(--yellow); border-color:rgba(227,179,65,.3); }
.tag-muted  { background:rgba(125,133,144,.1);color:var(--muted);  border-color:rgba(125,133,144,.3);}

/* ── SHARED TERMINAL ── */
.terminal { background:var(--bg3); border:1px solid var(--border); border-radius:8px; overflow:hidden; margin:14px 0; }
.term-bar { background:var(--surface); padding:8px 14px; display:flex; align-items:center; gap:7px; border-bottom:1px solid var(--border); }
.dot { width:11px; height:11px; border-radius:50%; }
.dot-r{background:#ff5f57;} .dot-y{background:#febc2e;} .dot-g{background:#28c840;}
.term-label { margin-left:6px; font-family:var(--mono); font-size:11px; color:var(--muted); flex:1; }
.copy-btn { font-family:var(--mono); font-size:10px; color:var(--muted); cursor:pointer; padding:2px 8px; border:1px solid var(--border); border-radius:4px; background:transparent; transition:all .15s; }
.copy-btn:hover { color:var(--green); border-color:rgba(57,211,83,.4); }
.term-body { padding:16px 20px; font-family:var(--mono); font-size:13px; line-height:1.9; overflow-x:auto; white-space:pre-line; }
.tp { color:var(--green); }
.tc { color:var(--accent); }
.tf { color:var(--purple); }
.ta { color:var(--orange); }
.tt { color:var(--yellow); }
.to { color:#c9d1d9; }
.tcm{ color:#3d4450; }
.thl{ display:block; background:rgba(57,211,83,.07); border-left:2px solid var(--green); padding-left:8px; margin-left:-8px; }

/* ── SHARED CALLOUT ── */
.callout { border-radius:7px; padding:12px 16px; margin:14px 0; font-family:var(--mono); font-size:12px; line-height:1.8; }
.c-find { background:rgba(57,211,83,.07);  border:1px solid rgba(57,211,83,.25); }
.c-find strong { color:var(--green); }
.c-warn { background:rgba(255,166,87,.07); border:1px solid rgba(255,166,87,.25); }
.c-warn strong { color:var(--orange); }
.c-info { background:rgba(88,166,255,.07); border:1px solid rgba(88,166,255,.25); }
.c-info strong { color:var(--accent); }

/* ── SECTION HEADER ── */
.sec-hdr { display:flex; align-items:baseline; gap:14px; margin-bottom:22px; }
.sec-title { font-family:var(--mono); font-size:13px; color:var(--green); letter-spacing:.06em; text-transform:uppercase; }
.sec-line { flex:1; height:1px; background:linear-gradient(to right,var(--border),transparent); }
.sec-meta { font-family:var(--mono); font-size:11px; color:var(--muted); }

/* ── CHEATSHEETS TOGGLE ── */
.sb-cs-toggle {
  display:flex; align-items:center; gap:10px;
  padding:7px 10px; border-radius:6px; cursor:pointer;
  font-size:12px; font-family:var(--mono); color:var(--muted);
  transition:all .15s; text-decoration:none; border:1px solid transparent;
  width:100%; background:none; text-align:left;
}
.sb-cs-toggle:hover { background:var(--surface); color:var(--text); }
.sb-cs-toggle.active { background:var(--gglow); color:var(--green); border-color:rgba(57,211,83,.25); }
.sb-cs-arrow { margin-left:auto; font-size:10px; transition:transform .2s; flex-shrink:0; }
.sb-cs-toggle.open .sb-cs-arrow { transform:rotate(90deg); }
.sb-cs-children {
  overflow:hidden; max-height:0; transition:max-height .28s ease;
  padding-left:12px;
}
.sb-cs-children.open { max-height:400px; }
.sb-cs-child {
  display:flex; align-items:center; gap:8px;
  padding:5px 10px; border-radius:5px;
  font-size:11px; font-family:var(--mono); color:var(--muted);
  transition:all .15s; text-decoration:none; border-left:2px solid transparent;
}
.sb-cs-child:hover { color:var(--text); border-left-color:var(--border); }
.sb-cs-child.active { color:var(--green); border-left-color:var(--green); background:rgba(57,211,83,.04); }
.sb-cs-child-icon { font-size:12px; width:16px; text-align:center; flex-shrink:0; }

/* ── MOBILE ── */
#oxr-toggle {
  display:none; position:fixed; bottom:20px; right:20px; z-index:300;
  width:42px; height:42px; border-radius:8px; background:var(--surface);
  border:1px solid var(--border); color:var(--green); font-size:18px;
  cursor:pointer; align-items:center; justify-content:center; font-family:var(--mono);
}
#scroll-top {
  position:fixed; bottom:20px; right:20px; z-index:300;
  width:42px; height:42px; border-radius:8px; background:var(--surface);
  border:1px solid var(--border); color:var(--text); font-size:18px;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  opacity:0; pointer-events:none; transition:all .2s; font-family:var(--mono);
}
#scroll-top.visible {
  opacity:1; pointer-events:auto;
}
#scroll-top:hover {
  color:var(--green); border-color:rgba(57,211,83,.4); background:var(--gglow);
}
@media(max-width:768px){
  :root{ --sbw:0px; }
  #oxr-sb{ transform:translateX(-248px); width:248px; transition:transform .25s; }
  #oxr-sb.open{ transform:translateX(0); }
  #oxr-toggle{ display:flex; }
  #scroll-top { bottom: 72px; }
  .page-content{ padding:24px 20px; }
  #oxr-top{ padding:10px 20px; }
  #oxr-foot{ padding:16px 20px; }
}

::-webkit-scrollbar{ width:5px; }
::-webkit-scrollbar-track{ background:var(--bg); }
::-webkit-scrollbar-thumb{ background:var(--surface2); border-radius:3px; }
  `;
  document.head.appendChild(s);
}

// ═══════════════════════════════════════════════════════════
//  BUILD SIDEBAR
// ═══════════════════════════════════════════════════════════
function _buildSidebar() {
  const path = window.location.pathname;
  const isActive = href => {
    // strip base prefix for comparison
    const bare = href.replace(/^(\.\.\/)+/, '');
    if (bare === 'index.html') return path === '/' || path.endsWith('/index.html');
    return path.includes(bare.replace(/\/$/, ''));
  };

  const nav = SITE_CONFIG.nav.map(n => `
    <a href="${_base}${n.href}" class="sb-item${isActive(n.href) ? ' active' : ''}">
      <span class="sb-icon">${n.icon}</span>${n.label}
      ${n.badge ? `<span class="sb-badge">${n.badge}</span>` : ''}
    </a>`).join('');

  // Cheatsheets collapsible section
  const csActive = SITE_CONFIG.cheatsheets.some(c => isActive(c.href));
  const csChildren = SITE_CONFIG.cheatsheets.map(c => `
    <a href="${_base}${c.href}" class="sb-cs-child${isActive(c.href) ? ' active' : ''}">
      ${c.label}
      ${c.badge ? `<span class="sb-badge" style="margin-left:auto">${c.badge}</span>` : ''}
    </a>`).join('');

  const csToggle = `
    <div class="sb-cs-toggle" style="cursor: default;">
      <span class="sb-icon">≡</span>Cheatsheets
    </div>
    <div class="sb-cs-children open" style="max-height: none;">
      ${csChildren}
    </div>`;

  const diff = SITE_CONFIG.difficulty.map(d => `
    <a href="${_base}${d.href}" class="sb-item">
      <span class="sb-icon" style="color:${d.color}">●</span>${d.label}
      <span class="sb-badge">${d.count}</span>
    </a>`).join('');

  const os = SITE_CONFIG.os.map(o => `
    <a href="${_base}${o.href}" class="sb-item">
      <span class="sb-icon">${o.icon}</span>${o.label}
    </a>`).join('');

  return `
    <div class="sb-logo">
      <div class="sb-logo-tag">// pentesting notes</div>
      <a href="${_base}index.html" class="sb-logo-name"><em>J0</em>$tif</a>
      <div class="sb-logo-sub">${SITE_CONFIG.tagline}</div>
    </div>
    <div class="sb-sec"><div class="sb-sec-lbl">navigation</div>${nav}${csToggle}</div>
    <div class="sb-sec"><div class="sb-sec-lbl">difficulty</div>${diff}</div>
    <div class="sb-sec"><div class="sb-sec-lbl">os</div>${os}</div>
    <div class="sb-foot">
      <div><span class="sb-dot"></span>vpn connected</div>
      <div style="margin-top:4px;color:var(--accent)">${SITE_CONFIG.vpn_ip}</div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════
//  BUILD TOPBAR
// ═══════════════════════════════════════════════════════════
function _buildTopbar(opts) {
  const parts = (opts.breadcrumb || '').split('/').filter(Boolean);
  const depth = parts.length;
  const crumb = '<span class="top-root">~</span>/' + parts.map((p, i) => {
    if (i === depth - 1) return `<span style="color:var(--text)">${p}</span>`;
    const up = '../'.repeat(depth - 1 - i);
    return `<a href="${up}index.html">${p}</a>/`;
  }).join('');

  const tags = (opts.tags || []).map(t =>
    `<span class="tag tag-${t.color}">${t.label}</span>`).join('');

  return `<div class="top-crumb">${crumb}</div>${tags}`;
}

// ═══════════════════════════════════════════════════════════
//  initPage — call this on every page
// ═══════════════════════════════════════════════════════════
/**
 * @param {object} opts
 *   title       {string}  Browser tab title suffix
 *   breadcrumb  {string}  e.g. 'writeups/passage'
 *   tags        {Array}   [{label, color}] for topbar
 *   extraSb     {string}  Optional extra HTML injected at bottom of sidebar
 */
function initPage(opts = {}) {
  _injectStyles();
  document.title = `${SITE_CONFIG.handle} — ${opts.title || 'Notes'}`;

  const content = document.querySelector('.page-content');

  // Sidebar
  const sb = document.createElement('aside');
  sb.id = 'oxr-sb';
  sb.innerHTML = _buildSidebar() + (opts.extraSb || '');

  // Main
  const main = document.createElement('div');
  main.id = 'oxr-main';

  // Topbar
  const top = document.createElement('div');
  top.id = 'oxr-top';
  top.innerHTML = _buildTopbar(opts);

  // Footer
  const foot = document.createElement('footer');
  foot.id = 'oxr-foot';
  foot.innerHTML = `
    <span><span class="sb-dot"></span>${SITE_CONFIG.handle} — ${opts.title || 'notes'}</span>
    <span>
      <a href="${_base}index.html">dashboard</a> ·
      <a href="https://${SITE_CONFIG.github}" target="_blank">${SITE_CONFIG.github}</a>
    </span>`;

  // Mobile toggle
  const tog = document.createElement('button');
  tog.id = 'oxr-toggle'; tog.innerHTML = '☰';
  tog.addEventListener('click', () => sb.classList.toggle('open'));

  main.appendChild(top);
  if (content) main.appendChild(content);
  main.appendChild(foot);

  // Scroll to top button
  const scrollTop = document.createElement('button');
  scrollTop.id = 'scroll-top';
  scrollTop.innerHTML = '↑';
  scrollTop.title = 'Scroll to top';
  scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) scrollTop.classList.add('visible');
    else scrollTop.classList.remove('visible');
  });

  document.body.innerHTML = '';
  document.body.appendChild(sb);
  document.body.appendChild(main);
  document.body.appendChild(tog);
  document.body.appendChild(scrollTop);
}

// ── COPY TERMINAL helper (available globally) ─────────────
function copyTerm(btn) {
  const body = btn.closest('.terminal').querySelector('.term-body');
  navigator.clipboard?.writeText(body.innerText.trim()).then(() => {
    btn.textContent = '✓';
    btn.style.color = 'var(--green)';
    setTimeout(() => { btn.textContent = 'copy'; btn.style.color = ''; }, 1600);
  });
}
