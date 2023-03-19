const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading index.html: ${err}`);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.url === '/challenge') {
    // generate a new challenge and send it as JSON
    const challenge = generateChallenge();
    const response = { challenge, imageUrl: getRandomImageUrl() };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

function generateChallenge() {
  let [char1, series1] = randomCharacterAndSeries();
  let [char2, series2] = randomCharacterAndSeries();
  while (series1 === series2) {
    [char2, series2] = randomCharacterAndSeries();
  }
  return `Draw ${char1} (${series1}) in the style of ${series2}`;
}

function getRandomImageUrl() {
  // implementation of getRandomImageUrl function goes here
}

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
