// node seven_days_example.js seven.json
// http://localhost:8080/show_mem.js,leak_mem.js
// http://localhost:8080/foo/show_mem.js,foo/leak_mem.js
// http://localhost:8080/,../pachong.js,../anti_debug.js
var fs = require('fs'),
  path = require('path'),
  http = require('http');

var MIME = {
  '.css': 'text/css',
  '.js': 'application/javascript',
};

function combineFiles(pathnames, callback) {
  var output = [];

  (function next(i, len) {
    if (i < len) {
      fs.readFile(pathnames[i], function (err, data) {
        if (err) {
          callback(err);
        } else {
          output.push(data);
          next(i + 1, len);
        }
      });
    } else {
      callback(null, Buffer.concat(output));
    }
  })(0, pathnames.length);
}

function parseURL(root, url) {
  var base, pathnames, parts;

  if (url.indexOf('??') === -1) {
    url = url.replace('/', '/??');
  }

  parts = url.split('??');
  base = parts[0];
  pathnames = (parts[1].split(',').filter(p => !!p) || []).map(function (value) {
    console.log(parts, root, base, value, path.join(root, base, value));
    return path.join(root, base, value);
  });

  return {
    mime: MIME[path.extname(pathnames[0])] || 'text/plain',
    pathnames: pathnames,
  };
}

function main(argv) {
  var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')),
    root = config.root || '.',
    port = config.port || 80;
  http
    .createServer(function (request, response) {
      var urlInfo = parseURL(root, request.url);
      combineFiles(urlInfo.pathnames, function (err, data) {
        if (err) {
          response.writeHead(404);
          response.end(err.message);
        } else {
          response.writeHead(200, {
            'Content-Type': urlInfo.mime,
          });
          response.end(data);
        }
      });
    })
    .listen(port);
}
// 可以看到，第二版代码在检查了请求的所有文件是否有效之后，立即就输出了响应头，并接着一边按顺序读取文件一边输出响应内容。并且，在读取文件时，第二版代码直接使用了只读数据流来简化代码。
function main2(argv) {
  var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')),
    root = config.root || '.',
    port = config.port || 80,
    server;

  server = http
    .createServer(function (request, response) {
      var urlInfo = parseURL(root, request.url);
      console.log(urlInfo);

      validateFiles(urlInfo.pathnames, function (err, pathnames) {
        if (err) {
          response.writeHead(404);
          response.end(err.message);
        } else {
          response.writeHead(200, {
            'Content-Type': urlInfo.mime,
          });
          outputFiles(pathnames, response);
        }
      });
    })
    .listen(port);
  process.on('SIGTERM', function () {
    console.log('server:', server);
    server.close(function () {
      process.exit(0);
    });
  });
}

function outputFiles(pathnames, writer) {
  (function next(i, len) {
    if (i < len) {
      var reader = fs.createReadStream(pathnames[i]);

      reader.pipe(writer, { end: false });
      // 读取并输出一个文件之后，才处理第二个文件
      reader.on('end', function () {
        next(i + 1, len);
      });
    } else {
      writer.end();
    }
  })(0, pathnames.length);
}

function validateFiles(pathnames, callback) {
  (function next(i, len) {
    if (i < len) {
      fs.stat(pathnames[i], function (err, stats) {
        if (err) {
          callback(err);
        } else if (!stats.isFile()) {
          callback(new Error());
        } else {
          next(i + 1, len);
        }
      });
    } else {
      callback(null, pathnames);
    }
  })(0, pathnames.length);
}

// main(process.argv.slice(2));
main2(process.argv.slice(2));
