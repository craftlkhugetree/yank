var http = require('http');
http.get('http://tuijian.hao123.com/hotrank', function (res) {
  var data = '';
  res.on('data', function (chunk) {
    data += chunk;
  });
  res.on('end', function () {
    console.log(data);
  });
});
