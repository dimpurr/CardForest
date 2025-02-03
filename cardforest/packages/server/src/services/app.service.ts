import { Injectable } from '@nestjs/common';

// NOTE: This page is for backend debug

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <h1>CardForest Backend Debug</h1>
      
      <h2>Query</h2>
      <p>
        Card: <a href="/card">card</a> | <a href="/card/full">card/full</a><br>
        Model: <a href="/model">model</a> | <a href="/model/full">model/full</a>
      </p>
      
      <h2>Auth</h2>
      <p>
        <a href="/user/auth/github">user/auth/github</a><br>
        <a href="/user/current">user/current</a><br>
        <a href="/user/manage">user/manage</a>
      </p>
      
      <h2>Dangerous</h2>
      <p>
        <a href="/install" style="color: red">install</a><br>
        <a href="/databases" style="color: red">databases</a>
      </p>

      <style>
        body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 2em auto; padding: 0 1em; }
        h1 { color: #333; }
        h2 { color: #666; margin-top: 1.5em; }
        a { color: #0066cc; text-decoration: none; padding: 0.2em 0.4em; }
        a:hover { background: #f0f0f0; border-radius: 3px; }
        p { line-height: 1.6; }
      </style>
    `;
  }
}
