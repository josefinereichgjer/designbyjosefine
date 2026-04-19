// Shared icons + helpers for Tjønnås & Norvald
(function () {
  const ICONS = {
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/></svg>',
    cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5z"/><path d="M8 7h8M8 11h8M8 15h6"/></svg>',
    target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg>',
    chevL:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>',
    chevR:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
  };
  window.ICONS = ICONS;

  function navHTML(active){
    const items = [
      ['hjem.html','home','Hjem'],
      ['vaktliste.html','cal','Vaktliste'],
      ['min-trening.html','book','Min trening'],
      ['mal.html','target','Mål'],
      ['chat.html','chat','Meldinger'],
      ['dokument.html','file','Dokumenter'],
      ['profil.html','user','Profil']
    ];
    return items.map(([href,ico,label])=>`
      <a href="${href}" class="${active===href?'active':''}">
        <span class="ico">${ICONS[ico]}</span>${label}
      </a>`).join('');
  }

  function shellHTML(active, title){
    return `
    <aside class="sidebar">
      <div class="brand">Tjønnås<br>& Norvald<small>Mitt arbeid</small></div>
      <nav class="nav">${navHTML(active)}</nav>
      <div class="sidebar-foot">
        <div class="avatar">EM</div>
        <div class="who"><b>Emma Lind</b><span>Vakt 15:00 – 20:00</span></div>
      </div>
    </aside>`;
  }

  function topbarHTML(){
    return `
    <header class="topbar">
      <div class="search">
        <span class="ico" style="color:var(--burgundy)">${ICONS.search}</span>
        <input placeholder="Søk etter modul, vakt, melding…">
      </div>
      <button class="icon-btn" title="Meldinger" onclick="location.href='chat.html'">${ICONS.chat}<span class="dot">2</span></button>
      <button class="icon-btn" title="Varsler" onclick="window._showToast && window._showToast('3 nye varsler: ny vakt, HMS-påminnelse og melding fra Linn.')">${ICONS.bell}<span class="dot">3</span></button>
    </header>`;
  }

  function mobileNavHTML(active){
    const items = [
      ['hjem.html','home'],['vaktliste.html','cal'],['min-trening.html','book'],
      ['chat.html','chat'],['profil.html','user']
    ];
    return `<nav class="mobile-nav">${items.map(([h,i])=>
      `<a href="${h}" class="${active===h?'active':''}">${ICONS[i]}</a>`).join('')}</nav>`;
  }

  window.mountShell = function(active){
    const root = document.getElementById('shell');
    if(!root) return;
    root.innerHTML = shellHTML(active);
    document.body.appendChild(
      Object.assign(document.createElement('div'), {innerHTML: mobileNavHTML(active)}).firstElementChild
    );
  };
  window.mountTopbar = function(){
    const root = document.getElementById('topbar');
    if(root) root.innerHTML = topbarHTML();
  };

  // small build-icon helper for inline use
  window.icon = function(name){ return ICONS[name] || ''; };

  // shared toast — pages may override with their own showToast
  window._showToast = function(msg){
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  };
})();
