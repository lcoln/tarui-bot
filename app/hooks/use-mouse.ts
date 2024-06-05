'use client';

import { useEffect } from 'react';

export function useMouse() {
  useEffect(() => {
    const {
      appWindow, LogicalPosition, currentMonitor,
    } = require('@tauri-apps/api/window');

    const draggableHeader = document.getElementById('draggable-header');

    let isDragging = false;
    let initialMouseX = 0;
    let initialMouseY = 0;
    let initialWindowX = 0;
    let initialWindowY = 0;
    let scaleFactor = window.devicePixelRatio;
    let requestAnimationFrameId = null;

    const updateInitialCoordinates = async () => {
      const monitor = await currentMonitor();
      scaleFactor = monitor?.scaleFactor || window.devicePixelRatio;

      const position = await appWindow.innerPosition();
      initialWindowX = position.x;
      initialWindowY = position.y;
    };

    const handleMouseDown = async (event) => {
      isDragging = true;

      await updateInitialCoordinates();
      initialMouseX = event.screenX;
      initialMouseY = event.screenY;

      event.preventDefault();
      draggableHeader?.addEventListener('mouseup', handleMouseUp);
      draggableHeader?.addEventListener('mousemove', handleMouseMove);
    };

    const handleMouseMove = async (event) => {
      console.log(event.screenX, 'event.screenX');
      if (isDragging) {
        const currentMouseX = event.screenX;
        const currentMouseY = event.screenY;

        const deltaX = currentMouseX - initialMouseX;
        const deltaY = currentMouseY - initialMouseY;

        if (requestAnimationFrameId) {
          cancelAnimationFrame(requestAnimationFrameId);
        }
        requestAnimationFrameId = requestAnimationFrame(async () => {
          const newX = initialWindowX + deltaX;
          const newY = initialWindowY + deltaY;

          const newPosition = new LogicalPosition(newX / scaleFactor, newY / scaleFactor);
          await appWindow.setPosition(newPosition);
        });
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      initialMouseX = 0;
      initialMouseY = 0;
      initialWindowX = 0;
      initialWindowY = 0;
      console.log('handleMouseUp');
      if (requestAnimationFrameId) {
        cancelAnimationFrame(requestAnimationFrameId);
        requestAnimationFrameId = null;
      }
      draggableHeader?.removeEventListener('mousemove', handleMouseMove);
      draggableHeader?.removeEventListener('mouseup', handleMouseUp);
    };

    draggableHeader?.addEventListener('mousedown', handleMouseDown);

    // Clean up the event listeners
    return () => {
      draggableHeader?.removeEventListener('mousedown', handleMouseDown);
      draggableHeader?.removeEventListener('mousemove', handleMouseMove);
      draggableHeader?.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
}
