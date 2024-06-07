#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[link(name = "AppKit", kind = "framework")]
extern "C" {}
extern crate cocoa;
extern crate objc;

use tauri::{Manager, PhysicalPosition, Position};
use objc::{class, sel, sel_impl, msg_send, runtime::Object};

use cocoa::appkit::{NSWindow, NSWindowLevel};
use cocoa::base::id;
use objc::runtime::Object;
use objc::declare::ClassDecl;
use objc::runtime::Sel;
use objc::runtime::BOOL;
use objc::runtime::YES;
fn set_window_level(window: id) {
    unsafe {
        // Use objc::msg_send to call the windowLevel method on window object
        let screen_saver_level: NSWindowLevel = msg_send![class!(NSScreenSaverWindowLevel), integerValue];
        window.setLevel_(screen_saver_level);
    }
}

fn main() {
    let context = tauri::generate_context!();

    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            main_window.set_always_on_top(true).unwrap();
            // main_window.set_fullscreen(true);
            main_window.set_decorations(false).unwrap();
            main_window.set_position(Position::Physical(PhysicalPosition { x: 0, y: -300 })).unwrap();

            #[cfg(target_os = "macos")]
            {
                use cocoa::base::id;
                use cocoa::appkit::{NSWindow, NSScreenSaverWindowLevel};
                let ns_win = main_window.ns_window().unwrap() as id;
                // unsafe { ns_win.setLevel_((NSScreenSaverWindowLevel) as i64); }
            }
            set_window_level(window);

            Ok(())
        })
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .run(context)
        .expect("error while running tauri application");
}