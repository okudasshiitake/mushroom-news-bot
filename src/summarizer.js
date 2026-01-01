import { SUMMARY_CONFIG } from './config.js';

/**
 * 収集した情報をDiscord Embed形式で要約
 */
export function createSummaries(data) {
    const today = new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    // ===== 簡潔版（1つのEmbed） =====
    const shiitakeArticles = data.shiitake.flatMap(s => s.articles).slice(0, 3);
    const otherArticles = data.otherMushrooms.flatMap(s => s.articles).slice(0, 3);

    let shiitakeBrief = '';
    if (shiitakeArticles.length > 0) {
        shiitakeArticles.forEach((article, i) => {
            const title = truncate(article.title, 60);
            if (article.link) {
                shiitakeBrief += `${i + 1}. [${title}](${article.link})\n`;
            } else {
                shiitakeBrief += `${i + 1}. ${title}\n`;
            }
        });
    } else {
        shiitakeBrief = '本日の新着情報はありません';
    }

    let otherBrief = '';
    if (otherArticles.length > 0) {
        otherArticles.forEach((article, i) => {
            const title = truncate(article.title, 60);
            if (article.link) {
                otherBrief += `${i + 1}. [${title}](${article.link})\n`;
            } else {
                otherBrief += `${i + 1}. ${title}\n`;
            }
        });
    } else {
        otherBrief = '本日の新着情報はありません';
    }

    const briefEmbeds = [
        {
            title: '🍄 きのこ最新情報',
            description: `📅 ${today}`,
            color: 0x8B4513, // 茶色
            fields: [
                {
                    name: '🌲 椎茸',
                    value: shiitakeBrief || '情報なし',
                    inline: false
                },
                {
                    name: '🍄 その他キノコ',
                    value: otherBrief || '情報なし',
                    inline: false
                }
            ],
            footer: {
                text: 'Mushroom News Bot'
            },
            timestamp: new Date().toISOString()
        }
    ];

    // ===== 詳細版（カテゴリ別のEmbed） =====
    const detailedEmbeds = [];

    // 椎茸詳細
    const shiitakeFields = [];
    data.shiitake.forEach(source => {
        if (source.articles.length > 0) {
            let value = '';
            source.articles.forEach(article => {
                const title = truncate(article.title, 50);
                if (article.link) {
                    value += `▸ [${title}](${article.link})\n`;
                } else {
                    value += `▸ ${title}\n`;
                }
                if (article.summary) {
                    value += `  _${truncate(article.summary, 80)}_\n`;
                }
            });
            shiitakeFields.push({
                name: `📌 ${source.source}`,
                value: value || '情報なし',
                inline: false
            });
        }
    });

    if (shiitakeFields.length > 0) {
        detailedEmbeds.push({
            title: '🌲 椎茸専門 - 詳細レポート',
            color: 0x228B22, // 緑
            fields: shiitakeFields,
            footer: {
                text: `ソース: ${data.shiitake.map(s => s.source).join(', ')}`
            }
        });
    }

    // その他キノコ詳細
    const otherFields = [];
    data.otherMushrooms.forEach(source => {
        if (source.articles.length > 0) {
            let value = '';
            source.articles.forEach(article => {
                const title = truncate(article.title, 50);
                if (article.link) {
                    value += `▸ [${title}](${article.link})\n`;
                } else {
                    value += `▸ ${title}\n`;
                }
                if (article.summary) {
                    value += `  _${truncate(article.summary, 80)}_\n`;
                }
            });

            // Discord Embedのフィールド値は1024文字制限
            if (value.length > 1000) {
                value = value.substring(0, 997) + '...';
            }

            otherFields.push({
                name: `📌 ${source.source}`,
                value: value || '情報なし',
                inline: false
            });
        }
    });

    if (otherFields.length > 0) {
        detailedEmbeds.push({
            title: '🍄 その他食用キノコ - 詳細レポート',
            color: 0xDAA520, // ゴールド
            fields: otherFields,
            footer: {
                text: `ソース: ${data.otherMushrooms.map(s => s.source).join(', ')}`
            }
        });
    }

    // 統計Embed
    const totalShiitake = data.shiitake.reduce((acc, s) => acc + s.articles.length, 0);
    const totalOther = data.otherMushrooms.reduce((acc, s) => acc + s.articles.length, 0);

    detailedEmbeds.push({
        title: '📊 統計情報',
        color: 0x4169E1, // ロイヤルブルー
        fields: [
            {
                name: '椎茸関連',
                value: `${totalShiitake}件`,
                inline: true
            },
            {
                name: 'その他キノコ',
                value: `${totalOther}件`,
                inline: true
            },
            {
                name: '合計',
                value: `${totalShiitake + totalOther}件`,
                inline: true
            }
        ],
        footer: {
            text: `取得時刻: ${data.fetchedAt}`
        }
    });

    return { briefEmbeds, detailedEmbeds };
}

/**
 * 文字列を指定した長さに切り詰め
 */
function truncate(str, maxLength) {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
}
