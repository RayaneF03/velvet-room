const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const toast = (message) => {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => element.classList.remove('show'), 2600);
};

// Data e navegação
const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());
$('#today-date').textContent = date.toUpperCase();
function updateClock() {
  $('#live-clock').textContent = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date());
}
updateClock();
setInterval(updateClock, 30000);

const translations = {
  'pt-BR': {
    nav: ['home', 'about me', 'music room', 'bias zone', 'scrapbook', 'find me', 'little journal'],
    music: 'music room', bias: 'the jungkook corner', scrapbook: 'my scrapbook', connect: 'find me around the web',
    playlist: 'my little spotify playlist', heroButton: 'explorar meu universo', welcome: 'bem-vinda ao meu mundinho',
    about: 'um pouco sobre mim', journal: 'meu mini diário', edit: 'editar textos', save: 'SALVAR TODAS AS ALTERAÇÕES ♡',
    tabs: ['textos', 'links', 'visual', 'backup'], editor: 'editor do meu cantinho', close: 'fechar editor',
    addMemory: '＋ adicionar memória', editMemory: 'editar memória', cancel: 'cancelar'
  },
  es: {
    nav: ['inicio', 'sobre mí', 'sala de música', 'zona bias', 'scrapbook', 'encuéntrame', 'diario'],
    music: 'sala de música', bias: 'el rincón de jungkook', scrapbook: 'mi scrapbook', connect: 'encuéntrame en la web',
    playlist: 'mi playlist de spotify', heroButton: 'explorar mi universo', welcome: 'bienvenida a mi pequeño mundo',
    about: 'un poco sobre mí', journal: 'mi pequeño diario', edit: 'editar textos', save: 'GUARDAR TODOS LOS CAMBIOS ♡',
    tabs: ['textos', 'enlaces', 'visual', 'respaldo'], editor: 'editor de mi rincón', close: 'cerrar editor',
    addMemory: '＋ añadir memoria', editMemory: 'editar memoria', cancel: 'cancelar'
  },
  en: {
    nav: ['home', 'about me', 'music room', 'bias zone', 'scrapbook', 'find me', 'little journal'],
    music: 'music room', bias: 'the jungkook corner', scrapbook: 'my scrapbook', connect: 'find me around the web',
    playlist: 'my little spotify playlist', heroButton: 'explore my universe', welcome: 'welcome to my little world',
    about: 'a little about me', journal: 'my little journal', edit: 'edit texts', save: 'SAVE ALL CHANGES ♡',
    tabs: ['texts', 'links', 'visual', 'backup'], editor: 'my little editor', close: 'close editor',
    addMemory: '＋ add memory', editMemory: 'edit memory', cancel: 'cancel'
  }
};
function setLanguage(language) {
  const copy = translations[language] || translations['pt-BR'];
  document.documentElement.lang = language;
  document.body.dataset.language = language;
  $$('.language-button').forEach(button => button.classList.toggle('active', button.dataset.language === language));
  $$('.nav-link').forEach((link, index) => {
    const number = link.querySelector('small');
    const icon = link.querySelector('span');
    link.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = ` ${copy.nav[index]} `;
    });
    if (!number && icon) link.append(` ${copy.nav[index]} `);
  });
  $('.music-window h2').textContent = copy.music;
  $('.bias-window h2').textContent = copy.bias;
  $('.scrapbook-window h2').textContent = copy.scrapbook;
  $('.connect-window h2').textContent = copy.connect;
  $('.primary-btn[href="#about"]').childNodes[0].textContent = `${copy.heroButton} `;
  $('.welcome-window h2').textContent = copy.welcome;
  $('.about-layout h2').textContent = copy.about;
  $('.journal-window h2').textContent = copy.journal;
  $('#edit-mode-toggle').textContent = `✎ ${copy.edit}`;
  $('#save-texts').textContent = copy.save;
  $$('.editor-tab').forEach((tab, index) => { tab.textContent = copy.tabs[index]; });
  $('#text-editor-title').textContent = copy.editor;
  $('#close-text-editor').setAttribute('aria-label', copy.close);
  $('#add-scrap-card').textContent = copy.addMemory;
  $('#scrap-edit-title').textContent = copy.editMemory;
  $('#scrap-edit-cancel').textContent = copy.cancel;
  const playlistCard = document.querySelector('[data-title="my spotify playlist"] strong');
  if (playlistCard) playlistCard.textContent = copy.playlist;
  localStorage.setItem('velvetLanguage', language);
}
$$('.language-button').forEach(button => button.addEventListener('click', () => {
  setLanguage(button.dataset.language);
  toast(`idioma: ${button.textContent}`);
}));
setLanguage(localStorage.getItem('velvetLanguage') || 'pt-BR');

