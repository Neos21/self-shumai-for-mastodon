# Self-Shumai For Mastodon

Twitter の「[しゅうまい君](https://twitter.com/shuumai)」もどきをマストドン向けにセルフホストできるように作った Deno プログラムです。

マストドン API を利用してホームタイムラインを収集し、マルコフ連鎖を用いて文章を自動生成、定期的に投稿します。

```bash
# WSL2 にて動作確認
$ deno --version
deno 1.30.3 (release, x86_64-unknown-linux-gnu)
v8 10.9.194.5
typescript 4.9.4

# 実行方法 : API トークンはホームタイムラインの読み取り、トゥートができる権限を付与しておいてください
$ MASTODON_HOST_NAME='【マストドンホスト名】' MASTODON_API_TOKEN='【マストドン API トークン】' deno run --allow-env --allow-read --allow-write --allow-net ./main.ts
```


## Links

- [Neo's World](https://neos21.net/)
