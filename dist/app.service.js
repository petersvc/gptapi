"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer_1 = require("puppeteer");
let AppService = class AppService {
    constructor() {
        this.ai = ['lexii'];
        this.baseUrl = {
            lexii: 'https://lexii.ai/',
        };
    }
    async delay(time) {
        return await new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }
    setBrowserOptions() {
        this.browserOptions = {
            executablePath: '/usr/bin/chromium-browser',
            args: [
                '--no-sandbox',
                '--disable-gpu',
                '--headless',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
            ],
        };
    }
    async launchBrowser() {
        this.setBrowserOptions();
        this.browser = await (0, puppeteer_1.launch)(this.browserOptions);
        this.page = await this.browser.newPage();
    }
    async crawl() {
        let url = '';
        let elementToWait = '';
        let inputElement = '';
        let context = '';
        const ai = this.ai[0];
        if (ai === 'lexii') {
            url = this.baseUrl.lexii;
            context = 'Answer concisely the following question or statement: ';
            inputElement = '.rsc-input[placeholder="Type your question..."]';
            elementToWait = '.rsc-suggestion-sub';
        }
        console.log('\nUrl: ' + url);
        console.log('Prompt: ' + this.promptRequest);
        await this.page.goto(url);
        await this.page.waitForSelector(elementToWait);
        await this.delay(300);
        await this.page.type(inputElement, context + this.promptRequest);
        await this.page.keyboard.press('Enter', { delay: 30 });
    }
    async scrape() {
        var _a;
        let scrapeResult = '';
        const ai = this.ai[0];
        if (ai === 'lexii') {
            await this.page.waitForSelector('div.sources');
            await this.delay(300);
            scrapeResult = await ((_a = this.page) === null || _a === void 0 ? void 0 : _a.evaluate(() => {
                const elementToScrape = document.querySelector('div.rsc-lexii-bubble');
                return elementToScrape.textContent.split('Sources:')[0];
            }));
        }
        this.response = scrapeResult;
    }
    async getResponse(promptRequest) {
        var _a;
        this.promptRequest = promptRequest;
        await this.launchBrowser();
        await this.crawl();
        await this.scrape();
        await ((_a = this.browser) === null || _a === void 0 ? void 0 : _a.close());
        console.log('\nResponse: ' + this.response);
        return { res: this.response.replace(/\"/g, "'") };
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map