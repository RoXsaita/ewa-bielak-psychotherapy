/**
 * Simple HTTP server for testing the website locally
 * Use: node server.js
 * Then visit: http://localhost:8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((request, response) => {
  console.log(`Request for: ${request.url}`);
  
  // Normalize the URL by removing query strings, etc.
  let filePath = '.' + request.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Get the file extension
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        fs.readFile('./404.html', (error, content) => {
          if (error) {
            // If no 404.html file, return simple text message
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end('<h1>404 Not Found</h1><p>The page you requested does not exist.</p>', 'utf-8');
          } else {
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        response.writeHead(500);
        response.end(`Server Error: ${error.code}`);
      }
    } else {
      // Return the file
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
}); 