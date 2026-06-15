import fs from 'fs';
import path from 'path';

// サーバー側のマニフェストからクライアントエントリーポイントを読む
const manifestPath = 'dist/server/assets';
const manifestFile = fs.readdirSync(manifestPath).find(f => f.startsWith('_tanstack-start-manifest'));
const manifest = JSON.parse(fs.readFileSync(path.join(manifestPath, manifestFile), 'utf-8').match(/\{.*\}/s)?.[0] ?? '{}');

console.log('Manifest:', JSON.stringify(manifest, null, 2));

// client側のファイル一覧も出力
const clientAssets = fs.readdirSync('dist/client/assets');
console.log('Client assets:', clientAssets);
