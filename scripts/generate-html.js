import fs from 'fs';

const clientAssets = fs.readdirSync('dist/client/assets');
const css = clientAssets.find(f => f.endsWith('.css'));

// client-BiriCxZt.js がTanStack Startのクライアントエントリー
const clientEntry = clientAssets.find(f => f.startsWith('client-') && f.endsWith('.js'));
// なければ最大サイズのindex-*.js
const fallback = clientAssets
  .filter(f => f.endsWith('.js'))
  .sort((a, b) => fs.statSync(`dist/client/assets/${b}`).size - fs.statSync(`dist/client/assets/${a}`).size)[0];

const js = clientEntry || fallback;
console.log('CSS:', css, 'JS:', js);

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>KAZUTCHI — Dancer & Choreographer</title>
  <link rel="stylesheet" href="/assets/${css}" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/${js}"></script>
</body>
</html>`;

fs.writeFileSync('dist/client/index.html', html);
fs.copyFileSync('dist/client/index.html', 'dist/client/404.html');
console.log('Done!');
