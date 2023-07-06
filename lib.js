import diff from 'k6/x/diff';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export function compareScreenshots(page, filePath, threshold) {
    if (!filePath) {
      filePath = "screenshot.png";
    }

    if (!threshold) {
        threshold = 0;
    }

    var exists = diff.checkIfFileExists(filePath);
    if (exists) {
      const randomFileName = `/tmp/compare-${randomString(8)}.png`;
      const randomDiffFileName = `/tmp/compare-${randomString(8)}.png`;
      page.screenshot({ path: randomFileName });
      var percentage = diff.compareVisuals(filePath, randomFileName, randomDiffFileName);

      if (percentage > threshold) {
        diff.moveAndRenameFile(randomFileName, "compare-bad-screenshot.png");
        diff.moveAndRenameFile(randomDiffFileName, "compare-bad-diff.png");
        throw new Error(`Different from the baseline by ${percentage}%`);
      } else {
        diff.deleteFile(randomFileName);
        diff.deleteFile(randomDiffFileName);
      }
    } else {
        page.screenshot({ path: filePath });
    }
}

export function compareImages(filePath1, filePath2, diffFilePath) {
  return diff.compareVisuals(filePath1, filePath2, diffFilePath);
}