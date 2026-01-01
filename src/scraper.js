import axios from 'axios';
import * as cheerio from 'cheerio';
import { SOURCES, SUMMARY_CONFIG } from './config.js';

/**
 * 指定されたURLからコンテンツを取得
 */
async function fetchPage(url) {
    try {
        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`[ERROR] ${url}: ${error.message}`);
        return null;
    }
}

/**
 * HTMLから記事情報を抽出
 */
function extractArticles(html, source) {
    const $ = cheerio.load(html);
    const articles = [];

    // セレクタで要素を取得
    $(source.selector).each((index, element) => {
        if (index >= SUMMARY_CONFIG.maxArticlesPerSource) return false;

        const $el = $(element);

        // タイトルを取得（複数のパターンに対応）
        let title = $el.find('h2, h3, h4, .title, a').first().text().trim()
            || $el.text().trim();

        // タイトルを適切な長さに切り詰め
        if (title.length > 100) {
            title = title.substring(0, 100) + '...';
        }

        // リンクを取得
        let link = $el.find('a').first().attr('href') || $el.attr('href') || '';
        if (link && !link.startsWith('http')) {
            // 相対URLを絶対URLに変換
            const baseUrl = new URL(source.url);
            link = new URL(link, baseUrl.origin).href;
        }

        // 日付を取得（可能であれば）
        const dateEl = $el.find('.date, time, .timestamp').first();
        const date = dateEl.text().trim() || dateEl.attr('datetime') || '';

        // 概要を取得
        const summary = $el.find('p, .summary, .description').first().text().trim();

        if (title && title.length > 5) {
            articles.push({
                title,
                link,
                date,
                summary: summary.substring(0, 200),
                source: source.name,
                type: source.type
            });
        }
    });

    return articles;
}

/**
 * PubMed専用のパーサー
 */
function extractPubMedArticles(html) {
    const $ = cheerio.load(html);
    const articles = [];

    $('.docsum-content').each((index, element) => {
        if (index >= SUMMARY_CONFIG.maxArticlesPerSource) return false;

        const $el = $(element);
        const title = $el.find('.docsum-title').text().trim();
        const authors = $el.find('.docsum-authors').text().trim();
        const citation = $el.find('.docsum-citation').text().trim();
        const link = 'https://pubmed.ncbi.nlm.nih.gov' + $el.find('a').first().attr('href');

        if (title) {
            articles.push({
                title,
                link,
                date: citation.split('.')[0] || '',
                summary: `著者: ${authors}`,
                source: 'PubMed',
                type: 'academic'
            });
        }
    });

    return articles;
}

/**
 * ScienceDaily専用のパーサー
 */
function extractScienceDailyArticles(html) {
    const $ = cheerio.load(html);
    const articles = [];

    $('#headlines .latest-head, #headlines h3').each((index, element) => {
        if (index >= SUMMARY_CONFIG.maxArticlesPerSource) return false;

        const $el = $(element);
        const $link = $el.find('a').first();
        const title = $link.text().trim() || $el.text().trim();
        let href = $link.attr('href') || '';

        if (href && !href.startsWith('http')) {
            href = 'https://www.sciencedaily.com' + href;
        }

        if (title) {
            articles.push({
                title,
                link: href,
                date: '',
                summary: '',
                source: 'ScienceDaily',
                type: 'news'
            });
        }
    });

    return articles;
}

/**
 * カテゴリ別に記事を収集
 */
export async function scrapeAllSources() {
    const results = {
        shiitake: [],
        otherMushrooms: [],
        fetchedAt: new Date().toISOString()
    };

    console.log('📡 情報収集を開始します...\n');

    // 椎茸専門サイト
    console.log('🍄 【椎茸専門サイト】');
    for (const source of SOURCES.shiitake) {
        console.log(`  → ${source.name}`);
        const html = await fetchPage(source.url);
        if (html) {
            const articles = extractArticles(html, source);
            results.shiitake.push({
                source: source.name,
                description: source.description,
                articles
            });
            console.log(`    ✓ ${articles.length}件の記事を取得`);
        } else {
            console.log(`    ✗ 取得失敗`);
        }
    }

    // その他食用キノコ
    console.log('\n🍄 【その他食用キノコ】');
    for (const source of SOURCES.otherMushrooms) {
        console.log(`  → ${source.name}`);
        const html = await fetchPage(source.url);
        if (html) {
            let articles;

            // サイト別のパーサーを使用
            if (source.url.includes('pubmed')) {
                articles = extractPubMedArticles(html);
            } else if (source.url.includes('sciencedaily')) {
                articles = extractScienceDailyArticles(html);
            } else {
                articles = extractArticles(html, source);
            }

            results.otherMushrooms.push({
                source: source.name,
                description: source.description,
                articles
            });
            console.log(`    ✓ ${articles.length}件の記事を取得`);
        } else {
            console.log(`    ✗ 取得失敗`);
        }
    }

    return results;
}
