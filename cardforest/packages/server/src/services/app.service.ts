import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World!
      <h2>query</h2>
      <a href="/card">card</a>
      <h2>auth</h2>
      <a href="/user/auth/github">user/auth/github</a>
      <a href="/user/current">user/current</a>
      <a href="/user/manage">user/manage</a>
      <h2>dangerous</h2>
      <a href="/install">install</a>
      <a href="/databases">databases</a>
    `;
  }
}