// Personal text editor: changes stay only in this browser.
const textEditorPanel = $('#text-editor-panel');
const readStored = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value ?? fallback;
  } catch {
    return fallback;
  }
};
const editableSelector = 'h1,h2,h3,h4,p,small,strong,button,label,blockquote,code';
const editableTexts = $$(editableSelector).filter(element => {
  if (element.closest('#text-editor-panel, #scrap-modal')) return false;
  if (element.matches('#edit-mode-toggle,#back-top,#show-spotify,#hide-spotify,#heart-button,.language-button,.mood-btn,.gallery-filter,.love-tile')) return false;
  if (element.children.length) return false;
  if (!element.textContent.trim()) return false;
  if (element.classList.contains('section-icon') || element.classList.contains('social-icon')) return false;
  return true;
});
const originalTexts = editableTexts.map(element => element.textContent);
let hasUnsavedChanges = false;
function markEditorDirty() {
  hasUnsavedChanges = true;
  const status = $('#editor-status');
  status.textContent = '⚠ alterações não salvas — clique em “SALVAR TODAS AS ALTERAÇÕES”.';
  status.classList.add('is-dirty');
}
editableTexts.forEach(element => element.addEventListener('input', markEditorDirty));
const savedTexts = readStored('velvetCustomTexts', null);
if (Array.isArray(savedTexts)) editableTexts.forEach((element, index) => {
  if (typeof savedTexts[index] === 'string') element.textContent = savedTexts[index];
});
function setEditMode(enabled) {
  document.body.classList.toggle('editing-texts', enabled);
  editableTexts.forEach(element => { element.contentEditable = enabled ? 'true' : 'false'; });
  $('#edit-mode-toggle').textContent = enabled ? '✓ terminar edição' : '✎ editar textos';
  $('#floating-edit-button').classList.toggle('active', enabled);
  $('#floating-edit-button').textContent = enabled ? '✓' : '✎';
}
function openTextEditor() {
  textEditorPanel.hidden = false;
  setEditMode(true);
  textEditorPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
$('#edit-mode-toggle').addEventListener('click', openTextEditor);
$('#floating-edit-button').addEventListener('click', openTextEditor);
$('#close-text-editor').addEventListener('click', () => {
  if (hasUnsavedChanges) toast('lembrete: clique em “SALVAR TODAS AS ALTERAÇÕES” antes de fechar');
  setEditMode(false);
  textEditorPanel.hidden = true;
});
$('#save-texts').addEventListener('click', () => {
  localStorage.setItem('velvetCustomTexts', JSON.stringify(editableTexts.map(element => element.textContent)));
  localStorage.setItem('velvetSettings', JSON.stringify(settings));
  hasUnsavedChanges = false;
  $('#editor-status').textContent = '✓ todas as alterações foram salvas neste navegador ♡';
  $('#editor-status').classList.remove('is-dirty');
  toast('seus textos foram salvos ♡');
});
$('#reset-texts').addEventListener('click', () => {
  editableTexts.forEach((element, index) => { element.textContent = originalTexts[index]; });
  localStorage.removeItem('velvetCustomTexts');
  hasUnsavedChanges = true;
  markEditorDirty();
  $('#editor-status').textContent = '⚠ originais restaurados na tela — clique em salvar para confirmar.';
  toast('textos originais restaurados');
});
window.addEventListener('beforeunload', event => {
  if (!hasUnsavedChanges) return;
  event.preventDefault();
  event.returnValue = '';
});

$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    $$('.nav-link').forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});

