'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const handleIsTauri = () => Boolean(
  typeof window !== 'undefined'
  && window !== undefined,
);

function ThreeCube() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { appWindow, LogicalPosition } = require('@tauri-apps/api/window');

    const draggableHeader = document.getElementById('draggable-header');

    let isDragging = false;
    let initialMouseX = 0;
    let initialMouseY = 0;
    let initialWindowX = 0;
    let initialWindowY = 0;
    let requestAnimationFrameId = null;

    const getScale = () => window.devicePixelRatio;

    draggableHeader?.addEventListener('mousedown', async (event) => {
      isDragging = true;

      const scale = getScale();
      initialMouseX = event.screenX;
      initialMouseY = event.screenY;

      const position = await appWindow.innerPosition();
      initialWindowX = position.x;
      initialWindowY = position.y;

      event.preventDefault();
    });

    document.addEventListener('mousemove', async (event) => {
      if (isDragging) {
        const scale = getScale();
        console.log({ scale });

        const currentMouseX = event.screenX;
        const currentMouseY = event.screenY;

        const deltaX = currentMouseX - initialMouseX;
        const deltaY = currentMouseY - initialMouseY;

        if (requestAnimationFrameId) {
          cancelAnimationFrame(requestAnimationFrameId);
        }

        requestAnimationFrameId = requestAnimationFrame(async () => {
          const newPosition = new LogicalPosition(
            (initialWindowX + deltaX) / scale,
            (initialWindowY + deltaY) / scale,
          );
          await appWindow.setPosition(newPosition);
        });
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      if (requestAnimationFrameId) {
        cancelAnimationFrame(requestAnimationFrameId);
        requestAnimationFrameId = null;
      }
    });

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    mountRef?.current?.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.shiftKey && event.metaKey && event.key === 'x' && handleIsTauri()) {
        const {
          WebviewWindow, currentMonitor, LogicalSize, LogicalPosition,
        } = await import('@tauri-apps/api/window');

        const webview = new WebviewWindow('theUniqueLabel', {
          url: '/screen-shot/index.html',
          resizable: false,
          transparent: true,
          decorations: false,
        });
        // 在新窗口创建后，将其设置为全屏
        webview.once('tauri://created', async () => {
          try {
            // 获取当前显示器尺寸
            const monitor = await currentMonitor();
            const { size } = monitor;

            // 设置新窗口最大化
            await webview.setSize(new LogicalSize(size.width, size.height));
            await webview.setPosition(new LogicalPosition(0, 0));

            // 请求前置显示窗口
            await webview.setFocus();
          } catch (error) {
            console.error('Error setting window size or position:', error);
          }
        });

        // console.log({ webview });
        // 按下 Shift + Cmd + X 时触发事件
        // invoke('handle_shift_cmd_x').catch((error) => {
        //   console.error("Failed to invoke command:", error);
        // });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // 清除事件监听
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      id="draggable-header" ref={mountRef}
      style={{ width: '100%', height: '100%', cursor: 'grab' }} data-tauri-drag-region
    />
  );
}

export default ThreeCube;
