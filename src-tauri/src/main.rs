// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// fn main() {
//   tauri::Builder::default()
//     .run(tauri::generate_context!())
//     .expect("error while running tauri application");
// }

use tauri::Manager;
use std::path::PathBuf;
use std::fs::File;
use std::io::BufWriter;
use core_graphics::display::CGDisplay;
use chrono::Local;
use image::{DynamicImage, ImageBuffer, Rgba, GenericImageView};
use std::process::Command;
use serde_json::Value;

#[tauri::command]
async fn take_screenshot(x: u32, y: u32, width: u32, height: u32) -> Result<PathBuf, String> {
    // 获取主显示屏幕截图
    let main_display = CGDisplay::main();
    let image = main_display.image().ok_or("Failed to capture screen")?;
    
    // 获取整个屏幕的宽度和高度，并转换为u32类型
    let screen_width = image.width() as u32;
    let screen_height = image.height() as u32;

    // 裁剪区域
    let crop_x = x.min(screen_width - 1);
    let crop_y = y.min(screen_height - 1);
    let crop_width = width.min(screen_width - crop_x);
    let crop_height = height.min(screen_height - crop_y);

    // 转换CGImage数据为Vec<u8>
    let data_ref = image.data();
    let data_len = data_ref.len() as usize; // 转换为usize
    let img_data = unsafe { std::slice::from_raw_parts(data_ref.as_ptr(), data_len).to_vec() };

    // 将数据转换为ImageBuffer
    let img_buffer = ImageBuffer::<Rgba<u8>, _>::from_raw(screen_width, screen_height, img_data)
        .ok_or("Failed to create image buffer from screen data")?;

    // 创建DynamicImage以进行裁剪操作
    let mut img = DynamicImage::ImageRgba8(img_buffer);
    let cropped_img = img.crop(crop_x, crop_y, crop_width, crop_height);

    // 生成文件名
    let datetime = Local::now();
    let filename = format!("screenshot_{}.png", datetime.format("%Y-%m-%d_%H-%M-%S"));
    let filepath = std::env::temp_dir().join(filename);

    // 保存裁剪后的图像到文件
    let file = File::create(&filepath).map_err(|e| e.to_string())?;
    let mut writer = BufWriter::new(file); // 声明为可变的
    cropped_img.write_to(&mut writer, image::ImageOutputFormat::Png).map_err(|e| e.to_string())?;

    Ok(filepath)
}

#[tauri::command]
fn get_monitors() -> Result<Value, String> {
    let output = Command::new("node")
        .arg("./screenshot.js")  // 请将此路径修改为实际的脚本路径
        .output()
        .expect("failed to execute process");

    if output.status.success() {
        let output_str = String::from_utf8(output.stdout)
            .expect("failed to convert stdout to String");

        // 解析 JSON 并返回
        let monitors: Value = serde_json::from_str(&output_str)
            .expect("failed to parse JSON");

        Ok(monitors)
    } else {
        let error_msg = String::from_utf8(output.stderr)
            .unwrap_or_else(|_| "unknown error".to_string());
        Err(error_msg)
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_monitors])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}