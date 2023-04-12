import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getResponse(query: {
        prompt: string;
    }): Promise<{
        res: string;
    }>;
}
