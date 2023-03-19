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

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve the index.html file
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write('404 Not Found');
        return res.end();
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
  } else if (req.url === '/generate') {
    // Generate a random character swap and send as response
    const swap = generateSwap();
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(swap);
    return res.end();
  } else {
    // Handle all other requests with a 404 error
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write('404 Not Found');
    return res.end();
  }
});

const port = process.env.PORT || 443;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
