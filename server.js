// read the input file
const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');

// split the input into an array of lines
const lines = input.trim().split('\n');

// create an object with the series and characters
const data = {};
for (const line of lines) {
  const [series, ...characters] = line.split(';');
  data[series] = characters;
}

// generate a random character and series
function randomCharacterAndSeries() {
  const series = Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)];
  const characters = data[series];
  const character = characters[Math.floor(Math.random() * characters.length)];
  return [character, series];
}

// generate a random challenge
function generateChallenge() {
  let [char1, series1] = randomCharacterAndSeries();
  let [char2, series2] = randomCharacterAndSeries();
  while (series1 === series2) {
    [char2, series2] = randomCharacterAndSeries();
  }
  return `Draw ${char1} (${series1}) in the style of ${series2}`;
}

// create the HTML file
const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Comic Character Swap Challenge Generator</title>
    <style>
      body {
        background-color: #EFEFEF;
        font-family: Arial, sans-serif;
        text-align: center;
      }
      h1 {
        font-size: 3em;
        margin-top: 2em;
      }
      button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 1.5em;
        margin-top: 2em;
        cursor: pointer;
        border-radius: 10px;
      }
      button:hover {
        background-color: #3E8E41;
      }
      #challenge {
        font-size: 2em;
        margin-top: 2em;
      }
      img {
        max-width: 100%;
        margin-top: 2em;
      }
    </style>
  </head>
  <body>
    <h1>Comic Character Swap Challenge Generator</h1>
    <button onclick="generate()">Generate Challenge</button>
    <div id="challenge"></div>
    <img id="image" src="">
    <script>
      function generate() {
        const challenge = document.getElementById('challenge');
        const image = document.getElementById('image');
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState === 4 && this.status === 200) {
            challenge.textContent = this.responseText;
            image.src = 'https://source.unsplash.com/featured/?animated%20series';
          }
        };
        xhr.open('GET', '/challenge');
        xhr.send();
      }
    </script>
  </body>
</html>
`;

// create the server
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/challenge') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(generateChallenge());
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }
});

// start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
