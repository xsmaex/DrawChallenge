const http = require('http');
const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'input.txt');
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
};

// Load input file
const inputText = fs.readFileSync(inputFilePath, 'utf-8');
const lines = inputText.trim().split('\n');
const seriesCharacters = lines.map((line) => {
  const [series, ...characters] = line.trim().split(';');
  return {
    series,
    characters,
  };
});

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateChallenge() {
  const series1 = getRandomElement(seriesCharacters);
  const series2Candidates = seriesCharacters.filter(
    (series) => series.series !== series1.series
  );
  const series2 = getRandomElement(series2Candidates);
  const character1 = getRandomElement(series1.characters);
  const character2 = getRandomElement(series2.characters);
  const challenge = `Draw ${character1} (${series1.series}) in the style of ${series2.series}`;
  return challenge;
}

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'index.html');
    const contentType = MIME_TYPES['.html'];
    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(500);
        res.end(`Error loading ${filePath}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.url === '/generate') {
    const challenge = generateChallenge();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(challenge);
  } else {
    const filePath = path.join(__dirname, req.url);
    const extension = path.extname(filePath);
    const contentType = MIME_TYPES[extension] || 'text/plain';
    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(404);
        res.end(`File not found: ${req.url}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
});

const port = process.env.PORT || 80;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
