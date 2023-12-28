const fs = require("fs");
const path = require("path");

const puppeteer = require("puppeteer");
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

const recording = false;

const Cookies = require("./src/Cookies");
const CWV = require("./src/CWV");
const DeviceEmulation = require("./src/DeviceEmulation");

// TODO, Change here to the element you would like Puppeteer to interact with.
const elementToInteractWith = "### ADD THE CSS SELECTOR HERE ###";

// TODO, Change here to the url you would like to load in Puppeteer.
const navigateTo = "https://www.example.com/";

var args = process.argv.slice(2);

let experiment = 0;

if (args[0]) {
  const paramParts = args[0].split("=");

  if (paramParts[0] === "experiment") {
    experiment = parseInt(paramParts[1]);
  }
}

if (experiment === 0) {
  console.log("Running on the original page.");
}
else {
  console.log("Running experiment {" + experiment + "} on a modified page.");
}

(async() => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  if (recording) {
    // Configure the screen recorder
    const recorder = new PuppeteerScreenRecorder(page, {
      followNewTab: true,
      fps: 30,
      videoFrame: {
        width: 1080,
        height: 2400
      }
      // Other configurations
    });

    await recorder.start("output.mp4");
  }

  await DeviceEmulation.emulate(page);

  // Listen for console events within the page and log them in Node.js context
  page.on("console", (msg) => {
    console.log(msg.text());
  });

  // Enable request interception
  await page.setRequestInterception(true);

  // Add event listener to intercept requests
  page.on("request", (interceptedRequest) => {
    // Check if the request is for the resource you want to override
    if (interceptedRequest.url().endsWith("example-js-of-interest.js")) {
      console.log("Intercepted and overriding: " + interceptedRequest.url());

      // Create a response from a local file
      const overrideContent = fs.readFileSync(path.join(__dirname, "overrides", "example-js-of-interest.js"), "utf8");
      interceptedRequest.respond({
        status: 200,
        contentType: "application/javascript; charset=utf-8",
        body: overrideContent
      });
      return;
    }

    // Allow all other requests to continue normally
    interceptedRequest.continue();
  });

  // Navigate to the page
  await page.goto(navigateTo);

  await CWV.attachCWV_Lib(page);

  await Cookies.setOptanonConsent(page);

  // Wait for a specified timeout in milliseconds
  await page.waitForTimeout(5000); // waits for 5 seconds

  // Wait for the element to be present in the DOM
  await page.waitForSelector(elementToInteractWith);

  // Click the input input
  await page.click(elementToInteractWith);
  await page.focus(elementToInteractWith);

  await page.waitForTimeout(5); // waits for 5 seconds

  // Execute JS code after the timeout
  await page.evaluateHandle(() => {
    window.webVitals.getINP(function(info) {
      if (info.value) {
        console.log("inp: " + info.value);
      }
      else {
        console.log("inp: not measured");
      }
    },
    {
      reportAllChanges: true
    }
    );
  });

  await page.waitForTimeout(5000); // waits for 5 seconds

  if (recording) {
    // Stop recording
    await recorder.stop();
  }

  // You can close the browser after a timeout, or after some specific action
  // that would ensure all metrics have been captured.
  await browser.close();
})();
