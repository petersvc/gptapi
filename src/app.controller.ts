import { Controller, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getResponse(@Query() query: { prompt: string }): Promise<{ res: string }> {
    const promptRequest = query.prompt;
    const res = this.appService.getResponse(promptRequest);
    // INSERT INTO expenses (description, category, value) VALUES ("sorvete", "alimentação", 30);
    return res;
  }
}
