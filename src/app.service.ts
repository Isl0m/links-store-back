import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      name: 'links-store-api',
      version: '0.0.1',
      description: 'An REST API with NESTJS and MONGODB',
      author: 'Isl0m',
    };
  }
}
