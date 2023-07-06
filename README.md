# xk6-compare-screenshots

xk6-compare-screenshots is an extension that adds image comparison capabilities to [Grafana k6](https://github.com/grafana/k6). 

These can be extremely useful for doing visual regression testing.

## Build

To build a `k6` binary with this extension, first, ensure you have the prerequisites:

- [Go toolchain](https://go101.org/article/go-toolchain.html)
- Git

Then:

1. Download [xk6](https://github.com/grafana/xk6):
  ```bash
  $ go install go.k6.io/xk6/cmd/xk6@latest
  ```

2. [Build the k6 binary](https://github.com/grafana/xk6#command-usage):
  ```bash
  $ xk6 build --with github.com/grafana/xk6-compare-screenshots@latest
  ```

## How to use

We provide two functions: `compareScreenshots` and `compareImages`.

### compareScreenshots
> This functionality is built on top of [xk6 Browser](https://k6.io/docs/using-k6-browser/overview/).

This function validates that a screenshot with the same name exists. If it doesn't: It takes a screenshot. 

If it does: It takes a new screenshot and compares it with the previous one. If the difference is greater than the threshold, it will throw an error. Also, it will save the problematic screenshot and the diff in the folder where the test is running. 

```javascript
import { chromium } from 'k6/experimental/browser';
import { compareScreenshots } from 'https://raw.githubusercontent.com/dgzlopes/xk6-compare-screenshots/main/lib.js';

export default async function () {
  const browser = chromium.launch({
    headless: false,
    timeout: '60s',
  });
  const page = browser.newPage();

  try {
    await page.goto('https://grafana.com/');
    try {
      compareScreenshots(page);
    } catch (e) {
      console.log(`Screenshot comparison failed: ${e}`);
    }
    
  } finally {
    page.close();
    browser.close();
  }
}
```

The `compareScreenshots` API has the following parameters:
- `page`: The page object from xk6 Browser.
- `filePath`: The path where the screenshot will be saved. By default: `screenshot.png`.
- `threshold`: The percentage of the difference between the two images. By default: `0`.

### compareImages

This function compares two images and returns the percentage of the difference between them.

```javascript
import { compareImages } from 'https://raw.githubusercontent.com/dgzlopes/xk6-compare-screenshots/main/lib.js';

export default function () {
    const diff = compareImages("hello.png", "hello2.png", "diff.png");
    console.log(`The difference between the images is ${diff}%`);
}
```

## Credits

- @burntcarrot: For creating and open sourcing: https://github.com/burntcarrot/difftective
  - We are using all their code for the image comparison.
- @odai-alali: For creating and open sourcing: https://github.com/odai-alali/cypress-odiff
  - It was a great inspiration for this project.



