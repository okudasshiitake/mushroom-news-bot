import { scrapeAllSources } from './scraper.js';
import { createSummaries } from './summarizer.js';
import { sendNotifications, printToConsole } from './notifier.js';

/**
 * メイン処理
 */
async function main() {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  🍄 Mushroom News Bot - きのこ最新情報Bot  ║');
    console.log('╚════════════════════════════════════════════╝\n');

    const isTestMode = process.argv.includes('--test');

    if (isTestMode) {
        console.log('🧪 テストモードで実行中...\n');
    }

    try {
        // Step 1: 情報収集
        const data = await scrapeAllSources();

        // Step 2: 要約生成
        console.log('\n📝 要約を生成中...');
        const summaries = createSummaries(data);
        console.log('✓ 要約生成完了');

        // Step 3: 通知送信
        if (isTestMode) {
            printToConsole(summaries);
        } else {
            await sendNotifications(summaries);
        }

        console.log('\n🎉 処理が正常に完了しました！');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ エラーが発生しました:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
