const fs = require('fs');
const http = require('http');

// Read input file and parse into array of series and characters
const input = fs.readFileSync('input.txt', 'utf8').trim();
const seriesList = input.split('\n').map(line => line.trim().split(';'));

// Helper function to select a random element from an array
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a random character swap
function generateSwap() {
  const [sourceSeries, ...sourceChars] = randomChoice(seriesList);
  let targetSeries, targetChar;
  do {
    [targetSeries, ...targetChars] = randomChoice(seriesList);
    targetChar = randomChoice(targetChars);
  } while (targetSeries === sourceSeries);
  return `${targetChar} (${targetSeries}) in the style of ${sourceSeries}`;
}

// Create a simple HTTP server that sends the character swap as response
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  const swap = generateSwap();
  res.write(`<h1>${swap}</h1>`);
  res.end();
});

server.listen(8080);
console.log('Server running at http://localhost:8080/');
