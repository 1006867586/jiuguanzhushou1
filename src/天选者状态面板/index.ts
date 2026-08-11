import _ from 'lodash';
import App from './App.vue';
import './global.css';

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT_RATIO = 0.96; // 视口高度比例
const MIN_WIDTH = 260;
const MIN_HEIGHT = 240;
const MARGIN = 8;

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
    height: Math.round(window.parent.innerHeight * DEFAULT_HEIGHT_RATIO),
    collapsed: false,
  };
}

// 在父页面注入控制条(标题栏含折叠按钮)+ resize handle
const CONTROL_ID = 'tavern-status-panel-controls';
function ensureControls(iframe: HTMLIFrameElement, layout: Layout) {
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
      height: 24px;
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

    // 折叠按钮点击
    const btn = bar.querySelector('#tavern-panel-collapse') as HTMLButtonElement;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const current = loadLayout() || getDefaultLayout();
      current.collapsed = !current.collapsed;
      saveLayout(current);
      applyLayout(iframe, current);
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
      const cur = loadLayout() || getDefaultLayout();
      startLeft = cur.left;
      startTop = cur.top;
      e.preventDefault();
    });
    parent_doc.addEventListener('mousemove', e => {
      if (!dragging) return;
      const cur = loadLayout() || getDefaultLayout();
      const new_left = Math.max(0, Math.min(window.parent.innerWidth - 60, startLeft + (e.clientX - startX)));
      const new_top = Math.max(0, Math.min(window.parent.innerHeight - 30, startTop + (e.clientY - startY)));
      cur.left = new_left;
      cur.top = new_top;
      saveLayout(cur);
      applyLayout(iframe, cur);
    });
    parent_doc.addEventListener('mouseup', () => {
      dragging = false;
    });

    // resize handle(右下角)
    const resize = parent_doc.createElement('div');
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
      const cur = loadLayout() || getDefaultLayout();
      rStartW = cur.width;
      rStartH = cur.height;
      e.preventDefault();
      e.stopPropagation();
    });
    parent_doc.addEventListener('mousemove', e => {
      if (!resizing) return;
      const cur = loadLayout() || getDefaultLayout();
      cur.width = Math.max(MIN_WIDTH, rStartW + (e.clientX - rStartX));
      cur.height = Math.max(MIN_HEIGHT, rStartH + (e.clientY - rStartY));
      cur.collapsed = false;
      saveLayout(cur);
      applyLayout(iframe, cur);
    });
    parent_doc.addEventListener('mouseup', () => {
      resizing = false;
    });
  }

  applyLayout(iframe, layout);
}

// 防止 MutationObserver 与 applyLayout 形成递归
let _applying = false;

function applyLayout(iframe: HTMLIFrameElement, layout: Layout) {
  if (_applying) return;
  _applying = true;
  try {
    _applyLayoutInternal(iframe, layout);
  } finally {
    _applying = false;
  }
}

function _applyLayoutInternal(iframe: HTMLIFrameElement, layout: Layout) {
  const parent_doc = window.parent.document;
  const wrap = parent_doc.getElementById(CONTROL_ID) as HTMLDivElement | null;
  if (!wrap) return;

  // 折叠时:只显示标题栏,隐藏 iframe 和 resize handle
  if (layout.collapsed) {
    wrap.style.left = `${layout.left}px`;
    wrap.style.top = `${layout.top}px`;
    wrap.style.width = `${layout.width}px`;
    wrap.style.height = `24px`;
    iframe.style.setProperty('display', 'none', 'important');
    const resize = wrap.querySelector('div[style*="nwse-resize"]') as HTMLDivElement | null;
    if (resize) resize.style.display = 'none';
    // 更新折叠按钮箭头
    const btn = wrap.querySelector('#tavern-panel-collapse') as HTMLButtonElement | null;
    if (btn) btn.textContent = '▸';
  } else {
    wrap.style.left = `${layout.left}px`;
    wrap.style.top = `${layout.top}px`;
    wrap.style.width = `${layout.width}px`;
    wrap.style.height = `${layout.height + 24}px`; // 标题栏 + iframe
    iframe.style.removeProperty('display');

    // iframe 紧贴标题栏下方
    const s = iframe.style;
    s.setProperty('position', 'fixed', 'important');
    s.setProperty('left', `${layout.left}px`, 'important');
    s.setProperty('top', `${layout.top + 24}px`, 'important');
    s.setProperty('width', `${layout.width}px`, 'important');
    s.setProperty('height', `${layout.height}px`, 'important');
    s.setProperty('z-index', '9999', 'important');
    s.setProperty('border', '1px solid rgba(45, 53, 97, 0.6)', 'important');
    s.setProperty('border-radius', '0 0 8px 8px', 'important');
    s.setProperty('box-shadow', '0 8px 32px rgba(0, 0, 0, 0.5)', 'important');
    s.setProperty('background', 'transparent', 'important');

    const resize = wrap.querySelector('div[style*="nwse-resize"]') as HTMLDivElement | null;
    if (resize) resize.style.display = '';
    const btn = wrap.querySelector('#tavern-panel-collapse') as HTMLButtonElement | null;
    if (btn) btn.textContent = '▾';
  }
}

function detachAndSetup() {
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (!iframe) {
    console.warn('[天选者状态面板] 无法获取 iframe 元素');
    return;
  }

  const parent_doc = window.parent.document;

  // 把 iframe 从消息流剥离到 body
  if (iframe.parentElement !== parent_doc.body) {
    const $old_parent = $(iframe).parent();
    if ($old_parent.length && !$old_parent.hasClass('mes_text') && !$old_parent.is('body')) {
      $old_parent.css('display', 'none');
    }
    parent_doc.body.appendChild(iframe);
    console.info('[天选者状态面板] 已将 iframe 移至酒馆 body 下');
  }

  const layout = getDefaultLayout();
  ensureControls(iframe, layout);
}

function cleanup() {
  const parent_doc = window.parent.document;
  parent_doc.getElementById(CONTROL_ID)?.remove();
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (iframe && iframe.parentElement === parent_doc.body) {
    iframe.remove();
  }
}

$(async () => {
  detachAndSetup();

  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (iframe) {
    // 酒馆助手可能调整 iframe style,监听并重新应用
    const observer = new MutationObserver(() => {
      const layout = getDefaultLayout();
      applyLayout(iframe, layout);
    });
    observer.observe(iframe, { attributes: true, attributeFilter: ['style', 'class'] });
    // 兜底定时器
    setInterval(() => {
      const layout = getDefaultLayout();
      applyLayout(iframe, layout);
    }, 1000);
    // 窗口尺寸变化时重新应用
    window.parent.addEventListener('resize', () => {
      const layout = getDefaultLayout();
      applyLayout(iframe, layout);
    });
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
