import { OutputEntity } from "../entities/output.ts";

/** Post Service */
export class PostService {
  constructor(private outputEntity: OutputEntity) { }
  
  /**
   * Post
   * 
   * @param mastodonHostName Mastodon Host Name
   * @param mastodonApiToken Mastodon API Token
   * @param text Text To Post (Markov Text : Optional)
   * @throws Failed To Find, Failed To Post
   */
  public async post(mastodonHostName: string, mastodonApiToken: string, text?: string): Promise<void> {
    if(text == null) text = this.outputEntity.findOneByRandom();  // throws
    await this.postToMastodon(mastodonHostName, mastodonApiToken, text);  // throws
    this.outputEntity.removeOneByText(text);
  }
  
  /**
   * Post To Mastodon
   * 
   * @param hostName Host Name
   * @param apiToken API Token
   * @param text Text To Post
   * @throws Failed To Post
   */
  private async postToMastodon(hostName: string, apiToken: string, text: string): Promise<void> {
    const response = await fetch(`https://${hostName}/api/v1/statuses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        visibility: 'public',
        status: `${text}\n\n#マルコフ連鎖自動生成文章`
      })
    });
    const json = await response.json();
    console.log(`PostService#postToMastodon() : Posted [${json.created_at}]`);
  }
}
