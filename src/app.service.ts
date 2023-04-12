import { Injectable } from '@nestjs/common';
import { launch, type Browser, Page } from 'puppeteer';

@Injectable()
export class AppService {
  ai = ['lexii'];
  browser: Browser | undefined;
  page: Page | undefined;
  browserOptions!: {
    executablePath?: string;
    headless?: boolean;
    args: string[];
  };
  promptRequest!: string;
  baseUrl = {
    lexii: 'https://lexii.ai/',
  };
  response!: string;

  async delay(time: number): Promise<void> {
    return await new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  setBrowserOptions(): void {
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

  async launchBrowser(): Promise<void> {
    this.setBrowserOptions();
    this.browser = await launch(this.browserOptions);
    this.page = await this.browser.newPage();
  }

  async crawl(): Promise<void> {
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

  async scrape(): Promise<void> {
    let scrapeResult = '';
    const ai = this.ai[0];
    if (ai === 'lexii') {
      await this.page.waitForSelector('div.sources');
      await this.delay(300);
      scrapeResult = await this.page?.evaluate(() => {
        const elementToScrape = document.querySelector('div.rsc-lexii-bubble');
        return elementToScrape.textContent.split('Sources:')[0];
      });
    }

    this.response = scrapeResult; // .replace(/\./g, '');
  }

  async getResponse(promptRequest: string): Promise<{ res: string }> {
    this.promptRequest = promptRequest;

    await this.launchBrowser();
    await this.crawl();
    await this.scrape();
    await this.browser?.close();

    console.log('\nResponse: ' + this.response);

    return { res: this.response.replace(/\"/g, "'") };
  }
}
// appid: 1095769083393355868
// key: 5f9c216652ec3ce50795cc9a2e76efe3baf71ba09b89fd662bebe9655b1874b7
// token: MTA5NTc2OTA4MzM5MzM1NTg2OA.GslVrC.-oC3907knHvjs7tdmVEIeKAU6MPGZ0fbH-2LKk
// permissions interger: 534723918912
