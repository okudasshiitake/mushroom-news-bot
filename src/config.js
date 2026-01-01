/**
 * 巡回対象サイトの設定
 * 科学的根拠があり、信頼性の高いソースのみを選定
 */

export const SOURCES = {
    // ===== 椎茸専門 =====
    shiitake: [
        {
            name: '森林総合研究所 - きのこ研究',
            url: 'https://www.ffpri.affrc.go.jp/',
            category: 'shiitake',
            type: 'research',
            selector: 'article, .news-item, .topics-item',
            description: '国立研究開発法人の公式研究情報'
        },
        {
            name: '日本きのこ学会',
            url: 'https://www.mashroom.jp/',
            category: 'shiitake',
            type: 'academic',
            selector: '.news, .topics, article',
            description: '日本きのこ学会の最新情報'
        },
        {
            name: '全国椎茸連合会',
            url: 'https://www.shiitake.or.jp/',
            category: 'shiitake',
            type: 'industry',
            selector: '.news, .info, article',
            description: '椎茸業界の公式情報'
        }
    ],

    // ===== その他主要食用キノコ =====
    otherMushrooms: [
        {
            name: 'PubMed - Medicinal Mushrooms',
            url: 'https://pubmed.ncbi.nlm.nih.gov/?term=medicinal+mushrooms&sort=date',
            category: 'other',
            type: 'academic',
            selector: '.docsum-content',
            description: '世界最大の医学論文データベース'
        },
        {
            name: '農研機構 - きのこ研究',
            url: 'https://www.naro.go.jp/',
            category: 'other',
            type: 'research',
            selector: '.news-item, article, .topics',
            description: '農業・食品産業技術総合研究機構'
        },
        {
            name: '厚生労働省 - 食品安全',
            url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/index.html',
            category: 'other',
            type: 'government',
            selector: '.m-listLink, article',
            description: '食品の安全性に関する公式情報'
        },
        {
            name: 'ScienceDaily - Mushroom Research',
            url: 'https://www.sciencedaily.com/news/plants_animals/mushrooms/',
            category: 'other',
            type: 'news',
            selector: '.latest-head, .story-title',
            description: '科学ニュースサイトのキノコ関連記事'
        }
    ]
};

// Discord Webhook設定
export const DISCORD_CONFIG = {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL
};

// 要約設定
export const SUMMARY_CONFIG = {
    maxArticlesPerSource: 3,      // 各ソースから取得する最大記事数
    briefMaxLength: 200,          // 簡潔版の最大文字数
    detailedMaxLength: 500        // 詳細版の最大文字数
};