// Mood selector
const moods = {
  dreamy: 'dreamy & a little delulu',
  lovely: 'in love with everything ♡',
  chaotic: 'main character chaos ⚡',
  soft: 'soft, quiet & healing ☾'
};
$$('.mood-btn').forEach(button => {
  button.addEventListener('click', () => {
    $$('.mood-btn').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    $('#mood-label').textContent = moods[button.dataset.mood];
    localStorage.setItem('velvetMood', button.dataset.mood);
    toast('mood atualizado ♡');
  });
});
const savedMood = localStorage.getItem('velvetMood');
if (savedMood && moods[savedMood]) {
  const button = $(`.mood-btn[data-mood="${savedMood}"]`);
  if (button) {
    $$('.mood-btn').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    $('#mood-label').textContent = moods[savedMood];
  }
}

// Love tiles: likes saved in this browser
const savedLoves = new Set(JSON.parse(localStorage.getItem('velvetLoves') || '[]'));
function renderLoves() {
  $$('.love-tile').forEach(button => button.classList.toggle('loved', savedLoves.has(button.dataset.love)));
  $('#love-count').textContent = savedLoves.size;
}
$$('.love-tile').forEach(button => {
  button.addEventListener('click', () => {
    const love = button.dataset.love;
    if (savedLoves.has(love)) {
      savedLoves.delete(love);
      toast(`${love}: removido dos favoritos`);
    } else {
      savedLoves.add(love);
      toast(`${love} adicionado aos seus little loves ♡`);
    }
    localStorage.setItem('velvetLoves', JSON.stringify([...savedLoves]));
    renderLoves();
  });
});
renderLoves();

