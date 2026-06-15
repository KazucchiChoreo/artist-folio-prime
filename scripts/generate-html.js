import fs from 'fs';

const assetsDir = 'dist/server/assets';
const manifestFile = fs.readdirSync(assetsDir).find(f => f.startsWith('_tanstack-start-manifest'));
const raw = fs.readFileSync(`${assetsDir}/${manifestFile}`, 'utf-8');

// JSオブジェクトリテラルとして評価
const manifest = eval('(' + raw.replace(/^[^(]+\(/, '').replace(/\);?\s*$/, '') + ')');
const entryScript = manifest.routes.__root__.scripts[0].attrs.src;

const css = fs.readdirSync('dist/client/assets').find(f => f.endsWith('.css'));

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>KAZUTCHI — Dancer & Choreographer</title>
  <link rel="modulepreload" href="${entryScript}" />
  <link rel="stylesheet" href="/assets/${css}" />
</head>
<body>
  <div id="root"></div>
  <script type="module" async src="${entryScript}"></script>
</body>
</html>`;

fs.writeFileSync('dist/client/index.html', html);
fs.copyFileSync('dist/client/index.html', 'dist/client/404.html');
console.log('Entry:', entryScript);
console.log('Done!');
