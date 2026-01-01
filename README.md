# 🍄 Mushroom News Bot

椎茸とその他主要な食用キノコに関する最先端の科学情報を、毎朝8時に自動収集してDiscordに通知するBotです。

## 📋 機能

- **自動巡回**: 科学的根拠のある信頼性の高いサイトを毎日巡回
- **カテゴリ分け**: 「椎茸専門」と「その他食用キノコ」に分類
- **2種類の要約**: 簡潔版（箇条書き）と詳細版（リンク付き）
- **Discord通知**: 埋め込み形式でリッチな表示

## 🌐 巡回対象サイト

### 椎茸専門
| サイト | 種類 |
|--------|------|
| 森林総合研究所 | 国立研究機関 |
| 日本きのこ学会 | 学術団体 |
| 全国椎茸連合会 | 業界団体 |

### その他食用キノコ
| サイト | 種類 |
|--------|------|
| PubMed | 医学論文DB |
| 農研機構 | 国立研究機関 |
| 厚生労働省 | 政府機関 |
| ScienceDaily | 科学ニュース |

## 🚀 セットアップ

### 1. Discord Webhookの作成

1. Discordで通知を受け取りたいサーバーを開く
2. 通知先チャンネルの **設定（⚙️）** → **連携サービス** → **ウェブフック**
3. **新しいウェブフック** をクリック
4. 名前を設定（例：`きのこBot`）、アイコンも設定可能
5. **ウェブフックURLをコピー** をクリック

### 2. GitHubリポジトリの設定

1. このフォルダをGitHubにプッシュ
2. リポジトリの `Settings` → `Secrets and variables` → `Actions`
3. `New repository secret` をクリック
4. 以下を追加：
   - Name: `DISCORD_WEBHOOK_URL`
   - Secret: コピーしたWebhook URL

### 3. 動作確認

```bash
# ローカルでテスト（Discord送信なし）
npm install
npm run test

# 本番実行（環境変数が必要）
DISCORD_WEBHOOK_URL=your_webhook_url npm start
```

## ⏰ スケジュール

GitHub Actionsにより、毎日 **8:00 JST** に自動実行されます。

手動で実行したい場合は、GitHubのActionsタブから `Run workflow` をクリックしてください。

## 📱 通知サンプル

### 簡潔版
```
🍄 きのこ最新情報
📅 2026年1月1日 水曜日

🌲 椎茸
1. 森林総研が新しい栽培技術を発表
2. 椎茸の機能性成分に関する研究
3. 全国椎茸品評会の結果

🍄 その他キノコ
1. PubMed: マイタケの免疫効果
2. 厚労省: きのこの安全な調理法
3. ScienceDaily: 新種発見
```

### 詳細版
各ソースごとに記事タイトル、概要、リンクを含む埋め込みカード

## 📁 ファイル構成

```
mushroom-news-bot/
├── .github/
│   └── workflows/
│       └── daily-news.yml    # GitHub Actions設定
├── src/
│   ├── index.js              # エントリーポイント
│   ├── config.js             # 設定（巡回サイト等）
│   ├── scraper.js            # Webスクレイピング
│   ├── summarizer.js         # 要約生成
│   └── notifier.js           # Discord通知
├── package.json
└── README.md
```

## 🔧 カスタマイズ

### 巡回サイトを追加する

`src/config.js` の `SOURCES` に新しいサイトを追加：

```javascript
{
  name: 'サイト名',
  url: 'https://example.com',
  category: 'shiitake', // または 'other'
  type: 'research',     // research, academic, government, news, industry
  selector: '.news-item', // 記事要素のCSSセレクタ
  description: '説明文'
}
```

### 実行時刻を変更する

`.github/workflows/daily-news.yml` のcron設定を変更：

```yaml
schedule:
  # 毎日 XX:00 UTC = XX+9:00 JST
  - cron: '0 23 * * *'  # 現在: 8:00 JST
```

### Embedの色を変更する

`src/summarizer.js` の各Embedの `color` 値を変更（16進数）：
- `0x8B4513` - 茶色（簡潔版）
- `0x228B22` - 緑（椎茸詳細）
- `0xDAA520` - ゴールド（その他詳細）
- `0x4169E1` - ブルー（統計）

## ⚠️ 注意事項

- 各サイトの利用規約を確認の上、適切な頻度でアクセスしてください
- スクレイピング対象サイトの構造が変更された場合、`scraper.js`の更新が必要な場合があります
- Discord Webhookのレート制限に注意（1秒あたり5リクエスト程度）

## 📄 ライセンス

MIT License
