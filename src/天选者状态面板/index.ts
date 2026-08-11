import _ from 'lodash';
import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

// 把当前 iframe 固定到屏幕左侧,脱离消息流
// 使用 !important 防止酒馆助手的 iframe 高度自适应逻辑覆盖
let _applying = false;
function pinIframeToLeft() {
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (!iframe) {
    console.warn('[天选者状态面板] 无法获取 iframe 元素,跳过侧边定位');
    return;
  }
  if (_applying) return;
  _applying = true;

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

  _applying = false;
}

$(async () => {
  pinIframeToLeft();

  // 酒馆助手会持续调整 iframe 的 style 属性,需要观察并在被覆盖后重新应用
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (iframe) {
    const observer = new MutationObserver(pinIframeToLeft);
    observer.observe(iframe, { attributes: true, attributeFilter: ['style', 'class'] });
    // 兜底: 定时器也定期重新应用
    setInterval(pinIframeToLeft, 1000);
    $(window).on('pagehide', () => observer.disconnect());
  }

  try {
    await waitGlobalInitialized('Mvu');
    await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'), { timeout: 8000 });
  } catch (e) {
    console.warn('[天选者状态面板] 等待 Mvu/stat_data 超时,尝试用默认数据挂载', e);
  }

  createApp(App).use(createPinia()).mount('#app');
  pinIframeToLeft();
  console.info('[天选者状态面板] 已挂载, iframe 尺寸:', iframe?.offsetWidth, 'x', iframe?.offsetHeight);
});
