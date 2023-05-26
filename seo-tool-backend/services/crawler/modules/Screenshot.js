async function createScreenshot(page) {
    await page.setViewport({
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
    });
    await page;
    const screenshotBase64 = await page.screenshot({ encoding: 'base64' });
    return screenshotBase64;
}

module.exports = createScreenshot;