fn main() {
  cc::Build::new()
      .file("src/custom_panel.m")
      .flag_if_supported("-fobjc-arc")
      .compile("custom_panel");
  
  println!("cargo:rustc-link-lib=framework=Cocoa");
  println!("cargo:rustc-link-lib=framework=AppKit");
  println!("cargo:rustc-link-lib=framework=Foundation");
}