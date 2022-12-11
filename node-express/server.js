const express = require('express');
const morgan = require('morgan');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

app.use(express.static(__dirname + '/public'));

app.use((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


// const http = require('http');

// const hostname = 'localhost';
// const port = 3000;

// const path = require('path');
// const fs = require('fs');

// const server = http.createServer((req, res) => {
//     console.log(`Request for ${req.url} by method ${req.method}`);

//     if (req.method === 'GET') {
//         let fileUrl = req.url;
//         if (fileUrl === '/') {
//             fileUrl = '/index.html';
//         }

//         const filePath = path.resolve('./public' + fileUrl);
//         const fileExt = path.extname(filePath);

//         if (fileExt === '.html') {
//             fs.access(filePath, err => {
//                 if (err) {
//                     res.statusCode = 404;
//                     res.setHeader('Content-Type', 'text/html');
//                     res.end(`<html><body><h1>Error 404: ${fileUrl} not found</h1></body></html>`);
//                     return;
//                 }
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'text/html');

//                 fs.createReadStream(filePath).pipe(res);
//             });
//         } else {
//             res.statusCode = 404;
//             res.setHeader('Content-Type', 'text/html');
//             res.end(`<html><body><h1>Error 404: ${fileUrl} is not an HTML file</h1></body></html>`);
//         }
//     } else {
//         res.statusCode = 404;
//         res.setHeader('Content-Type', 'text/html');
//         res.end(`<html><body><h1>Error 404: ${req.method} not supported</h1></body></html>`);
//     }
// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

// // const http = require('http');

// // const hostname = 'localhost';
// // const port = 3000;

// const server = http.createServer((req, res) => {
//     console.log(req.headers);
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.end('<html><body><h1>Hello World!</h1></body></html>');
// });