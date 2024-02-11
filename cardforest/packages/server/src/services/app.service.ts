import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World!
    <a href="/install">install</a>
    <a href="/card">card</a>
    <a href="/databases">databases</a>
    <a href="/user/auth/github">user/auth/github</a>
    <a href="/user/current">user/current</a>
    <a href="/user/manage">user/manage</a>
    `;
  }
}
