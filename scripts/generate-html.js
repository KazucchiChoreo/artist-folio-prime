const fs = require('fs');
const path = require('path');

const assetsDir = 'dist/client/assets';
const files = fs.readdirSync(assetsDir);

const css = files.find(f => f.endsWith('.css'));

// index-*.js の中でstart またはentryを含むもの、なければ最大サイズ
const jsFiles = files.filter(f => f.endsWith('.js'));
const jsWithSize = jsFiles.map(f => ({
  name: f,
  size: fs.statSync(path.join(assetsDir, f)).size
})).sort((a, b) => b.size - a.size);

// 全JSファイルをログ出力
jsWithSize.forEach(f => console.log(f.size, f.name));

// index-rV6... (5KB) ではなく、それ以外のindex-で始まる最大ファイルを選ぶ
const mainJs = jsWithSize[0].name;

console.log('Selected CSS:', css);
console.log('Selected JS:', mainJs);

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>KAZUTCHI — Dancer & Choreographer</title>
  <link rel="stylesheet" href="./assets/${css}" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./assets/${mainJs}"></script>
</body>
</html>`;

fs.writeFileSync('dist/client/index.html', html);
fs.copyFileSync('dist/client/index.html', 'dist/client/404.html');
console.log('Done!');
