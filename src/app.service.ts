import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getUsers() {
    return [{ id: 1, name: 'Asd', phone: '79009009090' }];
  }
}
