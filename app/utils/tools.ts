import { invoke } from '@tauri-apps/api/tauri';

const handleScreenshot = async () => {
  try {
    // 示例坐标与尺寸，你需要根据实际需要更新这些值
    const x = 100;
    const y = 100;
    const width = 300;
    const height = 200;

    const filePath = await invoke('take_screenshot', {
      x, y, width, height,
    });
    console.log({ filePath });
    // setScreenshotPath(filePath);
  } catch (error) {
    console.error('Failed to take screenshot:', error);
  }
};

export {
  handleScreenshot,
};
