import _ from 'lodash';
import App from './App.vue';
import './global.css';

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT_RATIO = 0.96;
const MIN_WIDTH = 260;
const MIN_HEIGHT = 240;
const MARGIN = 8;
const TITLE_BAR_HEIGHT = 24;

const STORAGE_KEY = 'tavern-status-panel-layout';

interface Layout {
  left: number;
  top: number;
  width: number;
  height: number;
  collapsed: boolean;
}

function loadLayout(): Layout | null {
  try {
    const raw = window.parent.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data.left !== 'number' || typeof data.width !== 'number') return null;
    return data;
  } catch {
    return null;
  }
}

function saveLayout(layout: Layout) {
  try {
    window.parent.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {
    /* 忽略存储失败 */
  }
}

function getDefaultLayout(): Layout {
  const saved = loadLayout();
  if (saved) return saved;
  return {
    left: MARGIN,
    top: MARGIN,
    width: DEFAULT_WIDTH,
    height: Math.round(window.parent.innerHeight * DEFAULT_HEIGHT_RATIO) - TITLE_BAR_HEIGHT - MARGIN,
    collapsed: false,
  };
}

// 在父页面注入标题栏(拖动手柄+折叠按钮)+ resize handle
const CONTROL_ID = 'tavern-status-panel-controls';
function ensureControls(layout: Layout) {
  const parent_doc = window.parent.document;
  let wrap = parent_doc.getElementById(CONTROL_ID) as HTMLDivElement | null;

  if (!wrap) {
    wrap = parent_doc.createElement('div');
    wrap.id = CONTROL_ID;
    wrap.style.cssText = `
      position: fixed;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      pointer-events: none;
    `;
    parent_doc.body.appendChild(wrap);

    // 标题栏(拖动手柄 + 折叠按钮)
    const bar = parent_doc.createElement('div');
    bar.style.cssText = `
      pointer-events: auto;
      cursor: move;
      user-select: none;
      height: ${TITLE_BAR_HEIGHT}px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      background: linear-gradient(135deg, rgba(45,53,97,0.95), rgba(31,38,71,0.95));
      color: #a8b9ff;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid rgba(45,53,97,0.6);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      backdrop-filter: blur(8px);
    `;
    bar.innerHTML = `<span>🎲 天选者状态</span><button id="tavern-panel-collapse" style="background:none;border:none;color:#a8b9ff;cursor:pointer;font-size:14px;padding:0 4px;line-height:1;">▾</button>`;
    wrap.appendChild(bar);

    // 折叠按钮
    const btn = bar.querySelector('#tavern-panel-collapse') as HTMLButtonElement;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const current = getDefaultLayout();
      current.collapsed = !current.collapsed;
      saveLayout(current);
      applyLayout(current);
    });

    // 拖动逻辑
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    bar.addEventListener('mousedown', e => {
      if ((e.target as HTMLElement).tagName === 'BUTTON') return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const cur = getDefaultLayout();
      startLeft = cur.left;
      startTop = cur.top;
      e.preventDefault();
    });
    parent_doc.addEventListener('mousemove', e => {
      if (!dragging) return;
      const cur = getDefaultLayout();
      cur.left = Math.max(0, Math.min(window.parent.innerWidth - 60, startLeft + (e.clientX - startX)));
      cur.top = Math.max(0, Math.min(window.parent.innerHeight - 30, startTop + (e.clientY - startY)));
      saveLayout(cur);
      applyLayout(cur);
    });
    parent_doc.addEventListener('mouseup', () => {
      dragging = false;
    });

    // resize handle(右下角)
    const resize = parent_doc.createElement('div');
    resize.dataset.role = 'resize';
    resize.style.cssText = `
      pointer-events: auto;
      position: absolute;
      right: 0;
      bottom: 0;
      width: 14px;
      height: 14px;
      cursor: nwse-resize;
      background: linear-gradient(135deg, transparent 50%, rgba(168,185,255,0.6) 50%);
      border-radius: 0 0 8px 0;
    `;
    wrap.appendChild(resize);

    let resizing = false;
    let rStartX = 0;
    let rStartY = 0;
    let rStartW = 0;
    let rStartH = 0;
    resize.addEventListener('mousedown', e => {
      resizing = true;
      rStartX = e.clientX;
      rStartY = e.clientY;
      const cur = getDefaultLayout();
      rStartW = cur.width;
      rStartH = cur.height;
      e.preventDefault();
      e.stopPropagation();
    });
    parent_doc.addEventListener('mousemove', e => {
      if (!resizing) return;
      const cur = getDefaultLayout();
      cur.width = Math.max(MIN_WIDTH, rStartW + (e.clientX - rStartX));
      cur.height = Math.max(MIN_HEIGHT, rStartH + (e.clientY - rStartY));
      cur.collapsed = false;
      saveLayout(cur);
      applyLayout(cur);
    });
    parent_doc.addEventListener('mouseup', () => {
      resizing = false;
    });

    console.info('[天选者状态面板] 已注入控制条(拖动标题栏移动/右下角缩放/点击▾折叠)');
  }

  applyLayout(layout);
}

