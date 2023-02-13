import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts';

import { InputEntity } from '../entities/input.ts';

/** Crawl Service */
export class CrawlService {
  constructor(private inputEntity: InputEntity) { }
  
  /**
   * Crawl
   * 
   * @param mastodonHostName Mastodon Host Name
   * @param mastodonApiToken Mastodon API Token
   * @throws Failed To Crawl Mastodon, Failed To Save (Exclude Unique Constaint)
   */
  public async crawl(mastodonHostName: string, mastodonApiToken: string): Promise<void> {
    const texts = await this.crawlMastodon(mastodonHostName, mastodonApiToken);  // throws
    this.inputEntity.saveAll(texts);  // throws
    this.inputEntity.removeOlds();
  }
  
  /**
   * Crawl Mastodon
   * 
   * @param hostName Host Name
   * @param apiToken API Token
   * @return Texts
   * @throws Request Failed
   */
  private async crawlMastodon(hostName: string, apiToken: string): Promise<Array<string>> {
    const response = await fetch(`https://${hostName}/api/v1/timelines/home?limit=40`, { headers: { Authorization: `Bearer ${apiToken}` } });
    const posts = await response.json();
    
    const texts: Array<string> = [];
    posts.forEach((post: { content: string; }) => {
      const { content } = post;
      const document = new DOMParser().parseFromString(content, 'text/html');
      const rawText = document?.querySelector('p')?.textContent ?? '';
      const text = rawText
        .replace(/@.*?(\s|$)/g, '$1')            // リプライの `@username`
        .replace(/https?:\/\/.*?(\s|$)/g, '$1')  // URL
        .replace(/:.*?:(\s|$)/g, '$1')           // 絵文字
        .replace(/ +/g, ' ')                     // 連続するスペースは1つにする
        .trim();
      if(text !== '') texts.push(text);
    });
    console.log(`CrawlService#crawlMastodon() : Crawl [${texts.length}] Posts`);
    return texts;
  }
}