// Spotify official embed: accepts public playlist, album, track, artist or episode URLs.
const spotifyPanel = $('#spotify-panel');
$('#show-spotify').addEventListener('click', () => {
  spotifyPanel.hidden = false;
  spotifyPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  $('#spotify-url').focus();
});
$('#hide-spotify').addEventListener('click', () => { spotifyPanel.hidden = true; });
function loadSpotify(input) {
  const error = $('#spotify-error');
  const embed = $('#spotify-embed');
  error.textContent = '';
  embed.replaceChildren();

  let url;
  try { url = new URL(input); } catch {
    error.textContent = 'Esse link não parece válido. Cole um link público do Spotify.';
    return;
  }
  if (!['open.spotify.com', 'spotify.link'].includes(url.hostname)) {
    error.textContent = 'Use um link de open.spotify.com ou spotify.link.';
    return;
  }
  // spotify.link redirects are not reliably embeddable; ask for the canonical URL.
  if (url.hostname === 'spotify.link') {
    error.textContent = 'Abra esse link no Spotify e copie o link completo de open.spotify.com.';
    return;
  }
  const parts = url.pathname.split('/').filter(Boolean);
  const supported = ['playlist', 'album', 'track', 'artist', 'episode', 'show'];
  const typeIndex = parts.findIndex(part => supported.includes(part));
  if (typeIndex < 0 || !parts[typeIndex + 1]) {
    error.textContent = 'Não encontrei uma playlist, álbum, faixa ou artista nesse link.';
    return;
  }
  const type = parts[typeIndex];
  const id = parts[typeIndex + 1].split('?')[0];
  if (!/^[A-Za-z0-9]+$/.test(id)) {
    error.textContent = 'O link não contém um ID válido do Spotify.';
    return;
  }
  const iframe = document.createElement('iframe');
  iframe.title = 'Player oficial do Spotify';
  iframe.src = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  iframe.loading = 'lazy';
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  embed.appendChild(iframe);
  toast('seu cantinho musical está pronto ♫');
  fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(input)}`)
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (!data?.thumbnail_url) return;
      const cover = $('#playlist-cover');
      cover.style.backgroundImage = `url("${data.thumbnail_url}")`;
      cover.classList.add('has-cover');
    })
    .catch(() => console.warn('Não foi possível carregar a capa pública da playlist do Spotify.'));
}
$('#spotify-embed').addEventListener('error', () => {
  $('#spotify-error').textContent = 'O Spotify não respondeu. Você ainda pode abrir a playlist pelo botão acima.';
});
$('#spotify-form').addEventListener('submit', event => {
  event.preventDefault();
  loadSpotify($('#spotify-url').value.trim());
});
loadSpotify($('#spotify-url').value.trim());

// Tiny journal: saved locally in the browser, never sent to a server.
const journalInput = $('#journal-entry');
const journalStatus = $('#journal-status');
const journalKey = 'velvetJournalEntry';
const savedEntry = localStorage.getItem(journalKey);
if (savedEntry) journalInput.value = savedEntry;
function updateCount() { $('#char-count').textContent = `${journalInput.value.length} / 600`; }
updateCount();
journalInput.addEventListener('input', updateCount);
$('#journal-form').addEventListener('submit', event => {
  event.preventDefault();
  localStorage.setItem(journalKey, journalInput.value);
  journalStatus.textContent = journalInput.value.trim()
    ? 'guardado neste navegador com carinho ♡'
    : 'diário limpo. quando quiser, escreva uma nova memória.';
  toast('seu diário foi salvo ♡');
});

// Guestbook heart button
let heartCount = Number(localStorage.getItem('velvetHeartCount') || 0);
function renderHearts() {
  $('#heart-message').textContent = `${heartCount} ${heartCount === 1 ? 'coração enviado' : 'corações enviados'}`;
}
renderHearts();
$('#heart-button').addEventListener('click', () => {
  heartCount += 1;
  localStorage.setItem('velvetHeartCount', String(heartCount));
  renderHearts();
  $('#heart-button').textContent = '♥';
  toast('um coraçãozinho enviado para o universo ♡');
  setTimeout(() => { $('#heart-button').textContent = '♡'; }, 700);
});

// Back to top
$('#back-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const scrollProgress = $('#scroll-progress');
function updateScrollChrome() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0;
  scrollProgress.style.setProperty('--scroll-progress', `${progress}%`);
  $('#back-top').classList.toggle('visible', window.scrollY > 420);
}
window.addEventListener('scroll', updateScrollChrome, { passive: true });
updateScrollChrome();

$$('.scrap-card, .artist-card, .social-card, .love-tile').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (document.body.classList.contains('reduce-motion')) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
  });
});

if ('IntersectionObserver' in window && !document.body.classList.contains('reduce-motion')) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.window').forEach(windowElement => {
    if (!windowElement.classList.contains('hero')) revealObserver.observe(windowElement);
  });
}

// Keep active section in the navigation as the page scrolls.
if ('IntersectionObserver' in window) {
  const sections = $$('main [id]');
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, .25, .5] });
  sections.forEach(section => observer.observe(section));
}

// Scrapbook filters and accessible details modal
const galleryFilters = $$('.gallery-filter');
const scrapCards = $$('.scrap-card');
galleryFilters.forEach(filter => {
  filter.addEventListener('click', () => {
    galleryFilters.forEach(item => item.classList.toggle('active', item === filter));
    scrapCards.forEach(card => {
      card.hidden = filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter;
    });
  });
});
const scrapModal = $('#scrap-modal');
const scrapEditModal = $('#scrap-edit-modal');
let activeScrapCard = null;
function closeScrapModal() { scrapModal.hidden = true; }
function closeScrapEditModal() { scrapEditModal.hidden = true; }
function openScrapEditModal(card) {
  $('#scrap-edit-name').value = card.dataset.title;
  $('#scrap-edit-description').value = card.dataset.note;
  scrapEditModal.hidden = false;
  $('#scrap-edit-name').focus();
}
scrapCards.forEach(card => {
  card.addEventListener('click', () => {
    activeScrapCard = card;
    $('#scrap-modal-title').textContent = card.dataset.title;
    $('#scrap-modal-note').textContent = card.dataset.note;
    const art = card.querySelector('.scrap-art');
    $('#scrap-modal-preview').style.backgroundImage = art.style.backgroundImage || getComputedStyle(art).backgroundImage;
    scrapModal.hidden = false;
    $('#scrap-modal-close').focus();
  });
});
$('#scrap-modal-edit').addEventListener('click', () => {
  if (!activeScrapCard) return;
  closeScrapModal();
  openScrapEditModal(activeScrapCard);
});
$('#scrap-modal-delete').addEventListener('click', () => {
  if (!activeScrapCard?.dataset.custom) {
    toast('as memórias originais não podem ser apagadas');
    return;
  }
  if (!window.confirm('Excluir esta memória?')) return;
  activeScrapCard.remove();
  saveCustomScraps();
  closeScrapModal();
  toast('memória excluída');
});
$('#scrap-modal-close').addEventListener('click', closeScrapModal);
$('#scrap-modal-ok').addEventListener('click', closeScrapModal);
scrapModal.addEventListener('click', event => { if (event.target === scrapModal) closeScrapModal(); });
$('#scrap-edit-close').addEventListener('click', closeScrapEditModal);
$('#scrap-edit-cancel').addEventListener('click', closeScrapEditModal);
scrapEditModal.addEventListener('click', event => { if (event.target === scrapEditModal) closeScrapEditModal(); });
$('#scrap-edit-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!activeScrapCard) return;
  const title = $('#scrap-edit-name').value.trim();
  if (!title) return;
  activeScrapCard.dataset.title = title;
  activeScrapCard.dataset.note = $('#scrap-edit-description').value.trim() || 'Uma memória adicionada ao seu scrapbook.';
  activeScrapCard.querySelector('strong').textContent = title;
  saveCustomScraps();
  closeScrapEditModal();
  toast('memória atualizada ♡');
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeScrapModal();
  closeScrapEditModal();
});

// Personalization settings, themes, mobile navigation and scrapbook additions.
const defaultSettings = {
  siteName: 'ray\'s room',
  pageTitle: 'Velvet Room ♡ my little universe',
  profileNote: 'professional daydreamer',
  instagram: 'https://instagram.com/rayyxv._',
  tiktok: 'https://www.tiktok.com/iukyuki',
  spotify: 'https://open.spotify.com/playlist/4KjUgnIVcIbNe5uZz3BkWz',
  profileImage: '',
  accent: '#ff78bd',
  cursor: 'star'
};
const settings = { ...defaultSettings, ...readStored('velvetSettings', {}) };
function readImage(file, callback) {
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) {
    toast('a imagem deve ter no máximo 3 MB');
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(String(reader.result)));
  reader.readAsDataURL(file);
}
function applySettings() {
  $('#setting-site-name').value = settings.siteName;
  $('#setting-page-title').value = settings.pageTitle;
  $('#setting-profile-note').value = settings.profileNote;
  $('#setting-instagram').value = settings.instagram;
  $('#setting-tiktok').value = settings.tiktok;
  $('#setting-spotify').value = settings.spotify;
  $('#setting-profile-image').value = settings.profileImage;
  $('#setting-accent').value = settings.accent;
  $('#setting-cursor').value = settings.cursor;
  document.documentElement.style.setProperty('--pink', settings.accent);
  document.body.classList.toggle('normal-cursor', settings.cursor === 'normal');
  const profileName = $('.mini-profile h2');
  if (profileName) profileName.textContent = settings.siteName;
  document.title = settings.pageTitle;
  const profileNote = $('.mini-profile h2 + .muted');
  if (profileNote) profileNote.textContent = settings.profileNote;
  $$('.social-card').forEach(card => {
    const title = card.querySelector('strong')?.textContent.toLowerCase();
    if (title === 'instagram') card.href = settings.instagram;
    if (title === 'tiktok') card.href = settings.tiktok;
    if (title === 'spotify') card.href = settings.spotify;
  });
  if (settings.profileImage) {
    const avatar = $('.avatar');
    avatar.textContent = '';
    avatar.style.background = `url("${settings.profileImage}") center/cover`;
  }
}
['site-name', 'page-title', 'profile-note', 'instagram', 'tiktok', 'spotify', 'profile-image', 'accent', 'cursor'].forEach(name => {
  const field = $(`#setting-${name}`);
  const updateSetting = event => {
    const key = name.replaceAll('-', '');
    settings[key] = event.target.value.trim();
    if (name === 'site-name') settings.siteName = event.target.value.trim();
    if (name === 'page-title') settings.pageTitle = event.target.value.trim();
    if (name === 'profile-note') settings.profileNote = event.target.value.trim();
    if (name === 'profile-image') settings.profileImage = event.target.value.trim();
    if (name === 'accent') settings.accent = event.target.value;
    if (name === 'cursor') settings.cursor = event.target.value;
    localStorage.setItem('velvetSettings', JSON.stringify(settings));
    applySettings();
    markEditorDirty();
  };
  field.addEventListener('input', updateSetting);
  if (name === 'cursor') field.addEventListener('change', updateSetting);
});
$$('.editor-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.editor-tab').forEach(item => item.classList.toggle('active', item === tab));
  $$('.editor-tab-panel').forEach(panel => {
    const active = panel.dataset.editorPanel === tab.dataset.editorTab;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
}));
$('#setting-profile-file').addEventListener('change', event => {
  readImage(event.target.files[0], image => {
    settings.profileImage = image;
    localStorage.setItem('velvetSettings', JSON.stringify(settings));
    applySettings();
    markEditorDirty();
  });
});
applySettings();

