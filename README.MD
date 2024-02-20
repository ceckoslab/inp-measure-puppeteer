# INP Measure - Puppeteer

Very experimental and still in a proof of concept stage but it does the trick. 

Utilizes the source code available the [Web Vitals](https://github.com/GoogleChrome/web-vitals) library.

## Configure

Tweak the following lines in `index.js` or `index_int.js`(if you wan to simulate user-interaction):

```
// TODO, Change here to the element you would like Puppeteer to interact with.
const elementToInteractWith = "### ADD THE CSS SELECTOR HERE ###";

// TODO, Change here to the url you would like to load in Puppeteer.
const navigateTo = "https://www.example.com/";
```

## How to run?

 1. From the root folder of the project run `npm init` 
 2. Run `node index.js` or `node index_int.js`

When we run the project a browser will open and we will observe a simulation of user journey.

When INP gets triggered we will see similar output in the terminal:
```
Running on the original page.
Failed to load resource: the server responded with a status of 404 ()
Failed to load resource: the server responded with a status of 404 ()
Unsupported namespace or locale
inp: 264
```

## Measure many times after a change:

We have a shell script that can run a simulation multiple times. At the moment we run a simulation 10 times.

Change `index.js` for `index_int.js` if you want to run many user-interaction simulations.

Try:

```
./run.sh
```

## Override resources:

In `index.js` we have a code fragment that looks like this:

```
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
```

This allows us to load from filesystem our own version of some of the frontend files.

## CPU throttling:

In `DeviceEmulation.js` tweak:
```
page.emulateCPUThrottling(4)
```

## User-Agent string and screen size emulation:

Tweak parameters in `DeviceEmulation.js`.

