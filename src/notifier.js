import axios from 'axios';
import { DISCORD_CONFIG } from './config.js';

/**
 * Discord Webhookにメッセージを送信
 */
async function sendDiscordMessage(content, embeds = null) {
    if (!DISCORD_CONFIG.webhookUrl) {
        console.error('[ERROR] DISCORD_WEBHOOK_URL が設定されていません');
        return false;
    }

    try {
        const payload = {};

        if (content) {
            payload.content = content;
        }

        if (embeds) {
            payload.embeds = embeds;
        }

        const response = await axios.post(DISCORD_CONFIG.webhookUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.status === 204 || response.status === 200;
    } catch (error) {
        console.error(`[ERROR] Discord送信失敗: ${error.message}`);
        if (error.response) {
            console.error(`  Status: ${error.response.status}`);
            console.error(`  Data: ${JSON.stringify(error.response.data)}`);
        }
        return false;
    }
}

/**
 * 簡潔版と詳細版の両方を送信
 */
export async function sendNotifications(summaries) {
    const { briefEmbeds, detailedEmbeds } = summaries;

    console.log('\n📤 Discord通知を送信中...\n');

    // 簡潔版を送信（1つの埋め込みメッセージ）
    console.log('  → 簡潔版を送信');
    let success = await sendDiscordMessage(null, briefEmbeds);
    if (!success) {
        console.log('    ✗ 送信失敗');
        return false;
    }
    console.log('    ✓ 完了');

    // レート制限回避のため待機
    await sleep(2000);

    // 詳細版を送信（複数の埋め込みに分割）
    console.log('  → 詳細版を送信');
    for (const embed of detailedEmbeds) {
        success = await sendDiscordMessage(null, [embed]);
        if (!success) {
            console.log('    ✗ 送信失敗');
            return false;
        }
        await sleep(1500);
    }
    console.log('    ✓ 完了');

    console.log('\n✅ すべての通知を送信しました！');
    return true;
}

/**
 * テストモード用：コンソールに出力のみ
 */
export function printToConsole(summaries) {
    console.log('\n' + '='.repeat(50));
    console.log('【テストモード】Discord送信をスキップしました');
    console.log('='.repeat(50) + '\n');

    console.log('--- 簡潔版 Embed ---');
    console.log(JSON.stringify(summaries.briefEmbeds, null, 2));

    console.log('\n--- 詳細版 Embeds ---');
    summaries.detailedEmbeds.forEach((embed, i) => {
        console.log(`\n[Embed ${i + 1}]`);
        console.log(JSON.stringify(embed, null, 2));
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
