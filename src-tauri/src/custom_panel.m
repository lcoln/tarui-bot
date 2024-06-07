#import <Cocoa/Cocoa.h>

@interface CustomPanel : NSPanel
@end

@implementation CustomPanel
@end

void createCustomPanel(NSWindow **window) {
    NSRect frame = NSMakeRect(0, 0, 800, 600);
    NSUInteger styleMask = NSWindowStyleMaskTitled | NSWindowStyleMaskClosable | NSWindowStyleMaskResizable;
    CustomPanel *panel = [[CustomPanel alloc] initWithContentRect:frame
                                                        styleMask:styleMask
                                                          backing:NSBackingStoreBuffered
                                                            defer:NO];
    [panel setLevel:NSMainMenuWindowLevel + 1];
    [panel setFloatingPanel:YES];
    *window = panel;
}