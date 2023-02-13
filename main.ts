import { Entity } from './src/entities/entity.ts';
import { InputEntity } from './src/entities/input.ts';
import { OutputEntity } from './src/entities/output.ts';

import { CrawlService } from './src/services/crawl.ts';
import { GenerateService } from './src/services/generate.ts';
import { PostService } from './src/services/post.ts';

console.log('+------------------------------------+');
console.log('|      Self-Shumai For Mastodon      |');
console.log('+------------------------------------+');
console.log('');

const mastodonHostName = Deno.env.get('MASTODON_HOST_NAME');
const mastodonApiToken = Deno.env.get('MASTODON_API_TOKEN');
if(mastodonHostName == null) throw new Error('Environment Variable MASTODON_HOST_NAME Is Empty');
if(mastodonApiToken == null) throw new Error('Environment Variable MASTODON_API_TOKEN Is Empty');
console.log(`Environment Variables [${mastodonHostName}] [${mastodonApiToken}]`);

// Initialize
new Entity().initialize();
const inputEntity     = new InputEntity();
const outputEntity    = new OutputEntity();
const crawlService    = new CrawlService(inputEntity);
const generateService = new GenerateService(inputEntity, outputEntity);
const postService     = new PostService(outputEntity);

/** Crawl */
const crawl = async () => {
  console.log('');
  console.log(new Date().toISOString(), 'Crawl : Start');
  try {
    await crawlService.crawl(mastodonHostName, mastodonApiToken);
  }
  catch(error) {
    console.warn(new Date().toISOString(), `Crawl : Error [${error}]`);
  }
  console.log(new Date().toISOString(), 'Crawl : Finished');
};

/** Generate And Post */
const generateAndPost = async () => {
  console.log('');
  console.log(new Date().toISOString(), 'Generate And Post : Start');
  try {
    const markovText = generateService.generate();
    await postService.post(mastodonHostName, mastodonApiToken, markovText);
  }
  catch(error) {
    console.warn(new Date().toISOString(), `Generate And Post : Error [${error}]`);
  }
  console.log(new Date().toISOString(), 'Generate And Post : Finished');
};

// First
await crawl();
await generateAndPost();
// Interval
setInterval(crawl          , 1000 * 60);
setInterval(generateAndPost, 1000 * 60 + 1000);  // テキトーにズラす
