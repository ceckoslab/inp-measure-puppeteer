// Define the device properties for Samsung Galaxy A51
const GalaxyA51 = {
  name: "Galaxy A51",
  userAgent: "Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/12.0 Chrome/79.0.3945.136 Mobile Safari/537.36",
  viewport: {
    width: 1080 / 2,   // The width of the viewport in pixels. Divide by device scale factor for actual pixels.
    height: 2400 / 2,  // The height of the viewport in pixels. Divide by device scale factor for actual pixels.
    deviceScaleFactor: 2, // The device scale factor.
    isMobile: true,    // Whether the meta viewport tag is set to mobile.
    hasTouch: true,    // Whether the device supports touch events.
    isLandscape: false // Whether the device is in landscape mode.
  }
};

module.exports = class DeviceEmulation {

  constructor() {};

  static async emulate(page) {
    await page.emulate(GalaxyA51);
    await page.emulateCPUThrottling(4);
  }

};
