import _ from 'https://testingcf.jsdelivr.net/npm/lodash@4.17.21/+esm';
import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

// 把当前 iframe 固定到屏幕左侧,脱离消息流
function pinIframeToLeft() {
  const iframe = window.frameElement as HTMLIFrameElement | null;
  if (!iframe) {
    console.warn('[天选者状态面板] 无法获取 iframe 元素,跳过侧边定位');
    return;
  }

  const $iframe = $(iframe);
  // 固定到左侧,420px 宽,高度撑满可视区域
  $iframe.css({
    position: 'fixed',
    left: '8px',
    top: '8px',
    bottom: '8px',
    width: '420px',
    height: 'auto',
    'z-index': 9999,
    border: '1px solid rgba(45, 53, 97, 0.6)',
    'border-radius': '12px',
    'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.5)',
    background: 'transparent',
  });

  // 隐藏 iframe 在消息楼层中的占位父容器(避免消息流里留空白)
  const $wrapper = $iframe.parent('.mes_text');
  if ($wrapper.length) {
    // 仅隐藏 iframe 的直接包裹层中的占位,保留其他内容
    $wrapper.children('code').hide();
  }

  console.info('[天选者状态面板] 已固定到屏幕左侧');
}

$(async () => {
  // 先把 iframe 固定到左侧,这样加载过程中就是侧边显示
  pinIframeToLeft();

  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));
  createApp(App).use(createPinia()).mount('#app');

  // 挂载完成后再次确认定位(防止被酒馆重新渲染覆盖)
  pinIframeToLeft();
});
