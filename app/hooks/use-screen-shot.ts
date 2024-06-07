'use client';

import { useEffect } from 'react';

async function fetchMonitors() {
  const { invoke } = require('@tauri-apps/api');

  try {
    const monitors = await invoke('get_monitors');
    console.log('Monitors:', monitors);
    // 可以在此处进一步处理 monitors 结果，如更新 UI 等
  } catch (error) {
    console.error('Failed to get monitors:', error);
  }
}
const handleIsTauri = () => Boolean(
  typeof window !== 'undefined'
  && window !== undefined,
);
const newWindow = async () => {
  const {
    WebviewWindow, currentMonitor, LogicalSize, LogicalPosition,
  } = await import('@tauri-apps/api/window');
  const res = await fetchMonitors()
  console.log({res})
  const filepath = '33333';
  const webview = new WebviewWindow('theUniqueLabel', {
    url: `/screen-shot/index.html?screenshot=${filepath}`,
    resizable: false,
    transparent: true,
    decorations: false,
    // alwaysOnTop: true,
    fullscreen: false,
    maximized: true,
    // height: 3000,
    x: 0,
    y: -400
  });
  // 在新窗口创建后，将其设置为全屏
  webview.once('tauri://created', async () => {
    try {
      // 获取当前显示器尺寸
      const monitor = await currentMonitor();
      console.log({monitor})
      const { size } = monitor;

      // 设置新窗口最大化
      await webview.setSize(new LogicalSize(size.width, size.height));
      await webview.setAlwaysOnTop(true)
      await webview.setPosition(new LogicalPosition(0, -1000));
      // await webview.maximize();

      // 请求前置显示窗口
      // await webview.setFocus();
    } catch (error) {
      console.error('Error setting window size or position:', error);
    }
  });
  console.log({ webview });
  return webview;
};

export function useScreenShot() {
  useEffect(() => {
    let currWindow;
    const handleKeyDown = async (event) => {
      const { shiftKey, metaKey, key } = event;
      console.log({ key });
      if (handleIsTauri()) {
        switch (key) {
          case 'x':
            shiftKey && metaKey && (currWindow = await newWindow());
            break;
          case 'Escape':
            currWindow?.close();
            break;
          default:
        }
        console.log(87678987);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // 清除事件监听
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