// 防止 MutationObserver 与 applyLayout 递归
let _applying = false;

const IFRAME_ID = 'tavern-status-panel-iframe';
const IFRAME_STYLE_ID = 'tavern-status-panel-iframe-style';

// 在父页面注入一个 <style> 标签,用属性选择器锁定 iframe
// CSS 规则(选择器 + !important)的优先级高于 inline style 的 !important
// (同为 important 时,选择器特异性高的胜出),酒馆助手改 iframe style 属性也无法覆盖
function injectIframeStyle(layout: Layout) {
  const parent_doc = window.parent.document;
  let style_el = parent_doc.getElementById(IFRAME_STYLE_ID) as HTMLStyleElement | null;
  if (!style_el) {
    style_el = parent_doc.createElement('style');
    style_el.id = IFRAME_STYLE_ID;
    parent_doc.head.appendChild(style_el);
  }

  if (layout.collapsed) {
    style_el.textContent = `
      #${IFRAME_ID} {
        display: none !important;
      }
    `;
  } else {
    style_el.textContent = `
      #${IFRAME_ID} {
        position: fixed !important;
        left: ${layout.left}px !important;
        top: ${layout.top + TITLE_BAR_HEIGHT}px !important;
        width: ${layout.width}px !important;
        height: ${layout.height}px !important;
        z-index: 9999 !important;
        border: 1px solid rgba(45, 53, 97, 0.6) !important;
        border-radius: 0 0 8px 8px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
        background: transparent !important;
        display: block !important;
      }
    `;
  }
}

function applyLayout(layout: Layout) {
  if (_applying) return;
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (!iframe) return;

  _applying = true;
  try {
    const parent_doc = window.parent.document;
    const wrap = parent_doc.getElementById(CONTROL_ID) as HTMLDivElement | null;
    if (!wrap) return;

    // 给 iframe 打上 id,让注入的 <style> 能锁定它
    if (iframe.id !== IFRAME_ID) iframe.id = IFRAME_ID;

    const btn = wrap.querySelector('#tavern-panel-collapse') as HTMLButtonElement | null;
    const resize = wrap.querySelector('[data-role="resize"]') as HTMLDivElement | null;

    if (layout.collapsed) {
      wrap.style.left = `${layout.left}px`;
      wrap.style.top = `${layout.top}px`;
      wrap.style.width = `${layout.width}px`;
      wrap.style.height = `${TITLE_BAR_HEIGHT}px`;
      if (resize) resize.style.display = 'none';
      if (btn) btn.textContent = '▸';
    } else {
      wrap.style.left = `${layout.left}px`;
      wrap.style.top = `${layout.top}px`;
      wrap.style.width = `${layout.width}px`;
      wrap.style.height = `${layout.height + TITLE_BAR_HEIGHT}px`;
      if (resize) resize.style.display = '';
      if (btn) btn.textContent = '▾';
    }

    // 关键: 用注入的 <style> 规则覆盖 iframe 样式,而非 inline style
    // 这样即使酒馆助手修改 iframe.style 属性,也无法覆盖这里的规则
    injectIframeStyle(layout);
  } finally {
    _applying = false;
  }
}

// 把 iframe 原来的占位父元素(消息流中的 code/pre/div)压扁,减少消息流空白
// 不移动 iframe 本身,避免浏览器重载 iframe 内容导致 Vue 崩溃
function collapsePlaceholder() {
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (!iframe) return;
  const $parent = $(iframe).parent();
  if ($parent.length && !$parent.hasClass('mes_text') && !$parent.is('body')) {
    $parent.css({ height: '0', overflow: 'hidden', margin: '0', padding: '0', border: 'none' });
  }
}

function cleanup() {
  const parent_doc = window.parent.document;
  parent_doc.getElementById(CONTROL_ID)?.remove();
  parent_doc.getElementById(IFRAME_STYLE_ID)?.remove();
}

$(async () => {
  collapsePlaceholder();
  ensureControls(getDefaultLayout());

  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (iframe) {
    // 酒馆助手可能调整 iframe style,监听并重新应用布局
    const observer = new MutationObserver(() => applyLayout(getDefaultLayout()));
    observer.observe(iframe, { attributes: true, attributeFilter: ['style', 'class'] });
    setInterval(() => applyLayout(getDefaultLayout()), 1000);
    window.parent.addEventListener('resize', () => applyLayout(getDefaultLayout()));
    $(window).on('pagehide', () => {
      observer.disconnect();
      cleanup();
    });
  }

  try {
    createApp(App).use(createPinia()).mount('#app');
    console.info('[天选者状态面板] 已挂载,支持拖动/缩放/折叠');
  } catch (e) {
    console.error('[天选者状态面板] 挂载失败', e);
    throw e;
  }
});