const themes = {
  velvet: { pink: '#ff78bd', purple: '#b89aff', mint: '#9ef4dc' },
  ruby: { pink: '#ff5f91', purple: '#d46bff', mint: '#ffc0cb' },
  moon: { pink: '#8db7ff', purple: '#7b6cff', mint: '#9ef4dc' },
  dreamy: { pink: '#ffb8e3', purple: '#c7a6ff', mint: '#b9fff0' },
  bts: { pink: '#b68cff', purple: '#7d63b8', mint: '#e5d8ff' },
  jennie: { pink: '#ff789f', purple: '#d18cff', mint: '#ffd0dc' },
  mono: { pink: '#f1f1f1', purple: '#aaa', mint: '#ddd' }
};
function applyTheme(theme) {
  const colors = themes[theme] || themes.velvet;
  Object.entries(colors).forEach(([name, value]) => document.documentElement.style.setProperty(`--${name}`, value));
  if (settings.accent) document.documentElement.style.setProperty('--pink', settings.accent);
  document.body.dataset.theme = theme;
  localStorage.setItem('velvetTheme', theme);
  if (typeof markEditorDirty === 'function') markEditorDirty();
  $$('.theme-options button').forEach(button => button.classList.toggle('active', button.dataset.theme === theme));
}
$$('.theme-options button').forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.theme)));
$('#theme-toggle').addEventListener('click', () => {
  const order = ['velvet', 'ruby', 'moon', 'dreamy', 'bts', 'jennie', 'mono'];
  applyTheme(order[(order.indexOf(document.body.dataset.theme) + 1) % order.length]);
  toast(`tema ${document.body.dataset.theme} aplicado`);
});
applyTheme(localStorage.getItem('velvetTheme') || 'velvet');

