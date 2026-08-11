import _ from 'lodash';
import App from './App.vue';
import './global.css';

const PANEL_WIDTH = 420;
const PANEL_MARGIN = 8;

// 把 iframe 从消息流中剥离,移到酒馆 body 下,固定到左侧背景区
// 这样面板浮在左侧原本显示背景图的空白区,不再挤压对话
function detachAndPinIframe() {
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (!iframe) {
    console.warn('[天选者状态面板] 无法获取 iframe 元素');
    return;
  }

  const parent_doc = window.parent.document;

  // 首次调用: 把 iframe 从消息流中剥离,移到酒馆 body 直接子元素
  // 这样它彻底脱离消息流,不会随消息滚动,也不会被 .mes_text 样式干扰
  if (iframe.parentElement !== parent_doc.body) {
    const $old_parent = $(iframe).parent();
    // 隐藏消息流里残留的空占位父元素(code/pre/div),但不动 .mes_text 本身
    if ($old_parent.length && !$old_parent.hasClass('mes_text') && !$old_parent.is('body')) {
      $old_parent.css('display', 'none');
    }
    parent_doc.body.appendChild(iframe);
    console.info('[天选者状态面板] 已将 iframe 移至酒馆 body 下');
  }

  // fixed 定位到左侧背景区
  const s = iframe.style;
  s.setProperty('position', 'fixed', 'important');
  s.setProperty('left', `${PANEL_MARGIN}px`, 'important');
  s.setProperty('top', `${PANEL_MARGIN}px`, 'important');
  s.setProperty('height', `calc(100vh - ${PANEL_MARGIN * 2}px)`, 'important');
  s.setProperty('width', `${PANEL_WIDTH}px`, 'important');
  s.setProperty('z-index', '9999', 'important');
  s.setProperty('border', '1px solid rgba(45, 53, 97, 0.6)', 'important');
  s.setProperty('border-radius', '12px', 'important');
  s.setProperty('box-shadow', '0 8px 32px rgba(0, 0, 0, 0.5)', 'important');
  s.setProperty('background', 'transparent', 'important');
}

function cleanup() {
  // 卸载时移除 iframe(已移到 body 下,不会随消息流自动清理)
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (iframe && iframe.parentElement === window.parent.document.body) {
    iframe.remove();
  }
}

$(async () => {
  detachAndPinIframe();

  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (iframe) {
    // 酒馆助手可能调整 iframe style,监听并重新应用
    const observer = new MutationObserver(detachAndPinIframe);
    observer.observe(iframe, { attributes: true, attributeFilter: ['style', 'class'] });
    // 兜底定时器
    setInterval(detachAndPinIframe, 1000);
    $(window).on('pagehide', () => {
      observer.disconnect();
      cleanup();
    });
  }

  // store 内部用 getVariables 容错读取,schema 填充默认值
  // 即使 MVU 未初始化当前楼层,面板也能用默认数据(1级、幸运999)显示
  try {
    createApp(App).use(createPinia()).mount('#app');
    console.info('[天选者状态面板] 已挂载到左侧背景区, iframe 尺寸:', iframe?.offsetWidth, 'x', iframe?.offsetHeight);
  } catch (e) {
    console.error('[天选者状态面板] 挂载失败', e);
    throw e;
  }
});
