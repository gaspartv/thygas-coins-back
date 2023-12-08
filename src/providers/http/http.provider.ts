import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';

@Injectable()
export class HttpService {
  async post(url: string, dto: any, headers: any) {
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify(dto),
      headers,
    }).then((res) => res);
  }
}
