const cheerio = require('cheerio');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const SEO = require('./modules/index');


const CheckSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    checkData: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    screenshot: {
        type: Buffer,
    }
});

const Check = mongoose.model('Check', CheckSchema, "checks");


async function performPageCheck(url, userId) {
    const pageData = {};


    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Set viewport size to desktop resolution
        await page.setViewport({
            width: 1280,
            height: 800,
            deviceScaleFactor: 1,
        });

        // Laden der Seite
        await page.goto(url, { waitUntil: 'networkidle2' });

        // HTML parsen
        const $ = cheerio.load(await page.content());

        // Seite analysieren
        pageData.title = SEO.pageTitle.getPageTitle($);
        pageData.description = SEO.pageDescription.getPageDescription($);
        pageData.keywords = SEO.pageKeywords.getPageKeywords($);


        pageData.missingAltTags = SEO.pageAltTags.getImageAltTags($);

        // Page speed check
        pageData.pageSpeedData = await SEO.pageSpeedtest.getPageSpeedData(url);


        // Screenshot aufnehmen und als Base64-String speichern
        const screenshotBuffer = await page.screenshot();
        const screenshotBase64 = screenshotBuffer.toString('base64');
        pageData.screenshot = screenshotBase64;



        // Speichern der Daten in der Datenbank
        const newCheck = new Check({
            url: url,
            userId: userId,
            checkData: pageData
        });
        await newCheck.save();

    } catch (error) {
        console.log(error);
        throw new Error("Page check failed");
    } finally {
        await browser.close();
    }

    return pageData;
}

module.exports = {
    Check,
    performPageCheck
}