import _ from 'lodash';
import App from './App.vue';
import './global.css';

// 把当前 iframe 固定到屏幕左侧,脱离消息流
// 使用 !important 防止酒馆助手的 iframe 高度自适应逻辑覆盖
function pinIframeToLeft() {
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (!iframe) {
    console.warn('[天选者状态面板] 无法获取 iframe 元素,跳过侧边定位');
    return;
  }

  const s = iframe.style;
  s.setProperty('position', 'fixed', 'important');
  s.setProperty('left', '8px', 'important');
  s.setProperty('top', '8px', 'important');
  s.setProperty('height', 'calc(100vh - 16px)', 'important');
  s.setProperty('width', '420px', 'important');
  s.setProperty('z-index', '9999', 'important');
  s.setProperty('border', '1px solid rgba(45, 53, 97, 0.6)', 'important');
  s.setProperty('border-radius', '12px', 'important');
  s.setProperty('box-shadow', '0 8px 32px rgba(0, 0, 0, 0.5)', 'important');
  s.setProperty('background', 'transparent', 'important');
}

// 在父页面(酒馆)注入 CSS,让对话区域让出左侧空间,避免被面板遮挡
const SIDEBAR_STYLE_ID = 'tavern-status-panel-sidebar-layout';
function injectSidebarLayout() {
  const parent_doc = window.parent.document;
  parent_doc.getElementById(SIDEBAR_STYLE_ID)?.remove();
  const style = parent_doc.createElement('style');
  style.id = SIDEBAR_STYLE_ID;
  // 420 面板 + 8 左边距 + 12 间隔 = 448px
  // 同时解除 #chat 自身的 max-width 限制,让它撑满剩余空间
  style.textContent = `
    @media (min-width: 900px) {
      #chat {
        margin-left: 448px !important;
        max-width: calc(100vw - 460px) !important;
        width: calc(100vw - 460px) !important;
      }
    }
  `;
  parent_doc.head.appendChild(style);
  console.info('[天选者状态面板] 已注入侧边布局样式');
}

function cleanup() {
  window.parent.document.getElementById(SIDEBAR_STYLE_ID)?.remove();
}

$(async () => {
  pinIframeToLeft();
  injectSidebarLayout();

  // 酒馆助手会持续调整 iframe 的 style 属性,需要观察并在被覆盖后重新应用
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (iframe) {
    const observer = new MutationObserver(pinIframeToLeft);
    observer.observe(iframe, { attributes: true, attributeFilter: ['style', 'class'] });
    setInterval(pinIframeToLeft, 1000);
    $(window).on('pagehide', () => {
      observer.disconnect();
      cleanup();
    });
  }

  // 不等待 stat_data: store 内部用 getVariables 容错读取,schema 会填充默认值
  // 这样即使 MVU 未初始化当前楼层,面板也能用默认数据(1级、幸运999)显示
  try {
    createApp(App).use(createPinia()).mount('#app');
    console.info('[天选者状态面板] 已挂载, iframe 尺寸:', iframe?.offsetWidth, 'x', iframe?.offsetHeight);
  } catch (e) {
    console.error('[天选者状态面板] 挂载失败', e);
    throw e;
  }
});