$('#mobile-menu-toggle').addEventListener('click', () => {
  $('.nav-window').classList.toggle('menu-open');
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => $('.nav-window').classList.remove('menu-open')));

function renderScrapCard(card) {
  card.addEventListener('click', () => {
    activeScrapCard = card;
    $('#scrap-modal-title').textContent = card.dataset.title;
    $('#scrap-modal-note').textContent = card.dataset.note;
    $('#scrap-modal-preview').style.backgroundImage = card.querySelector('.scrap-art').style.backgroundImage;
    scrapModal.hidden = false;
    $('#scrap-modal-close').focus();
  });
}
function saveCustomScraps() {
  const cards = $$('.scrap-card[data-custom="true"]').map(card => ({
    image: card.dataset.image || card.querySelector('.scrap-art').style.backgroundImage.slice(5, -2),
    title: card.dataset.title,
    note: card.dataset.note,
    category: card.dataset.category
  }));
  localStorage.setItem('velvetCustomScraps', JSON.stringify(cards));
}
function addScrapCard({ image, title, note = 'Uma memória adicionada ao seu scrapbook.', category = 'mood' }) {
  const card = document.createElement('button');
  card.className = 'scrap-card';
  card.dataset.category = category;
  card.dataset.title = title;
  card.dataset.note = note;
  card.dataset.image = image;
  card.dataset.custom = 'true';
  const tape = document.createElement('span');
  tape.className = 'scrap-tape';
  const art = document.createElement('span');
  art.className = 'scrap-art art-photo';
  art.role = 'img';
  art.ariaLabel = title;
  const heading = document.createElement('strong');
  heading.textContent = title;
  const caption = document.createElement('small');
  caption.textContent = 'personal archive';
  card.append(tape, art, heading, caption);
  art.style.backgroundImage = `url("${image}")`;
  $('.scrapbook-grid').appendChild(card);
  scrapCards.push(card);
  renderScrapCard(card);
}
readStored('velvetCustomScraps', []).forEach(addScrapCard);
$('#add-scrap-card').addEventListener('click', () => {
  const file = $('#scrap-image-file').files[0];
  const imageUrl = $('#scrap-image-url').value.trim();
  const title = $('#scrap-image-title').value.trim() || 'new memory';
  if (!imageUrl && !file) {
    toast('cole o link de uma imagem primeiro');
    return;
  }
  const finish = image => { addScrapCard({ image, title }); saveCustomScraps(); };
  file ? readImage(file, finish) : finish(imageUrl);
  $('#scrap-image-url').value = '';
  $('#scrap-image-file').value = '';
  $('#scrap-image-title').value = '';
  toast('memória adicionada ao scrapbook ♡');
});

