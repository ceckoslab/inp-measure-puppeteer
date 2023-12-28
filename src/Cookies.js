module.exports = class Cookies {

  constructor() {};

  // TODO: Modify cookie values, domain and path

  static async setOptanonConsent(page) {
    await page.setCookie({
      "name": "OptanonConsent",
      "value": "ADD YOU COOKIE VALUE HERE",
      "domain": ".example.com",
      "path": "/",
      "secure": true,
      "sameSite": "None" // or 'Strict' or 'None'
    });

    await page.setCookie({
      "name": "OptanonAlertBoxClosed",
      "value": "2023-11-07T12:55:33.827Z",
      "domain": ".example.com",
      "path": "/",
      "secure": true,
      "sameSite": "None" // or 'Strict' or 'None'
    });
  }

};
