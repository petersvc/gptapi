import { type Browser, Page } from 'puppeteer';
export declare class AppService {
    ai: string[];
    browser: Browser | undefined;
    page: Page | undefined;
    browserOptions: {
        executablePath?: string;
        headless?: boolean;
        args: string[];
    };
    promptRequest: string;
    baseUrl: {
        lexii: string;
    };
    response: string;
    delay(time: number): Promise<void>;
    setBrowserOptions(): void;
    launchBrowser(): Promise<void>;
    crawl(): Promise<void>;
    scrape(): Promise<void>;
    getResponse(promptRequest: string): Promise<{
        res: string;
    }>;
}