$('#export-settings').addEventListener('click', () => {
  const data = {
    texts: editableTexts.map(element => element.textContent),
    settings,
    theme: localStorage.getItem('velvetTheme') || 'velvet',
    reducedMotion: localStorage.getItem('velvetReducedMotion') === 'true',
    scraps: readStored('velvetCustomScraps', [])
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'velvet-room-backup.json';
  link.click();
  URL.revokeObjectURL(url);
  toast('backup exportado ♡');
});
$('#import-settings').addEventListener('click', () => $('#import-settings-file').click());
$('#import-settings-file').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (Array.isArray(data.texts)) localStorage.setItem('velvetCustomTexts', JSON.stringify(data.texts));
      if (data.settings && typeof data.settings === 'object') localStorage.setItem('velvetSettings', JSON.stringify({ ...defaultSettings, ...data.settings }));
      if (Array.isArray(data.scraps)) localStorage.setItem('velvetCustomScraps', JSON.stringify(data.scraps));
      if (data.theme) localStorage.setItem('velvetTheme', data.theme);
      if (typeof data.reducedMotion === 'boolean') localStorage.setItem('velvetReducedMotion', String(data.reducedMotion));
      location.reload();
    } catch {
      $('#editor-status').textContent = 'arquivo inválido. Escolha um backup do Velvet Room.';
    }
  });
  reader.readAsText(file);
});
$('#reset-all-settings').addEventListener('click', () => {
  if (!confirm('Apagar toda a personalização deste navegador?')) return;
  ['velvetCustomTexts', 'velvetSettings', 'velvetTheme', 'velvetReducedMotion', 'velvetCustomScraps'].forEach(key => localStorage.removeItem(key));
  location.reload();
});

// Keep link fields safe and avoid navigating to unsupported schemes.
$$('.editor-settings input[type="url"]').forEach(input => {
  input.addEventListener('blur', () => {
    if (!input.value) return;
    try {
      const url = new URL(input.value);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol');
    } catch {
      input.setCustomValidity('Use um link começando com https://');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
  });
});

const savedReducedMotion = localStorage.getItem('velvetReducedMotion') === 'true';
if (savedReducedMotion) document.body.classList.add('reduce-motion');
const motionToggle = document.createElement('button');
motionToggle.type = 'button';
motionToggle.className = 'motion-toggle';
motionToggle.textContent = savedReducedMotion ? 'animações: off' : 'animações: on';
motionToggle.addEventListener('click', () => {
  document.body.classList.toggle('reduce-motion');
  const reduced = document.body.classList.contains('reduce-motion');
  localStorage.setItem('velvetReducedMotion', String(reduced));
  motionToggle.textContent = reduced ? 'animações: off' : 'animações: on';
  markEditorDirty();
});
textEditorPanel.querySelector('.theme-options').append(motionToggle);

document.addEventListener('click', event => {
  if (document.body.classList.contains('reduce-motion')) return;
  const sparkle = document.createElement('span');
  sparkle.className = 'click-sparkle';
  sparkle.textContent = '✦';
  sparkle.style.left = `${event.clientX}px`;
  sparkle.style.top = `${event.clientY}px`;
  $('#click-sparkles').appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 650);
});
