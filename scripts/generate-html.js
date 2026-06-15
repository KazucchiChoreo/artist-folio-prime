import fs from 'fs';
import path from 'path';

const assetsDir = 'dist/client/assets';
const files = fs.readdirSync(assetsDir);

const css = files.find(f => f.endsWith('.css'));
const js = files.filter(f => f.endsWith('.js'))
  .sort((a, b) => fs.statSync(path.join(assetsDir, b)).size - fs.statSync(path.join(assetsDir, a)).size)[0];

console.log('CSS:', css);
console.log('JS:', js);

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
  <script type="module" src="./assets/${js}"></script>
</body>
</html>`;

fs.writeFileSync('dist/client/index.html', html);
fs.copyFileSync('dist/client/index.html', 'dist/client/404.html');
console.log('Done!');
